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
    var focusableSelectors = 'a, button, input, [tabindex]:not([tabindex="-1"])';

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
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
        document.removeEventListener('keydown', trapFocus);
      }
    }

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        var focusable = getFocusable();
        if (focusable[0]) focusable[0].focus();
        document.addEventListener('keydown', trapFocus);
      } else {
        document.removeEventListener('keydown', trapFocus);
      }
    });

    // Close when clicking a link
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', trapFocus);
      });
    });
  }

  // === Footer year ===
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // === Active link highlight ===
  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.top-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0];
    if (href === current) a.classList.add('active');
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
