import * as THREE from '/vendor/three.module.js';

// Procedural engineering illustration. Geometry is deliberately not production CAD.
const stage = document.querySelector('#hero-stage');
const canvas = stage?.querySelector('.assembly-canvas');
const fallback = stage?.querySelector('.scene-fallback');
const controls = [...document.querySelectorAll('[data-scene-action]')];
const statusLabel = document.querySelector('[data-scene-status]');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const state = window.sicherScene = { ready: false, fallback: false, mode: 'assembly', progress: 0, reducedMotion: motionQuery.matches };

function announceReady(isFallback = false) {
  state.ready = true;
  state.fallback = isFallback;
  stage?.classList.toggle('scene-ready', !isFallback);
  stage?.classList.toggle('scene-static', isFallback);
  if (stage) stage.dataset.sceneState = isFallback ? 'fallback' : 'ready';
  window.dispatchEvent(new CustomEvent('sicher:scene-ready', { detail: { ...state } }));
}

function showFallback() {
  if (canvas) canvas.hidden = true;
  if (fallback) fallback.hidden = false;
  controls.forEach(button => { button.disabled = true; });
  if (statusLabel) statusLabel.textContent = 'Engineering illustration';
  announceReady(true);
}

if (!stage || !canvas) {
  announceReady(true);
} else {
  try {
    createScene();
  } catch (error) {
    console.info('Sicher: the engineering illustration is available in a static view.', error.message);
    showFallback();
  }
}

