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

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
      if (open) {
        var focusable = getFocusable();
        if (focusable[0]) focusable[0].focus();
        document.addEventListener('keydown', trapFocus);
      } else {
        closeMenu();
      }
    });

    // Close when clicking a link
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

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
