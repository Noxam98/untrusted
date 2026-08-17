#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced": [],
    "music": "The_Waves_Call_Her_Name",
    "startingMessage": "Вы потеряли Алгоритм!"
}
#END_PROPERTIES#
/**************************
 * exceptionalCrossing.js *
 **************************
 *
 * Прости, старый друг, но соавторством в этой
 * статье я, боюсь, делиться не стану. Ты отлично
 * справился и добыл для меня Алгоритм. Трюк с
 * ключами был особенно изящен! Сам бы я до такого
 * не додумался. Впрочем, за этим тебя сюда и
 * позвали.
 *
 * Своё предназначение ты выполнил. А теперь, увы,
 * тебе пора умереть.
 *
 * Но я не бессердечен. Я даже позволю тебе выбрать
 * способ смерти. Ну разве не мило?
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Глава 3\nПредательство');

    map.placePlayer(0, 0);

    // хвать!
    map.getPlayer().removeItem('theAlgorithm');

    map.defineObject('water', {
        'symbol': '░',
        'color': '#44f',
        'onCollision': function (player) {
            player.killedBy#{#('утопление в тёмной глубокой воде')#}#;
        }
    });

    for (var x = 0; x < map.getWidth(); x++)
        for (var y = 5; y < 15; y++)
            map.placeObject(x, y, 'water');

    map.placeObject(map.getWidth()-1, map.getHeight()-1, 'exit');
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
