/* Animaciones de la landing Masterclass FantuLash */
(function () {
  var d = document;
  var header = d.querySelector('header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  d.documentElement.classList.add('anim');

  /* ---------- HERO: una sola secuencia al cargar ---------- */
  var hero = d.getElementById('inicio');
  var heroAnims = [];
  if (hero) {
    var h1 = hero.querySelector('h1');
    if (h1) {
      var text = h1.textContent.trim();
      h1.setAttribute('aria-label', text);
      h1.textContent = '';
      text.split(/\s+/).forEach(function (word, i) {
        var s = d.createElement('span');
        s.className = 'w';
        s.setAttribute('aria-hidden', 'true');
        s.style.transitionDelay = (150 + i * 75) + 'ms';
        s.textContent = word;
        h1.appendChild(s);
        h1.appendChild(d.createTextNode(' '));
      });
      heroAnims.push(h1);
    }

    var label = hero.querySelector('p');
    if (label) { label.classList.add('rv'); label.style.transitionDelay = '0ms'; heroAnims.push(label); }

    var brow = hero.querySelector('svg');
    var browPaths = [];
    if (brow) {
      brow.classList.add('brow');
      browPaths = Array.prototype.slice.call(brow.querySelectorAll('path'));
      browPaths.forEach(function (p, i) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len + 'px ' + (len + 6) + 'px';
        p.style.strokeDashoffset = (len + 3) + 'px';
        void p.getBoundingClientRect(); void getComputedStyle(p).strokeDashoffset;
        p.style.transition = 'stroke-dashoffset 750ms cubic-bezier(.4,0,.2,1) ' + (650 + i * 26) + 'ms';
      });
      heroAnims.push(brow);
    }

    if (h1) {
      var after = hero.querySelectorAll('h1 ~ p, h1 ~ div, h1 ~ dl');
      Array.prototype.forEach.call(after, function (el, i) {
        el.classList.add('rv');
        el.style.transitionDelay = (900 + i * 130) + 'ms';
        heroAnims.push(el);
      });
    }

    var photo = hero.querySelector('img');
    if (photo && photo.parentNode) {
      photo.parentNode.classList.add('reveal-arch');
      heroAnims.push(photo.parentNode);
      var thumbs = photo.parentNode.nextElementSibling;
      if (thumbs) { thumbs.classList.add('rv'); thumbs.style.transitionDelay = '1200ms'; heroAnims.push(thumbs); }
    }

    function startHero() {
      browPaths.forEach(function (p) { void getComputedStyle(p).strokeDashoffset; });
      heroAnims.forEach(function (el) { el.classList.add('in'); });
      browPaths.forEach(function (p) { p.style.strokeDashoffset = '0'; });
    }
    requestAnimationFrame(function () { requestAnimationFrame(startHero); });
  }

  /* ---------- Piezas especiales ---------- */
  // Viñetas de trazo y checks de las listas
  Array.prototype.forEach.call(d.querySelectorAll('section:not(#inicio) li svg'), function (svg) {
    svg.classList.add('stroke-mark');
    Array.prototype.forEach.call(svg.querySelectorAll('path'), function (p) { p.setAttribute('pathLength', '1'); });
  });
  // Barras del calendario (los 3 últimos hijos de la grilla de fechas)
  var cal = d.querySelector('#capacitaciones [role="img"]');
  if (cal) {
    var kids = cal.children;
    for (var k = 5; k < kids.length; k++) kids[k].classList.add('bar');
  }
  // Los 5 cupos
  var seats = d.querySelector('[aria-label^="Cinco lugares"]');
  if (seats) Array.prototype.forEach.call(seats.children, function (s) { s.classList.add('seat'); });

  // Precio del combo que cuenta hasta $8.000.000
  var total = null;
  Array.prototype.forEach.call(d.querySelectorAll('#combo p'), function (p) {
    if (!total && p.firstChild && p.firstChild.nodeType === 3 && /8\.000\.000/.test(p.firstChild.nodeValue)) total = p;
  });

  /* ---------- Entradas al hacer scroll ---------- */
  var SEL = 'h2, p, li, article, figure, details, form, dl, blockquote, [role="img"], h3, h4, img, div[style*="aspect-ratio"], div[style*="dashed"]';
  var picked = [];
  Array.prototype.forEach.call(d.querySelectorAll('section:not(#inicio)'), function (sec) {
    var chosen = [];
    Array.prototype.forEach.call(sec.querySelectorAll(SEL), function (el) {
      for (var i = 0; i < chosen.length; i++) if (chosen[i].contains(el)) return;
      chosen.push(el);
    });
    var perParent = new Map();
    chosen.forEach(function (el) {
      var n = perParent.get(el.parentNode) || 0;
      perParent.set(el.parentNode, n + 1);
      el.classList.add('rv');
      el.style.transitionDelay = Math.min(n, 6) * 80 + 'ms';
      picked.push(el);
    });
  });

  function countUp(el) {
    var node = el.firstChild, end = 8000000, start = performance.now(), dur = 1600;
    function fmt(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' '; }
    function tick(t) {
      var k = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      node.nodeValue = fmt(Math.round(end * e / 1000) * 1000);
      if (k < 1) requestAnimationFrame(tick);
    }
    node.nodeValue = fmt(0);
    requestAnimationFrame(tick);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target === total || (total && en.target.contains(total))) countUp(total);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  picked.forEach(function (el) { io.observe(el); });
})();
