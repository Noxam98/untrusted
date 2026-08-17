/*
 * i18n.js - translation runtime for Untrusted
 *
 * Loaded from index.html *before* the merged game script, together with
 * every file in locales/. Each locale file registers itself:
 *
 *     I18n.register('ru', 'Русский', { 'ui.menu': 'Меню', ... });
 *
 * Game code then looks strings up with the global shorthand __():
 *
 *     __('ui.menu')                     // "Меню"
 *     __('status.killedBy', {killer: x}) // interpolates {killer}
 *
 * Static markup is translated by tagging elements in index.html:
 *
 *     <a data-i18n="ui.menu"></a>            sets textContent
 *     <a data-i18n-title="ui.menu.title">    sets the title attribute
 *     <img data-i18n-alt="ui.forkMe">        sets the alt attribute
 *     <div data-i18n-html="ui.licensing">    sets innerHTML (markup allowed)
 *
 * Missing keys fall back to the default locale, then to the key itself, so a
 * partial translation always degrades to English rather than to blanks.
 */

var I18n = (function () {
    var STORAGE_KEY = 'untrusted.locale';
    var DEFAULT_LOCALE = 'en';

    var locales = {};      // code -> {code: ..., name: ..., strings: {...}}
    var order = [];        // registration order, for the switcher
    var currentLocale = DEFAULT_LOCALE;

    // ?lang=ru wins over the saved choice, so links can point at a language
    function localeFromQueryString() {
        var match = /[?&]lang=([a-zA-Z-]+)/.exec(window.location.search);
        return match ? match[1].toLowerCase() : null;
    }

    function localeFromStorage() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null; // localStorage can be disabled
        }
    }

    // "ru-RU" and "ru" both count as a match for the "ru" locale
    function localeFromBrowser() {
        var languages = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < languages.length; i++) {
            var tag = String(languages[i]).toLowerCase();
            if (locales[tag]) { return tag; }
            var base = tag.split('-')[0];
            if (locales[base]) { return base; }
        }
        return null;
    }

    // {name} placeholders are replaced with params.name
    function interpolate(template, params) {
        if (!params) { return template; }
        return template.replace(/\{(\w+)\}/g, function (match, name) {
            return params.hasOwnProperty(name) ? params[name] : match;
        });
    }

    var self = {
        defaultLocale: DEFAULT_LOCALE,

        register: function (code, name, strings) {
            code = code.toLowerCase();
            if (!locales[code]) {
                order.push(code);
                locales[code] = { code: code, name: name, strings: {} };
            }
            locales[code].name = name;
            for (var key in strings) {
                if (strings.hasOwnProperty(key)) {
                    locales[code].strings[key] = strings[key];
                }
            }
        },

        getAvailableLocales: function () {
            return order.map(function (code) { return locales[code]; });
        },

        getLocale: function () { return currentLocale; },

        getLocaleName: function (code) {
            var locale = locales[code || currentLocale];
            return locale ? locale.name : code;
        },

        // Persists the choice. Callers reload the page afterwards: level
        // sources, the API reference and the static markup are all built at
        // startup, so a reload is the only way to swap every one of them.
        setLocale: function (code) {
            code = String(code).toLowerCase();
            if (!locales[code]) { return false; }
            currentLocale = code;
            try {
                localStorage.setItem(STORAGE_KEY, code);
            } catch (e) { /* localStorage can be disabled */ }
            return true;
        },

        t: function (key, params) {
            var locale = locales[currentLocale];
            if (locale && locale.strings.hasOwnProperty(key)) {
                return interpolate(locale.strings[key], params);
            }
            var fallback = locales[DEFAULT_LOCALE];
            if (fallback && fallback.strings.hasOwnProperty(key)) {
                return interpolate(fallback.strings[key], params);
            }
            return key;
        },

        // True if the key exists in the active locale or the default one.
        has: function (key) {
            var locale = locales[currentLocale];
            if (locale && locale.strings.hasOwnProperty(key)) { return true; }
            var fallback = locales[DEFAULT_LOCALE];
            return !!(fallback && fallback.strings.hasOwnProperty(key));
        },

        // Applies data-i18n* attributes within the given root (default: document).
        translateDom: function (root) {
            var $root = $(root || document);
            var attributes = {
                'data-i18n-title': 'title',
                'data-i18n-alt': 'alt',
                'data-i18n-placeholder': 'placeholder'
            };

            $root.find('[data-i18n]').each(function () {
                $(this).text(self.t($(this).attr('data-i18n')));
            });

            $root.find('[data-i18n-html]').each(function () {
                $(this).html(self.t($(this).attr('data-i18n-html')));
            });

            for (var dataAttr in attributes) {
                if (attributes.hasOwnProperty(dataAttr)) {
                    (function (dataAttr, htmlAttr) {
                        $root.find('[' + dataAttr + ']').each(function () {
                            $(this).attr(htmlAttr, self.t($(this).attr(dataAttr)));
                        });
                    })(dataAttr, attributes[dataAttr]);
                }
            }

            document.title = self.t('ui.pageTitle');
            document.documentElement.lang = currentLocale;
        },

        // Renders the EN | RU switcher into #langSwitcher.
        buildSwitcher: function () {
            var $switcher = $('#langSwitcher');
            if ($switcher.length === 0) { return; }

            $switcher.empty();
            self.getAvailableLocales().forEach(function (locale, i) {
                if (i > 0) {
                    $switcher.append($('<span class="langSep">').text('|'));
                }

                var $link = $('<a class="langOption">')
                    .attr('href', '#')
                    .attr('title', locale.name)
                    .attr('lang', locale.code)
                    .text(locale.code.toUpperCase());

                if (locale.code === currentLocale) {
                    $link.addClass('selected');
                } else {
                    $link.click(function (e) {
                        e.preventDefault();
                        if (self.setLocale(locale.code)) {
                            // Drop ?lang= so it can't override the new choice.
                            var url = window.location.href.split('?')[0].split('#')[0];
                            window.location.replace(url);
                        }
                    });
                }

                $switcher.append($link);
            });
        },

        // Picks the starting locale: ?lang= > saved choice > browser > English.
        init: function () {
            var candidates = [localeFromQueryString(), localeFromStorage(), localeFromBrowser()];
            for (var i = 0; i < candidates.length; i++) {
                var code = candidates[i] && String(candidates[i]).toLowerCase();
                if (code && locales[code]) {
                    currentLocale = code;
                    break;
                }
            }

            self.translateDom();
            self.buildSwitcher();
        }
    };

    return self;
})();

// Shorthand used throughout the game code.
var __ = function (key, params) { return I18n.t(key, params); };

$(document).ready(function () { I18n.init(); });
