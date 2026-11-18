(() => {
  const menuButton = document.querySelector('#menuToggle');
  const nav = document.querySelector('#siteNav');
  const dialog = document.querySelector('#imageDialog');
  const dialogImg = document.querySelector('#dialogImage');
  const dialogTitle = document.querySelector('#dialogTitle');
  let lastTrigger = null;
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  }
  menuButton?.addEventListener('click', () => {
    const next = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(next));
    menuButton.setAttribute('aria-label', next ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', next);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    if (!dialog?.showModal) return;
    lastTrigger = button;
    dialogImg.src = button.dataset.lightbox;
    dialogImg.alt = button.querySelector('img')?.alt || 'Image preview';
    dialogTitle.textContent = button.dataset.title || 'Image detail';
    dialog.showModal();
  }));
  document.querySelector('#dialogClose')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog?.addEventListener('close', () => { dialogImg.removeAttribute('src'); lastTrigger?.focus(); });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
    }, { threshold: 0.07, rootMargin: '0px 0px 35px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('revealed'));
  }
  window.addEventListener('scroll', () => document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 18), { passive: true });
})();
