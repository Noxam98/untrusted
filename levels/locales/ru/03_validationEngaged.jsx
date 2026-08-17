#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced":
        ["global.validateLevel", "map.validateAtLeastXObjects",
         "map.validateExactlyXManyObjects"],
    "music": "Obscure Terrain"
}
#END_PROPERTIES#
/************************
 * validationEngaged.js *
 ************************
 *
 * Теперь они точно нас засекли! Включилась функция
 * validateLevel — она следит за тем, что вам позволено
 * делать. В данном случае убирать блоки запрещено.
 *
 * Они делают всё, чтобы удержать вас здесь. Но перехитрить
 * их всё ещё можно.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.placePlayer(map.getWidth()-7, map.getHeight()-5);
#BEGIN_EDITABLE#

    for (var y = 10; y <= map.getHeight() - 3; y++) {
        map.placeObject(5, y, 'block');
        map.placeObject(map.getWidth() - 5, y, 'block');
    }

    for (var x = 5; x <= map.getWidth() - 5; x++) {
        map.placeObject(x, 10, 'block');
        map.placeObject(x, map.getHeight() - 3, 'block');
    }
#END_EDITABLE#

    map.placeObject(7, 5, 'exit');
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    var numBlocks = 2 * (map.getHeight()-13) + 2 * (map.getWidth()-10);

    map.validateAtLeastXObjects(numBlocks, 'block');
    map.validateExactlyXManyObjects(1, 'exit');
}
