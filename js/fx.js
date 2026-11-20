/* DYWE redesign: визуальные эффекты. Ничего не меняет в логике сайта.
   Откат: удалить <script src="js/fx.js"> из index.html. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  if (!reduce) root.classList.add('js-fx');

  /* ---- scroll progress bar + nav state ---- */
  var bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var nav = document.querySelector('.nav');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- scrollspy for the nav links ---- */
  var links = $$('.nav ul a[href^="#"]');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        var a = map[e.target.id];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---- reveal on scroll ---- */
  if (!reduce && 'IntersectionObserver' in window) {
    var sel = '.section-head, .eyebrow, .h2, .lead, .card, .step, .num, .aud, .ph, .vs, .lat, .build, ' +
              '.diagram, .stage, .layers li, .faq details, .final h2, .final .cta-row, .tabs, .note';
    var targets = $$(sel).filter(function (el) { return !el.closest('.hero'); });
    targets.forEach(function (el) {
      el.classList.add('rv');
      // stagger among siblings that are revealed together
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('rv') || targets.indexOf(c) > -1; });
      var i = sibs.indexOf(el);
      el.style.setProperty('--d', Math.min(i, 5) * 80 + 'ms');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
    // страховка: если что-то не сработало, всё равно показать контент
    setTimeout(function () { targets.forEach(function (el) { el.classList.add('in'); }); }, 6000);
  }

  /* ---- cursor spotlight on cards ---- */
  if (fine && !reduce) {
    $$('.card, .aud, .ph, .step, .viz, .num, .build, .diagram').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--mx', '-300px');
        el.style.setProperty('--my', '-300px');
      });
    });

    /* ---- subtle 3D tilt for the hero terminal ---- */
    var term = document.querySelector('.hero .term');
    if (term) {
      var wrap = term.parentNode;
      wrap.addEventListener('pointermove', function (e) {
        var r = term.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        var y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        term.style.transform = 'perspective(1200px) rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)';
      });
      wrap.addEventListener('pointerleave', function () { term.style.transform = ''; });
    }
  }
})();
