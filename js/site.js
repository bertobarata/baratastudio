/**
 * site.js — small UX helpers shared by every page.
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

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
      syncToggleLabel(open);
      if (open) {
        var focusable = getFocusable();
        if (focusable[0]) focusable[0].focus();
        document.addEventListener('keydown', trapFocus);
      } else {
        closeMenu();
      }
    });

    // === Enhance mobile menu with sections, numbers, secondary CTAs ===
    function enhanceMobileMenu() {
      if (menu.dataset.enhanced === '1') return;
      menu.dataset.enhanced = '1';

      var items = Array.from(menu.querySelectorAll('li')).filter(function (li) {
        return !li.classList.contains('nav-close-item');
      });
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
    enhanceMobileMenu();

    // === Event delegation: close on any link click ===
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && menu.contains(a)) {
        closeMenu();
        syncToggleLabel(false);
      }
    });

    // Close X button
    var closeBtn = menu.querySelector('.nav-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeMenu({ restoreFocus: true });
        syncToggleLabel(false);
      });
    }

    // === Swipe down to close ===
    var touchStartY = null;
    menu.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
    }, { passive: true });
    menu.addEventListener('touchmove', function (e) {
      if (touchStartY === null) return;
      var delta = e.touches[0].clientY - touchStartY;
      if (delta > 0) menu.style.transform = 'translateY(' + delta + 'px)';
    }, { passive: true });
    menu.addEventListener('touchend', function (e) {
      if (touchStartY === null) return;
      var delta = (e.changedTouches[0].clientY) - touchStartY;
      menu.style.transform = '';
      touchStartY = null;
      if (delta > 90) {
        closeMenu({ restoreFocus: true });
        syncToggleLabel(false);
      }
    });

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
        waBtn.setAttribute('data-tooltip', 'Pedir site');
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

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var number = contactForm.getAttribute('data-whatsapp-number') || '351939443377';

      var fields = [
        ['Nome', getFieldValue('nome')],
        ['Nome da empresa', getFieldValue('empresa')],
        ['Email', getFieldValue('email')],
        ['Telemóvel', getFieldValue('telefone')],
        ['Tipo de projeto', getFieldValue('tipo_projeto')],
        ['Faixa de investimento', getFieldValue('investimento')],
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

      var whatsappUrl = 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n'));
      window.location.href = whatsappUrl;
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

  // === Custom cursor (pointer devices only) ===
  (function () {
    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    var mX = 0, mY = 0, rX = 0, rY = 0;

    document.addEventListener('mousemove', function (e) {
      mX = e.clientX;
      mY = e.clientY;
      dot.style.left = mX + 'px';
      dot.style.top  = mY + 'px';
    });

    (function tick() {
      rX += (mX - rX) * 0.1;
      rY += (mY - rY) * 0.1;
      ring.style.left = rX + 'px';
      ring.style.top  = rY + 'px';
      requestAnimationFrame(tick);
    })();

    document.querySelectorAll('a, button, .project-card, .process-panel, [role="button"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hovered'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hovered'); });
    });

    document.documentElement.addEventListener('mouseleave', function () {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.documentElement.addEventListener('mouseenter', function () {
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
  })();

})();
