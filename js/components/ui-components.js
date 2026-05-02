// ── contact-strip ──────────────────────────────────────────────────────────
// Usage: <contact-strip heading="..." subtext="..."></contact-strip>
class ContactStrip extends HTMLElement {
  connectedCallback() {
    const heading = this.getAttribute('heading') || 'Ready to discuss your requirement?';
    const subtext  = this.getAttribute('subtext')  || 'Call us, send an email, or fill in the enquiry form.';
    this.innerHTML = `
      <div class="contact-strip">
        <div class="contact-strip__left">
          <h3>${heading}</h3>
          <p>${subtext}</p>
        </div>
        <div class="contact-strip__right">
          <a href="/contact.html" class="btn btn--white">Send an enquiry</a>
          <a href="tel:+919303230577" class="btn btn--transp">+91 93032 30577</a>
        </div>
      </div>
    `;
  }
}
customElements.define('contact-strip', ContactStrip);


// ── page-header ────────────────────────────────────────────────────────────
// Usage: <page-header eyebrow="..." heading="..." subtext="..."></page-header>
class PageHeader extends HTMLElement {
  connectedCallback() {
    const eyebrow = this.getAttribute('eyebrow') || '';
    const heading = this.getAttribute('heading') || '';
    const subtext  = this.getAttribute('subtext')  || '';
    this.innerHTML = `
      <div class="page-header">
        ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
        <h1 class="dark-h1">${heading}</h1>
        ${subtext ? `<p class="page-header__sub dark-p">${subtext}</p>` : ''}
      </div>
    `;
  }
}
customElements.define('page-header', PageHeader);


// ── how-point ──────────────────────────────────────────────────────────────
// Usage: <how-point number="01" title="..." description="..."></how-point>
class HowPoint extends HTMLElement {
  connectedCallback() {
    const num   = this.getAttribute('number')      || '';
    const title = this.getAttribute('title')       || '';
    const desc  = this.getAttribute('description') || '';
    this.innerHTML = `
      <div class="how-point">
        <div class="how-point__num">${num}</div>
        <div class="how-point__title">${title}</div>
        <p class="how-point__desc">${desc}</p>
      </div>
    `;
  }
}
customElements.define('how-point', HowPoint);


// ── product-other-card ─────────────────────────────────────────────────────
// Usage: <product-other-card category="..." name="..." href="..."></product-other-card>
class ProductOtherCard extends HTMLElement {
  connectedCallback() {
    const cat  = this.getAttribute('category') || '';
    const name = this.getAttribute('name')     || '';
    const href = this.getAttribute('href')     || '#';
    this.innerHTML = `
      <div class="other-products__card">
        <div class="other-products__cat">${cat}</div>
        <div class="other-products__name">${name}</div>
        <a href="${href}" class="other-products__link">View product →</a>
      </div>
    `;
  }
}
customElements.define('product-other-card', ProductOtherCard);
