/**
 * site.js - small UX helpers shared by every page.
 *  - Mobile nav toggle
 *  - Auto-fill <span id="year"></span> in the footer
 *  - Active link highlight in the top nav
 *  - Service Worker registration (if /service-worker.js exists)
 */
(function () {
  'use strict';

  // === Mobile nav toggle ===
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.top-nav ul');
  if (toggle && menu) {
    // Focus trap
    var focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function closeMenu(options) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', trapFocus);
      if (typeof floatingClose !== 'undefined' && floatingClose) floatingClose.hidden = true;
      if (options && options.restoreFocus) {
        toggle.focus();
      }
    }

    function getFocusable() {
      return Array.from(menu.querySelectorAll(focusableSelectors));
    }

    function trapFocus(e) {
      var focusable = getFocusable();
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
      if (e.key === 'Escape') {
        closeMenu({ restoreFocus: true });
      }
    }

    function syncToggleLabel(open) {
      toggle.textContent = open ? 'Fechar' : 'Menu';
    }

    // === Move close button out of UL to body (avoid li styling interference) ===
    var existingCloseLi = menu.querySelector('.nav-close-item');
    if (existingCloseLi) existingCloseLi.remove();
    var floatingClose = document.createElement('button');
    floatingClose.type = 'button';
    floatingClose.className = 'nav-close-floating';
    floatingClose.setAttribute('aria-label', 'Fechar menu');
    floatingClose.innerHTML = '&times;';
    floatingClose.hidden = true;
    document.body.appendChild(floatingClose);

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
      syncToggleLabel(open);
      floatingClose.hidden = !open;
      if (open) {
        var focusable = getFocusable();
        if (focusable[0]) focusable[0].focus();
        document.addEventListener('keydown', trapFocus);
      } else {
        closeMenu();
      }
    });

    floatingClose.addEventListener('click', function () {
      closeMenu({ restoreFocus: true });
      syncToggleLabel(false);
      floatingClose.hidden = true;
    });

    // === Enhance mobile menu with sections, numbers, secondary CTAs ===
    function enhanceMobileMenu() {
      if (menu.dataset.enhanced === '1') return;
      menu.dataset.enhanced = '1';

      var items = Array.from(menu.querySelectorAll('li'));
      if (!items.length) return;

      items.forEach(function (li) {
        li.classList.add('nav-item');
        var a = li.querySelector('a');
        if (a && !a.querySelector('.nav-arrow')) {
          var ar = document.createElement('span');
          ar.className = 'nav-arrow';
          ar.setAttribute('aria-hidden', 'true');
          ar.textContent = '→';
          a.appendChild(ar);
        }
      });

      var navLabel = document.createElement('li');
      navLabel.className = 'nav-section-label';
      navLabel.setAttribute('aria-hidden', 'true');
      navLabel.innerHTML = '<span>Navegar</span>';
      items[0].parentNode.insertBefore(navLabel, items[0]);

      var falarLabel = document.createElement('li');
      falarLabel.className = 'nav-section-label';
      falarLabel.setAttribute('aria-hidden', 'true');
      falarLabel.innerHTML = '<span>Falar</span>';
      menu.appendChild(falarLabel);

      var waText = encodeURIComponent('Olá Berto, vi o teu site e tenho interesse em desenvolver um projeto.');
      var ctas = [
        { href: 'formulario.html', label: 'Pedir proposta', cls: 'nav-cta-item', arrow: true },
        { href: 'https://wa.me/351939443377?text=' + waText, label: 'WhatsApp', cls: 'nav-secondary', external: true },
        { href: 'mailto:berto.barata77@gmail.com', label: 'berto.barata77@gmail.com', cls: 'nav-secondary' },
        { href: 'https://instagram.com/berto_barata', label: '@berto_barata', cls: 'nav-secondary', external: true }
      ];
      ctas.forEach(function (c) {
        var li = document.createElement('li');
        li.className = c.cls;
        var a = document.createElement('a');
        a.href = c.href;
        a.textContent = c.label;
        if (c.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        if (c.arrow) {
          var ar = document.createElement('span');
          ar.className = 'nav-arrow';
          ar.setAttribute('aria-hidden', 'true');
          ar.textContent = '→';
          a.appendChild(document.createTextNode(' '));
          a.appendChild(ar);
        }
        li.appendChild(a);
        menu.appendChild(li);
      });

      var footerLi = document.createElement('li');
      footerLi.className = 'nav-footer-text';
      footerLi.setAttribute('aria-hidden', 'true');
      footerLi.textContent = '© Barata Studio · Do briefing ao launch';
      menu.appendChild(footerLi);
    }
    // Only build the editorial overlay on mobile - on desktop the base 4-link
    // nav must stay clean (the injected sections/CTAs/arrows were cluttering it).
    var mobileMenuMQ = window.matchMedia('(max-width: 768px)');
    if (mobileMenuMQ.matches) enhanceMobileMenu();
    mobileMenuMQ.addEventListener('change', function (e) {
      if (e.matches) enhanceMobileMenu();
    });

    // === Event delegation: close on any link click ===
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && menu.contains(a)) {
        closeMenu();
        syncToggleLabel(false);
      }
    });

    // Swipe-to-close removed - close X button + Escape + link tap handle it

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
      syncToggleLabel(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && menu.classList.contains('open')) {
        closeMenu();
        syncToggleLabel(false);
      }
    });
  }

  // === WhatsApp float: mobile opens wa.me directly, desktop keeps form ===
  (function () {
    var waBtn = document.querySelector('.whatsapp-float');
    if (!waBtn) return;
    var WA_NUMBER = '351939443377';
    var WA_TEXT = 'Olá Berto, vi o teu site e tenho interesse em desenvolver um projeto.';
    var DESKTOP_HREF = waBtn.getAttribute('href');
    var mq = window.matchMedia('(max-width: 768px)');
    function applyMode() {
      if (mq.matches) {
        waBtn.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT));
        waBtn.setAttribute('target', '_blank');
        waBtn.setAttribute('rel', 'noopener noreferrer');
        waBtn.setAttribute('aria-label', 'Abrir conversa WhatsApp');
        waBtn.setAttribute('data-tooltip', 'WhatsApp');
      } else {
        waBtn.setAttribute('href', DESKTOP_HREF);
        waBtn.removeAttribute('target');
        waBtn.removeAttribute('rel');
        waBtn.setAttribute('aria-label', 'Abrir formulário de contacto');
        waBtn.setAttribute('data-tooltip', 'Pedir proposta');
      }
    }
    applyMode();
    if (mq.addEventListener) mq.addEventListener('change', applyMode);
    else mq.addListener(applyMode);
  })();

  // === Footer year ===
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // === Contact form -> WhatsApp ===
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    function getFieldValue(name) {
      var field = contactForm.elements[name];
      if (!field) return '';

      if (field.tagName === 'SELECT') {
        return field.selectedIndex > -1 ? field.options[field.selectedIndex].text : '';
      }

      return field.value || '';
    }

    // Inline validation replaces the native bubbles (kept as fallback without JS).
    var MESSAGES = {
      valueMissing: 'Preencha este campo.',
      selectMissing: 'Escolha uma opção.',
      typeMismatch: 'Indique um email válido, por exemplo nome@empresa.pt.',
      patternMismatch: 'Use só números, espaços e o sinal +.',
      consent: 'Para enviar, aceite a política de privacidade e os termos.'
    };
    contactForm.setAttribute('novalidate', '');
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    if (submitBtn) submitBtn.insertAdjacentElement('afterend', status);

    var validated = Array.prototype.filter.call(contactForm.elements, function (el) {
      return el.willValidate && el.name;
    });
    validated.forEach(function (el) {
      var err = document.createElement('span');
      err.className = 'field-error';
      err.id = 'erro-' + el.name;
      // Hidden from the label's accessible name; read through aria-describedby.
      err.setAttribute('aria-hidden', 'true');
      var label = el.closest('label');
      (label || el.parentNode).appendChild(err);
      el.setAttribute('aria-describedby', err.id);
      el.addEventListener('blur', function () { if (el.dataset.touched || el.value) { el.dataset.touched = '1'; check(el); } });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
      el.addEventListener('change', function () { if (el.type === 'checkbox' || el.tagName === 'SELECT') check(el); });
    });

    function messageFor(el) {
      var v = el.validity;
      if (v.valid) return '';
      if (el.type === 'checkbox') return MESSAGES.consent;
      if (v.valueMissing) return el.tagName === 'SELECT' ? MESSAGES.selectMissing : MESSAGES.valueMissing;
      if (v.typeMismatch) return MESSAGES.typeMismatch;
      if (v.patternMismatch) return MESSAGES.patternMismatch;
      return el.validationMessage;
    }

    function check(el) {
      var msg = messageFor(el);
      var err = document.getElementById('erro-' + el.name);
      if (err) err.textContent = msg;
      if (msg) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
      return !msg;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = validated.filter(function (el) { return !check(el); });
      if (invalid.length) {
        status.textContent = invalid.length === 1
          ? 'Há 1 campo por corrigir.'
          : 'Há ' + invalid.length + ' campos por corrigir.';
        invalid[0].focus();
        return;
      }

      var number = contactForm.getAttribute('data-whatsapp-number') || '351939443377';

      var fields = [
        ['Nome', getFieldValue('nome')],
        ['Nome da empresa', getFieldValue('empresa')],
        ['Email', getFieldValue('email')],
        ['Telemóvel', getFieldValue('telefone')],
        ['Tipo de projeto', getFieldValue('tipo_projeto')],
        ['Prazo pretendido', getFieldValue('prazo')],
        ['Mensagem', getFieldValue('mensagem')]
      ];

      var lines = ['ola berto tudo bem? preciso de um site. heis os meus dados.....', ''];

      fields.forEach(function (field) {
        var label = field[0];
        var value = field[1];
        if (typeof value === 'string' && value.trim() !== '') {
          lines.push(label + ': ' + value.trim());
        }
      });

      if (submitBtn) {
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = 'A abrir o WhatsApp…';
      }
      status.textContent = 'Pedido pronto. O WhatsApp vai abrir com a mensagem preenchida.';

      var whatsappUrl = 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n'));
      window.location.href = whatsappUrl;
    });

    // Coming back from WhatsApp (bfcache): restore the button.
    window.addEventListener('pageshow', function () {
      if (submitBtn && submitBtn.getAttribute('aria-busy') === 'true') {
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = 'Enviar por WhatsApp';
        status.textContent = '';
      }
    });
  }

  // === Active link highlight ===
  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.top-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0];
    if (href === current) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // === Service Worker ===
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function () { /* ignore */ });
    });
  }

})();

/**
 * Glass header state + scroll reveal (all pages).
 * - Header: a 1px sentinel at the top of the page, watched by IntersectionObserver
 *   (no scroll listener).
 * - Reveal: only for content below the fold at load. The hero and anything already
 *   on screen stay visible from the first paint (their entrance is pure CSS).
 */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  var header = document.getElementById('site-header');
  if (header) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:24px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targets = document.querySelectorAll(
    '.manifesto-inner > *, .identity-inner > *, .process-head, .process-term, ' +
    '.services-header, .service-item, .services-cta, .projects-header, .project-card, .projects-more, .apps-inner > h2, .apps-intro, .app-item, ' +
    '.final-cta-inner, .page-intro-grid, .faq-item, .form-sidecard, .form-container, .legal-shell'
  );
  var fold = window.innerHeight;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  // Read every position first, then write: avoids a forced reflow per element.
  var below = Array.prototype.filter.call(targets, function (el) {
    return el.getBoundingClientRect().top >= fold; // already visible: never hide it
  });
  below.forEach(function (el, n) {
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--d', Math.min((n % 4) * 70, 210) + 'ms');
    io.observe(el);
  });
})();
