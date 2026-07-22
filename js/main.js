/* ============================================================
   D'ART — shared chrome (header / menu / footer / brand bar)
   Injected on every page so markup lives in one place and works
   from file:// (no fetch-based includes).
   Each page sets <body data-page="about" data-nav="inner">.
   ============================================================ */
(function () {
  'use strict';

  // Newsletter signup proxy — same endpoint used by the cync homepage.
  var NEWSLETTER_ENDPOINT =
    'https://symphonious-baklava-a36141.netlify.app/.netlify/functions/signup';

  var IG_ICON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
    '<rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/>' +
    '<circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>';

  var EMAIL_ICON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
    '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M4 6.5l8 6.5 8-6.5"/></svg>';

  var NAV_LINKS = [
    { key: 'about',      label: 'About',               href: 'about.html' },
    { key: 'services',   label: 'Services',            href: 'services.html' },
    { key: 'social',     label: 'Social Contribution', href: 'social.html' },
    { key: 'curatorial', label: 'Curatorial View',     href: 'curatorial.html' }
  ];

  function menuLinks(current) {
    return NAV_LINKS.map(function (l) {
      var cls = 'menu-link' + (l.key === current ? ' current' : '');
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
      '<div class="menu-backdrop" data-menu-close hidden></div>' +
      '<div class="menu-block ' + variant + '" data-menu-block data-closed role="dialog" aria-label="Menu">' +
        '<nav class="menu-nav">' + menuLinks(current) + '</nav>' +
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
                '(required) I agree to the ' +
                '<button type="button" class="news-policy-btn" data-policy-open>privacy policy</button>' +
              '</label>' +
              '<div class="news-error" role="alert" hidden></div>' +
            '</form>' +
          '</div>' +
          '<div>' +
            infoRow('Hours', 'Tuesday - Friday, 11AM - 5PM') +
            infoRow('Address', '1F, 577 Tongil-ro, Eunpyeong-gu, Seoul 03473') +
            infoRow('Contact', '<a href="mailto:timmykim@dartseoul.com">timmykim@dartseoul.com</a>') +
            '<div class="footer-copyright">' +
              '<p>Copyright © 2026 D\'ART Inc. 디아트 주식회사. All rights reserved.</p>' +
              '<p>All artworks © respective artists. Unauthorized use is prohibited.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="brand-bar-spacer"></div>' +
      '<div class="brand-bar">' +
        '<div class="lockup">' +
          '<img src="assets/dart-logo.png" alt="D\'ART">' +
        '</div>' +
        '<div class="icons">' +
          '<a class="foot-icon" href="mailto:timmykim@dartseoul.com" aria-label="Email">' +
            EMAIL_ICON + '</a>' +
          '<a class="foot-icon" href="https://instagram.com/dartseoul" target="_blank" rel="noopener" aria-label="Instagram">' +
            IG_ICON + '</a>' +
        '</div>' +
      '</div>' +
      '<button class="scroll-top" data-scroll-top aria-label="Scroll to top">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M12 19V5M5 12l7-7 7 7"/></svg>' +
      '</button>' +
      '<div class="policy-modal" data-policy-modal hidden>' +
        '<div class="policy-backdrop" data-policy-close></div>' +
        '<div class="policy-card" role="dialog" aria-modal="true" aria-label="Privacy policy">' +
          '<button class="policy-x" data-policy-close aria-label="Close">×</button>' +
          '<div class="policy-title serif">Collection and Use of Personal Information</div>' +
          '<p class="policy-text">We collect and use only the minimum personal information necessary for sending our newsletter. The collected information will not be used for any purpose other than sending, and will be immediately destroyed when the service ends or you unsubscribe.</p>' +
          '<p class="policy-text">뉴스레터 발송을 위한 최소한의 개인정보를 수집하고 이용합니다. 수집된 정보는 발송 외 다른 목적으로 이용되지 않으며, 서비스가 종료되거나 구독을 해지할 경우 즉시 파기됩니다.</p>' +
          '<div class="policy-foot"><button class="policy-close-btn" data-policy-close>Close</button></div>' +
        '</div>' +
      '</div>';
  }

  function infoRow(label, value) {
    return '<div class="info-row"><div class="info-label">' + label +
      '</div><div class="info-value">' + value + '</div></div>';
  }

  function wireMenu() {
    var block = document.querySelector('[data-menu-block]');
    var backdrop = document.querySelector('.menu-backdrop');
    if (!block) return;

    function open() {
      block.removeAttribute('data-closed');
      block.setAttribute('data-open', '');
      backdrop.hidden = false;
    }
    function close() {
      block.removeAttribute('data-open');
      block.setAttribute('data-closed', '');
      backdrop.hidden = true;
    }

    document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        block.hasAttribute('data-open') ? close() : open();
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

  function wirePolicyModal() {
    var modal = document.querySelector('[data-policy-modal]');
    if (!modal) return;
    function open(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      modal.hidden = false;
    }
    function close() { modal.hidden = true; }
    document.querySelectorAll('[data-policy-open]').forEach(function (b) {
      b.addEventListener('click', open);
    });
    modal.querySelectorAll('[data-policy-close]').forEach(function (b) {
      b.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

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

    wireMenu();
    wireNewsletter();
    wireScrollTop();
    wirePolicyModal();
    wireReveal();
  });
})();
