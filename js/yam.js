/* =============================================================
   Y.A.M. PAGE — Scroll Reveals & Newsletter Placeholder
   ============================================================= */
(function() {
  'use strict';

  /* Scroll reveal via IntersectionObserver */
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(function(el) {
    observer.observe(el);
  });

  /* Newsletter button placeholder behavior */
  var newsletterBtn = document.querySelector('.newsletter-band button');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var btn = this;
      btn.textContent = 'Coming Soon!';
      btn.style.background = 'var(--green)';
      setTimeout(function() {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 2000);
    });
  }
})();
