#BEGIN_PROPERTIES#
{
    "version": "1.2.2",
    "commandsIntroduced":
        ["map.getDynamicObjects", "map.getCanvasCoords", "object.setTarget"],
    "music": "Tart",
    "mapProperties": {
        "showDrawingCanvas": true
    }
}
#END_PROPERTIES#
/***************
 * pointers.js *
 ***************
 *
 * Вы?! Как вы вообще ещё живы?
 *
 * Впрочем, неважно. Удачи вам в этом лабиринте комнат —
 * ни меня, ни Алгоритм вы больше не увидите!
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    function shuffle(o){ //v1.0 [http://bit.ly/1l6LGQT]
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
            x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    map.createFromGrid(
        ['+++++++++++++++++++++++++++++++++++++++++++++',
         '++o *++++o *++++o *++++o *++++o *++++o *+++++',
         '+* @ o++*   o++*   o++*   o++*   o++*   o++++',
         '++o *++++o *++++o *++++o *++++o *++++o *+++++',
         '+++++++++++++++++++++++++++++++++++++++++++++',
         '+++++* o++++* o++++* o++++* o++++* o++++* o++',
         '++++o   *++o   *++o   *++o   *++o   *++o   *+',
         '+++++* o++++* o++++* o++++* o++++* o++++* o++',
         '+++++++++++++++++++++++++++++++++++++++++++++',
         '++o *++++o *++++o *++++o *++++o *++++o *+++++',
         '+*   o++*   o++*   o++*   o++*   o++*   o++++',
         '++o *++++o *++++o *++++o *++++o *++++o *+++++',
         '+++++++++++++++++++++++++++++++++++++++++++++',
         '+++++* o++++* o++++* o++++* o++++* o++++* o++',
         '++++o   *++o   *++o   *++o   *++o   *++o   *+',
         '+++++* o++++* o++++* o++++* o++++* o++++* o++',
         '+++++++++++++++++++++++++++++++++++++++++++++',
         '++o *++++o *++++o *++++o *++++o *++++o *+++++',
         '+*   o++*   o++*   o++*   o++*   o++* E o++++',
         '++o *++++o *++++o *++++o *++++o *++++o *+++++',
         '+++++++++++++++++++++++++++++++++++++++++++++'],
        {
            '@': 'player',
            'E': 'exit',
            '+': 'block',
            'o': 'teleporter',
            '*': 'trap',
        }, 2, 2);

    var canvas = map.getCanvasContext();

    var teleportersAndTraps = map.getDynamicObjects();
    teleportersAndTraps = shuffle(teleportersAndTraps);

    for (var i = 0; i < teleportersAndTraps.length; i+=2) {
        var t1 = teleportersAndTraps[i];
        var t2 = teleportersAndTraps[i+1];

        // Направляем каждый телепорт либо на другой телепорт,
        // либо на ловушку
        if (t1.getType() == 'teleporter') {
            t1.setTarget(t2);
        }
        if (t2.getType() == 'teleporter') {
            t2.setTarget(t1);
        }

#BEGIN_EDITABLE#
        // TODO придумать, как убрать документацию по API
        // не хотелось бы, чтобы «добрый доктор» узнал
        // про map.getCanvasCoords()...





#END_EDITABLE#
    }
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
