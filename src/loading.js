(() => {
  'use strict';
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = window.performance?.getEntriesByType?.('navigation')[0];
  const restored = navigation?.type === 'back_forward';

  // The page is always usable. Loading is a short visual introduction, never a gate.
  if (preference.matches || navigator.connection?.saveData || restored) {
    root.classList.add('is-ready', 'loader-exit');
    return;
  }

  const started = window.performance?.now?.() ?? Date.now();
  const now = () => window.performance?.now?.() ?? Date.now();
  const introduction = 320;
  let complete = false;
  let deadline;
  let introductionTimer;
  let status;
  let progressTrack;
  let sceneReady = false;
  let resolveScene;
  const setProgress = (value, message) => {
    root.style.setProperty('--loader-progress', String(value));
    if (status) status.textContent = message;
    if (progressTrack) progressTrack.style.setProperty('--loader-progress', String(value));
  };

  const finish = () => {
    if (complete) return;
    complete = true;
    window.clearTimeout(deadline);
    window.clearTimeout(introductionTimer);
    setProgress(1, 'Opening website');
    root.classList.remove('is-loading');
    root.classList.add('is-ready', 'loader-exit');
    document.removeEventListener('pointerdown', finish, true);
    document.removeEventListener('keydown', finish, true);
    document.removeEventListener('DOMContentLoaded', prepare);
    window.removeEventListener('sicher:scene-ready', onSceneReady);
    window.removeEventListener('pageshow', onPageShow);
    preference.removeEventListener?.('change', onPreference);
  };
  const onPreference = event => {
    if (event.matches) finish();
  };
  const onPageShow = event => {
    if (event.persisted) finish();
  };
  const onSceneReady = () => {
    sceneReady = true;
    resolveScene?.();
  };
  const ready = () => {
    if (complete) return;
    setProgress(1, 'Experience ready');
    const remaining = introduction - (now() - started);
    if (remaining > 0) introductionTimer = window.setTimeout(finish, remaining);
    else finish();
  };

  const prepare = () => {
    if (complete) return;
    status = document.querySelector('[data-loader-step]');
    progressTrack = document.querySelector('[data-loader-progress]');
    const images = [...document.querySelectorAll('.brand img, img[fetchpriority="high"]')];
    const scene = document.querySelector('[data-engineering-scene], [data-scene]');
    const needsScene = scene && !sceneReady && !['ready', 'fallback', 'failed'].includes(scene.dataset.sceneState);
    const work = images.map(img => ({kind: 'image', promise: Promise.resolve().then(() => img.decode?.())}));
    if (document.fonts) work.push({kind: 'font', promise: document.fonts.ready});
    if (needsScene) work.push({kind: 'scene', promise: new Promise(resolve => { resolveScene = resolve; })});
    let remainingImages = images.length;
    let remainingFonts = document.fonts ? 1 : 0;
    let remainingScenes = needsScene ? 1 : 0;
    let settled = 0;
    const update = () => {
      if (complete) return;
      const message = remainingImages ? 'Preparing application imagery'
        : remainingFonts ? 'Setting the typography'
        : remainingScenes ? 'Building the 3D study' : 'Experience ready';
      setProgress(work.length ? 0.12 + 0.78 * settled / work.length : 0.9, message);
    };
    update();
    Promise.allSettled(work.map(item => Promise.resolve(item.promise).catch(() => {}).then(() => {
      settled++;
      if (item.kind === 'image') remainingImages--;
      if (item.kind === 'font') remainingFonts--;
      if (item.kind === 'scene') remainingScenes--;
      update();
    }))).then(ready);
  };

  root.classList.add('is-loading');
  setProgress(0.08, 'Preparing the engineering experience');
  // The fallback bounds stalled fonts, failed modules and blocked WebGL alike.
  deadline = window.setTimeout(finish, 1700);
  document.addEventListener('pointerdown', finish, {capture: true, once: true});
  document.addEventListener('keydown', finish, {capture: true, once: true});
  preference.addEventListener?.('change', onPreference);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('sicher:scene-ready', onSceneReady);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepare, {once: true});
  } else {
    prepare();
  }
})();
