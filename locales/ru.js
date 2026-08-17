/*
 * Русская локализация.
 *
 * Ключи совпадают с locales/en.js — переводятся только значения.
 * Отсутствующий ключ автоматически берётся из английского словаря.
 *
 * Названия категорий справочника (canvas, map, player…) намеренно оставлены
 * без перевода: это имена объектов в самом коде игры.
 */

I18n.register('ru', 'Русский', {
    /* --- обрамление страницы -------------------------------------------- */

    'ui.pageTitle': 'Untrusted — приключение на пользовательском JavaScript',
    'ui.noscript': 'Чтобы играть в Untrusted, включите JavaScript.',
    'ui.forkMe': 'Форкни меня на GitHub',
    'ui.language': 'Язык',
    'ui.licensing': 'Хотите использовать Untrusted в коммерческих целях?',
    'ui.paypalCaption': 'Хотите скинуть нам на пиво?',
    'ui.newGame': '<span id="new-text">НОВОЕ</span> Загляните в новую игру Алекса — <a href="https://app.wordbots.io" target="_blank">Wordbots</a>!',

    /* --- кнопки редактора ------------------------------------------------ */

    'ui.button.api': 'API',
    'ui.button.api.title': 'Ctrl+1: Справочник API',
    'ui.button.toggleFocus': 'Фокус',
    'ui.button.toggleFocus.title': 'Ctrl+2: Переключить фокус',
    'ui.button.notepad': 'Блокнот',
    'ui.button.notepad.title': 'Ctrl+3: Блокнот',
    'ui.button.reset': 'Сброс',
    'ui.button.reset.title': 'Ctrl+4: Сбросить уровень',
    'ui.button.execute': 'Запуск',
    'ui.button.execute.title': 'Ctrl+5: Выполнить',
    'ui.button.phone': 'Телефон',
    'ui.button.phone.title': 'Q: Использовать телефон',
    'ui.button.menu': 'Меню',
    'ui.button.menu.title': 'Ctrl+0: Меню',
    'ui.button.menuPlus': 'Меню+',

    /* --- панели ---------------------------------------------------------- */

    'ui.helpPaneTitle': 'Справочник API',
    'ui.levelSelect': 'Выбор уровня',
    'ui.lockedLevel': '???',
    'ui.notepadTitle': '$EDITOR',
    'ui.notepadSave': 'Сохранить',
    'ui.inventory': 'ИНВЕНТАРЬ: ',

    /* --- заставка -------------------------------------------------------- */

    'intro.initialize': '> initialize',
    'intro.title': 'U N T R U S T E D',
    'intro.orElse': '- или - ',
    'intro.subtitle': 'ПРОДОЛЖЕНИЕ ПРИКЛЮЧЕНИЙ Д-РА EVAL',
    'intro.credits': 'игра Алекса Нисневича и Грега Шуфлина',
    'intro.pressAnyKey': 'Нажмите любую клавишу для начала ...',

    /* --- сообщения в статусной строке ------------------------------------ */

    'status.pickUp.computer': 'Вы подобрали компьютер!',
    'status.pickUp.phone': 'Вы подобрали функциональный телефон!',
    'status.pickUp.redKey': 'Вы подобрали красный ключ!',
    'status.pickUp.greenKey': 'Вы подобрали зелёный ключ!',
    'status.pickUp.blueKey': 'Вы подобрали синий ключ!',
    'status.pickUp.yellowKey': 'Вы подобрали жёлтый ключ!',
    'status.pickUp.theAlgorithm': 'Вы подобрали Алгоритм!',
    'status.drop.theAlgorithm': 'Вы потеряли Алгоритм!',
    'status.phoneUnbound': 'Ваш функциональный телефон ни к чему не привязан!',
    'status.resetLevel': 'Чтобы сбросить уровень, нажмите ^4 ещё раз.',
    'status.killedBy': 'Причина смерти: \n{killer}',
    'status.killedByChapter': 'Причина смерти: \n{killer}!',
    'status.nowPlaying': 'Сейчас играет: «{title}» — {artist}',
    'status.solutionSaved': 'Решение уровня {level} сохранено: <a href="{url}" target="_blank">{url}</a>',
    'status.gistDescription': 'Решение уровня {level} в игре Untrusted: http://alex.nisnevich.com/untrusted/',

    /* --- сообщения об ошибках -------------------------------------------- */

    'error.linePrefix': '[Строка {line}] ',
    'error.notAllowed': 'Использовать «{word}» запрещено!',
    'error.tampered': 'Функцию startLevel() подменили!',
    'error.prematureReturn': 'startLevel() завершилась преждевременно!',
    'error.timeout': '[Строка {line}] TimeOutException: превышено максимальное время выполнения цикла — {ms} мс.',
    'error.reloadLevel': 'Пожалуйста, перезагрузите уровень.',
    'error.validationFailed': 'Проверка не пройдена! Перезагрузите уровень.',

    /* --- консоль разработчика -------------------------------------------- */

    'console.cheating': 'Если вы это читаете, вы жульничаете! D:',
    'console.hint': 'Но вообще-то консоль для игры не нужна. Ходите стрелками (или клавишами Vim) и подберите компьютер ({symbol}). Вот тут и начнётся веселье!',

    /* --- автодополнение --------------------------------------------------- */

    'autocomplete.category.local': 'своё',
    'autocomplete.desc.local': 'Имя, объявленное в коде этого уровня.',
    'autocomplete.desc.localTyped': 'Имя, объявленное в коде этого уровня. Содержит: {type}.',
    'autocomplete.desc.sandboxGlobal': 'Встроенное средство JavaScript, разрешённое в коде уровня.',

    /* --- справочник API: названия категорий ------------------------------ */

    'reference.category.canvas': 'canvas',
    'reference.category.global': 'global',
    'reference.category.jQuery': 'jQuery',
    'reference.category.map': 'map',
    'reference.category.object': 'object',
    'reference.category.player': 'player',
    'reference.category.ROT': 'ROT',

    /* --- справочник API: описания ---------------------------------------- */

    'reference.desc.canvas.beginPath': 'Начинает рисование новой фигуры.',
    'reference.desc.canvas.lineTo': 'Задаёт конечные координаты линии.',
    'reference.desc.canvas.lineWidth': 'Определяет толщину следующих нарисованных линий.',
    'reference.desc.canvas.moveTo': 'Задаёт начальные координаты линии.',
    'reference.desc.canvas.stroke': 'Рисует линию, координаты которой заданы через <b>lineTo</b> и <b>moveTo</b>.',
    'reference.desc.canvas.strokeStyle': 'Определяет цвет (и, при желании, другие свойства) следующих нарисованных линий.',
    'reference.desc.canvas.fillStyle': 'Определяет цвет (и, при желании, другие свойства) текста, нарисованного через <b>fillText</b>.',
    'reference.desc.canvas.fillText': 'Рисует на холсте заданный текст, начиная с указанных координат.',
    'reference.desc.global.$': 'Получив строку HTML, $ возвращает соответствующий объект <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a>.',
    'reference.desc.global.objective': 'Игрок покидает уровень, как только этот метод возвращает true.',
    'reference.desc.global.onExit': 'Игрок может покинуть уровень, только если этот метод возвращает true.',
    'reference.desc.global.startLevel': 'Этот метод вызывается при загрузке уровня.',
    'reference.desc.global.validateLevel': 'Уровень может быть загружен, только если этот метод возвращает true.',
    'reference.desc.ROT.Map.DividedMaze': 'Создаёт объект Maze (лабиринт) заданной ширины и высоты. Лабиринт строится вызовом maze.create(callback), где callback — функция, принимающая (x, y, mapValue) и выполняющая некое действие для каждой точки сетки; mapValue — булево значение, истинное тогда и только тогда, когда точка входит в лабиринт.',
    'reference.desc.jQuery.addClass': 'Добавляет указанный CSS-класс элементу (или элементам) DOM, заданным объектом jQuery.',
    'reference.desc.jQuery.children': 'Возвращает потомков DOM-элемента, заданного объектом jQuery, в виде массива jQuery.',
    'reference.desc.jQuery.find': 'Возвращает все элементы дерева DOM, заданного объектом jQuery, которые совпадают с указанным CSS-селектором, в виде массива jQuery.',
    'reference.desc.jQuery.first': 'Возвращает первый элемент массива jQuery.',
    'reference.desc.jQuery.hasClass': 'Возвращает true тогда и только тогда, когда у DOM-элемента, заданного объектом jQuery, есть указанный CSS-класс.',
    'reference.desc.jQuery.length': 'Возвращает количество элементов в массиве jQuery.',
    'reference.desc.jQuery.next': 'Возвращает следующего соседа DOM-элемента, заданного объектом jQuery.',
    'reference.desc.jQuery.parent': 'Возвращает родителя DOM-элемента, заданного объектом jQuery.',
    'reference.desc.jQuery.prev': 'Возвращает предыдущего соседа DOM-элемента, заданного объектом jQuery.',
    'reference.desc.jQuery.removeClass': 'Удаляет указанный CSS-класс у элемента (или элементов) DOM, заданных объектом jQuery.',
    'reference.desc.map.countObjects': 'Возвращает количество объектов заданного типа на карте.',
    'reference.desc.map.createFromDOM': 'Создаёт карту из объекта <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a>, отображая её как DOM (объектную модель документа), а не как сетку.',
    'reference.desc.map.createFromGrid': 'Расставляет объекты на карте согласно их положению в сетке grid (массив строк), используя соответствия из tiles (словарь «символ → тип объекта»), со смещением offset от левого верхнего угла карты.',
    'reference.desc.map.createLine': 'Проводит на карте линию между заданными точками; при касании её игроком вызывается указанный callback. (Учтите, что линия невидима: createLine <i>ничего</i> не рисует на <a onclick="$(\'#helpPaneSidebar .category#canvas\').click();">canvas</a>.)',
    'reference.desc.map.displayChapter': 'Показывает заданное название главы.',
    'reference.desc.map.defineObject': 'Определяет новый тип <a onclick="$(\'#helpPaneSidebar .category#object\').click();">объекта</a> с заданными свойствами. Учтите, что типы, созданные через map.defineObject, существуют только в пределах текущего уровня.',
    'reference.desc.map.getAdjacentEmptyCells': 'Возвращает пустые клетки, соседние с клеткой по заданным координатам (если такие есть), в виде массива элементов вида <i>[[x, y], направление]</i>, где (x, y) — координаты пустой клетки, а <i>направление</i> — направление от заданной клетки к ней («left», «right», «up» или «down»).',
    'reference.desc.map.getCanvasContext': 'Возвращает двумерный контекст рисования для <a onclick="$(\'#helpPaneSidebar .category#canvas\').click();">canvas</a>, наложенного на карту.',
    'reference.desc.map.getCanvasCoords': 'Возвращает {"x": x, "y": y}, где x и y — координаты заданного объекта или клетки сетки на холсте, который возвращает map.getCanvasContext().',
    'reference.desc.map.getDOM': 'Возвращает объект <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a>, представляющий карту.',
    'reference.desc.map.getDynamicObjects': 'Возвращает все динамические объекты, находящиеся сейчас на карте.',
    'reference.desc.map.getHeight': 'Возвращает высоту карты в клетках.',
    'reference.desc.map.getObjectTypeAt': 'Возвращает тип объекта по заданным координатам (или «empty», если объекта там нет).',
    'reference.desc.map.getPlayer': 'Возвращает объект Player (игрока).',
    'reference.desc.map.getRandomColor': 'Возвращает шестнадцатеричную строку со случайным цветом между начальным и конечным цветом. Начальный и конечный цвета задаются массивами вида [R, G, B], где R, G и B — десятичные целые числа.',
    'reference.desc.map.getWidth': 'Возвращает ширину карты в клетках.',
    'reference.desc.map.isStartOfLevel': 'Возвращает true, если вызван во время запуска уровня.',
    'reference.desc.map.overrideKey': 'Переопределяет действие, выполняемое при нажатии заданной клавиши (<i>left</i>, <i>right</i>, <i>up</i> или <i>down</i>).',
    'reference.desc.map.placeObject': 'Помещает объект заданного типа в заданные координаты.',
    'reference.desc.map.placePlayer': 'Помещает игрока в заданные координаты.',
    'reference.desc.map.setSquareColor': 'Задаёт цвет фона указанной клетки.',
    'reference.desc.map.timeout': 'Запускает таймер (ср. setTimeout) с заданной задержкой в миллисекундах (минимум 25 мс). В отличие от map.startTimer, callback сработает лишь один раз.',
    'reference.desc.map.startTimer': 'Запускает таймер (ср. setInterval) с заданной задержкой в миллисекундах (минимум 25 мс).',
    'reference.desc.map.updateDOM': 'Обновляет объект <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a>, представляющий карту.',
    'reference.desc.map.validateAtLeastXLines': 'Выбрасывает исключение, если на карте меньше num линий (созданных через map.createLine).',
    'reference.desc.map.validateAtLeastXObjects': 'Выбрасывает исключение, если на карте меньше num объектов типа objectType.',
    'reference.desc.map.validateAtMostXDynamicObjects': 'Выбрасывает исключение, если на карте больше num динамических объектов.',
    'reference.desc.map.validateExactlyXManyObjects': 'Выбрасывает исключение, если на карте не ровно num объектов типа objectType.',
    'reference.desc.map.validateNoTimers': 'Выбрасывает исключение, если сейчас установлен хотя бы один таймер через map.startTimer.',
    'reference.desc.map.writeStatus': 'Показывает сообщение внизу карты.',
    'reference.desc.object.behavior': '(Только для динамических объектов.) Функция, выполняемая каждый раз, когда наступает ход этого объекта.',
    'reference.desc.object.canMove': '(Только для динамических объектов.) Возвращает true тогда и только тогда, когда объект может сместиться на одну клетку в заданном направлении: «left», «right», «up» или «down».',
    'reference.desc.object.color': 'Цвет символа объекта на карте.',
    'reference.desc.object.findNearest': '(Только для динамических объектов.) Возвращает координаты x и y ближайшего к этому объекту объекта заданного типа в виде хеша.',
    'reference.desc.object.getX': '(Только для динамических объектов.) Возвращает координату x объекта.',
    'reference.desc.object.getY': '(Только для динамических объектов.) Возвращает координату y объекта.',
    'reference.desc.object.giveItemTo': '(Только для динамических объектов.) Передаёт заданный предмет цели (обычно игроку). Возможно лишь сразу после столкновения объекта с игроком.',
    'reference.desc.object.impassable': '(Только для нединамических объектов.) Функция, определяющая, может ли игрок пройти сквозь этот объект.',
    'reference.desc.object.move': '(Только для динамических объектов.) Смещает объект на одну клетку в заданном направлении: «left», «right», «up» или «down». За один ход объект может сместиться только один раз.',
    'reference.desc.object.onCollision': 'Функция, выполняемая, когда этот объект касается игрока.',
    'reference.desc.object.onDestroy': '(Только для динамических объектов.) Функция, выполняемая при уничтожении этого объекта.',
    'reference.desc.object.projectile': '(Только для динамических объектов.) Если true, этот объект уничтожает любой динамический объект (или игрока), с которым сталкивается, и сам уничтожается при столкновении с чем угодно.',
    'reference.desc.object.pushable': '(Только для динамических объектов.) Если true, игрок может толкать этот объект.',
    'reference.desc.object.symbol': 'Символ объекта на карте.',
    'reference.desc.object.setTarget': '(Только для телепортов.) Задаёт пункт назначения этого телепорта.',
    'reference.desc.object.type': 'Может быть «item», «dynamic» или отсутствовать. Если «dynamic», объект может двигаться в ходы, которые происходят при каждом перемещении игрока. Если «item», объект можно подобрать.',
    'reference.desc.player.atLocation': 'Возвращает true тогда и только тогда, когда игрок находится в заданной точке.',
    'reference.desc.player.getColor': 'Возвращает цвет игрока.',
    'reference.desc.player.getLastMoveDirection': 'Возвращает направление последнего перемещения игрока.',
    'reference.desc.player.getX': 'Возвращает координату x игрока.',
    'reference.desc.player.getY': 'Возвращает координату y игрока.',
    'reference.desc.player.hasItem': 'Возвращает true тогда и только тогда, когда у игрока есть заданный предмет.',
    'reference.desc.player.killedBy': 'Убивает игрока и показывает заданный текст как причину смерти.',
    'reference.desc.player.move': 'Смещает игрока на одну клетку в заданном направлении. За один вызов функции игрок может сместиться только один раз.',
    'reference.desc.player.removeItem': 'Удаляет заданный предмет из инвентаря игрока, если этот предмет у него есть.',
    'reference.desc.player.setColor': 'Задаёт цвет игрока.',
    'reference.desc.player.setPhoneCallback': 'Задаёт функцию, выполняемую, когда игрок пользуется функциональным телефоном.'
});
