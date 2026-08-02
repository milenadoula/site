// Milena Brandão — comportamento do site (sem dependências).
(function () {
  var els = document.querySelectorAll('[data-reveal="1"]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        setTimeout(function () { en.target.classList.add('visivel'); }, Math.random() * 90);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('visivel'); }); }, 2500);
  }

  // Menu mobile (hambúrguer).
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Carrossel de depoimentos: pausa a rolagem automática ao tocar (mobile).
  var depoInner = document.querySelector('.depo-track-inner');
  if (depoInner) {
    depoInner.addEventListener('touchstart', function () { depoInner.classList.add('pausado'); }, { passive: true });
    depoInner.addEventListener('touchend', function () { depoInner.classList.remove('pausado'); });
  }

  // Galeria: carrossel com rolagem automática lenta, pausa ao interagir, arraste manual.
  function initGalTrack(track, speed, direction) {
    if (!track) return;
    var inner = track.querySelector('.gal-track-inner');
    if (!inner) return;
    var paused = false, resumeTimer = null, lastTs = null;
    if (direction < 0) track.scrollLeft = inner.scrollWidth / 2;

    function step(ts) {
      if (!paused && lastTs != null) {
        var dt = (ts - lastTs) / 1000;
        var half = inner.scrollWidth / 2;
        track.scrollLeft += direction * speed * dt;
        if (direction > 0 && track.scrollLeft >= half) track.scrollLeft -= half;
        if (direction < 0 && track.scrollLeft <= 0) track.scrollLeft += half;
      }
      lastTs = ts;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    function pause() { paused = true; clearTimeout(resumeTimer); }
    function scheduleResume() { clearTimeout(resumeTimer); resumeTimer = setTimeout(function () { paused = false; }, 2200); }
    ['pointerdown', 'touchstart', 'mouseenter'].forEach(function (ev) {
      track.addEventListener(ev, pause, { passive: true });
    });
    ['pointerup', 'pointercancel', 'touchend', 'mouseleave'].forEach(function (ev) {
      track.addEventListener(ev, scheduleResume, { passive: true });
    });
  }
  initGalTrack(document.getElementById('gal-vertical'), 26, 1);
  initGalTrack(document.getElementById('gal-horizontal'), 30, -1);

  // Newsletter: troca o formulário pela confirmação.
  // Ligue ao seu provedor de e-mail (Mailchimp, Brevo…) trocando o corpo deste handler.
  var form = document.querySelector('[data-newsletter]');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = document.createElement('p');
    ok.style.cssText = 'font:500 15px/1.6 var(--font-body);color:var(--md-rosa);margin:0;flex:1 1 260px';
    ok.textContent = 'Prontinho! O e-book está a caminho do seu e-mail.';
    form.replaceWith(ok);
  });
})();
