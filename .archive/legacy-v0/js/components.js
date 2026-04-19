/* ============================================
   Ghana Government Portal - Reusable Components
   Version: 1.0.0
   ============================================ */

// ========== Header Component ==========
function renderHeader(activePage = '') {
    return `
    <!-- Skip Link -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Top Bar -->
    <div class="top-bar">
        <a href="tel:112" class="emergency-link">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            Emergency: 112 | COVID-19: 311
        </a>
        <div class="language-selector">
            <span style="color: var(--gray-mid);">Language:</span>
            <button class="active">English</button>
            <button>Twi</button>
            <button>Hausa</button>
            <button>Ewe</button>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="nav-main" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <a href="/index.html" class="logo" aria-label="Republic of Ghana - Home">
                <div class="logo-emblem">
                    <svg class="logo-star" viewBox="0 0 100 100" aria-hidden="true">
                        <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"/>
                    </svg>
                </div>
                <div class="logo-text">
                    <span class="logo-title">Republic of Ghana</span>
                    <span class="logo-subtitle">Official Government Portal</span>
                </div>
            </a>

            <ul class="nav-links">
                <li><a href="/index.html" ${activePage === 'home' ? 'class="active"' : ''}>Home</a></li>
                <li><a href="/services/index.html" ${activePage === 'services' ? 'class="active"' : ''}>Services</a></li>
                <li><a href="/government/index.html" ${activePage === 'government' ? 'class="active"' : ''}>Government</a></li>
                <li><a href="/business/index.html" ${activePage === 'business' ? 'class="active"' : ''}>Business</a></li>
                <li><a href="/tourism/index.html" ${activePage === 'tourism' ? 'class="active"' : ''}>Tourism</a></li>
                <li><a href="/contact.html" ${activePage === 'contact' ? 'class="active"' : ''}>Contact</a></li>
            </ul>

            <div class="nav-actions">
                <button class="search-toggle" aria-label="Open search" onclick="openSearch()">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                </button>
                <button class="theme-toggle" aria-label="Toggle dark mode">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </button>
                <a href="/services/index.html" class="nav-cta">Access Services</a>
            </div>

            <button class="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div class="mobile-menu" aria-hidden="true">
        <ul class="mobile-menu-links">
            <li><a href="/index.html">Home</a></li>
            <li><a href="/services/index.html">Services</a></li>
            <li><a href="/government/index.html">Government</a></li>
            <li><a href="/business/index.html">Business</a></li>
            <li><a href="/tourism/index.html">Tourism</a></li>
            <li><a href="/contact.html">Contact</a></li>
        </ul>
    </div>

    <!-- Search Modal -->
    <div class="search-modal" id="searchModal" role="dialog" aria-modal="true" aria-label="Search">
        <button class="search-close" onclick="closeSearch()" aria-label="Close search">
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        <div class="search-container">
            <div class="search-input-wrapper">
                <svg class="search-icon-lg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" class="search-input-lg" placeholder="Search services, agencies, information..." aria-label="Search">
            </div>
            <div id="searchResults"></div>
            <div class="search-suggestions">
                <h4>Popular Searches</h4>
                <div class="search-tags">
                    <a href="/services/passport.html" class="search-tag">Passport Application</a>
                    <a href="/services/ghana-card.html" class="search-tag">Ghana Card</a>
                    <a href="/services/tax.html" class="search-tag">Tax Filing</a>
                    <a href="/services/business.html" class="search-tag">Business Registration</a>
                    <a href="/services/drivers-license.html" class="search-tag">Driver's License</a>
                    <a href="/contact.html" class="search-tag">Contact Us</a>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ========== Footer Component ==========
function renderFooter() {
    const currentYear = new Date().getFullYear();

    return `
    <footer class="footer" role="contentinfo">
        <div class="footer-grid">
            <div class="footer-brand">
                <div class="footer-logo">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                        <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"/>
                    </svg>
                    <span class="footer-logo-text">Republic of Ghana</span>
                </div>
                <p class="footer-desc">
                    The official digital gateway to Ghana's government services. Building a transparent, efficient, and citizen-centered administration for all Ghanaians.
                </p>
                <div class="footer-social">
                    <a href="https://facebook.com/GhanaGov" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                    </a>
                    <a href="https://twitter.com/GhanaGov" class="social-link" aria-label="Twitter" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                        </svg>
                    </a>
                    <a href="https://instagram.com/GhanaGov" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                    </a>
                    <a href="https://youtube.com/GhanaGov" class="social-link" aria-label="YouTube" target="_blank" rel="noopener">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="var(--green-deep)"/>
                        </svg>
                    </a>
                </div>
            </div>

            <div class="footer-column">
                <h4>Services</h4>
                <ul>
                    <li><a href="/services/passport.html">Passport Services</a></li>
                    <li><a href="/services/ghana-card.html">Ghana Card (NIA)</a></li>
                    <li><a href="/services/tax.html">Tax Filing (GRA)</a></li>
                    <li><a href="/services/business.html">Business Registration</a></li>
                    <li><a href="/services/drivers-license.html">Driver's License</a></li>
                    <li><a href="/services/health.html">Health Insurance</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4>Government</h4>
                <ul>
                    <li><a href="/government/president.html">The Presidency</a></li>
                    <li><a href="/government/parliament.html">Parliament</a></li>
                    <li><a href="/government/judiciary.html">Judiciary</a></li>
                    <li><a href="/government/ministries.html">Ministries</a></li>
                    <li><a href="/government/agencies.html">Agencies</a></li>
                    <li><a href="/government/regions.html">Regional Offices</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4>Support</h4>
                <ul>
                    <li><a href="/help.html">Help Center</a></li>
                    <li><a href="/contact.html">Contact Us</a></li>
                    <li><a href="/faq.html">FAQs</a></li>
                    <li><a href="/accessibility.html">Accessibility</a></li>
                    <li><a href="/sitemap.html">Sitemap</a></li>
                    <li><a href="/feedback.html">Give Feedback</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="footer-copy">&copy; ${currentYear} Republic of Ghana. All rights reserved.</p>
            <div class="footer-links">
                <a href="/privacy.html">Privacy Policy</a>
                <a href="/terms.html">Terms of Use</a>
                <a href="/cookies.html">Cookie Policy</a>
            </div>
        </div>
    </footer>
    `;
}

// ========== Breadcrumbs Component ==========
function renderBreadcrumbs(items) {
    return `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
        ${items.map((item, index) => {
            const isLast = index === items.length - 1;
            if (isLast) {
                return `<span class="current" aria-current="page">${item.label}</span>`;
            }
            return `
                <a href="${item.url}">${item.label}</a>
                <span class="separator" aria-hidden="true">/</span>
            `;
        }).join('')}
    </nav>
    `;
}

// ========== Page Header Component ==========
function renderPageHeader(title, description, breadcrumbs = []) {
    return `
    <header class="page-header">
        <div class="container">
            <div class="page-header-content">
                ${breadcrumbs.length > 0 ? renderBreadcrumbs(breadcrumbs) : ''}
                <h1 class="page-title">${title}</h1>
                ${description ? `<p class="page-desc">${description}</p>` : ''}
            </div>
        </div>
    </header>
    `;
}

// ========== Service Card Component ==========
function renderServiceCard(service) {
    return `
    <a href="${service.url}" class="service-card reveal">
        <div class="service-icon">
            ${service.icon}
        </div>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-desc">${service.description}</p>
        <span class="service-link">
            ${service.linkText || 'Get Started'}
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </span>
    </a>
    `;
}

// ========== Agency Card Component ==========
function renderAgencyCard(agency) {
    return `
    <a href="${agency.url}" class="agency-card reveal">
        <div class="agency-logo">${agency.acronym}</div>
        <div class="agency-info">
            <h3 class="agency-name">${agency.name}</h3>
            <p class="agency-full">${agency.fullName}</p>
            <div class="agency-services">
                ${agency.services.map(s => `<span class="agency-tag">${s}</span>`).join('')}
            </div>
        </div>
    </a>
    `;
}

// ========== Alert Component ==========
function renderAlert(type, message, dismissible = true) {
    const icons = {
        success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
        error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
        info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
    };

    return `
    <div class="alert alert-${type}" role="alert">
        <svg class="alert-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            ${icons[type]}
        </svg>
        <span class="alert-message">${message}</span>
        ${dismissible ? `
            <button class="alert-close" aria-label="Dismiss">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        ` : ''}
    </div>
    `;
}

// ========== Stats Component ==========
function renderStats(stats) {
    return `
    <div class="stats-grid">
        ${stats.map(stat => `
            <div class="stat-item">
                <div class="stat-number" data-count="${stat.value}" data-suffix="${stat.suffix || ''}">${stat.value}${stat.suffix || ''}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('')}
    </div>
    `;
}

// ========== Export ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderHeader,
        renderFooter,
        renderBreadcrumbs,
        renderPageHeader,
        renderServiceCard,
        renderAgencyCard,
        renderAlert,
        renderStats
    };
}
