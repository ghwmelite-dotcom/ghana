/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL SOVEREIGNTY THEME SYSTEM
 * Ghana Government Portal - Dark/Light Mode Toggle
 *
 * Include this file in all pages to enable theme switching.
 * Also include theme.css for the styling.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'ghana-gov-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    /**
     * Get saved theme from localStorage or detect system preference
     * @returns {string} 'dark' or 'light'
     */
    function getSavedTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;

        // Check system preference as fallback
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return LIGHT;
        }
        return DARK;
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'dark' or 'light'
     */
    function applyTheme(theme) {
        if (theme === LIGHT) {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem(STORAGE_KEY, theme);

        // Dispatch custom event for any listeners
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: theme }
        }));
    }

    /**
     * Toggle between dark and light themes
     * @returns {string} The new theme
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? DARK : LIGHT;
        applyTheme(newTheme);
        return newTheme;
    }

    /**
     * Get current theme
     * @returns {string} 'dark' or 'light'
     */
    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? LIGHT : DARK;
    }

    // Initialize theme immediately (before DOM ready to prevent flash)
    applyTheme(getSavedTheme());

    // Set up toggle functionality after DOM loads
    document.addEventListener('DOMContentLoaded', function() {
        const toggle = document.getElementById('themeToggle');

        if (toggle) {
            toggle.addEventListener('click', function() {
                toggleTheme();

                // Add a subtle animation feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });

            // Keyboard accessibility
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }

        // Also support any element with data-theme-toggle attribute
        document.querySelectorAll('[data-theme-toggle]').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
            });
        });
    });

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? LIGHT : DARK);
            }
        });
    }

    // Expose API for programmatic theme control
    window.GhanaGovTheme = {
        toggle: toggleTheme,
        set: applyTheme,
        get: getCurrentTheme,
        DARK: DARK,
        LIGHT: LIGHT
    };

})();
