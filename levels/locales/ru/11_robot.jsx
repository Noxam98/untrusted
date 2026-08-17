#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced":
        ["object.giveItemTo", "object.passableFor",
         "map.validateAtMostXObjects"],
    "music": "conspiracy"
}
#END_PROPERTIES#
/*
 * robot.js
 *
 * Чтобы разблокировать Алгоритм, понадобятся три
 * ключа: красный, зелёный и синий. К несчастью, все
 * три спрятаны за барьерами, непроходимыми для
 * человека.
 *
 * План прост: перепрограммировать ремонтных роботов
 * так, чтобы они схватили ключ и пронесли его через
 * барьер к нам.
 *
 * Начнём с красного ключа.
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel(map) {
#START_OF_START_LEVEL#
    // Подсказка: клавишами R или 5 можно «переждать» ход,
    // не двигая игрока, пока робот перемещается.

    map.placePlayer(map.getWidth()-2, map.getHeight()-2);
    var player = map.getPlayer();

    map.defineObject('robot', {
        'type': 'dynamic',
        'symbol': 'R',
        'color': 'gray',
        'onCollision': function (player, me) {
            me.giveItemTo(player, 'redKey');
        },
        'behavior': function (me) {
#BEGIN_EDITABLE#
            // Доступные команды: me.move(direction)
            //                  и me.canMove(direction)



#END_EDITABLE#
        }
    });

    map.defineObject('barrier', {
        'symbol': '░',
        'color': 'purple',
        'impassable': true,
        'passableFor': ['robot']
    });

    map.placeObject(0, map.getHeight() - 1, 'exit');
    map.placeObject(1, 1, 'robot');
    map.placeObject(map.getWidth() - 2, 8, 'redKey');
    map.placeObject(map.getWidth() - 2, 9, 'barrier');

    for (var x = 0; x < map.getWidth(); x++) {
        map.placeObject(x, 0, 'block');
        if (x != map.getWidth() - 2) {
            map.placeObject(x, 9, 'block');
        }
    }

    for (var y = 1; y < 9; y++) {
        map.placeObject(0, y, 'block');
        map.placeObject(map.getWidth() - 1, y, 'block');
    }
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateExactlyXManyObjects(1, 'robot');
    map.validateAtMostXObjects(1, 'redKey');
}

function onExit(map) {
    if (!map.getPlayer().hasItem('redKey')) {
        map.writeStatus("Нам нужно достать этот ключ!");
        return false;
    } else {
        return true;
    }
}
