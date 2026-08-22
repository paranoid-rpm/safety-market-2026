document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  const setHeader = () => header?.classList.toggle('scrolled', scrollY > 24);
  const closeMenu = (returnFocus = false) => {
    menuBtn?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (returnFocus) menuBtn?.focus();
  };

  setHeader();
  addEventListener('scroll', setHeader, { passive: true });
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);
      }
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => reveal.observe(element));
    document.documentElement.classList.add('reveal-ready');
  }

  const animateNumber = element => {
    const end = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const start = performance.now();
    element.textContent = `0${suffix}`;
    const run = now => {
      const progress = Math.min((now - start) / 1100, 1);
      element.textContent = `${Math.round(end * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
      if (progress < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }), { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach(element => counterObserver.observe(element));
  }

  const filters = [...document.querySelectorAll('.filter-btn')];
  const products = [...document.querySelectorAll('.product')];
  const filterStatus = document.getElementById('filter-status');
  const validFilters = new Set(filters.map(button => button.dataset.filter));
  const categoryFromUrl = () => {
    const category = new URLSearchParams(location.search).get('category');
    return category && validFilters.has(category) ? category : 'all';
  };
  const applyFilter = (value, updateHistory = false) => {
    const selected = validFilters.has(value) ? value : 'all';
    filters.forEach(button => {
      const active = button.dataset.filter === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let shown = 0;
    products.forEach(card => {
      const hidden = selected !== 'all' && card.dataset.category !== selected;
      card.classList.toggle('hidden', hidden);
      if (!hidden) shown += 1;
    });
    if (filterStatus) filterStatus.textContent = `Показано: ${shown}`;
    if (updateHistory) {
      const url = new URL(location.href);
      if (selected === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', selected);
      history.pushState({ category: selected }, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };
  if (filters.length && products.length) {
    applyFilter(categoryFromUrl());
    filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter, true)));
    addEventListener('popstate', () => applyFilter(categoryFromUrl()));
  }

  document.querySelectorAll('.details-btn').forEach(button => button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    if (panel) panel.style.maxHeight = open ? '0px' : `${panel.scrollHeight}px`;
  }));

  const line = document.querySelector('.history-line');
  if (line) {
    const progress = () => {
      const rect = line.getBoundingClientRect();
      const value = Math.max(0, Math.min(100, ((innerHeight * .55 - rect.top) / rect.height) * 100));
      line.style.setProperty('--timeline-progress', `${value}%`);
    };
    progress();
    addEventListener('scroll', progress, { passive: true });
  }
});
