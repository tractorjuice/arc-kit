// Play buttons for the command films on the static guide pages
// (docs/guide/*.html, written by scripts/generate-site-pages.py).
// The page carries a button per film; the YouTube player
// (youtube-nocookie.com) is only created when the reader presses play.
(function () {
    document.querySelectorAll('.app-film__play[data-film]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var frame = document.createElement('iframe');
            frame.className = 'app-film__frame';
            frame.src = 'https://www.youtube-nocookie.com/embed/' + btn.getAttribute('data-film') + '?autoplay=1&rel=0&cc_load_policy=1';
            frame.title = btn.getAttribute('data-label') || 'ArcKit film';
            frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            frame.allowFullscreen = true;
            btn.parentNode.replaceChild(frame, btn);
            frame.focus();
        });
    });
})();
