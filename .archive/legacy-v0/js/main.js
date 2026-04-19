/* ============================================
   Ghana Government Portal - Main JavaScript
   Version: 1.0.0
   ============================================ */

// ========== DOM Ready ==========
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initTheme();
    initScrollReveal();
    initCounters();
    initMobileMenu();
    initAccessibility();
});

// ========== Navigation ==========
function initNavigation() {
    const nav = document.querySelector('.nav-main');
    if (!nav) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show on scroll direction (optional)
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Active link highlighting
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// ========== Mobile Menu ==========
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            body.style.overflow = '';
        });
    });
}

// ========== Search ==========
function initSearch() {
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.querySelector('.search-input-lg');
    const searchToggle = document.querySelector('.search-toggle');
    const searchClose = document.querySelector('.search-close');

    if (!searchModal) return;

    // Open search
    window.openSearch = function() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 100);
    };

    // Close search
    window.closeSearch = function() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        if (searchInput) searchInput.value = '';
    };

    // Toggle button
    if (searchToggle) {
        searchToggle.addEventListener('click', openSearch);
    }

    // Close button
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K to open
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        // Escape to close
        if (e.key === 'Escape') {
            closeSearch();
        }
    });

    // Click outside to close
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearch();
        }
    });

    // Search functionality
    if (searchInput) {
        const searchResults = document.getElementById('searchResults');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim().toLowerCase();

            if (query.length < 2) {
                if (searchResults) searchResults.innerHTML = '';
                return;
            }

            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
    }
}

// Search data - would come from API in production
const searchData = [
    { title: 'Passport Application', url: '/services/passport.html', category: 'Services', keywords: ['passport', 'travel', 'document', 'application'] },
    { title: 'Ghana Card (National ID)', url: '/services/ghana-card.html', category: 'Services', keywords: ['ghana card', 'national id', 'identity', 'nia'] },
    { title: 'Tax Filing & Payments', url: '/services/tax.html', category: 'Services', keywords: ['tax', 'gra', 'filing', 'payment', 'returns'] },
    { title: 'Business Registration', url: '/services/business.html', category: 'Services', keywords: ['business', 'company', 'registration', 'rgd'] },
    { title: 'Driver\'s License', url: '/services/drivers-license.html', category: 'Services', keywords: ['license', 'driving', 'dvla', 'vehicle'] },
    { title: 'Birth Certificate', url: '/services/birth-certificate.html', category: 'Services', keywords: ['birth', 'certificate', 'registration', 'vital records'] },
    { title: 'Health Insurance (NHIS)', url: '/services/health.html', category: 'Services', keywords: ['health', 'insurance', 'nhis', 'medical'] },
    { title: 'Education Services', url: '/services/education.html', category: 'Services', keywords: ['education', 'school', 'scholarship', 'enrollment'] },
    { title: 'The President', url: '/government/president.html', category: 'Government', keywords: ['president', 'executive', 'leadership'] },
    { title: 'Parliament of Ghana', url: '/government/parliament.html', category: 'Government', keywords: ['parliament', 'legislature', 'mp', 'laws'] },
    { title: 'The Judiciary', url: '/government/judiciary.html', category: 'Government', keywords: ['judiciary', 'courts', 'justice', 'supreme court'] },
    { title: 'Ministries', url: '/government/ministries.html', category: 'Government', keywords: ['ministry', 'ministries', 'cabinet'] },
    { title: 'Visit Ghana', url: '/tourism/visit.html', category: 'Tourism', keywords: ['visit', 'tourism', 'travel', 'attractions'] },
    { title: 'Invest in Ghana', url: '/business/invest.html', category: 'Business', keywords: ['invest', 'investment', 'business', 'economy'] },
    { title: 'Contact Us', url: '/contact.html', category: 'Contact', keywords: ['contact', 'help', 'support', 'regional offices'] },
];

function performSearch(query) {
    const results = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const keywordMatch = item.keywords.some(kw => kw.includes(query));
        return titleMatch || keywordMatch;
    });

    displaySearchResults(results);
}

function displaySearchResults(results) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <p>No results found. Try different keywords.</p>
            </div>
        `;
        return;
    }

    const grouped = results.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    let html = '';
    for (const [category, items] of Object.entries(grouped)) {
        html += `
            <div class="search-result-group">
                <h5>${category}</h5>
                <ul>
                    ${items.map(item => `
                        <li>
                            <a href="${item.url}" onclick="closeSearch()">
                                <span class="result-title">${item.title}</span>
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ========== Theme (Dark Mode) ==========
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDark.matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;

    // Apply theme
    setTheme(currentTheme);

    // Toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Listen for system changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const sunIcon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`;

    const moonIcon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;

    themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

// ========== Scroll Reveal ==========
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (reveals.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 50);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
}

// ========== Counters ==========
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepDuration);
}

// ========== Accessibility ==========
function initAccessibility() {
    // Skip link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }

    // Keyboard navigation for cards
    document.querySelectorAll('.card, .service-card, .agency-card').forEach(card => {
        const link = card.querySelector('a') || card;
        if (card.tagName !== 'A' && link.tagName !== 'A') {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        }
    });

    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);

    window.announce = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// ========== Utility Functions ==========

// Format phone numbers
function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GH', options);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll to element
function scrollToElement(selector, offset = 100) {
    const element = document.querySelector(selector);
    if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        announce('Copied to clipboard');
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// ========== Form Validation ==========
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        const error = input.parentElement.querySelector('.form-error');

        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            if (error) error.textContent = 'This field is required';
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            if (error) error.textContent = 'Please enter a valid email';
        } else {
            input.classList.remove('error');
            if (error) error.textContent = '';
        }
    });

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-+()]{10,}$/.test(phone);
}

// ========== Particles (for hero sections) ==========
function initParticles(containerId, count = 30) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--gold-burnished);
            border-radius: 50%;
            opacity: 0.3;
            left: ${Math.random() * 100}%;
            animation: float-particle ${15 + Math.random() * 10}s infinite linear;
            animation-delay: ${Math.random() * 20}s;
        `;
        container.appendChild(particle);
    }
}

// ========== Export for modules ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initSearch,
        initTheme,
        initScrollReveal,
        initCounters,
        validateForm,
        debounce,
        throttle,
        scrollToElement,
        copyToClipboard
    };
}
