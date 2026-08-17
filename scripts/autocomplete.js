/*
 * autocomplete.js - completion popup for the level editor
 *
 * The completion database is reference.js, which already carries a signature,
 * a category and a method/property flag for every call in the game, and whose
 * descriptions are already translated. What goes in the list is decided by
 * inference.js (what type is to the left of the dot) and filtered by the
 * commands the player has actually unlocked, so the popup never spoils an API
 * from a level they haven't reached.
 *
 * The widget is hand-rolled rather than CodeMirror's show-hint addon: the 3.1
 * addon renders list items with createTextNode, so it can only show bare
 * strings - no signature plus description, no category badges.
 */

// Types that map straight onto a reference.js category.
var COMPLETION_CATEGORY_FOR_TYPE = {
    'map': 'map',
    'player': 'player',
    'object': 'object',
    'canvas': 'canvas',
    'jQuery': 'jQuery'
};

// Members of things reference.js doesn't describe, written in its shape so the
// rest of the code doesn't need to care where an entry came from.
var SYNTHETIC_REFERENCE = {
    'maze.create': {
        name: 'maze.create(callback)',
        category: 'maze',
        type: 'method',
        requires: 'ROT.Map.DividedMaze'
    },
    'point.x': { name: 'x', category: 'point', type: 'property' },
    'point.y': { name: 'y', category: 'point', type: 'property' },
    'array.length': { name: 'length', category: 'array', type: 'property' }
};

// Bare identifiers worth offering that aren't API calls: the JavaScript
// globals validate.js lets through into the sandbox.
var COMPLETION_SANDBOX_GLOBALS = ['Object', 'Array', 'String', 'Number', 'Math', 'parseInt', 'Date'];

