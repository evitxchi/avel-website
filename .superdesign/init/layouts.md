# Shared page layouts

There is one static landing-page route, so the following inline structures render on that page. They are not imported shared components.

## Site header and navigation

Source: `index.html` lines 17-72. Includes the fixed header, four desktop menu panels, backdrop, and mobile menu.

```html
    <header class="site-header is-dark" id="site-header">
      <a class="brand" href="#home" aria-label="Hamilton AI home">
        <img class="brand-mark" src="/assets/hamilton-favicon.png" alt="" />
        <span>Hamilton AI</span>
      </a>

      <nav class="desktop-nav" aria-label="Main navigation">
        <button class="nav-trigger" type="button" data-menu="products" aria-expanded="false">Products <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></button>
        <button class="nav-trigger" type="button" data-menu="users" aria-expanded="false">Users <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></button>
        <button class="nav-trigger" type="button" data-menu="company" aria-expanded="false">Company <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></button>
        <button class="nav-trigger nav-resources" type="button" data-menu="resources" aria-expanded="false">Resources</button>
      </nav>

      <div class="header-actions">
        <a class="login-link" href="https://app.hamilton.ai/">Login</a>
        <button class="button button-light header-cta" type="button" data-open-demo>Get Started <span class="button-arrow">›</span></button>
      </div>
      <button class="mobile-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span></button>
    </header>

    <div class="mega-backdrop" hidden></div>
    <div class="mega-menu" id="mega-menu" hidden>
      <div class="mega-panel" data-panel="products">
        <div class="mega-column mega-featured">
          <p class="mega-eyebrow">Core features</p>
          <a class="mega-card" href="#modules" data-close-menu><span class="mega-icon">↗</span><span><strong>Hamilton Inbound</strong><small>Focus on the relevant sales opportunity</small></span><span class="mega-arrow">↗</span></a>
          <a class="mega-card" href="#modules" data-close-menu><span class="mega-icon">⌘</span><span><strong>Hamilton CRM</strong><small>The client database built for private aviation</small></span><span class="mega-arrow">↗</span></a>
          <a class="mega-card" href="#modules" data-close-menu><span class="mega-icon">✳</span><span><strong>Hamilton Quoting</strong><small>The fastest way to quote, book, and close deals</small></span><span class="mega-arrow">↗</span></a>
          <a class="mega-card" href="#lead-system" data-close-menu><span class="mega-icon">⌁</span><span><strong>Hamilton Demand</strong><small>The sales intelligence layer for private aviation</small></span><span class="mega-arrow">↗</span></a>
        </div>
        <div class="mega-column mega-up-next">
          <p class="mega-eyebrow">What's next</p>
          <a class="mega-next-card" href="#modules" data-close-menu>
            <div class="mini-calendar" aria-hidden="true"><b>MON</b><b>TUE</b><b>WED</b><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i></div>
            <strong>Crew Module</strong><small>Integrate your crew calendar, create custom events</small>
          </a>
        </div>
      </div>
      <div class="mega-panel" data-panel="users">
        <div class="mega-column"><p class="mega-eyebrow">For whom</p><a class="mega-card" href="#modules" data-close-menu><span class="mega-icon">✈</span><span><strong>For Operators</strong><small>Optimized sales and dispatch workflows</small></span><span class="mega-arrow">↗</span></a><a class="mega-card" href="#modules" data-close-menu><span class="mega-icon">◎</span><span><strong>For Brokers</strong><small>Increased client satisfaction and better deals</small></span><span class="mega-arrow">↗</span></a></div>
        <div class="mega-column mega-up-next"><p class="mega-eyebrow">Zoom</p><a class="mega-next-card demand-menu-card" href="#lead-system" data-close-menu><div class="map-preview" aria-hidden="true"><span></span><span></span><span></span><i></i></div><strong>Empty Legs Search</strong><small>Spot the best opportunities within seconds</small></a></div>
      </div>
      <div class="mega-panel" data-panel="company">
        <div class="mega-column"><p class="mega-eyebrow">Company</p><a class="mega-card" href="#footer" data-close-menu><span class="mega-icon">◌</span><span><strong>About us</strong><small>Learn about our vision</small></span><span class="mega-arrow">↗</span></a><a class="mega-card" href="#footer" data-close-menu><span class="mega-icon">↗</span><span><strong>Careers</strong><small>The roles we're hiring for</small></span><span class="mega-arrow">↗</span></a></div>
        <div class="mega-column mega-up-next"><p class="mega-eyebrow">Latest news / articles</p><a class="mega-next-card article-menu-card" href="#footer" data-close-menu><span class="article-date">July 31, 2026</span><strong>What Is Embedded Banking In Private Aviation?</strong><small>Explore the latest news from Hamilton</small></a></div>
      </div>
      <div class="mega-panel" data-panel="resources">
        <div class="mega-column"><p class="mega-eyebrow">Resources</p><a class="mega-card" href="#footer" data-close-menu><span class="mega-icon">▤</span><span><strong>Blog</strong><small>Ideas for the business of flight</small></span><span class="mega-arrow">↗</span></a><a class="mega-card" href="#footer" data-close-menu><span class="mega-icon">◖</span><span><strong>Podcasts</strong><small>Conversations from private aviation</small></span><span class="mega-arrow">↗</span></a></div>
        <div class="mega-column mega-up-next"><p class="mega-eyebrow">Customer stories</p><a class="mega-next-card article-menu-card" href="#stories" data-close-menu><strong>How operators are changing the way they work</strong><small>Discover real stories from the Hamilton community</small></a></div>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu" hidden>
      <a href="#modules">Products <span>↓</span></a><a href="#modules">Users <span>↓</span></a><a href="#footer">Company <span>↓</span></a><a href="#footer">Resources <span>↗</span></a>
      <a class="mobile-login" href="https://app.hamilton.ai/">Login</a><button class="button button-light" data-open-demo>Get Started <span class="button-arrow">›</span></button>
    </div>

```

