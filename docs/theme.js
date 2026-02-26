(function () {
    'use strict';

    function getPreference() {
        return localStorage.getItem('arckit-theme'); // 'dark', 'light', or null (auto)
    }

    function applyTheme(pref) {
        var html = document.documentElement;
        html.classList.remove('dark-mode', 'light-mode');

        if (pref === 'dark') {
            html.classList.add('dark-mode');
        } else if (pref === 'light') {
            html.classList.add('light-mode');
        } else {
            // Auto — follow system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                html.classList.add('dark-mode');
            }
        }
    }

    function updateButton() {
        var btn = document.querySelector('.app-theme-toggle');
        if (!btn) return;

        var pref = getPreference();
        var icon, label;

        if (pref === 'dark') {
            icon = '\u263E'; // ☾ moon
            label = 'Theme: dark (click for light)';
        } else if (pref === 'light') {
            icon = '\u2600'; // ☀ sun
            label = 'Theme: light (click for auto)';
        } else {
            icon = '\u25D0'; // ◐ half
            label = 'Theme: auto (click for dark)';
        }

        btn.textContent = icon;
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
    }

    // Cycle: auto → dark → light → auto
    window.toggleTheme = function () {
        var current = getPreference();
        var next;

        if (current === null) {
            next = 'dark';
        } else if (current === 'dark') {
            next = 'light';
        } else {
            next = null;
        }

        if (next) {
            localStorage.setItem('arckit-theme', next);
        } else {
            localStorage.removeItem('arckit-theme');
        }

        applyTheme(next);
        updateButton();
    };

    // React to system theme changes while in auto mode
    if (window.matchMedia) {
        try {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
                if (!getPreference()) {
                    applyTheme(null);
                }
            });
        } catch (e) {
            // Older browsers — ignore
        }
    }

    // Update toggle button once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateButton);
    } else {
        updateButton();
    }
})();
