(function () {
  'use strict';

  // ===== Lenis smooth scroll =====
  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({ lerp: 0.1, duration: 1.4 });
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); })(0);
    }
  }

  // ===== Header scroll state =====
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Hero content reveal =====
  var heroContent = document.getElementById('hero-content');
  if (heroContent) {
    requestAnimationFrame(function () {
      setTimeout(function () {
        heroContent.classList.add('revealed');
      }, 100);
    });
  }

  // ===== Scroll reveal for sections =====
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  // ===== Process panels — Managed via GSAP below =====
  var processPanels = document.querySelectorAll('.process-panel');
  var processFill = document.getElementById('process-fill');

  // ===== GSAP animations (if available) =====
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', function () {

  // Phone slide & swap
  var phoneTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1
    }
  });

  // Outgoing pair (up)
  phoneTL.to('.phone--1', { y: '-150vh', autoAlpha: 0, ease: 'power1.in' }, 0)
         .to('.phone--2', { y: '-150vh', autoAlpha: 0, ease: 'power1.in' }, 0.1);
         
  // Incoming pair (from bottom to center)
  phoneTL.fromTo('.phone--3', 
           { y: '150vh', autoAlpha: 0 }, 
           { y: '-50%', autoAlpha: 1, ease: 'power2.out' }, 0.3)
         .fromTo('.phone--4', 
           { y: '150vh', autoAlpha: 0 }, 
           { y: '-50%', autoAlpha: 1, ease: 'power2.out' }, 0.4);

  // Watermark Parallax
  gsap.to('.watermark--1', { y: -100, rotate: -20, scrollTrigger: { scrub: true } });
  gsap.to('.watermark--2', { y: -150, rotate: 15, scrollTrigger: { scrub: true } });
  gsap.to('.watermark--3', { y: -80, rotate: -10, scrollTrigger: { scrub: true } });

  // Rhythmic Process Scroll (Vertical Pinned Step-by-Step)
  var panels = gsap.utils.toArray('.process-panel');
  if (panels.length) {
    var processTL = gsap.timeline({
      scrollTrigger: {
        trigger: '.process-layers',
        start: 'top top',
        end: '+=' + (panels.length * 50) + '%',
        pin: true,
        scrub: 1.2, // Higher scrub for smoother, rhythmic feel
        anticipatePin: 1
      }
    });

    panels.forEach(function(panel, i) {
      // First panel starts visible, others start hidden/dimmed
      if (i > 0) {
        processTL.from(panel, {
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: 'power2.inOut'
        }, i);
      }
      
      // Keep panel active for a while (rhythm)
      processTL.to({}, { duration: 0.5 }); 
      
      // Fade out previous panel if not last
      if (i < panels.length - 1) {
        processTL.to(panel, {
          opacity: 0.1,
          scale: 0.9,
          y: -30,
          duration: 1,
          ease: 'power2.inOut'
        }, i + 1);
      }
      
      // Update progress fill via GSAP instead of IntersectionObserver
      processTL.to(processFill, {
        width: ((i + 1) / panels.length * 100) + '%',
        duration: 0.5,
        ease: 'none'
      }, i);
    });
  }

  // Manifesto — staggered lines
  var manifestoCopy = document.querySelector('.manifesto-inner');
  if (manifestoCopy) {
    gsap.from('.manifesto-inner > *', {
      opacity: 0,
      y: 24,
      duration: .8,
      stagger: .15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.manifesto-inner',
        start: 'top 80%',
        once: true
      }
    });
  }

  // BB Depth section — layers animate in with rotation
  var depthSection = document.querySelector('.bb-depth');
  if (depthSection) {
    gsap.from('.depth-layer--1', {
      opacity: 0,
      rotateY: 20,
      scale: .9,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.bb-depth-visual', start: 'top 75%', once: true }
    });
    gsap.from('.depth-layer--2', {
      opacity: 0,
      rotateY: 12,
      scale: .95,
      duration: 1,
      delay: .15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.bb-depth-visual', start: 'top 75%', once: true }
    });
    gsap.from('.depth-layer--3', {
      opacity: 0,
      scale: .92,
      duration: .9,
      delay: .3,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.bb-depth-visual', start: 'top 75%', once: true }
    });
    gsap.from('#bb-depth-copy > *', {
      opacity: 0,
      x: 30,
      duration: .8,
      stagger: .12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#bb-depth-copy', start: 'top 78%', once: true }
    });
  }

  // Services list — stagger items
  var serviceItems = document.querySelectorAll('.service-item');
  if (serviceItems.length) {
    gsap.from('.service-item', {
      opacity: 0,
      y: 16,
      duration: .5,
      stagger: .07,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.services-list', start: 'top 80%', once: true }
    });
  }

  // Process summary steps
  var stepEls = document.querySelectorAll('.process-step');
  if (stepEls.length) {
    gsap.from('.process-step', {
      opacity: 0,
      y: 20,
      duration: .6,
      stagger: .1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.process-steps', start: 'top 80%', once: true }
    });
  }

  // Project cards
  var projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    gsap.from('.project-card', {
      opacity: 0,
      y: 24,
      duration: .7,
      stagger: .15,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.projects-grid', start: 'top 80%', once: true }
    });
  }

  // Final CTA
  var ctaContent = document.querySelector('.cta-content');
  if (ctaContent) {
    gsap.from('.cta-content > *', {
      opacity: 0,
      y: 20,
      duration: .7,
      stagger: .12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.cta-content', start: 'top 80%', once: true }
    });
    gsap.from('.cta-bb-bg', {
      opacity: 0,
      x: 60,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.final-cta', start: 'top 80%', once: true }
    });
  }

  }); // end gsap.matchMedia (>=769px)

})();