## Footer

Source: `index.html` lines 206-215. Includes the CTA panel, brand column, three link columns, and backing organizations.

```html
      <footer class="footer-section section-dark" id="footer" data-tone="dark">
        <div class="section-container footer-container">
          <div class="footer-cta" data-reveal><div><h2>Ready to quote smarter<br />and boost revenues?</h2></div><button class="button button-dark" type="button" data-open-demo>Book A Demo <span class="button-arrow">›</span></button></div>
          <div class="footer-main">
            <div class="footer-brand-column"><a class="brand footer-brand" href="#home"><img class="brand-mark" src="/assets/hamilton-favicon.png" alt="" /><span>Hamilton AI</span></a><p>The world's most intelligent private<br />aviation platform</p><div class="social-links" aria-label="Social media"><a href="#footer" aria-label="LinkedIn">in</a><a href="#footer" aria-label="Instagram">◎</a><a href="#footer" aria-label="Facebook">f</a><a href="#footer" aria-label="TikTok">♪</a><a href="#footer" aria-label="X">𝕏</a></div><a class="privacy-link" href="#footer">Privacy Policy</a><small>©2025 Hamilton - All rights reserved</small></div>
            <div class="footer-links"><div><span>Product</span><a href="#modules">Inbound</a><a href="#modules">CRM</a><a href="#modules">Quoting</a><a href="#lead-system">Demand</a></div><div><span>Users</span><a href="#modules">For Brokers</a><a href="#modules">For Operators</a></div><div><span>Company</span><a href="#footer">About</a><a href="#footer">Careers</a><a href="#footer">Partners</a><span class="footer-subheading">Resources</span><a href="#footer">Blog</a></div></div>
          </div>
          <div class="backed-by"><strong>Backed by:</strong><span class="backer logo-ttv">ttv</span><span class="backer bling">BLING CAPITAL</span><span class="backer weekend"><i></i> Weekend Fund</span><span class="backer cambrian">◉ CAMBRIAN</span><span class="backer fj">FJ LABS</span><span class="backer-dots" aria-hidden="true">⠿</span></div>
        </div>
      </footer>
```
