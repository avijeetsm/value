class SiteNav extends HTMLElement {
  connectedCallback() {
    const current = window.location.pathname;

    const links = [
      { href: '/',                label: 'Home' },
      { href: '/products.html',   label: 'Products' },
      { href: '/industries.html', label: 'Industries' },
      { href: '/services.html',   label: 'Services' },
      { href: '/about.html',      label: 'About' },
      { href: '/contact.html',    label: 'Contact' },
    ];

    const isActive = href =>
      href === '/'
        ? current === '/' || current === '/index.html'
        : current.startsWith(href.replace('.html', ''));

    const navLinks = links.map(l => `
      <a href="${l.href}" class="site-nav__link${isActive(l.href) ? ' site-nav__link--active' : ''}">${l.label}</a>
    `).join('');

    const drawerLinks = links.map(l => `
      <a href="${l.href}" class="site-nav__drawer-link${isActive(l.href) ? ' site-nav__drawer-link--active' : ''}">${l.label}</a>
    `).join('');

    this.innerHTML = `
      <nav class="site-nav" role="navigation" aria-label="Main navigation">
        <a href="/" class="site-nav__brand" aria-label="Value Concepts home">
          <div class="site-nav__logo" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3">
              <path d="M2 7h4l1-3 1 3 1-2 1 2h2"/>
              <circle cx="7" cy="10" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <div>
            <span class="site-nav__name">Value Concepts</span>
            <span class="site-nav__sub">Authorized Alfa Laval Distributor · Indore</span>
          </div>
        </a>

        <div class="site-nav__links" role="list">${navLinks}</div>

        <a href="/contact.html" class="btn btn--primary site-nav__cta">Get in touch</a>

        <button class="site-nav__hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-drawer">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div class="site-nav__drawer" id="site-nav-drawer" role="menu" aria-hidden="true">
        ${drawerLinks}
        <a href="/contact.html" class="btn btn--primary">Get in touch</a>
      </div>
    `;

    this._bindHamburger();
  }

  _bindHamburger() {
    const btn    = this.querySelector('.site-nav__hamburger');
    const drawer = this.querySelector('.site-nav__drawer');
    if (!btn || !drawer) return;

    btn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      drawer.setAttribute('aria-hidden', !isOpen);

      // Animate hamburger → X
      const spans = btn.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close drawer when a link is tapped
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        const spans = btn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!this.contains(e.target)) {
        drawer.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

customElements.define('site-nav', SiteNav);