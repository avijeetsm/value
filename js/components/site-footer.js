class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer__main">
          <div class="site-footer__brand">
            <div class="site-footer__brand-name">Value Concepts</div>
            <p class="site-footer__brand-desc">Authorized Alfa Laval distributor for heat transfer and separation equipment. Established 1998. Based in Indore, working across India.</p>
          </div>
          <div class="site-footer__col">
            <div class="site-footer__col-heading">Products</div>
            <a href="/products/gasketed-plate-heat-exchanger.html">Gasketed plate HE</a>
            <a href="/products/brazed-plate-heat-exchanger.html">Brazed plate HE</a>
            <a href="/products/decanter-centrifuge.html">Decanter centrifuge</a>
            <a href="/products/disc-stack-centrifuge.html">High-speed centrifuge</a>
          </div>
          <div class="site-footer__col">
            <div class="site-footer__col-heading">Services</div>
            <a href="/services.html#supply">Supply</a>
            <a href="/services.html#installation">Installation</a>
            <a href="/services.html#maintenance">Maintenance</a>
            <a href="/services.html#spares">Spares</a>
          </div>
          <div class="site-footer__col">
            <div class="site-footer__col-heading">Company</div>
            <a href="/about.html">About us</a>
            <a href="/industries.html">Industries</a>
            <a href="/contact.html">Contact</a>
            <a href="https://productguide.alfalaval.com/en-in/" target="_blank" rel="noopener">Alfa Laval product guide</a>
          </div>
        </div>
        <div class="site-footer__bottom">
          <span>© 2025 Value Concepts · 416 Chetak Centre Annex, 12/2 RNT Marg, Indore 452001</span>
          <div class="site-footer__badges">
            <span class="site-footer__badge">Alfa Laval authorized</span>
            <span class="site-footer__badge">Est. 1998</span>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
