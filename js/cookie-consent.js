/**
 * Cookie Consent Banner
 * Shows a notice on the first visit and stores the choice in localStorage.
 * Only essential cookies are used — no tracking by default.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'site-cookie-consent';

  var TEXTS = {
    pt: {
      message: 'Utilizamos <strong>cookies essenciais</strong> para garantir o correto funcionamento do site. Não utilizamos cookies de rastreamento.',
      policy: 'Política de Cookies',
      accept: 'Aceitar',
      decline: 'Apenas Essenciais'
    },
    en: {
      message: 'We use <strong>essential cookies</strong> to ensure the website works correctly. We do not use tracking cookies.',
      policy: 'Cookie Policy',
      accept: 'Accept',
      decline: 'Essential Only'
    }
  };

  function getLang() {
    var lang = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();
    return TEXTS[lang] ? lang : 'pt';
  }

  function hasConsent() {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  function saveConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignore */ }
  }

  function removeBanner(banner) {
    banner.classList.add('cookie-hiding');
    setTimeout(function () {
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 350);
  }

  function createBanner() {
    var t = TEXTS[getLang()];

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', t.policy);
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<p class="cookie-text">' + t.message + '</p>' +
        '<div class="cookie-actions">' +
          '<a href="politica-cookies.html" class="cookie-link">' + t.policy + '</a>' +
          '<button id="cookie-decline" class="cookie-btn cookie-btn--secondary">' + t.decline + '</button>' +
          '<button id="cookie-accept" class="cookie-btn cookie-btn--primary">' + t.accept + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      saveConsent('all');
      removeBanner(banner);
    });
    document.getElementById('cookie-decline').addEventListener('click', function () {
      saveConsent('essential');
      removeBanner(banner);
    });
  }

  function init() {
    if (hasConsent()) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }

  init();
})();
