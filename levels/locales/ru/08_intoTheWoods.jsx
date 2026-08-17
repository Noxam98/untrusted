#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced":
        ["map.getObjectTypeAt", "player.getX", "player.getY",
         "map.refresh"],
    "mapProperties": {
        "allowOverwrite": true
    },
    "music": "Night Owl"
}
#END_PROPERTIES#
/*******************
 * intoTheWoods.js *
 *******************
 *
 * Ну вот, вы выбрались из леса. Или, скорее, забрались в лес —
 * это как посмотреть.
 *
 * Так что вдохните поглубже, расслабьтесь и вспомните, ради
 * чего вы вообще здесь.
 *
 * Я отследил сигнал: Алгоритм совсем рядом. Нужно пройти
 * через лес и переправиться через реку — там вы выйдете к
 * крепости, где его держат. Охрана слабая, застанем их
 * врасплох.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    // ВНИМАНИЕ: только на этом уровне map.placeObject может
    //перезаписывать уже существующие объекты.

    map.displayChapter('Глава 2\nВ поисках утраченного Алгоритма');

    map.placePlayer(2, map.getHeight() - 1);

    var functionList = {};

    functionList['fortresses'] = function () {
        function genRandomValue(direction) {
            if (direction === "height") {
                return Math.floor(Math.random() * (map.getHeight()-3));
            } else if (direction === "width") {
                return Math.floor(Math.random() * (map.getWidth()+1));
            }
        }

        var x = genRandomValue("width");
        var y = genRandomValue("height");

        for (var i = x-2; i < x+2; i++) {
            map.placeObject(i,y-2, 'block');
        }
        for (var i = x-2; i < x+2; i++) {
            map.placeObject(i,y+2, 'block');
        }

        for (var j = y-2; j < y+2; j++) {
            map.placeObject(x-2,j, 'block');
        }

        for (var j = y-2; j < y+2; j++) {
            map.placeObject(x+2,j, 'block');
        }
    };

    functionList['generateForest'] = function () {
        for (var i = 0; i < map.getWidth(); i++) {
            for (var j = 0; j < map.getHeight(); j++) {

                // если в клетке уже есть лес, обнуляем её
                if (map.getObjectTypeAt(i, j) === 'tree') {
                    // убираем существующий лес
                    map.placeObject(i,j, 'empty');
                }

                if (map.getPlayer().atLocation(i,j) ||
                        map.getObjectTypeAt(i, j) === 'block' ||
                        map.getObjectTypeAt(i, j) === 'exit') {
                    continue;
                }

                var rv = Math.random();
                if (rv < 0.45) {
                    map.placeObject(i, j, 'tree');
                }
            }
        }
        map.refresh();
    };

    functionList['movePlayerToExit'] = function () {
        map.writeStatus("Отказано в доступе.");
    }

    functionList['pleaseMovePlayerToExit'] = function () {
        map.writeStatus("Вот уж вряд ли.");
    }

    functionList['movePlayerToExitDamnit'] = function () {
        map.writeStatus("Кстати, как там сыграли <МЕСТНАЯ КОМАНДА>?");
    }

    // генерируем лес
    functionList['generateForest']();

    // генерируем крепости
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();
    functionList['fortresses']();

    map.getPlayer().setPhoneCallback(functionList[#{#"movePlayerToExit"#}#]);

    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateAtLeastXObjects(100, 'tree');
    map.validateExactlyXManyObjects(1, 'exit');
}
