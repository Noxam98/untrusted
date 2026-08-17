
})();

// deferred: I18n picks the active language on document ready, and these
// would otherwise be built while it is still on the default locale
$(document).ready(function () {
    console.log("%c" + __('console.cheating'), "color: red; font-size: x-large");
    console.log("%c" + __('console.hint', {symbol: String.fromCharCode(0x2318)}), "font-size: 15px");
});
