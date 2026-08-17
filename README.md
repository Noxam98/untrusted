**Untrusted —or— the Continuing Adventures of Dr. Eval** is an exciting Meta-JavaScript Adventure Game wherein you guide the dashing, steadfast Dr. Eval through a mysterious MACHINE CONTINUUM, wherein, using only his trusty computer and the TURING-COMPLETE power of JavaScript, he must literally ALTER HIS REALITY in order to find his freedom! You must literally edit and re-execute the very JavaScript running the game in your browser to save Dr. Eval from this dark and confusing reality!

### Overview

The game presents you with a roguelike-like playing environment and a console window  with the JavaScript code generating each level. As loaded, each level is unbeatable, and most of the JavaScript is blocked from editing. The challenge is to open a path to the next level using only the limited tools left open to you.

### Development

Run
```
make
```
to merge the JavaScript files into `scripts/build/untrusted.js` (and enables debug features).

```
make release
```
merges and minifies the JavaScript files into `scripts/build/untrusted.min.js` (and disables debug features).

To run the game locally, you need to set up a local server to serve `index.html` (this step is necessary due to Access-Control-Allow-Origin restrictions).

First install [http-server](https://github.com/nodeapps/http-server/#installing-globally) if you haven't already:

```
npm install http-server
```

Then run:

```
make runlocal
```

Build your own mod in the `mods` directory:

```
make mod=example_mod
```

### Autocomplete

The editor completes the game's own API. Ctrl-Space asks for suggestions; a
`.` or a couple of identifier characters brings them up on their own. Enter or
Tab accepts, Esc dismisses, arrows navigate.

Two things make the suggestions specific rather than generic:

* **It only offers what the player has unlocked.** The list is filtered
  through the same set of commands that drives the API reference pane, so a
  level never advertises a call from a level you haven't reached.
* **It knows what is to the left of the dot.** `scripts/inference.js` parses
  the buffer with acorn's error-tolerant parser, builds a scope chain, and
  propagates types through it. `map.getPlayer()` yields a player, the `me` in
  a `behavior` callback is a dynamic object, `map.getDynamicObjects()[0]` is
  one too, and a variable holding any of them keeps its type across
  assignments and nested functions. Inside a `map.defineObject()` literal it
  offers the properties you'd write there; on a live object it offers the
  methods you can call.

The completion database is `reference.js` itself - signatures, categories and
the method/property split all come from there, and descriptions come from the
locale files, so the popup is translated along with everything else. Nothing
outside that database is ever suggested, which also means the editor never
proposes a word `validate.js` would reject.

Suggestions are suppressed on locked lines, and an insertion that would push a
line past the editor's 80-character limit falls back to a shorter form.

The parser lives in `lib/acorn/` (acorn 5.7, MIT). CodeMirror's own `show-hint`
addon is not used: the copy vendored here renders list items as bare strings,
which can't show a signature and a description together.

### Translations (i18n)

The game ships in English and Russian. Pick a language with the `EN | RU`
switcher next to the mute button, or with a `?lang=<code>` query parameter
(`index.html?lang=ru`). The choice is saved in `localStorage` and, on a first
visit, guessed from the browser's `Accept-Language`.

Translated text lives in two places:

* **`locales/<code>.js`** — the interface: buttons, panes, status messages,
  errors, the intro screen and the API reference descriptions. Each file is a
  single `I18n.register(code, name, strings)` call. `locales/en.js` is the
  reference locale and the canonical list of keys.
* **`levels/locales/<code>/*.jsx`** — the levels themselves. A translated level
  is a copy of the original with the comments and the player-facing strings
  translated; the code, the `#BEGIN_*#` markers and the properties block must
  stay identical, since the editor's editable regions are derived from them.

Anything missing falls back to English — a locale with three translated levels
and half a dozen UI strings works fine, it just falls back for the rest.

To add a language:

1. Copy `locales/en.js` to `locales/<code>.js` and translate the values (not
   the keys). Change the first two arguments of `I18n.register` to your
   language code and its name in that language.
2. Add `<script charset="utf-8" src="locales/<code>.js"></script>` to
   `index.html`, next to the other locale files. The switcher builds itself
   from whatever is registered.
3. Optionally copy level files into `levels/locales/<code>/` and translate
   them. `compile_levels.sh` picks up every directory under
   `levels/locales/` automatically — no build config to touch.

In game code, translated strings are fetched with `__('some.key')`, with
`{placeholder}` interpolation: `__('status.killedBy', {killer: 'a laser'})`.
Level code cannot call `__()` — it runs in a sandboxed iframe with globals
stripped — which is why levels are translated as whole files.

Saved solutions are stored per language, so switching languages does not drop
an English solution into a Russian level.

### Deployment

`vercel.json` builds the site with `make site`, which assembles a
self-contained static copy of the game in `_site/`. `make site` uses the
release launcher (debug features off) but skips the YUI compressor, so it
needs no Java.

### Contributing Levels

To add a new level, create a jsx file in [/levels/bonus](https://github.com/AlexNisnevich/untrusted/tree/master/levels/bonus) and add the level filename to the `bonusLevels` array in [game.js](https://github.com/AlexNisnevich/untrusted/blob/master/scripts/game.js#L40).

If you are adding any new commands that the player can use, make sure to add them to `reference.js`.

#### The .jsx file format

jsx files are like regular JavaScript files, but have some additional syntax:
- `#BEGIN_EDITABLE#` and `#END_EDITABLE#` surround editable lines
- `#{#` and `#}#` wrap editable sections (parts of lines)
- `#BEGIN_PROPERTIES#` and `#END_PROPERTIES#` surround the properties object at the start of the file. Available properties include:
  - `commandsIntroduced`: array of new commands introduced in the level (see `reference.js`)
  - `mapProperties`: optionally contains any of the following:
     - `allowOverwrite`: if true, placed static objects can be overwritten by other objects
     - `keyDelay`: specifies the lag, in milliseconds, between player keystrokes (default: 0)
     - `refreshRate`: the refresh rate of the level, in milliseconds (required for dynamic objects with `interval` properties to work correctly)
     - `showDrawingCanvas`: if true, the drawing canvas overlay is displayed
     - `showDummyDom`: if true, a dummy DOM will be displayed instead of the regular map
  - `music`: name of the background track for the level (see `sound.js`)
  - `startingMessage`: message displayed at the bottom of the screen when the level starts (if any)
  - `version`: increase the level version whenever you update a level
  - `nextBonusLevel`: load another level automatically when this one is solved
- `#START_OF_START_LEVEL#` and `#END_OF_START_LEVEL#` should be the first and last line of the `startLevel` method, respectively

#### Adding music

To add a new background music track, add an MP3 file (that you have permission to use) to the [/music](https://github.com/AlexNisnevich/untrusted/tree/master/music) and add a new entry to the `tracks` array in [sound.js](https://github.com/AlexNisnevich/untrusted/blob/master/scripts/sound.js).

### Acknowledgements

Untrusted is a game by [Alex Nisnevich](http://alex.nisnevich.com/) and [Greg Shuflin](https://github.com/neunenak).

We'd like to thank:

- [Dmitry Mazin](https://github.com/dmazin) for design assistance and for the implementation of multiline editing
- [Jordan Arnesen](https://github.com/extrajordanary) for playtesting and design of lvl17
- [Natasha Hull-Richter](http://nhull.com) for extensive playtesting and assistance in level design
- Alex Bolotov, Colin Curtin, Conrad Irwin, Devin C-R, Eugene Evans, Gilbert Hsyu, Jacob Nisnevich, James Silvey, Jason Jiang, Jimmy Hack, Philip Shao, Ryan Fitzgerald, Stephen Liu, Yayoi Ukai, and Yuval Gnessin for playtesting and feedback
- [Ondřej Žára](https://github.com/ondras) for his [rot.js](http://ondras.github.io/rot.js/) library
- [Marijn Haverbeke](https://github.com/marijnh) for his [CodeMirror](http://codemirror.net/) library
- [Brian Harvey](http://www.cs.berkeley.edu/~bh/) for allowing us to use his likeness in lvl19

#### Soundtrack

You can [listen to the full soundtrack here](https://soundcloud.com/untrusted/sets/untrusted-soundtrack).

The music that appears in Untrusted, in order, is:

- "The Green" - [Jonathan Holliday](http://www.soundclick.com/bands/default.cfm?bandID=836578) (used with permission)
- "Dmitry's Thing #2" - [Dmitry Mazin](https://soundcloud.com/dmitry-mazin) (written for Untrusted)
- "Obscure Terrain" - [Revolution Void](http://revolutionvoid.com/) (CC-BY-NC-SA)
- "coming soon" - [Fex](http://artistserver.com/Fex) (public domain)
- "cloudy sin" - [iNTRICATE](https://soundcloud.com/stk13) (used with permission)
- "Dynamic Punctuality" - [Dmitry Mazin](https://soundcloud.com/dmitry-mazin) (written for Untrusted)
- "Y" - [Tortue Super Sonic](https://soundcloud.com/tss-tortue-super-sonic) (CC-BY-NC-SA)
- "Night Owl" - [Broke for Free](http://brokeforfree.com/) (CC-BY)
- "The Waves Call Her Name" - [Sycamore Drive](http://sycamoredrive.bandcamp.com/) (CC-BY-NC-SA)
- "Come and Find Me - B mix" - [Eric Skiff](http://ericskiff.com/) (CC-BY)
- "Conspiracy" - [Mike and Alan](https://www.facebook.com/MicAndAlan) (used with permission)
- "Messeah" - [RoccoW](https://soundcloud.com/roccow) (CC-BY)
- "Searching" - [Eric Skiff](http://ericskiff.com/) (CC-BY)
- "Da Funk Do You Know 'bout Chip?" - [That Andy Guy](https://soundcloud.com/that-andy-guy) (used with permission)
- "Soixante-8" - [Obsibilo](http://freemusicarchive.org/music/Obsibilo/) (CC-BY-NC-SA)
- "Tart (Pts 1 and 2)" - [BLEO feat KeFF](http://bleo.dummydrome.com/) (CC-BY-NC-SA)
- "Beach Wedding Dance" - [Rolemusic](https://soundcloud.com/rolemusic) (CC-BY-NC-SA)
- "Boss Loop 1" - [Essa](http://www.youtube.com/user/Essasmusic) (free to use)
- "Adversity" - [Seropard](https://soundcloud.com/seropard) (free to use)
- "Comme Des Orages" - [Obsibilo](http://freemusicarchive.org/music/Obsibilo/) (CC-BY-NC-SA)
- "Brazilicon Alley" - [Vernon Lenoir](http://vernonlenoir.wordpress.com/) (CC-BY-NC-SA), based on "Aquarela do Brazil" by Ary Barroso

### License
This work is dual-licensed.

- Untrusted and the Untrusted soundtrack are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License (CC-BY-NC-SA 3.0)</a>. In other words, you are free to use and modify Untrusted for non-commercial purposes, provided that you credit us and your work is also licensed under CC-BY-NC-SA.
- Additionally, the Untrusted code *without the soundtrack* is licenced under a commercial license. This means that you are able to use Untrusted for commercial purposes under some conditions, provided that you do not use any of the music. Please [contact us](mailto:alex.nisnevich@gmail.com,greg.shuflin@gmail.com) for details.
