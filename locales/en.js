/*
 * English strings - the reference locale.
 *
 * Every other locale falls back to this one key by key, so this file is the
 * canonical list of what a translation needs to cover. To add a language,
 * copy this file, translate the values (never the keys), and see README.md
 * for the two places a new locale has to be registered.
 */

I18n.register('en', 'English', {
    /* --- page chrome ---------------------------------------------------- */

    'ui.pageTitle': 'Untrusted - a user javascript adventure game',
    'ui.noscript': 'You must enable JavaScript to play Untrusted.',
    'ui.forkMe': 'Fork me on GitHub',
    'ui.language': 'Language',
    'ui.licensing': 'Interested in using Untrusted commercially?',
    'ui.paypalCaption': 'Send some beer money our way?',
    'ui.newGame': '<span id="new-text">NEW</span> Check out Alex\'s new game, <a href="https://app.wordbots.io" target="_blank">Wordbots</a>!',

    /* --- editor buttons ------------------------------------------------- */

    'ui.button.api': 'API',
    'ui.button.api.title': 'Ctrl+1: API Reference',
    'ui.button.toggleFocus': 'Toggle Focus',
    'ui.button.toggleFocus.title': 'Ctrl+2: Toggle Focus',
    'ui.button.notepad': 'Notepad',
    'ui.button.notepad.title': 'Ctrl+3: Notepad',
    'ui.button.reset': 'Reset',
    'ui.button.reset.title': 'Ctrl+4: Reset Level',
    'ui.button.execute': 'Execute',
    'ui.button.execute.title': 'Ctrl+5: Execute',
    'ui.button.phone': 'Phone',
    'ui.button.phone.title': 'Q: Use Phone',
    'ui.button.menu': 'Menu',
    'ui.button.menu.title': 'Ctrl+0: Menu',
    'ui.button.menuPlus': 'Menu+',

    /* --- panes ---------------------------------------------------------- */

    'ui.helpPaneTitle': 'API Reference',
    'ui.levelSelect': 'Level Select',
    'ui.lockedLevel': '???',
    'ui.notepadTitle': '$EDITOR',
    'ui.notepadSave': 'Save',
    'ui.inventory': 'INVENTORY: ',

    /* --- intro sequence ------------------------------------------------- */

    'intro.initialize': '> initialize',
    'intro.title': 'U N T R U S T E D',
    'intro.orElse': '- or - ',
    'intro.subtitle': 'THE CONTINUING ADVENTURES OF DR. EVAL',
    'intro.credits': 'a game by Alex Nisnevich and Greg Shuflin',
    'intro.pressAnyKey': 'Press any key to begin ...',

    /* --- in-game status messages ---------------------------------------- */

    'status.pickUp.computer': 'You have picked up the computer!',
    'status.pickUp.phone': 'You have picked up the function phone!',
    'status.pickUp.redKey': 'You have picked up a red key!',
    'status.pickUp.greenKey': 'You have picked up a green key!',
    'status.pickUp.blueKey': 'You have picked up a blue key!',
    'status.pickUp.yellowKey': 'You have picked up a yellow key!',
    'status.pickUp.theAlgorithm': 'You have picked up the Algorithm!',
    'status.drop.theAlgorithm': 'You have lost the Algorithm!',
    'status.phoneUnbound': 'Your function phone isn\'t bound to any function!',
    'status.resetLevel': 'To reset this level press ^4 again.',
    'status.killedBy': 'You have been killed by \n{killer}',
    'status.killedByChapter': 'You have been killed by \n{killer}!',
    'status.nowPlaying': 'Now playing: "{title}" - {artist}',
    'status.solutionSaved': 'Level {level} solution saved at <a href="{url}" target="_blank">{url}</a>',
    'status.gistDescription': 'Solution to level {level} in Untrusted: http://alex.nisnevich.com/untrusted/',

    /* --- error messages ------------------------------------------------- */

    'error.linePrefix': '[Line {line}] ',
    'error.notAllowed': 'You are not allowed to use \'{word}\'!',
    'error.tampered': 'startLevel() has been tampered with!',
    'error.prematureReturn': 'startLevel() returned prematurely!',
    'error.timeout': '[Line {line}] TimeOutException: Maximum loop execution time of {ms} ms exceeded.',
    'error.reloadLevel': 'Please reload the level.',
    'error.validationFailed': 'Validation failed! Please reload the level.',

    /* --- developer console ---------------------------------------------- */

    'console.cheating': 'If you can read this, you are cheating! D:',
    'console.hint': 'But really, you don\'t need this console to play the game. Walk around using arrow keys (or Vim keys), and pick up the computer ({symbol}). Then the fun begins!',

    /* --- autocomplete --------------------------------------------------- */

    'autocomplete.category.local': 'in scope',
    'autocomplete.desc.local': 'A name defined in this level\'s code.',
    'autocomplete.desc.localTyped': 'A name defined in this level\'s code. Holds: {type}.',
    'autocomplete.desc.sandboxGlobal': 'A JavaScript built-in that level code is allowed to use.',

    /* --- API reference: category names ---------------------------------- */

    'reference.category.canvas': 'canvas',
    'reference.category.global': 'global',
    'reference.category.jQuery': 'jQuery',
    'reference.category.map': 'map',
    'reference.category.object': 'object',
    'reference.category.player': 'player',
    'reference.category.ROT': 'ROT',

    /* --- API reference: descriptions ------------------------------------ */

    'reference.desc.canvas.beginPath': 'Begins drawing a new shape.',
    'reference.desc.canvas.lineTo': 'Sets the end coordinates of a line.',
    'reference.desc.canvas.lineWidth': 'Determines the width of the next lines drawn.',
    'reference.desc.canvas.moveTo': 'Sets the start coordinates of a line.',
    'reference.desc.canvas.stroke': 'Draws a line whose coordinates have been defined by <b>lineTo</b> and <b>moveTo</b>.',
    'reference.desc.canvas.strokeStyle': 'Determines the color (and, optionally, other properties) of the next lines drawn.',
    'reference.desc.canvas.fillStyle': 'Determines the color (and, optionally, other properties) of the text drawn with <b>fillText</b>.',
    'reference.desc.canvas.fillText': 'Draws a given piece of text, starting at specified coordinates, to to the canvas',
    'reference.desc.global.$': 'When passed an HTML string, $ returns a corresponding <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance.',
    'reference.desc.global.objective': 'The player exits the level as soon as this method returns true.',
    'reference.desc.global.onExit': 'The player can exit the level only if this method returns true.',
    'reference.desc.global.startLevel': 'This method is called when the level loads.',
    'reference.desc.global.validateLevel': 'The level can be loaded only if this method returns true.',
    'reference.desc.ROT.Map.DividedMaze': 'Instantiates a Maze object of given width and height. The Maze object can create a maze by calling maze.create(callback), where the callback is a function that accepts (x, y, mapValue) and performs some action for each point in a grid, where mapValue is a boolean that is true if and only if the given point is part of the maze.',
    'reference.desc.jQuery.addClass': 'Adds the given CSS class to the DOM element(s) specified by the jQuery object.',
    'reference.desc.jQuery.children': 'Returns the children of the DOM element specified by the jQuery object, as a jQuery array.',
    'reference.desc.jQuery.find': 'Returns all elements in the DOM tree specified by the jQuery object that match the given CSS selector, as a jQuery array.',
    'reference.desc.jQuery.first': 'Returns the first element of a jQuery array.',
    'reference.desc.jQuery.hasClass': 'Returns true if and only if the DOM element specified by the jQuery object has the given CSS class.',
    'reference.desc.jQuery.length': 'Returns the number of elements in a jQuery array.',
    'reference.desc.jQuery.next': 'Returns the next sibling of the DOM element specified by the jQuery object.',
    'reference.desc.jQuery.parent': 'Returns the parent of the DOM element specified by the jQuery object.',
    'reference.desc.jQuery.prev': 'Returns the previous sibling of the DOM element specified by the jQuery object.',
    'reference.desc.jQuery.removeClass': 'Removes the given CSS class from the DOM element(s) specified by the jQuery object.',
    'reference.desc.map.countObjects': 'Returns the number of objects of the given type on the map.',
    'reference.desc.map.createFromDOM': 'Creates the map from a <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance, rendering the map as a DOM (document object model) rather than a grid.',
    'reference.desc.map.createFromGrid': 'Places objects on the map corresponding to their position on the grid (an array of strings), with mappings as defined in tiles (a dictionary of character -> object type mappings), at the given offset from the top-left corner of the map.',
    'reference.desc.map.createLine': 'Places a line on the map between the given points, that triggers the given callback when the player touches it. (Note that the line is invisible: createLine does <i>not</i> draw anything to the <a onclick="$(\'#helpPaneSidebar .category#canvas\').click();">canvas</a>.)',
    'reference.desc.map.displayChapter': 'Displays the given chapter name.',
    'reference.desc.map.defineObject': 'Defines a new type of <a onclick="$(\'#helpPaneSidebar .category#object\').click();">object</a> with the given properties. Note that type definitions created with map.defineObject only persist in the scope of the level.',
    'reference.desc.map.getAdjacentEmptyCells': 'Returns the empty cells adjacent to the cell at the given coordinates (if any), as an array of items of the form <i>[[x, y], direction]</i>, where (x, y) are the coordinates of each empty cell, and <i>direction</i> is the direction from the given cell to each empty cell ("left", "right", "up", or "down").',
    'reference.desc.map.getCanvasContext': 'Returns the 2D drawing context of the <a onclick="$(\'#helpPaneSidebar .category#canvas\').click();">canvas</a> overlaying the map.',
    'reference.desc.map.getCanvasCoords': 'Returns {"x": x, "y": y}, where x and y are the respective coordinates of the given object or grid position on the canvas returned by map.getCanvasContext().',
    'reference.desc.map.getDOM': 'Returns the <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance representing the map.',
    'reference.desc.map.getDynamicObjects': 'Returns all dynamic objects currently on the map.',
    'reference.desc.map.getHeight': 'Returns the height of the map, in cells.',
    'reference.desc.map.getObjectTypeAt': 'Returns the type of the object at the given coordinates (or "empty" if there is no object there).',
    'reference.desc.map.getPlayer': 'Returns the Player object.',
    'reference.desc.map.getRandomColor': 'Returns a hexadecimal string representing a random color in between the start and end colors. The start and end colors must be arrays of the form [R, G, B], where R, G, and B are decimal integers.',
    'reference.desc.map.getWidth': 'Returns the width of the map, in cells.',
    'reference.desc.map.isStartOfLevel': 'Returns true if called while a level is starting.',
    'reference.desc.map.overrideKey': 'Overrides the action performed by pressing the given key (<i>left</i>, <i>right</i>, <i>up</i>, or <i>down</i>).',
    'reference.desc.map.placeObject': 'Places an object of the given type at the given coordinates.',
    'reference.desc.map.placePlayer': 'Places the player at the given coordinates.',
    'reference.desc.map.setSquareColor': 'Sets the background color of the given square.',
    'reference.desc.map.timeout': 'Starts a timer (c.f. setTimeout) of the given delay, in milliseconds (minimum 25 ms). Unlike map.startTimer, the callback will only run once.',
    'reference.desc.map.startTimer': 'Starts a timer (c.f. setInterval) of the given delay, in milliseconds (minimum 25 ms).',
    'reference.desc.map.updateDOM': 'Updates the <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance representing the map.',
    'reference.desc.map.validateAtLeastXLines': 'Raises an exception if there are not at least num lines (created by map.createLine) on the map.',
    'reference.desc.map.validateAtLeastXObjects': 'Raises an exception if there are not at least num objects of type objectType on the map.',
    'reference.desc.map.validateAtMostXDynamicObjects': 'Raises an exception if there are more than num dynamic objects on the map.',
    'reference.desc.map.validateExactlyXManyObjects': 'Raises an exception if there are not exactly num objects of type objectType on the map.',
    'reference.desc.map.validateNoTimers': 'Raises an exception if there are any timers currently set with map.startTimer.',
    'reference.desc.map.writeStatus': 'Displays a message at the bottom of the map.',
    'reference.desc.object.behavior': '(For dynamic objects only.) The function that is executed each time it is this object\'s turn.',
    'reference.desc.object.canMove': '(For dynamic objects only.) Returns true if (and only if) the object is able to move one square in the given direction, which can be "left", "right", "up", or "down".',
    'reference.desc.object.color': 'The color of the object\'s symbol on the map.',
    'reference.desc.object.findNearest': '(For dynamic objects only.) Returns the x and y coordinates of the nearest object of the given type to this object, as a hash.',
    'reference.desc.object.getX': '(For dynamic objects only.) Returns the x-coordinate of the object.',
    'reference.desc.object.getY': '(For dynamic objects only.) Returns the y-coordinate of the object.',
    'reference.desc.object.giveItemTo': '(For dynamic objects only.) Gives the given item to the target (generally, the player). Can only be done if the object and the player have just collided.',
    'reference.desc.object.impassable': '(For non-dynamic objects only.) The function that determines whether or not the player can pass through this object.',
    'reference.desc.object.move': '(For dynamic objects only.) Moves the object one square in the given direction, which can be "left", "right", "up", or "down". An object can only move once per turn.',
    'reference.desc.object.onCollision': 'The function that is executed when this object touches the player.',
    'reference.desc.object.onDestroy': '(For dynamic objects only.) The function that is executed when this object is destroyed.',
    'reference.desc.object.projectile': '(For dynamic objects only.) If true, this object destroys any dynamic object (or player) that it collides with, and is itself destroyed when it collides with anything.',
    'reference.desc.object.pushable': '(For dynamic objects only.) If true, this object can be pushed by the player.',
    'reference.desc.object.symbol': 'The object\'s symbol on the map.',
    'reference.desc.object.setTarget': '(For teleporters only.) Sets the destination of this teleporter.',
    'reference.desc.object.type': 'Can be "item", "dynamic", or none. If "dynamic", then this object can move on turns that run each time that the player moves. If "item", then this object can be picked up.',
    'reference.desc.player.atLocation': 'Returns true if and only if the player is at the given location.',
    'reference.desc.player.getColor': 'Returns the color of the player.',
    'reference.desc.player.getLastMoveDirection': 'Returns the direction of last move by the player.',
    'reference.desc.player.getX': 'Returns the x-coordinate of the player.',
    'reference.desc.player.getY': 'Returns the y-coordinate of the player.',
    'reference.desc.player.hasItem': 'Returns true if and only if the player has the given item.',
    'reference.desc.player.killedBy': 'Kills the player and displays the given text as the cause of death.',
    'reference.desc.player.move': 'Moves the player one square in the given direction. The player can only move once in a given function.',
    'reference.desc.player.removeItem': 'Removes the given item from the player\'s inventory, if the player has the given item.',
    'reference.desc.player.setColor': 'Sets the color of the player.',
    'reference.desc.player.setPhoneCallback': 'Sets the function that is executed when the player uses the function phone.'
});
