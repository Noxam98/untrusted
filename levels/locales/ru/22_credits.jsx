#BEGIN_PROPERTIES#
{
    "version": "1.3.0",
    "music": "Brazil",
    "mapProperties": {
        "showDrawingCanvas": "true"
    },
    "commandsIntroduced": [
            "canvas.fillStyle",
            "canvas.fillText",
            "map.timeout"
    ]
}
#END_PROPERTIES#
/**************
 * credits.js *
 *************
 *
 * Поздравляем! Д-р Eval успешно сбежал из Машинного
 * Континуума, унося с собой Алгоритм.
 *
 * Похлопайте себя по плечу. Вы толковый хакер.
 *
 *
 *
 * Хочется ещё?
 *
 * Загляните в репозиторий Untrusted на github:
 *      https://github.com/AlexNisnevich/untrusted
 *
 * Может, попробуете сделать свой уровень-другой!
 *
 * Понравилось, что играло? Полный саундтрек можно
 * послушать здесь:
 *      https://soundcloud.com/untrusted
 *
 * Пишите нам на [
 *      'alex [dot] nisnevich [at] gmail [dot] com',
 *      'greg [dot] shuflin [at] gmail [dot] com'
 * ]
 *
 * И ещё раз — поздравляем!
 *
 *             -- Алекс и Грег
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    var credits = [
        [15, 1, "U N T R U S T E D"],
        [21, 2, "- или -"],
        [8, 3, "ПРОДОЛЖЕНИЕ ПРИКЛЮЧЕНИЙ Д-РА EVAL"],
        [1, 4, "{"],
        [2, 5, "a_game_by: 'Alex Nisnevich and Greg Shuflin',"],
        [2, 7, "special_thanks_to: {"],
        [5, 8, "Dmitry_Mazin: ['design', 'code'],"],
        [5, 9, "Jordan_Arnesen: ['levels', 'playtesting'],"],
        [5, 10, "Natasha_HullRichter: ['levels','playtesting']"],
        [2, 11, "},"],
        [2, 13, "music_by: "],
        [4, 14, "['Jonathan Holliday',"],
        [5, 15, "'Dmitry Mazin',"],
        [5, 16, "'Revolution Void',"],
        [5, 17, "'Fex',"],
        [5, 18, "'iNTRICATE',"],
        [5, 19, "'Tortue Super Sonic',"],
        [5, 20, "'Broke For Free',"],
        [5, 21, "'Sycamore Drive',"],
        [5, 22, "'Eric Skiff'],"],
        [30, 14, "'Mike and Alan',"],
        [30, 15, "'RoccoW',"],
        [30, 16, "'That Andy Guy',"],
        [30, 17, "'Obsibilo',"],
        [30, 18, "'BLEO',"],
        [30, 19, "'Rolemusic',"],
        [30, 20, "'Seropard',"],
        [30, 21, "'Vernon Lenoir',"],
        [15, map.getHeight() - 2, "Spasibo: 'за то, что играли!'"],
        [1, map.getHeight() - 1, "}"]
    ];

    function drawCredits(i) {
        if (i >= credits.length) {
            return;
        }
        var ctx = map.getCanvasContext();
        ctx.fillStyle = "#ccc";
        var line = credits[i];
        var coords = map.getCanvasCoords(line[0],line[1]);
        ctx.fillText(line[2],coords.x, coords.y)
        map.timeout(function () {drawCredits(i+1);}, 2000)
    }

    map.timeout(function () {drawCredits(0);}, 4000);

#END_OF_START_LEVEL#
}
