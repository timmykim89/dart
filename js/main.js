/* ============================================================
   D'ART — shared chrome (header / drawer / footer / brand bar)
   Injected on every page so markup lives in one place and works
   from file:// (no fetch-based includes).
   Each page sets <body data-page="about" data-nav="inner">.
   ============================================================ */
(function () {
  'use strict';

  // Newsletter signup proxy — same endpoint used by the cync homepage.
  // POSTs { email } and expects { ok: true }. The email service integration
  // lives behind this proxy, so no keys are needed on the D'ART side.
  var NEWSLETTER_ENDPOINT =
    'https://symphonious-baklava-a36141.netlify.app/.netlify/functions/signup';

  var IG_ICON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/>' +
    '<circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>';

  var NAV_LINKS = [
    { key: 'about',      label: 'About',               href: 'about.html' },
    { key: 'services',   label: 'Services',            href: 'services.html' },
    { key: 'social',     label: 'Social Contribution', href: 'social.html' },
    { key: 'curatorial', label: 'Curatorial',          href: 'curatorial.html' }
  ];

  function drawerLinks(current) {
    return NAV_LINKS.map(function (l) {
      var cls = 'drawer-link' + (l.key === current ? ' current' : '');
      return '<a class="' + cls + '" href="' + l.href + '">' + l.label + '</a>';
    }).join('');
  }

  function headerMarkup(variant, current) {
    var burger =
      '<button class="menu-btn" data-menu-toggle aria-label="Menu">' +
      '<span></span><span></span><span></span></button>';

    var nav;
    if (variant === 'overlay') {
      nav =
        '<div class="nav-overlay">' +
          '<a class="logo" href="index.html">' +
            '<img src="assets/dart-logo.png" alt="D\'ART"></a>' +
          burger +
        '</div>';
    } else {
      nav =
        '<nav class="nav-inner">' +
          '<a class="logo" href="index.html">' +
            '<img src="assets/dart-logo.png" alt="D\'ART"></a>' +
          burger +
        '</nav>';
    }

    return nav +
      '<div class="drawer-backdrop" data-menu-close></div>' +
      '<div class="drawer" role="dialog" aria-label="Menu" aria-modal="true">' +
        '<div class="drawer-head">' +
          '<img src="assets/dart-logo.png" alt="D\'ART">' +
          '<button class="drawer-close" data-menu-close aria-label="Close menu">×</button>' +
        '</div>' +
        '<nav>' + drawerLinks(current) + '</nav>' +
        '<div class="drawer-copy">' +
          '<p>Copyright © 2026 D\'ART Inc. 디아트 주식회사. All rights reserved.</p>' +
          '<p>All artworks © respective artists. Unauthorized use is prohibited.</p>' +
        '</div>' +
      '</div>';
  }

  function footerMarkup() {
    return '' +
      '<div class="footer">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<div class="news-title serif">Be the First to Know</div>' +
            '<div class="news-sub">Subscribe to our newsletter</div>' +
            '<form class="news-form" novalidate>' +
              '<div class="news-row">' +
                '<input class="subscribe-input" type="email" placeholder="your@email.com" required>' +
                '<button class="subscribe-btn" type="submit" aria-label="Subscribe">→</button>' +
              '</div>' +
              '<label class="news-consent">' +
                '<input type="checkbox" required>' +
                '(required) I agree to the <span>privacy policy</span>' +
              '</label>' +
              '<div class="news-error" role="alert" hidden></div>' +
            '</form>' +
          '</div>' +
          '<div>' +
            infoRow('Hours', 'Tuesday–Friday, 11AM–5PM') +
            infoRow('Address', '1F, 577 Tongil-ro, Eunpyeong-gu, Seoul 03473') +
            infoRow('Contact', '<a href="mailto:timmykim@dartseoul.com">timmykim@dartseoul.com</a>') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="brand-bar-spacer"></div>' +
      '<div class="brand-bar">' +
        '<div class="lockup">' +
          '<img src="assets/dart-logo.png" alt="D\'ART">' +
          '<div class="slash">/</div>' +
          '<div class="tag">A Seoul-based art advisory</div>' +
        '</div>' +
        '<div class="icons">' +
          '<a class="foot-icon" href="mailto:timmykim@dartseoul.com" aria-label="Email">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
            '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 6l8 7 8-7"/></svg></a>' +
          '<a class="foot-icon" href="https://instagram.com/dartseoul" target="_blank" rel="noopener" aria-label="Instagram">' +
            IG_ICON + '</a>' +
        '</div>' +
      '</div>' +
      '<button class="scroll-top" data-scroll-top aria-label="Scroll to top">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M12 19V5M5 12l7-7 7 7"/></svg>' +
      '</button>';
  }

  function infoRow(label, value) {
    return '<div class="info-row"><div class="info-label">' + label +
      '</div><div class="info-value">' + value + '</div></div>';
  }

  function wireDrawer() {
    var drawer = document.querySelector('.drawer');
    var backdrop = document.querySelector('.drawer-backdrop');
    if (!drawer) return;

    function open() { drawer.classList.add('open'); backdrop.classList.add('open'); }
    function close() { drawer.classList.remove('open'); backdrop.classList.remove('open'); }

    document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        drawer.classList.contains('open') ? close() : open();
      });
    });
    document.querySelectorAll('[data-menu-close]').forEach(function (b) {
      b.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function wireNewsletter() {
    var form = document.querySelector('.news-form');
    if (!form) return;

    var emailInput = form.querySelector('.subscribe-input');
    var consent = form.querySelector('.news-consent input');
    var btn = form.querySelector('.subscribe-btn');
    var errEl = form.querySelector('.news-error');

    function showError(msg) {
      if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
    }
    function clearError() {
      if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError();

      if (!emailInput.value || !emailInput.checkValidity() || !consent.checked) {
        form.reportValidity && form.reportValidity();
        return;
      }

      var email = emailInput.value.trim();
      btn.disabled = true;
      btn.textContent = '…';

      fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; })
            .then(function (d) { return { ok: r.ok, data: d }; });
        })
        .then(function (res) {
          if (res.ok && res.data && res.data.ok) {
            // Match the design: swap the form for a thank-you line.
            form.outerHTML = '<div class="news-thanks">Thank you, we\'ll be in touch.</div>';
          } else {
            btn.disabled = false;
            btn.textContent = '→';
            showError('Something went wrong. Please try again.');
          }
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = '→';
          showError('Network error. Please try again.');
        });
    });
  }

  function wireScrollTop() {
    var btn = document.querySelector('[data-scroll-top]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // IntersectionObserver fallback for browsers without CSS scroll-timeline.
  function wireReveal() {
    if (CSS && CSS.supports && CSS.supports('animation-timeline: view()')) return;
    var els = document.querySelectorAll('.fade');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('fade-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;
    var variant = body.getAttribute('data-nav') || 'inner';
    var current = body.getAttribute('data-page') || '';

    var headerMount = document.getElementById('site-header');
    var footerMount = document.getElementById('site-footer');
    if (headerMount) headerMount.innerHTML = headerMarkup(variant, current);
    if (footerMount) footerMount.innerHTML = footerMarkup();

    wireDrawer();
    wireNewsletter();
    wireScrollTop();
    wireReveal();
  });
})();
