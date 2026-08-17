#BEGIN_PROPERTIES#
{
    "version": "1.2",
	"commandsIntroduced":
        ["object.type", "object.behavior", "object.findNearest",
         "object.getX", "object.getY", "object.canMove", "object.move"],
    "music": "GameScratch"
}
#END_PROPERTIES#

/****************
 * drones101.js *
 ****************
 *
 * Помните, дорогой профессор, тот вводный курс вычислительной
 * рациональности, что вы читали много лет назад? Задание №2,
 * функции поведения автономных агентов? Я вспоминаю его с
 * теплотой — хотя про боевые дроны, полагаю, рассуждать куда
 * приятнее, когда они не смотрят тебе в лицо!
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    function moveToward(obj, type) {
        var target = obj.findNearest(type);
        var leftDist = obj.getX() - target.x;
        var upDist = obj.getY() - target.y;

        var direction;
        if (upDist == 0 && leftDist == 0) {
        	return;
        } if (upDist > 0 && upDist >= leftDist) {
            direction = 'up';
        } else if (upDist < 0 && upDist < leftDist) {
            direction = 'down';
        } else if (leftDist > 0 && leftDist >= upDist) {
            direction = 'left';
        } else {
            direction = 'right';
        }

        if (obj.canMove(direction)) {
            obj.move(direction);
        }
    }

    map.defineObject('attackDrone', {
        'type': 'dynamic',
        'symbol': 'd',
        'color': 'red',
        'onCollision': function (player) {
            player.killedBy('боевой дрон');
        },
        'behavior': function (me) {
            moveToward(me, 'player');
        }
    });


    map.placePlayer(1, 1);
    map.placeObject(map.getWidth()-2, 12, 'attackDrone');
    map.placeObject(map.getWidth()-1, 12, 'exit');

    map.placeObject(map.getWidth()-1, 11, 'block');
    map.placeObject(map.getWidth()-2, 11, 'block');
    map.placeObject(map.getWidth()-1, 13, 'block');
    map.placeObject(map.getWidth()-2, 13, 'block');
#BEGIN_EDITABLE#




#END_EDITABLE#
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
