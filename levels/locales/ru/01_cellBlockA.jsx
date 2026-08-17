#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced":
        ["global.startLevel", "global.onExit", "map.placePlayer",
         "map.placeObject", "map.getHeight", "map.getWidth",
         "map.displayChapter", "map.getPlayer", "player.hasItem"],
    "music": "The Green"
}
#END_PROPERTIES#
/*****************
 * cellBlockA.js *
 *****************
 *
 * Доброе утро, д-р Eval.
 *
 * Это было непросто, но я всё-таки протащил к вам ваш
 * компьютер. Система может показаться незнакомой, но код
 * под ней — всё тот же JavaScript. Как мы и предполагали.
 *
 * А теперь заберём то, за чем пришли, и вытащим вас
 * отсюда. Проще простого.
 *
 * Я дал вам столько доступа к их коду, сколько смог, но он
 * не идеален. Красным фоном отмечены строки, которые
 * редактировать нельзя.
 *
 * Сейчас код расставляет блоки прямоугольником вокруг вас.
 * Всё, что нужно, — сделать в нём проём. Ничего лишнего
 * делать не надо. Наоборот, надо сделать меньше.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Глава 1\nПобег');

    map.placePlayer(7, 5);
#BEGIN_EDITABLE#

    for (var y = 3; y <= map.getHeight() - 10; y++) {
        map.placeObject(5, y, 'block');
        map.placeObject(map.getWidth() - 5, y, 'block');
    }

    for (var x = 5; x <= map.getWidth() - 5; x++) {
        map.placeObject(x, 3, 'block');
        map.placeObject(x, map.getHeight() - 10, 'block');
    }
#END_EDITABLE#

    map.placeObject(15, 12, 'computer');

    map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');
#END_OF_START_LEVEL#
}

function onExit(map) {
    if (!map.getPlayer().hasItem('computer')) {
        map.writeStatus("Не забудьте подобрать компьютер!");
        return false;
    } else {
        return true;
    }
}
