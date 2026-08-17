#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced":
        ["map.createFromGrid", "player.removeItem"],
    "music": "Chip"
}
#END_PROPERTIES#
/********************
 * crispsContest.js *
 ********************
 *
 * Алгоритм почти у нас в руках!
 * Наконец-то мы окончательно докажем, что 3SAT
 * решается за полиномиальное время. Путь был долгим
 * и странным, но он того стоит.
 *
 * Красный, зелёный и синий ключи у вас. Осталось
 * сообразить, как открыть эту штуку.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.defineObject('redLock', {
        'symbol': String.fromCharCode(0x2297),
        'color': 'red',
        'impassable': function (player) {
            if (player.hasItem('redKey')) {
                player.removeItem('redKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('blueLock', {
        'symbol': String.fromCharCode(0x2297),
        'color': '#06f',
        'impassable': function (player) {
            if (player.hasItem('blueKey')) {
                player.removeItem('blueKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('greenLock', {
        'symbol': String.fromCharCode(0x2297),
        'color': '#0f0',
        'impassable': function (player) {
            if (player.hasItem('greenKey')) {
                player.removeItem(#{#'greenKey'#}#);
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('yellowLock', {
        'symbol': String.fromCharCode(0x2297),
        'color': 'yellow',
        'impassable': function (player) {
            if (player.hasItem('yellowKey')) {
                player.removeItem('yellowKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.createFromGrid(
       ['  +++++ +++++  ',
        '  + b +++ r +  ',
        '  +   +E+   +  ',
        '+++G+B+ +R+G+++',
        '+ y B     R b +',
        '+   +     +   +',
        '+++++  @  +++++',
        '+   +     +   +',
        '+ y R     B y +',
        '++++++Y+Y++++++',
        '    +  +  +    ',
        '    + ABy +    ',
        '    +++++++    '],
    {
        '@': 'player',
        'E': 'exit',
        'A': 'theAlgorithm',
        '+': 'block',
        'R': 'redLock',
        'G': 'greenLock',
        'B': 'blueLock',
        'Y': 'yellowLock',
        'r': 'redKey',
        'g': 'greenKey',
        'b': 'blueKey',
        'y': 'yellowKey'
    }, 17, 6);
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateAtMostXObjects(1, 'theAlgorithm');
    map.validateAtMostXObjects(4, 'yellowKey');
    map.validateAtMostXObjects(2, 'blueKey');
    map.validateAtMostXObjects(1, 'redKey');
}

function onExit(map) {
    // проверяем, что у нас есть всё необходимое!
    if (!map.getPlayer().hasItem('theAlgorithm')) {
        map.writeStatus("Вы должны забрать этот Алгоритм!!");
        return false;
    } else if (!map.getPlayer().hasItem('computer')) {
        map.writeStatus("Без компьютера никак! [Ctrl-5 — перезапуск]");
        return false;
    } else if (!map.getPlayer().hasItem('phone')) {
        map.writeStatus("Без телефона никак! [Ctrl-5 — перезапуск]");
        return false;
    } else {
        return true;
    }
}
