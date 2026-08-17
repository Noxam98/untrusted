#BEGIN_PROPERTIES#
{
    "version": "1.2.2",
    "commandsIntroduced": ["player.move", "map.startTimer"],
    "music": "Beach Wedding Dance",
    "mapProperties": {
         "keyDelay": 25
    }
}
#END_PROPERTIES#
/**********************
 * superDrEvalBros.js *
 **********************
 *
 * Вы всё ещё здесь?! Что ж, д-р Eval, посмотрим,
 * как вы справитесь на одно измерение меньше.
 *
 * Сдавайтесь. Если только у вас в рукаве не припрятан
 * волшебный гриб, всё кончено.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    var fl = Math.floor;
    var w = map.getWidth();
    var h = map.getHeight();

    map.placePlayer(1, fl(h/2)-1);
    var player = map.getPlayer();

    map.placeObject(w-1, fl(h/2)-1, 'exit');

    for (var x = 0; x < fl(w/2) - 5; x++) {
        for (var y = fl(h/2); y < h; y++) {
            map.placeObject(x, y, 'block');
        }
    }

    for (var x = fl(w/2) + 5; x <= w; x++) {
        for (var y = fl(h/2); y < h; y++) {
            map.placeObject(x, y, 'block');
        }
    }

    function gravity() {
        var x = player.getX();
        var y = player.getY() + 1;

        if (y === map.getHeight() - 2) {
            player.killedBy("гравитация");
        }

        if (map.getObjectTypeAt(x,y) === "empty") {
            player.move("down");
        }

    }
    map.startTimer(gravity, 45);

    function jump() {
#BEGIN_EDITABLE#







#END_EDITABLE#
    }

    player.setPhoneCallback(function () {
        var x = player.getX();
        var y = player.getY() + 1;

        if (map.getObjectTypeAt(x,y) !== "empty") {
            jump();
        }
    });
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateExactlyXManyObjects(520, 'block');
}