function createScene() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 80);
  camera.position.set(8.3, 4.9, 17);
  camera.lookAt(0, 0.05, 0);

  // Large studio light cards give the metal a quiet architectural reflection.
  const environment = new THREE.Scene();
  environment.background = new THREE.Color(0x22252c);
  const cardGeometry = new THREE.PlaneGeometry(1, 1);
  function lightCard(color, strength, x, y, z, width, height) {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide });
    const card = new THREE.Mesh(cardGeometry, material);
    card.position.set(x, y, z);
    card.scale.set(width, height, 1);
    card.lookAt(0, 0, 0);
    environment.add(card);
  }
  lightCard('#f6f0e8', 3, -7, 5, 5, 4, 12);
  lightCard('#f3d6be', 2.1, 4, 7, 5, 7, 3);
  lightCard('#b6d4dd', 1.6, 7, 1, -3, 3, 12);
  lightCard('#efab84', 0.6, -3, -1, -7, 4, 7);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, 0.06);
  scene.environment = environmentTarget.texture;
  environment.traverse(object => { if (object.material) object.material.dispose(); });
  cardGeometry.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xf6f0e8, 0x22252c, 2.3));
  const keyLight = new THREE.DirectionalLight(0xffffff, 4.7);
  keyLight.position.set(-5, 8, 8);
  scene.add(keyLight);
  const edgeLight = new THREE.DirectionalLight(0xefab84, 1.7);
  edgeLight.position.set(6, 3, -5);
  scene.add(edgeLight);
  const fillLight = new THREE.DirectionalLight(0xc4dce7, 1.7);
  fillLight.position.set(5, -2, 6);
  scene.add(fillLight);

  const brushCanvas = document.createElement('canvas');
  brushCanvas.width = 256;
  brushCanvas.height = 256;
  const brush = brushCanvas.getContext('2d');
  brush.fillStyle = '#b5b7b6';
  brush.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 256; row++) {
    const shade = 154 + ((row * 31) % 57);
    brush.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    brush.fillRect(0, row, 256, 1);
  }
  const brushTexture = new THREE.CanvasTexture(brushCanvas);
  brushTexture.wrapS = brushTexture.wrapT = THREE.RepeatWrapping;
  brushTexture.repeat.set(1, 4);
  const steel = new THREE.MeshStandardMaterial({ color: 0xc6cccf, metalness: 0.9, roughness: 0.27, bumpMap: brushTexture, bumpScale: 0.009, envMapIntensity: 1.2 });
  const satin = new THREE.MeshStandardMaterial({ color: 0x8d9ba1, metalness: 0.88, roughness: 0.36, bumpMap: brushTexture, bumpScale: 0.006 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x22252c, metalness: 0.76, roughness: 0.32 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x141519, metalness: 0.08, roughness: 0.85 });
  const brightSteel = new THREE.MeshStandardMaterial({ color: 0xe5e9e9, metalness: 0.98, roughness: 0.16 });
  const copper = new THREE.MeshStandardMaterial({ color: 0xefab84, metalness: 0.18, roughness: 0.48, emissive: 0xa04427, emissiveIntensity: 0.12 });
  // Transparent glazing avoids a second high-cost transmission pass on phones.
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x496e7a, metalness: 0.22, roughness: 0.12, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide, clearcoat: 1, clearcoatRoughness: 0.08 });

  function bevelBox(width, height, depth, material, radius = 0.025) {
    const outline = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const r = Math.min(radius, width / 4, height / 4);
    outline.moveTo(x + r, y);
    outline.lineTo(x + width - r, y);
    outline.quadraticCurveTo(x + width, y, x + width, y + r);
    outline.lineTo(x + width, y + height - r);
    outline.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    outline.lineTo(x + r, y + height);
    outline.quadraticCurveTo(x, y + height, x, y + height - r);
    outline.lineTo(x, y + r);
    outline.quadraticCurveTo(x, y, x + r, y);
    const geometry = new THREE.ExtrudeGeometry(outline, { depth: Math.max(0.01, depth - r * 0.7), bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: r * 0.55, bevelThickness: r * 0.35, curveSegments: 4 });
    geometry.translate(0, 0, -depth / 2);
    return new THREE.Mesh(geometry, material);
  }

  function panel(parent, width, height, depth, material, x = 0, y = 0, z = 0, radius) {
    const mesh = bevelBox(width, height, depth, material, radius);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  function leafBacking() {
    const outline = new THREE.Shape();
    outline.moveTo(-1.34, -3.15);
    outline.lineTo(1.34, -3.15);
    outline.lineTo(1.34, 3.15);
    outline.lineTo(-1.34, 3.15);
    outline.closePath();
    const opening = new THREE.Path();
    opening.moveTo(-1.15, -1.45);
    opening.lineTo(-1.15, 2.75);
    opening.lineTo(1.15, 2.75);
    opening.lineTo(1.15, -1.45);
    opening.closePath();
    outline.holes.push(opening);
    const geometry = new THREE.ExtrudeGeometry(outline, { depth: 0.16, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.018, bevelThickness: 0.018, steps: 1 });
    geometry.translate(0, 0, -0.18);
    return new THREE.Mesh(geometry, graphite);
  }

  const boltGeometry = new THREE.CylinderGeometry(0.047, 0.047, 0.026, 6);
  boltGeometry.rotateX(Math.PI / 2);
  function bolt(parent, x, y, z, material = brightSteel) {
    const mesh = new THREE.Mesh(boltGeometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  const assembly = new THREE.Group();
  assembly.rotation.y = -0.11;
  scene.add(assembly);
  const frame = new THREE.Group();
  assembly.add(frame);

  // Machined perimeter: dark mounting depth, satin face and a fine bright lip.
  for (const x of [-2.9, 2.9]) {
    panel(frame, 0.43, 6.95, 0.62, graphite, x, -0.05, -0.24, 0.04);
    panel(frame, 0.29, 6.95, 0.3, steel, x, -0.05, 0.09, 0.025);
    panel(frame, 0.055, 6.77, 0.03, brightSteel, x + Math.sign(x) * 0.09, -0.05, 0.25, 0.008);
    for (const y of [-3.18, -1.62, 0, 1.62, 3.18]) bolt(frame, x, y, 0.28);
  }
  panel(frame, 6.23, 0.27, 0.65, graphite, 0, -3.52, -0.18, 0.03);
  panel(frame, 6.21, 0.18, 0.54, steel, 0, -3.36, 0.03, 0.02);
  for (const z of [-0.12, 0.08, 0.2]) panel(frame, 5.65, 0.023, 0.025, graphite, 0, -3.245, z, 0.004);
  panel(frame, 6.23, 0.46, 0.53, graphite, 0, 3.32, -0.16, 0.04);
  panel(frame, 6.2, 0.18, 0.12, steel, 0, 3.53, 0.16, 0.015);

  const leaves = [];
  const glazingLayers = [];
  for (const side of [-1, 1]) {
    const leaf = new THREE.Group();
    leaf.position.set(side * 1.355, -0.02, 0.12);
    assembly.add(leaf);
    leaves.push(leaf);
    leaf.add(leafBacking());
    // Cut-out face structure surrounds a continuous smoke-blue glazing layer.
    const glazing = new THREE.Group();
    leaf.add(glazing);
    glazingLayers.push(glazing);
    panel(glazing, 2.3, 4.2, 0.055, glass, 0, 0.65, 0.07, 0.075);
    for (const x of [-1.21, 1.21]) panel(leaf, 0.18, 6.14, 0.16, steel, x, 0, 0.04, 0.025);
    panel(leaf, 2.48, 0.18, 0.16, steel, 0, 3, 0.04, 0.025);
    panel(leaf, 2.48, 0.23, 0.16, steel, 0, -3, 0.04, 0.025);
    panel(leaf, 2.38, 1.61, 0.13, steel, 0, -2.07, 0.05, 0.06);
    panel(leaf, 2.36, 0.12, 0.18, brightSteel, 0, -1.2, 0.07, 0.02);
    // Gasket reveals, central seals and tiny lower-panel fasteners.
    for (const x of [-1.075, 1.075]) panel(leaf, 0.032, 4.19, 0.06, rubber, x, 0.66, 0.07, 0.006);
    for (const y of [-1.425, 2.748]) panel(leaf, 2.17, 0.035, 0.06, rubber, 0, y, 0.07, 0.005);
    panel(leaf, 0.075, 6.05, 0.18, rubber, -side * 1.34, 0, 0.05, 0.012);
    panel(leaf, 0.018, 5.84, 0.035, copper, side * 1.105, 0.05, 0.17, 0.004);
    panel(leaf, 0.105, 0.74, 0.11, brightSteel, -side * 0.99, -0.29, 0.18, 0.04);
    for (const x of [-0.98, 0.98]) for (const y of [-2.71, -1.54]) bolt(leaf, x, y, 0.15);
    // A narrow reflection strip makes the pane read as glass from every angle.
    const reflectionMaterial = new THREE.MeshBasicMaterial({ color: 0xd8e8eb, transparent: true, opacity: 0.16, depthWrite: false });
    const reflection = panel(glazing, 0.18, 3.9, 0.007, reflectionMaterial, -0.58, 0.65, 0.105, 0.003);
    reflection.rotation.z = -0.14;
    const smallReflection = panel(glazing, 0.033, 4, 0.007, reflectionMaterial, -0.4, 0.65, 0.106, 0.002);
    smallReflection.rotation.z = -0.14;
  }

  const drive = new THREE.Group();
  drive.position.set(0, 3.43, -0.05);
  assembly.add(drive);
  panel(drive, 6.08, 0.6, 0.58, satin, 0, 0.08, -0.24, 0.05);
  panel(drive, 5.85, 0.075, 0.11, brightSteel, 0, 0.28, 0.12, 0.015);
  panel(drive, 5.72, 0.025, 0.025, rubber, 0, 0.035, 0.2, 0.004);
  panel(drive, 5.85, 0.09, 0.12, brightSteel, 0, -0.21, 0.12, 0.015);
  for (const x of [-2.27, -0.62, 0.62, 2.27]) {
    panel(drive, 0.31, 0.44, 0.14, graphite, x, 0, 0.1, 0.03);
    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.12, 24), brightSteel);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(x, 0.15, 0.22);
    drive.add(roller);
    bolt(drive, x, 0.15, 0.29, graphite);
    bolt(drive, x, -0.12, 0.2);
  }
  panel(drive, 1.05, 0.36, 0.28, graphite, 0, 0.01, 0.21, 0.04);
  panel(drive, 0.32, 0.23, 0.015, copper, 0, 0.01, 0.36, 0.016);
  for (const x of [-0.39, 0.39]) bolt(drive, x, 0.01, 0.37);
  for (const x of [-2.83, 2.83]) {
    panel(drive, 0.11, 0.6, 0.55, graphite, x, 0.08, -0.19, 0.018);
    bolt(drive, x, 0.23, 0.12);
    bolt(drive, x, -0.07, 0.12);
  }
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.4, 0.43, -0.04), new THREE.Vector3(-1.95, 0.5, -0.04),
    new THREE.Vector3(-1.18, 0.51, -0.04), new THREE.Vector3(-0.63, 0.4, -0.04), new THREE.Vector3(-0.41, 0.31, 0.1)
  ]);
  drive.add(new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 24, 0.026, 6, false), rubber));

  // Technical grounding is a quiet footprint, not an enclosing sci-fi grid.
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext('2d');
  const shadowGradient = shadowContext.createRadialGradient(64, 64, 4, 64, 64, 63);
  shadowGradient.addColorStop(0, 'rgba(0,0,0,.42)');
  shadowGradient.addColorStop(0.55, 'rgba(0,0,0,.2)');
  shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
  shadowContext.fillStyle = shadowGradient;
  shadowContext.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.65 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -3.64, 0.15);
  scene.add(shadow);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xefab84, transparent: true, opacity: 0.24 });
  const footprintPoints = [];
  for (let index = 0; index <= 80; index++) {
    const angle = index / 80 * Math.PI * 2;
    footprintPoints.push(new THREE.Vector3(Math.cos(angle) * 4.1, -3.65, Math.sin(angle) * 2.5));
  }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(footprintPoints), lineMaterial));
  const guides = new THREE.Group();
  assembly.add(guides);
  for (const x of [-2.9, 2.9]) {
    const points = [new THREE.Vector3(x, 3.4, -0.6), new THREE.Vector3(x, 3.4, 1.12)];
    guides.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial));
  }
  guides.visible = false;

  let width = 1;
  let height = 1;
  let inView = true;
  let raf = 0;
  let destroyed = false;
  let contextLost = false;
  let dirty = true;
  let manualProgress = null;
  let scrollProgress = 0;
  let progress = 0;
  let rotation = 0;
  let autoRotate = false;
  let globallyPaused = false;
  let globallyReduced = false;
  let saveData = Boolean(navigator.connection?.saveData);
  let pointerX = 0;
  let pointerY = 0;
  let smoothedX = 0;
  let smoothedY = 0;
  let previousTime = 0;
  const experience = stage.closest('.engineering-experience');
  const header = document.querySelector('.site-header');
  const controlsArePaused = () => globallyPaused && !globallyReduced && !saveData;

  function updateSize() {
    const bounds = stage.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    state.width = Math.round(width);
    state.height = Math.round(height);
    state.pixelRatio = renderer.getPixelRatio();
    const aspect = width / height;
    const verticalSpan = Math.max(9.8, 8.6 / aspect);
    camera.left = -verticalSpan * aspect / 2;
    camera.right = verticalSpan * aspect / 2;
    camera.top = verticalSpan / 2;
    camera.bottom = -verticalSpan / 2;
    camera.updateProjectionMatrix();
    dirty = true;
    requestTick();
  }

  function updateScroll() {
    if (experience) {
      const bounds = experience.getBoundingClientRect();
      const headerHeight = header?.getBoundingClientRect().height || 0;
      scrollProgress = THREE.MathUtils.clamp((headerHeight - bounds.top) / Math.max(1, bounds.height - window.innerHeight + headerHeight), 0, 1);
      state.scrollProgress = Number(scrollProgress.toFixed(3));
    }
    requestTick();
  }

  function requestTick() {
    if (!raf && !destroyed && !contextLost && inView && !document.hidden) raf = requestAnimationFrame(tick);
  }

  function tick(time) {
    raf = 0;
    if (destroyed || contextLost || !inView || document.hidden) return;
    const seconds = Math.min(0.045, (time - previousTime) / 1000 || 0.016);
    previousTime = time;
    const reduced = motionQuery.matches || globallyReduced || saveData || globallyPaused;
    const targetProgress = controlsArePaused() ? 0 : manualProgress ?? (reduced ? 0 : scrollProgress);
    const ease = reduced ? 1 : 1 - Math.exp(-seconds * 5.5);
    progress += (targetProgress - progress) * ease;
    smoothedX += (pointerX - smoothedX) * ease;
    smoothedY += (pointerY - smoothedY) * ease;
    if (autoRotate && !reduced) rotation += seconds * 0.19;
    assembly.rotation.y = -0.11 + rotation + (reduced ? 0 : smoothedX * 0.12) + progress * 0.12;
    assembly.rotation.x = reduced ? 0 : smoothedY * 0.035;
    frame.position.z = -progress * 0.36;
    leaves[0].position.x = -1.355 - progress * 0.52;
    leaves[1].position.x = 1.355 + progress * 0.52;
    leaves.forEach(leaf => { leaf.position.z = 0.12 + progress * 0.68; });
    glazingLayers.forEach(layer => { layer.position.z = progress * 0.46; });
    drive.position.y = 3.43 + progress * 0.65;
    drive.position.z = -0.05 + progress * 0.13;
    guides.visible = progress > 0.2;
    state.progress = Number(progress.toFixed(3));
    state.rotating = autoRotate && !reduced;
    const moving = Math.abs(targetProgress - progress) > 0.0005 || Math.abs(pointerX - smoothedX) > 0.0005 || Math.abs(pointerY - smoothedY) > 0.0005 || (autoRotate && !reduced);
    if (dirty || moving) {
      renderer.render(scene, camera);
      state.renderedFrames = (state.renderedFrames || 0) + 1;
      state.drawCalls = renderer.info.render.calls;
      state.triangles = renderer.info.render.triangles;
      dirty = false;
    }
    if (moving) requestTick();
  }

  function setControlState(action) {
    controls.forEach(button => {
      button.disabled = controlsArePaused() || contextLost || destroyed;
      if (button.dataset.sceneAction === 'rotate') button.setAttribute('aria-pressed', String(autoRotate));
      if (['assemble', 'explode'].includes(button.dataset.sceneAction)) button.setAttribute('aria-pressed', String(action === button.dataset.sceneAction));
    });
    if (statusLabel) statusLabel.textContent = controlsArePaused() ? 'Motion paused' : autoRotate ? 'Rotation enabled' : action === 'explode' ? 'Exploded view' : action === 'reset' ? 'Scroll to explore' : 'Assembly view';
  }

  function onAction(event) {
    if (controlsArePaused() || contextLost || destroyed) return;
    const action = event.currentTarget.dataset.sceneAction;
    if (action === 'explode') { manualProgress = 1; state.mode = 'exploded'; }
    if (action === 'assemble') { manualProgress = 0; state.mode = 'assembly'; }
    if (action === 'rotate') {
      autoRotate = !autoRotate;
      // A deliberate, static alternate angle remains available with reduced motion.
      if (motionQuery.matches || globallyReduced || saveData) rotation = autoRotate ? 0.55 : 0;
      state.mode = autoRotate ? 'rotating' : manualProgress === 1 ? 'exploded' : 'assembly';
    }
    if (action === 'reset') {
      manualProgress = null;
      rotation = 0;
      autoRotate = false;
      pointerX = pointerY = 0;
      state.mode = 'scroll';
    }
    setControlState(action);
    dirty = true;
    requestTick();
  }

  function onPointerMove(event) {
    if (!pointerQuery.matches || motionQuery.matches || globallyReduced || globallyPaused || saveData) return;
    const bounds = stage.getBoundingClientRect();
    pointerX = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
    pointerY = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
    requestTick();
  }
  function onPointerLeave() { pointerX = pointerY = 0; requestTick(); }
  function onVisibility() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else { previousTime = performance.now(); dirty = true; requestTick(); } }
  function onMotionChange() {
    state.reducedMotion = motionQuery.matches;
    if (motionQuery.matches) { autoRotate = false; rotation = 0; pointerX = pointerY = 0; }
    setControlState(manualProgress === 1 ? 'explode' : 'assemble');
    dirty = true;
    requestTick();
  }
  function onExperience(event) {
    if (!Number.isFinite(event.detail?.progress)) return;
    scrollProgress = THREE.MathUtils.clamp(event.detail.progress, 0, 1);
    state.scrollProgress = Number(scrollProgress.toFixed(3));
    requestTick();
  }
  function onGlobalMotion(event) {
    globallyPaused = Boolean(event.detail?.paused);
    globallyReduced = Boolean(event.detail?.reduced);
    saveData = Boolean(event.detail?.saveData ?? navigator.connection?.saveData);
    state.paused = globallyPaused;
    state.saveData = saveData;
    state.reducedMotion = motionQuery.matches || globallyReduced;
    if (globallyPaused || globallyReduced || saveData) {
      autoRotate = false;
      rotation = 0;
      pointerX = pointerY = 0;
    }
    setControlState(manualProgress === 1 ? 'explode' : 'assemble');
    dirty = true;
    requestTick();
  }
  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(raf);
    raf = 0;
    showFallback();
  }
  function onContextRestored() {
    contextLost = false;
    canvas.hidden = false;
    if (fallback) fallback.hidden = true;
    setControlState(manualProgress === 1 ? 'explode' : 'assemble');
    dirty = true;
    requestTick();
    announceReady(false);
  }

  controls.forEach(button => button.addEventListener('click', onAction));
  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('sicher:experience', onExperience);
  window.addEventListener('sicher:motion', onGlobalMotion);
  document.addEventListener('visibilitychange', onVisibility);
  motionQuery.addEventListener('change', onMotionChange);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  const resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(stage);
  const intersectionObserver = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (!inView) { cancelAnimationFrame(raf); raf = 0; }
    else { previousTime = performance.now(); dirty = true; requestTick(); }
  }, { rootMargin: '80px' });
  intersectionObserver.observe(stage);

  updateSize();
  updateScroll();
  renderer.render(scene, camera);
  state.renderedFrames = 1;
  state.drawCalls = renderer.info.render.calls;
  state.triangles = renderer.info.render.triangles;
  if (fallback) fallback.hidden = true;
  canvas.hidden = false;
  setControlState('assemble');
  announceReady(false);

  function dispose() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener('scroll', updateScroll);
    window.removeEventListener('sicher:experience', onExperience);
    window.removeEventListener('sicher:motion', onGlobalMotion);
    document.removeEventListener('visibilitychange', onVisibility);
    motionQuery.removeEventListener('change', onMotionChange);
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerleave', onPointerLeave);
    controls.forEach(button => button.removeEventListener('click', onAction));
    const geometries = new Set();
    const materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) materials.add(object.material);
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    brushTexture.dispose();
    shadowTexture.dispose();
    environmentTarget.dispose();
    renderer.dispose();
  }
  // Keep the renderer alive for back/forward cache restoration.
  window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); });
}
