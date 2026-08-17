/*
 * inference.js - static analysis behind the editor's autocomplete
 *
 * Parses the buffer with acorn's error-tolerant parser (so half-typed code
 * still yields a usable tree), builds a scope chain, and propagates types
 * through it. The point is to answer one question well:
 *
 *     given a cursor sitting after a dot, what kind of thing is on the left?
 *
 * Types are plain strings drawn from the categories in reference.js - 'map',
 * 'player', 'object', 'canvas', 'jQuery' - plus a few internal ones ('maze',
 * 'object[]', 'point'). Anything we can't work out is 'unknown', and the
 * caller falls back to offering globals.
 *
 * There is no attempt at soundness. This models the handful of shapes level
 * code actually takes, and degrades to 'unknown' everywhere else.
 */

var CodeInference = (function () {
    'use strict';

    var UNKNOWN = 'unknown';

    // What an API call hands back, keyed by "<receiver type>.<method>".
    var RETURN_TYPES = {
        'map.getPlayer': 'player',
        'map.getCanvasContext': 'canvas',
        'map.getDOM': 'jQuery',
        'map.getDynamicObjects': 'object[]',
        'map.getAdjacentEmptyCells': 'array',
        'map.getCanvasCoords': 'point',
        'object.findNearest': 'point',
        'jQuery.find': 'jQuery',
        'jQuery.children': 'jQuery',
        'jQuery.first': 'jQuery',
        'jQuery.next': 'jQuery',
        'jQuery.prev': 'jQuery',
        'jQuery.parent': 'jQuery',
        'jQuery.addClass': 'jQuery',
        'jQuery.removeClass': 'jQuery'
    };

    // Indexing into one of these yields that.
    var ELEMENT_TYPES = {
        'object[]': 'object'
    };

    // The level entry points, whose first parameter is always the map.
    var LEVEL_FUNCTION_PARAMS = {
        'startLevel': ['map'],
        'validateLevel': ['map'],
        'onExit': ['map'],
        'objective': ['map']
    };

    // Callbacks in a map.defineObject() literal, and what their parameters are.
    var OBJECT_CALLBACK_PARAMS = {
        'behavior': ['object'],
        'onCollision': ['player', 'object'],
        'onDestroy': ['object'],
        'impassable': ['player', 'object'],
        'onPickUp': ['player', 'object'],
        'onDrop': ['player', 'object']
    };

    // API calls that take a callback, keyed by "<receiver type>.<method>".
    var CALLBACK_ARGUMENTS = {
        'map.createLine': { index: 2, params: ['player'] },
        'player.setPhoneCallback': { index: 0, params: [] },
        'map.overrideKey': { index: 1, params: [] },
        'map.startTimer': { index: 0, params: [] },
        'map.timeout': { index: 0, params: [] },
        'maze.create': { index: 0, params: [] }
    };

    function isNode(value) {
        return value && typeof value === 'object' && typeof value.type === 'string' &&
            typeof value.start === 'number';
    }

    // acorn's loose parser stands in this character for a token it expected
    // but never got - which is exactly the case we complete on.
    function isPlaceholder(node) {
        return node && node.type === 'Identifier' && node.name === '✖';
    }

    /* --- scopes --------------------------------------------------------- */

    function Scope(parent, node) {
        this.parent = parent;
        this.node = node;
        this.bindings = {};
        this.start = node.start;
        this.end = node.end;
        this.children = [];
        if (parent) { parent.children.push(this); }
    }

    Scope.prototype.declare = function (name, type, node) {
        if (!this.bindings[name]) {
            this.bindings[name] = { name: name, type: type || UNKNOWN, node: node, scope: this };
        } else if (type && type !== UNKNOWN) {
            this.bindings[name].type = type;
        }
        return this.bindings[name];
    };

    Scope.prototype.lookup = function (name) {
        var scope = this;
        while (scope) {
            if (scope.bindings[name]) { return scope.bindings[name]; }
            scope = scope.parent;
        }
        return null;
    };

    // Every binding visible here, innermost shadowing outermost.
    Scope.prototype.visibleBindings = function () {
        var seen = {}, out = [], scope = this;
        while (scope) {
            for (var name in scope.bindings) {
                if (scope.bindings.hasOwnProperty(name) && !seen[name]) {
                    seen[name] = true;
                    out.push(scope.bindings[name]);
                }
            }
            scope = scope.parent;
        }
        return out;
    };

    /* --- analysis ------------------------------------------------------- */

    function Analysis(ast, globalScope, records) {
        this.ast = ast;
        this.globalScope = globalScope;
        this.records = records;
    }

    // Generic child walk. Written by hand rather than pulled from acorn's
    // walker so that it also copes with the loose parser's odd shapes and
    // can hang parent links off every node in one pass.
    function eachChild(node, fn) {
        for (var key in node) {
            if (!node.hasOwnProperty(key) || key.charAt(0) === '_') { continue; }
            var value = node[key];
            if (value instanceof Array) {
                for (var i = 0; i < value.length; i++) {
                    if (isNode(value[i])) { fn(value[i], key); }
                }
            } else if (isNode(value)) {
                fn(value, key);
            }
        }
    }

    function isFunctionNode(node) {
        return node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' ||
            node.type === 'ArrowFunctionExpression';
    }

    // Single pass: link parents, open a scope per function, hoist declarations,
    // and note the places worth revisiting once types start flowing.
    function collect(ast) {
        var globalScope = new Scope(null, ast);
        var records = { declarators: [], assignments: [], functions: [], calls: [], objects: [] };

        (function visit(node, parent, scope) {
            node._parent = parent;
            node._scope = scope;

            var innerScope = scope;

            if (isFunctionNode(node)) {
                if (node.type === 'FunctionDeclaration' && node.id && node.id.name) {
                    scope.declare(node.id.name, 'function', node);
                }
                innerScope = new Scope(scope, node);
                node._innerScope = innerScope;
                for (var i = 0; i < node.params.length; i++) {
                    if (node.params[i] && node.params[i].type === 'Identifier') {
                        innerScope.declare(node.params[i].name, UNKNOWN, node.params[i]);
                    }
                }
                records.functions.push({ node: node, scope: innerScope });
            } else if (node.type === 'VariableDeclarator' && node.id && node.id.type === 'Identifier') {
                scope.declare(node.id.name, UNKNOWN, node.id);
                records.declarators.push({ node: node, scope: scope });
            } else if (node.type === 'AssignmentExpression' && node.left && node.left.type === 'Identifier') {
                records.assignments.push({ node: node, scope: scope });
            } else if (node.type === 'CallExpression') {
                records.calls.push({ node: node, scope: scope });
            } else if (node.type === 'ObjectExpression') {
                records.objects.push({ node: node, scope: scope });
            }

            eachChild(node, function (child) { visit(child, node, innerScope); });
        })(ast, null, globalScope);

        return new Analysis(ast, globalScope, records);
    }

    /* --- type resolution ------------------------------------------------ */

    // Reads a dotted name like ROT.Map.DividedMaze back out of a member chain.
    function staticName(node) {
        if (!node) { return null; }
        if (node.type === 'Identifier') { return node.name; }
        if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier') {
            var base = staticName(node.object);
            return base ? base + '.' + node.property.name : null;
        }
        return null;
    }

    Analysis.prototype.typeOf = function (node, scope, depth) {
        if (!node || (depth || 0) > 12) { return UNKNOWN; }
        depth = (depth || 0) + 1;
        var self = this;

        switch (node.type) {
        case 'Identifier':
            var binding = scope.lookup(node.name);
            return binding ? binding.type : UNKNOWN;

        case 'CallExpression':
            var callee = node.callee;
            if (callee.type === 'Identifier') {
                return callee.name === '$' ? 'jQuery' : UNKNOWN;
            }
            if (callee.type === 'MemberExpression' && !callee.computed &&
                callee.property.type === 'Identifier') {
                var receiver = self.typeOf(callee.object, scope, depth);
                return RETURN_TYPES[receiver + '.' + callee.property.name] || UNKNOWN;
            }
            return UNKNOWN;

        case 'NewExpression':
            return staticName(node.callee) === 'ROT.Map.DividedMaze' ? 'maze' : UNKNOWN;

        case 'MemberExpression':
            if (node.computed) {
                return ELEMENT_TYPES[self.typeOf(node.object, scope, depth)] || UNKNOWN;
            }
            return UNKNOWN;

        case 'AssignmentExpression':
            return self.typeOf(node.right, scope, depth);

        case 'LogicalExpression':
            var left = self.typeOf(node.left, scope, depth);
            return left !== UNKNOWN ? left : self.typeOf(node.right, scope, depth);

        case 'ConditionalExpression':
            var consequent = self.typeOf(node.consequent, scope, depth);
            return consequent !== UNKNOWN ? consequent : self.typeOf(node.alternate, scope, depth);

        default:
            return UNKNOWN;
        }
    };

    // Types only ever move from unknown to known, so repeating the pass until
    // nothing changes terminates. Four rounds is well past the fixed point for
    // any level in the game; the cap is there for pathological input.
    Analysis.prototype.propagate = function () {
        var self = this;

        for (var round = 0; round < 4; round++) {
            var changed = false;

            var assign = function (binding, type) {
                if (binding && type && type !== UNKNOWN && binding.type !== type) {
                    binding.type = type;
                    changed = true;
                }
            };

            // level entry points and object callbacks give their parameters a type
            self.records.functions.forEach(function (record) {
                var node = record.node;
                var params = null;

                if (node.type === 'FunctionDeclaration' && node.id &&
                    LEVEL_FUNCTION_PARAMS[node.id.name] && node._parent &&
                    node._parent.type === 'Program') {
                    params = LEVEL_FUNCTION_PARAMS[node.id.name];
                } else if (node._parent && node._parent.type === 'Property') {
                    var key = node._parent.key;
                    var keyName = key && (key.name || key.value);
                    if (OBJECT_CALLBACK_PARAMS[keyName] && self.isObjectDefinition(node._parent._parent)) {
                        params = OBJECT_CALLBACK_PARAMS[keyName];
                    }
                }

                if (params) {
                    for (var i = 0; i < params.length && i < node.params.length; i++) {
                        if (node.params[i] && node.params[i].type === 'Identifier') {
                            assign(record.scope.bindings[node.params[i].name], params[i]);
                        }
                    }
                }
            });

            // callbacks handed to an API call get their parameters typed too
            self.records.calls.forEach(function (record) {
                var callee = record.node.callee;
                if (callee.type !== 'MemberExpression' || callee.computed ||
                    callee.property.type !== 'Identifier') { return; }

                var receiver = self.typeOf(callee.object, record.scope);
                var spec = CALLBACK_ARGUMENTS[receiver + '.' + callee.property.name];
                if (!spec) { return; }

                var argument = record.node.arguments[spec.index];
                if (!argument || !isFunctionNode(argument) || !argument._innerScope) { return; }
                for (var i = 0; i < spec.params.length && i < argument.params.length; i++) {
                    if (argument.params[i] && argument.params[i].type === 'Identifier') {
                        assign(argument._innerScope.bindings[argument.params[i].name], spec.params[i]);
                    }
                }
            });

            // var x = <expr>
            self.records.declarators.forEach(function (record) {
                if (!record.node.init) { return; }
                assign(record.scope.lookup(record.node.id.name),
                       self.typeOf(record.node.init, record.scope));
            });

            // x = <expr>
            self.records.assignments.forEach(function (record) {
                assign(record.scope.lookup(record.node.left.name),
                       self.typeOf(record.node.right, record.scope));
            });

            if (!changed) { break; }
        }

        return this;
    };

    // True only when the cursor sits directly in the literal's key position -
    // not somewhere down inside a property's value or a callback body, both of
    // which are still lexically "inside" the literal.
    function isPropertyNamePosition(node, objectLiteral) {
        var current = node;

        while (current && current !== objectLiteral) {
            if (isFunctionNode(current)) { return false; }
            var parent = current._parent;
            if (!parent) { return false; }
            // in shorthand ({ foo }) the key and the value are the same node,
            // and that still counts as naming a property
            if (parent.type === 'Property' && parent.value === current &&
                parent.key !== current) { return false; }
            current = parent;
        }

        return current === objectLiteral;
    }

    // Is this object literal the second argument of a defineObject() call?
    Analysis.prototype.isObjectDefinition = function (objectNode) {
        if (!objectNode || objectNode.type !== 'ObjectExpression') { return false; }
        var call = objectNode._parent;
        if (!call || call.type !== 'CallExpression') { return false; }
        var callee = call.callee;
        return !!(callee && callee.type === 'MemberExpression' && !callee.computed &&
            callee.property.type === 'Identifier' && callee.property.name === 'defineObject');
    };

    /* --- queries -------------------------------------------------------- */

    // Deepest node whose range covers the offset.
    Analysis.prototype.nodeAt = function (offset) {
        var found = null;

        (function search(node) {
            if (offset < node.start || offset > node.end) { return; }
            found = node;
            eachChild(node, search);
        })(this.ast);

        return found;
    };

    Analysis.prototype.scopeAt = function (offset) {
        var scope = this.globalScope;

        (function descend(current) {
            for (var i = 0; i < current.children.length; i++) {
                var child = current.children[i];
                if (offset >= child.start && offset <= child.end) {
                    scope = child;
                    descend(child);
                    return;
                }
            }
        })(this.globalScope);

        return scope;
    };

    Analysis.prototype.localsAt = function (offset) {
        return this.scopeAt(offset).visibleBindings();
    };

    // Nearest enclosing object literal, used to spot property-name position.
    Analysis.prototype.enclosingObject = function (offset) {
        var best = null;
        this.records.objects.forEach(function (record) {
            if (offset >= record.node.start && offset <= record.node.end) {
                if (!best || record.node.start > best.start) { best = record.node; }
            }
        });
        return best;
    };

    /*
     * Works out what to offer at a cursor position. Returns:
     *
     *   {kind: 'member', type: 'map', prefix: 'get', from: n, to: m}
     *   {kind: 'objectProperty',       prefix: '',    from: n, to: m}
     *   {kind: 'global',               prefix: 'ma',  from: n, to: m}
     *
     * `from`/`to` bound the text the completion replaces.
     */
    Analysis.prototype.completionAt = function (offset) {
        var node = this.nodeAt(offset);
        if (!node) {
            return { kind: 'global', prefix: '', from: offset, to: offset };
        }

        var scope = this.scopeAt(offset);
        var parent = node._parent;

        // sitting on the property half of `something.property`
        if (node.type === 'Identifier' && parent && parent.type === 'MemberExpression' &&
            !parent.computed && parent.property === node) {
            var placeholder = isPlaceholder(node);
            return {
                kind: 'member',
                type: this.typeOf(parent.object, scope),
                prefix: placeholder ? '' : node.name.slice(0, Math.max(0, offset - node.start)),
                from: placeholder ? offset : node.start,
                to: placeholder ? offset : node.end
            };
        }

        // sitting just past the dot, before the parser invented anything
        if (node.type === 'MemberExpression' && !node.computed && offset > node.object.end) {
            return {
                kind: 'member',
                type: this.typeOf(node.object, scope),
                prefix: '',
                from: offset,
                to: offset
            };
        }

        // naming a property inside a map.defineObject() literal
        var objectLiteral = this.enclosingObject(offset);
        if (objectLiteral && this.isObjectDefinition(objectLiteral) &&
            isPropertyNamePosition(node, objectLiteral)) {
            var onKey = node.type === 'Identifier' && !isPlaceholder(node) &&
                parent && parent.type === 'Property' && parent.key === node;

            return {
                kind: 'objectProperty',
                prefix: onKey ? node.name.slice(0, Math.max(0, offset - node.start)) : '',
                from: onKey ? node.start : offset,
                to: onKey ? node.end : offset
            };
        }

        // anything else: a bare name
        if (node.type === 'Identifier' && !isPlaceholder(node)) {
            return {
                kind: 'global',
                prefix: node.name.slice(0, Math.max(0, offset - node.start)),
                from: node.start,
                to: node.end
            };
        }

        return { kind: 'global', prefix: '', from: offset, to: offset };
    };

    /* --- entry point ---------------------------------------------------- */

    var cache = { code: null, analysis: null };

    function analyze(code) {
        if (cache.code === code) { return cache.analysis; }
        if (typeof acorn === 'undefined' || !acorn.loose) { return null; }

        var analysis;
        try {
            var ast = acorn.loose.parse_dammit(code, { ecmaVersion: 2018 });
            analysis = collect(ast).propagate();
        } catch (e) {
            // the loose parser is meant not to throw, but never trust that
            // enough to take the editor down with it
            analysis = null;
        }

        cache.code = code;
        cache.analysis = analysis;
        return analysis;
    }

    return {
        analyze: analyze,
        UNKNOWN: UNKNOWN,
        RETURN_TYPES: RETURN_TYPES,
        OBJECT_CALLBACK_PARAMS: OBJECT_CALLBACK_PARAMS
    };
})();
