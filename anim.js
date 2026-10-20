/* Animaciones y video de la VSL Masterclass FantuLash */
(function () {
  /* Cuando tengas el video, pega aquí el link de inserción (embed), por ejemplo:
     https://www.youtube.com/embed/ID_DEL_VIDEO  o  https://player.vimeo.com/video/ID */
  var VIDEO_EMBED = '';

  var d = document;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* Video: al dar play se reemplaza la portada por el reproductor */
  var play = d.querySelector('.fl-play');
  if (play) {
    play.addEventListener('click', function () {
      if (!VIDEO_EMBED) return;
      var box = play.closest('.fl-video');
      var f = d.createElement('iframe');
      f.src = VIDEO_EMBED + (VIDEO_EMBED.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&rel=0';
      f.title = 'Video de Carolina sobre la Masterclass';
      f.allow = 'autoplay; fullscreen; picture-in-picture';
      f.allowFullscreen = true;
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      box.textContent = '';
      box.appendChild(f);
    });
  }

  var header = d.querySelector('header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  d.documentElement.classList.add('anim');

  /* ---------- HERO ---------- */
  var heroEls = [];
  var h1 = d.querySelector('.fl-words');
  if (h1) {
    var text = h1.textContent.trim();
    h1.setAttribute('aria-label', text);
    h1.textContent = '';
    text.split(/\s+/).forEach(function (word, i) {
      var s = d.createElement('span');
      s.className = 'w';
      s.setAttribute('aria-hidden', 'true');
      s.style.transitionDelay = (200 + i * 80) + 'ms';
      s.textContent = word;
      h1.appendChild(s);
      h1.appendChild(d.createTextNode(' '));
    });
    heroEls.push(h1);
  }
  each(d.querySelectorAll('.fl-hero-in'), function (el, i) {
    el.style.transitionDelay = (i === 0 ? 0 : 900 + i * 140) + 'ms';
    heroEls.push(el);
  });
  each(d.querySelectorAll('.fl-hero-photo, .fl-ghost, .fl-eco'), function (el) { heroEls.push(el); });

  var brow = d.querySelector('.fl-brow');
  var browPaths = [];
  if (brow) {
    browPaths = Array.prototype.slice.call(brow.querySelectorAll('path'));
    browPaths.forEach(function (p, i) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len + 'px ' + (len + 6) + 'px';
      p.style.strokeDashoffset = (len + 3) + 'px';
      void p.getBoundingClientRect(); void getComputedStyle(p).strokeDashoffset;
      p.style.transition = 'stroke-dashoffset 750ms cubic-bezier(.4,0,.2,1) ' + (800 + i * 24) + 'ms';
    });
    heroEls.push(brow);
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroEls.forEach(function (el) { el.classList.add('in'); });
      browPaths.forEach(function (p) { p.style.strokeDashoffset = '0'; });
    });
  });

  /* ---------- Contador del combo ---------- */
  var total = d.querySelector('.fl-count');
  function countUp(el) {
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    var end = 8000000, start = performance.now(), dur = 1700;
    function fmt(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' '; }
    function tick(t) {
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      node.nodeValue = fmt(Math.round(end * e / 1000) * 1000);
      if (k < 1) requestAnimationFrame(tick);
    }
    node.nodeValue = fmt(0);
    requestAnimationFrame(tick);
  }

  /* ---------- Entradas al hacer scroll ---------- */
  var groups = new Map();
  each(d.querySelectorAll('.fl-rv'), function (el) {
    var n = groups.get(el.parentNode) || 0;
    groups.set(el.parentNode, n + 1);
    el.style.transitionDelay = Math.min(n, 6) * 90 + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (total && en.target.contains(total)) setTimeout(function () { countUp(total); }, 250);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  each(d.querySelectorAll('.fl-rv'), function (el) { io.observe(el); });
})();
