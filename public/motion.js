(() => {
  'use strict';
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
  const compactViewport = window.matchMedia('(max-width: 900px), (max-height: 700px)');
  const saveData = Boolean(navigator.connection?.saveData);
  const experience = document.querySelector('.engineering-experience');
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.reading-progress');
  const controls = [...document.querySelectorAll('[data-motion-toggle]')];
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  const activeParallax = new Set();
  const chapters = [...document.querySelectorAll('.experience-chapter[data-chapter]')];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  let manuallyPaused = false;
  let animationFrame = 0;
  let lastExperienceProgress = -1;
  let lastChapter = '';
  let revealObserver;
  let parallaxObserver;
  let observersReady = false;

  // Unscripted content stays fully visible. Only initialized observers opt the
  // page into entrance motion; keyboard focus reveals every hidden ancestor.
  const revealItems = [...document.querySelectorAll('[data-reveal], .section-heading, .product-item, .capability-row, .industry-item, .timeline > li, .article-item, .standards-panel, .capability-detail, .product-main > section')]
    .filter(element => !element.closest('.engineering-experience') && (
      element.hasAttribute('data-reveal') || (!element.closest('[data-reveal]') && !element.querySelector('[data-reveal]'))
    ));
  for (const element of revealItems) {
    if (!element.hasAttribute('data-reveal')) element.dataset.reveal = 'rise';
  }

  const paused = () => manuallyPaused || preference.matches || saveData;
  const revealVisible = () => {
    const height = window.innerHeight;
    const visible = revealItems.filter(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.top < height * 0.94 && bounds.bottom > 0;
    });
    for (const element of visible) {
      element.classList.add('is-visible');
      revealObserver?.unobserve(element);
    }
  };

  const update = () => {
    animationFrame = 0;
    const height = window.innerHeight;
    const position = Math.max(0, window.scrollY || window.pageYOffset || 0);
    const documentHeight = Math.max(root.scrollHeight, document.body.scrollHeight);
    const pageProgress = clamp(position / Math.max(1, documentHeight - height));
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const bounds = experience?.getBoundingClientRect();
    const experienceProgress = bounds ? clamp((headerHeight - bounds.top) / Math.max(1, bounds.height - height + headerHeight)) : 0;
    const chapter = String(Math.min(2, Math.floor(experienceProgress * 3)));
    const enhanced = observersReady && !paused();
    const chapterEnhanced = enhanced && !compactViewport.matches;
    const offsets = [];
    const useDepth = enhanced && !coarsePointer.matches;
    for (const element of activeParallax) {
      const box = element.getBoundingClientRect();
      const strength = clamp(Number(element.dataset.parallax) || 1, 0.2, 2);
      const offset = useDepth ? clamp((height / 2 - box.top - box.height / 2) / height, -1, 1) * 26 * strength : 0;
      offsets.push([element, offset]);
    }

    root.style.setProperty('--scroll-progress', pageProgress.toFixed(5));
    root.style.setProperty('--experience-progress', experienceProgress.toFixed(5));
    if (progressBar) progressBar.style.setProperty('--scroll-progress', pageProgress.toFixed(5));
    header?.classList.toggle('is-scrolled', position > 18);
    for (const [element, offset] of offsets) element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    if (experience) {
      experience.style.setProperty('--experience-progress', experienceProgress.toFixed(5));
      experience.dataset.chapter = chapter;
      if (chapter !== lastChapter) {
        for (const element of chapters) {
          const active = !chapterEnhanced || element.dataset.chapter === chapter;
          element.classList.toggle('is-active', active);
          element.inert = !active;
          if (active) element.removeAttribute('aria-hidden');
          else element.setAttribute('aria-hidden', 'true');
        }
        lastChapter = chapter;
      }
      if (Math.abs(lastExperienceProgress - experienceProgress) > 0.0005) {
        window.dispatchEvent(new CustomEvent('sicher:experience', {detail: {progress: experienceProgress, chapter: Number(chapter), paused: paused()}}));
        lastExperienceProgress = experienceProgress;
      }
    }
  };
  const schedule = () => {
    if (!animationFrame && !document.hidden) animationFrame = window.requestAnimationFrame(update);
  };

  const syncPreference = () => {
    const isPaused = paused();
    root.classList.toggle('motion-paused', isPaused);
    root.classList.toggle('motion-reduced', preference.matches);
    root.classList.toggle('motion-touch', coarsePointer.matches);
    root.classList.toggle('motion-compact', compactViewport.matches);
    root.classList.toggle('motion-ready', observersReady && !isPaused);
    root.dataset.motion = preference.matches ? 'reduced' : isPaused ? 'paused' : 'enabled';
    for (const control of controls) {
      control.setAttribute('aria-pressed', String(isPaused));
      const label = control.querySelector('[data-motion-label]');
      const text = preference.matches ? 'Reduced motion' : saveData ? 'Motion off' : isPaused ? 'Resume motion' : 'Pause motion';
      if (label) label.textContent = text;
      else control.textContent = text;
      control.disabled = preference.matches || saveData;
    }
    if (isPaused) {
      for (const element of parallaxItems) element.style.setProperty('--parallax-y', '0px');
    } else revealVisible();
    lastChapter = '';
    lastExperienceProgress = -1;
    window.dispatchEvent(new CustomEvent('sicher:motion', {detail: {paused: isPaused, reduced: preference.matches, saveData}}));
    schedule();
  };

  if ('IntersectionObserver' in window) {
    try {
      revealObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }, {rootMargin: '0px 0px -5% 0px', threshold: 0.01});
      for (const element of revealItems) revealObserver.observe(element);
      parallaxObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeParallax.add(entry.target);
          else activeParallax.delete(entry.target);
        }
        schedule();
      }, {rootMargin: '15% 0px 15% 0px'});
      for (const element of parallaxItems) parallaxObserver.observe(element);
      observersReady = true;
      revealVisible();
    } catch {
      revealObserver?.disconnect();
      parallaxObserver?.disconnect();
      // Missing observer support must not make any content disappear.
      observersReady = false;
    }
  }

  for (const control of controls) control.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    syncPreference();
  });
  document.addEventListener('focusin', event => {
    let element = event.target.closest?.('[data-reveal]');
    while (element) {
      element.classList.add('is-visible');
      revealObserver?.unobserve(element);
      element = element.parentElement?.closest('[data-reveal]');
    }
  });
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', () => {
    revealVisible();
    schedule();
  }, {passive: true});
  preference.addEventListener('change', syncPreference);
  coarsePointer.addEventListener('change', syncPreference);
  compactViewport.addEventListener('change', syncPreference);
  window.addEventListener('sicher:scene-ready', () => {
    lastExperienceProgress = -1;
    syncPreference();
  });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else schedule();
  });
  if ('ResizeObserver' in window && experience) new ResizeObserver(schedule).observe(experience);
  syncPreference();
})();
