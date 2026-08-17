#BEGIN_PROPERTIES#
{
    "version": "1.3",
    "commandsIntroduced":
        ["global.objective", "map.getDOM", "map.createFromDOM",
         "map.updateDOM", "map.overrideKey", "global.$",
         "jQuery.find", "jQuery.addClass", "jQuery.hasClass",
         "jQuery.removeClass", "jQuery.parent", "jQuery.length",
         "jQuery.children", "jQuery.first", "jQuery.next",
         "jQuery.prev"],
    "music": "BossLoop",
    "mapProperties": {
        "showDummyDom": true
    }
}
#END_PROPERTIES#
/****************************
 * documentObjectMadness.js *
 ****************************
 *
 * Поверить не могу! Не могу поверить, что вы пробрались
 * на веб-сервер кафедры теоретических вычислений!
 * ВАС ДОЛЖНЫ БЫЛИ УДАЛИТЬ! Это вообще не должно быть
 * возможно! О чём только думали наши айтишники?
 *
 * Впрочем, неважно. Алгоритм всё ещё у меня. Это главное.
 * Остальное — вопрос реализации, а насколько это может
 * быть сложно?
 *
 * И всё равно теперь вам меня не поймать, добрый доктор.
 * Вы же профессор с бессрочным контрактом и солидным
 * послужным списком — jQuery вы наверняка не знаете!
 */

function objective(map) {
    return map.getDOM().find('.adversary').hasClass('drEval');
}

function startLevel(map) {
#START_OF_START_LEVEL#
    var html = "<div class='container'>" +
    "<div style='width: 600px; height: 500px; background-color: white; font-size: 10px;'>" +
        "<center><h1>Кафедра теоретических вычислений</h1></center>" +
        "<hr />" +
        "<table border='0'><tr valign='top'>" +
            "<td><div id='face' /></td>" +
            "<td>" +
                "<h2 class=facultyName>Корнелиус Eval</h2>" +
                "<h3>Доцент кафедры информатики</h3>" +
                "<ul>" +
                    "<li>Бакалавр математики, Университет Манитобы</li>" +
                    "<li>PhD, теоретические вычисления, <a href='http://www.mit.edu'>MIT</a></li>" +
                "</ul>" +
                "<h4>Обо мне</h4>" +
                "<p>Я доцент кафедры информатики, прикреплённый к кафедре " +
                "теоретических вычислений. Мои текущие научные интересы: человеко-машинный " +
                "интерфейс, NP-полные задачи и распараллеленная сеточная математика.</p>" +
                "<p>Также я курирую <a href=''>студенческую команду по Super Smash Bros.</a> " +
                "В свободное время увлекаюсь полькой и эндуро. </p>" +
            "</td>" +
        "</tr></table>" +

        "<div id='class_schedule'>" +
          "<h4>Расписание занятий</h4>" +
            "<table>" +
             "<tr>" +
                "<th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th>" +
             "</tr>" +
             "<tr>" +
                "<td>CS145 — Точки с запятой</td><td>Ничего не запланировано</td><td>CS145 — Точки с запятой</td><td>CS199 — Прикладное теоретизирование </td><td>CS145 — Точки с запятой</td>" +
             "</tr>" +
            "</table>" +
        "</div>" +
        "<div id='loremIpsum'>" +
        "<h4>Lorem Ipsum</h4>" +
          "<blockquote>" +
            "<code>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci " +
            "velit, sed quia nonnumquam eiusmodi tempora incidunt ut labore et dolore magnam aliquam quaerat " +
            "voluptatem.</code>" +
            "<footer>— " +
              "<cite>Cicero, De Finibus Bonorum et Malorum</cite>" +
            "</footer>" +
          "</blockquote>" +
        "</div>" +
    "</div></div>";

    var $dom = $(html);

    $dom.find('.facultyName').addClass('drEval');
    $dom.find('cite').addClass('adversary');

    function moveToParent(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.parent().length > 0) {
            if (currentPosition.parent().hasClass('container')) {
                if (className === 'drEval') {
                    map.getPlayer().killedBy('выход за край DOM');
                } else {
                    return false;
                }
            } else {
                currentPosition.parent().addClass(className);
                currentPosition.removeClass(className);
                map.updateDOM($dom);
            }
        }
    }

    function moveToFirstChild(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.children().length > 0) {
            currentPosition.children().first().addClass(className);
            currentPosition.removeClass(className);
            map.updateDOM($dom);
        }
    }

    function moveToPreviousSibling(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.prev().length > 0) {
            currentPosition.prev().addClass(className);
            currentPosition.removeClass(className);
            map.updateDOM($dom);
        }
    }

    function moveToNextSibling(className) {
        var currentPosition = $dom.find('.' + className);
        if (currentPosition.next().length > 0) {
            currentPosition.next().addClass(className);
            currentPosition.removeClass(className);
            map.updateDOM($dom);
        }
    }

    map.overrideKey('up', function () { moveToParent('drEval'); });
    map.overrideKey('down', function () { moveToFirstChild('drEval'); });
    map.overrideKey('left', function () { moveToPreviousSibling('drEval'); });
    map.overrideKey('right', function () { moveToNextSibling('drEval'); });

    map.defineObject('adversary', {
        'type': 'dynamic',
        'symbol': '@',
        'color': 'red',
        'behavior': function (me) {
            var move = Math.floor(Math.random() * 4) + 1; // 1, 2, 3 или 4
            if (move == 1) {
                moveToParent('adversary');
            } else if (move == 2) {
                moveToFirstChild('adversary');
            } else if (move == 3) {
                moveToPreviousSibling('adversary');
            } else if (move == 4) {
                moveToNextSibling('adversary');
            }
        }
    });

    map.placePlayer(1, 1);
    map.placeObject(map.getWidth() - 2, map.getHeight() - 2, 'adversary');

    map.createFromDOM($dom);
#END_OF_START_LEVEL#
}
