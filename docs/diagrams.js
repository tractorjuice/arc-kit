// Draws the Mermaid diagrams on the static guide and article pages
// (docs/guide/*.html and docs/share/*.html, written by
// scripts/generate-site-pages.py). Each diagram is a <pre class="mermaid">
// holding its source, so a reader without JavaScript, or a search engine,
// still gets the code. The page loads a pinned Mermaid before this script,
// and only when it has a diagram. A theme change redraws the diagrams.
(function () {
    if (!window.mermaid) return;
    var root = document.documentElement;
    var blocks = Array.prototype.slice.call(document.querySelectorAll('pre.mermaid'));
    var sources = blocks.map(function (block) { return block.textContent; });
    var drawn = null;

    function draw() {
        var theme = root.classList.contains('dark-mode') ? 'dark' : 'default';
        if (theme === drawn) return;
        drawn = theme;
        blocks.forEach(function (block, i) {
            block.removeAttribute('data-processed');
            block.textContent = sources[i];
        });
        mermaid.initialize({ startOnLoad: false, theme: theme });
        mermaid.run({ nodes: blocks }).catch(function (err) { console.warn('Mermaid:', err); });
    }

    draw();
    new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ['class'] });
})();
