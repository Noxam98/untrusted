#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced": ["ROT.Map.DividedMaze", "player.atLocation"],
    "music": "gurh"
}
#END_PROPERTIES#
/********************
 * theLongWayOut.js *
 ********************
 *
 * Похоже, нас засекли. Путь оказался не таким свободным,
 * как я рассчитывал. Но неважно — четырёх толковых
 * символов хватит, чтобы стереть все их уловки.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.placePlayer(7, 5);

    var maze = new ROT.Map.DividedMaze(map.getWidth(), map.getHeight());
#BEGIN_EDITABLE#

#END_EDITABLE#
    maze.create( function (x, y, mapValue) {

        // не рисуем лабиринт поверх игрока
        if (map.getPlayer().atLocation(x, y)) {
            return 0;
        }

        else if (mapValue === 1) { //0 — пустое место, 1 — стена
            map.placeObject(x, y, 'block');
        }
        else {
            map.placeObject(x, y, 'empty');
        }
    });

    map.placeObject(map.getWidth()-4, map.getHeight()-4, 'block');
    map.placeObject(map.getWidth()-6, map.getHeight()-4, 'block');
    map.placeObject(map.getWidth()-5, map.getHeight()-5, 'block');
    map.placeObject(map.getWidth()-5, map.getHeight()-3, 'block');
#BEGIN_EDITABLE#

#END_EDITABLE#
    map.placeObject(map.getWidth()-5, map.getHeight()-4, 'exit');
#END_OF_START_LEVEL#
}