function Completer(game, codeEditor) {
    var self = this;

    this.game = game;
    this.editor = codeEditor;
    this.cm = codeEditor.internalEditor;

    this.widget = null;
    this.entries = [];
    this.selected = 0;
    this.range = null;

    this.charLimit = 80;

    /* --- building the list ---------------------------------------------- */

    // Turns a reference.js key into what we'd actually type. Most keys are
    // "<receiver>.<member>", but globals are spelled out in full.
    function memberName(key, category) {
        if (category === 'global') {
            return key.indexOf('global.') === 0 ? key.slice('global.'.length) : key;
        }
        var dot = key.indexOf('.');
        return dot === -1 ? key : key.slice(dot + 1);
    }

    // Pulls "x, y" out of "map.placeObject(x, y, type)".
    function signatureArguments(signature) {
        var open = signature.indexOf('(');
        if (open === -1) { return null; }
        var close = signature.lastIndexOf(')');
        if (close < open) { return null; }
        return signature.slice(open + 1, close);
    }

    function makeEntry(key, reference) {
        var name = memberName(key, reference.category);
        var args = signatureArguments(reference.name);
        var descriptionKey = 'reference.desc.' + key;

        return {
            key: key,
            name: name,
            signature: reference.name,
            category: reference.category,
            isMethod: reference.type === 'method',
            takesArguments: !!(args && args.length > 0),
            hasParens: args !== null,
            description: I18n.has(descriptionKey) ? __(descriptionKey) : (reference.description || '')
        };
    }

    // Everything the player is allowed to see right now.
    function unlockedKeys() {
        var unlocked = {};
        var commands = game._getHelpCommands() || [];
        for (var i = 0; i < commands.length; i++) {
            unlocked[commands[i]] = true;
        }
        return unlocked;
    }

    function referenceEntries(filter) {
        var unlocked = unlockedKeys();
        var entries = [];

        for (var key in game.reference) {
            if (game.reference.hasOwnProperty(key) && unlocked[key] && filter(key, game.reference[key])) {
                entries.push(makeEntry(key, game.reference[key]));
            }
        }

        for (var syntheticKey in SYNTHETIC_REFERENCE) {
            if (!SYNTHETIC_REFERENCE.hasOwnProperty(syntheticKey)) { continue; }
            var synthetic = SYNTHETIC_REFERENCE[syntheticKey];
            if (synthetic.requires && !unlocked[synthetic.requires]) { continue; }
            if (filter(syntheticKey, synthetic)) {
                entries.push(makeEntry(syntheticKey, synthetic));
            }
        }

        return entries;
    }

    function memberEntries(type) {
        var category = COMPLETION_CATEGORY_FOR_TYPE[type] || type;

        return referenceEntries(function (key, reference) {
            if (reference.category !== category) { return false; }
            // `me.` wants the things you can call on a live object, not the
            // properties you'd write into a defineObject literal
            if (category === 'object') { return reference.type === 'method'; }
            return true;
        });
    }

    function objectPropertyEntries() {
        return referenceEntries(function (key, reference) {
            return reference.category === 'object' && reference.type === 'property';
        });
    }

    function globalEntries(analysis, offset) {
        var entries = referenceEntries(function (key, reference) {
            return reference.category === 'global';
        });

        COMPLETION_SANDBOX_GLOBALS.forEach(function (name) {
            entries.push({
                key: 'sandbox.' + name,
                name: name,
                signature: name,
                category: 'javascript',
                isMethod: false,
                takesArguments: false,
                hasParens: false,
                description: __('autocomplete.desc.sandboxGlobal')
            });
        });

        // whatever the player has in scope right here
        if (analysis) {
            analysis.localsAt(offset).forEach(function (binding) {
                entries.push({
                    key: 'local.' + binding.name,
                    name: binding.name,
                    signature: binding.name,
                    category: 'local',
                    isMethod: false,
                    takesArguments: false,
                    hasParens: false,
                    isLocal: true,
                    description: binding.type && binding.type !== CodeInference.UNKNOWN ?
                        __('autocomplete.desc.localTyped', { type: binding.type }) :
                        __('autocomplete.desc.local')
                });
            });
        }

        return entries;
    }

    /* --- filtering and ranking ------------------------------------------ */

    function scoreEntry(entry, prefix) {
        if (!prefix) { return 1; }

        var name = entry.name.toLowerCase();
        var needle = prefix.toLowerCase();

        if (name.indexOf(needle) === 0) { return 3; }
        if (name.indexOf(needle) > -1) { return 2; }

        // subsequence match, so "gdo" still finds getDynamicObjects
        var at = 0;
        for (var i = 0; i < needle.length; i++) {
            at = name.indexOf(needle.charAt(i), at);
            if (at === -1) { return 0; }
            at++;
        }
        return 1;
    }

    function rank(entries, prefix) {
        var scored = [];

        entries.forEach(function (entry) {
            var score = scoreEntry(entry, prefix);
            if (score > 0) {
                // things in scope are what the player just wrote, so they come first
                scored.push({ entry: entry, score: score + (entry.isLocal ? 0.5 : 0) });
            }
        });

        scored.sort(function (a, b) {
            if (a.score !== b.score) { return b.score - a.score; }
            return a.entry.name < b.entry.name ? -1 : a.entry.name > b.entry.name ? 1 : 0;
        });

        return scored.map(function (item) { return item.entry; });
    }

    /* --- computing the completion --------------------------------------- */

    this.computeCompletions = function () {
        var cm = self.cm;
        var cursor = cm.getCursor();

        if (!self.editor.isEditablePosition(cursor.line, cursor.ch)) { return null; }

        var code = cm.getValue();
        var offset = cm.indexFromPos(cursor);
        var analysis = CodeInference.analyze(code);
        if (!analysis) { return null; }

        var context = analysis.completionAt(offset);
        var entries;

        if (context.kind === 'member') {
            entries = memberEntries(context.type);
        } else if (context.kind === 'objectProperty') {
            entries = objectPropertyEntries();
        } else {
            entries = globalEntries(analysis, offset);
        }

        return {
            context: context,
            entries: rank(entries, context.prefix),
            from: cm.posFromIndex(context.from),
            to: cm.posFromIndex(context.to)
        };
    };

    /* --- inserting ------------------------------------------------------ */

    // The editor hard-trims lines at 80 characters, so pick the longest form
    // of the completion that still fits rather than letting it get chopped.
    function insertionFor(entry, from, to) {
        var line = self.cm.getLine(from.line) || '';
        var without = line.length - (to.ch - from.ch);

        var candidates = [];
        if (entry.hasParens) { candidates.push(entry.name + '()'); }
        candidates.push(entry.name);

        for (var i = 0; i < candidates.length; i++) {
            if (without + candidates[i].length <= self.charLimit) {
                return candidates[i];
            }
        }
        return entry.name;
    }

    this.applyCompletion = function (entry) {
        var from = self.range.from;
        var to = self.range.to;
        var text = insertionFor(entry, from, to);

        self.close();
        self.cm.replaceRange(text, from, to);

        // drop the cursor between the parentheses when there are arguments to fill in
        var landing = from.ch + text.length;
        if (entry.takesArguments && text.charAt(text.length - 1) === ')') {
            landing -= 1;
        }
        self.cm.setCursor({ line: from.line, ch: landing });
        self.cm.focus();
    };

    /* --- the popup ------------------------------------------------------ */

    function buildWidget(entries) {
        var container = document.createElement('div');
        container.className = 'autocompleteHints';

        var list = document.createElement('ul');
        list.className = 'autocompleteList';

        entries.forEach(function (entry, index) {
            var item = document.createElement('li');
            item.className = 'autocompleteItem';

            var name = document.createElement('span');
            name.className = 'autocompleteName';
            name.appendChild(document.createTextNode(entry.signature));
            item.appendChild(name);

            var badge = document.createElement('span');
            badge.className = 'autocompleteBadge autocompleteBadge-' + entry.category;
            badge.appendChild(document.createTextNode(
                entry.category === 'local' ? __('autocomplete.category.local') : entry.category));
            item.appendChild(badge);

            item.onmousedown = function (e) {
                e.preventDefault();
                self.applyCompletion(entry);
            };
            item.onmouseover = function () { self.select(index); };

            list.appendChild(item);
        });

        container.appendChild(list);

        var doc = document.createElement('div');
        doc.className = 'autocompleteDoc';
        container.appendChild(doc);

        return { container: container, list: list, doc: doc };
    }

    this.select = function (index) {
        if (!self.widget) { return; }

        var items = self.widget.list.childNodes;
        if (!items.length) { return; }

        index = Math.max(0, Math.min(items.length - 1, index));
        if (items[self.selected]) {
            items[self.selected].className = 'autocompleteItem';
        }
        self.selected = index;
        items[index].className = 'autocompleteItem autocompleteItem-active';

        // keep the highlighted row visible
        var item = items[index];
        var list = self.widget.list;
        if (item.offsetTop < list.scrollTop) {
            list.scrollTop = item.offsetTop;
        } else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
            list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
        }

        var entry = self.entries[index];
        self.widget.doc.innerHTML = '';
        if (entry && entry.description) {
            self.widget.doc.innerHTML = entry.description;
        }
    };

    this.close = function () {
        if (!self.widget) { return; }

        self.cm.removeKeyMap(self.keyMap);
        if (self.widget.container.parentNode) {
            self.widget.container.parentNode.removeChild(self.widget.container);
        }
        self.widget = null;
        self.entries = [];
        self.range = null;
    };

    this.isOpen = function () {
        return !!self.widget;
    };

    this.keyMap = {
        'Up': function () { self.select(self.selected - 1); },
        'Down': function () { self.select(self.selected + 1); },
        'PageUp': function () { self.select(self.selected - 8); },
        'PageDown': function () { self.select(self.selected + 8); },
        'Home': function () { self.select(0); },
        'End': function () { self.select(self.entries.length - 1); },
        'Enter': function () { self.applyCompletion(self.entries[self.selected]); },
        'Tab': function () { self.applyCompletion(self.entries[self.selected]); },
        'Esc': function () { self.close(); }
    };

    /* --- driving it ----------------------------------------------------- */

    this.show = function (auto) {
        var result = self.computeCompletions();

        if (!result || !result.entries.length) {
            self.close();
            return false;
        }

        // typing shouldn't pop a full global list open on its own; only an
        // explicit Ctrl-Space asks for that
        if (auto && result.context.kind === 'global' && result.context.prefix.length < 2) {
            self.close();
            return false;
        }

        self.close();

        self.entries = result.entries;
        self.range = { from: result.from, to: result.to };
        self.widget = buildWidget(result.entries);

        document.body.appendChild(self.widget.container);

        var coords = self.cm.cursorCoords(result.from);
        var container = self.widget.container;
        container.style.left = coords.left + 'px';
        container.style.top = coords.bottom + 'px';

        // flip above the cursor if we'd hang off the bottom of the window
        var box = container.getBoundingClientRect();
        var viewportHeight = window.innerHeight ||
            Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
        if (box.bottom > viewportHeight && coords.top - box.height > 0) {
            container.style.top = (coords.top - box.height) + 'px';
        }
        var viewportWidth = window.innerWidth ||
            Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
        if (box.right > viewportWidth) {
            container.style.left = Math.max(0, viewportWidth - box.width - 8) + 'px';
        }

        self.cm.addKeyMap(self.keyMap);
        self.selected = -1;
        self.select(0);

        return true;
    };

    this.initialize = function () {
        // Ctrl-Space is the explicit request; the game's own shortcuts live on
        // ctrl+0..ctrl+6 so there's nothing to collide with
        self.cm.addKeyMap({
            'Ctrl-Space': function () { self.show(false); }
        });

        self.cm.on('inputRead', function (cm, change) {
            if (!change || !change.text || change.text.length !== 1) { return; }
            var typed = change.text[0];
            if (typed === '.' || /^[A-Za-z_$]$/.test(typed)) {
                // let the change settle before re-parsing
                setTimeout(function () { self.show(true); }, 0);
            } else if (self.isOpen()) {
                self.close();
            }
        });

        self.cm.on('cursorActivity', function () {
            if (!self.isOpen()) { return; }
            // a completion is only valid on the line it started on
            var cursor = self.cm.getCursor();
            if (!self.range || cursor.line !== self.range.from.line ||
                cursor.ch < self.range.from.ch) {
                self.close();
            }
        });

        self.cm.on('blur', function () {
            setTimeout(function () { self.close(); }, 100);
        });
    };

    this.initialize();
}

Game.prototype.setUpAutocomplete = function () {
    if (typeof acorn === 'undefined' || !acorn.loose) {
        return; // parser didn't load; the editor still works, just without hints
    }
    this.completer = new Completer(this, this.editor);
};
