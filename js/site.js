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
