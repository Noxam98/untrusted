function playIntro(display, map, i) {
	if (i < 0) {
        display._intro = true;
    } else {
        if (typeof i === 'undefined') { i = map.getHeight(); }
        display.clear();
        var centered = function (text, width) {
            return Math.max(0, Math.round((width - text.length) / 2));
        };
        var width = map.getWidth();

        var title = __('intro.title');
        var orElse = __('intro.orElse');
        var subtitle = __('intro.subtitle');
        var credits = __('intro.credits');
        var prompt = __('intro.pressAnyKey');

        display.drawText(0, i - 2, "%c{#0f0}" + __('intro.initialize'));
        display.drawText(centered(title, width), i + 3, title);
        display.drawText(centered(orElse, width), i + 5, orElse);
        display.drawText(centered(subtitle, width), i + 7, subtitle);
        display.drawText(centered(credits, width), i + 12, credits);
        display.drawText(centered(prompt, width), i + 22, prompt);
        setTimeout(function () {
            display.playIntro(map, i - 1);
        }, 100);
    }
}
