#!/bin/sh
#
# Bundles every level's source into levels/levels.js as string literals.
#
# Output is grouped by language:
#
#     Game.prototype._levels = {
#         'en': { 'levels/01_cellBlockA.jsx': '...' },
#         'ru': { 'levels/01_cellBlockA.jsx': '...' },
#     };
#
# The mod's own *.jsx files are the default locale ('en' - keep this in sync
# with I18n.defaultLocale). Translations live in <mod>/locales/<code>/*.jsx and
# only need to cover the levels they have actually translated; game.js falls
# back to the default locale for the rest.

mod=$1
out=levels/levels.js

# Emits one "'<key>': '<escaped source>'," entry.
# $1 = path to the .jsx file, $2 = key to store it under
emit_level() {
	printf %s "        '$2': '" >> $out
	echo "$1" | xargs sed "s#\\\#\\\\\\\#g" | sed "s#'#\\\'#g" | tr '\n' '`' | sed "s/\`/\\\n/g" | sed -e "a\\
	',
	" | tr '\n' ' ' >> $out
	echo "" >> $out # dummy newline for style
}

echo "Game.prototype._levels = {" > $out

echo "    'en': {" >> $out
for lvl in mods/$mod/*.jsx
do
	emit_level "$lvl" "levels/`basename $lvl`"
done
echo "    }," >> $out

if [ -d "mods/$mod/locales" ]; then
	for dir in mods/$mod/locales/*/
	do
		[ -d "$dir" ] || continue
		code=`basename "$dir"`
		echo "    '$code': {" >> $out
		for lvl in "$dir"*.jsx
		do
			[ -f "$lvl" ] || continue
			emit_level "$lvl" "levels/`basename $lvl`"
		done
		echo "    }," >> $out
	done
fi

echo "};" >> $out
