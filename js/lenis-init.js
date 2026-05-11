(function () {
  'use strict';
  if (typeof Lenis === 'undefined') return;
  var l = new Lenis({ lerp: 0.1, duration: 1.4 });
  (function raf(t) { l.raf(t); requestAnimationFrame(raf); })(0);
})();
