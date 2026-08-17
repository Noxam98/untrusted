#BEGIN_PROPERTIES#
{
    "version": "1.2.2",
    "commandsIntroduced": ["map.setSquareColor"],
    "music": "cloudy_sin"
}
#END_PROPERTIES#
/******************
 * minesweeper.js *
 ******************
 *
 * Вот вам и законы Азимова. Теперь они всерьёз пытаются
 * вас убить. Не хочу нагнетать, но пол усеян минами. Бежать
 * к выходу вслепую — не лучшая идея. Вы нужны мне живым.
 *
 * Вот если бы был какой-нибудь способ отследить, где
 * именно лежат мины...
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel(map) {
#START_OF_START_LEVEL#
    for (var x = 0; x < map.getWidth(); x++) {
        for (var y = 0; y < map.getHeight(); y++) {
            map.setSquareColor(x, y, '#f00');
        }
    }

    map.placePlayer(map.getWidth() - 5, 5);

    for (var i = 0; i < 75; i++) {
        var x = getRandomInt(0, map.getWidth() - 1);
        var y = getRandomInt(0, map.getHeight() - 1);
        if ((x != 2 || y != map.getHeight() - 1)
            && (x != map.getWidth() - 5 || y != 5)) {
            // не ставим мину поверх выхода или игрока!
            map.placeObject(x, y, 'mine');
#BEGIN_EDITABLE#

#END_EDITABLE#
        }
    }

    map.placeObject(2, map.getHeight() - 1, 'exit');
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateAtLeastXObjects(40, 'mine');
    map.validateExactlyXManyObjects(1, 'exit');
}
