/* works-loader.js loads Three.js first; embedded textures are only needed for file://. */
(()=>{
const THREE = window.THREE;
if (!THREE) return;

const track = document.querySelector('#works');
const stage = track.querySelector('.folio-stage');
const gallery = stage.querySelector('.folio-grid');
const buttons = [...gallery.querySelectorAll('button')];
const headline = [...stage.querySelector('.folio-type').children];
const jump = stage.querySelector('.folio-jump');
const calm = matchMedia('(prefers-reduced-motion: reduce)');

function startRibbon() {
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a, b, t) => a + (b - a) * t;
const ease = t => t * t * (3 - 2 * t);
const out = t => 1 - (1 - t) ** 3;
const span = (p, a, b) => clamp((p - a) / (b - a));

/* ---------- renderer ---------- */
const canvas = stage.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setClearColor(0, 0);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const scene = new THREE.Scene();
const FOV = 35, camera = new THREE.PerspectiveCamera(FOV, 1, .1, 100);

/* ---------- ribbon path ---------- */
let path, PATH_L = 1;
const SAMPLES = 1200, pathP = [], pathT = [];
const PH0 = -1.5, PH1 = Math.PI * 2 + 1.35;
function buildPath() {
  const pts = [];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160, ph = mix(PH0, PH1, t), cs = Math.cos(ph), u = 2 * t - 1;
    // a shallow arc close to the camera, then long runs far behind it
    const depth = cs > 0 ? 7.6 + 16.4 * cs ** .9 : 7.6 + 2.2 * cs;
    const edge = .84 + .5 * span(.14 - t, 0, .14) + .8 * span(t, .84, 1);
    pts.push(new THREE.Vector3(edge * Math.sin(ph) * depth * .561, .5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * .63, -depth));
  }
  path = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  path.arcLengthDivisions = 1500;
  PATH_L = path.getLength(); pathP.length = pathT.length = 0;
  for (let i = 0; i <= SAMPLES; i++) { const u = i / SAMPLES; pathP.push(path.getPointAt(u)); pathT.push(path.getTangentAt(u)); }
}
const at = (s, op, ot) => {
  const f = clamp(s / PATH_L) * SAMPLES, i = Math.min(SAMPLES - 1, Math.floor(f)), k = f - i;
  op.lerpVectors(pathP[i], pathP[i + 1], k); ot.lerpVectors(pathT[i], pathT[i + 1], k).normalize();
};

/* ---------- cards ---------- */
const CARD_W = 2.1, CARD_H = 1.32, GAP = .03, STEP = CARD_W + GAP, NX = 28, NY = 3;
const vs = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fs = `uniform sampler2D map;uniform vec2 cover;uniform float focus;uniform float aspect,ready,radius;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  vec3 c=mix(vec3(.075),texture2D(map,uv*cover+(1.-cover)*vec2(.5,1.-focus)).rgb,ready);
  float edge=smoothstep(-.012-px,-.012,d);
  gl_FragColor=vec4(mix(c,vec3(1.),edge*.1),a);
}`;
const cards = buttons.map((button, i) => {
  const tex = new THREE.TextureLoader().load(window.PORTFOLIO_COVERS?.[i] || button.querySelector('img').src, () => {
    mat.uniforms.ready.value = 1;
  });
  const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
  const mat = new THREE.ShaderMaterial({vertexShader:vs, fragmentShader:fs, transparent:true, side:THREE.DoubleSide,
    uniforms:{focus:{value:Number(button.dataset.focus)},map:{value:tex}, cover:{value:new THREE.Vector2(1, 1)}, aspect:{value:CARD_W / CARD_H}, ready:{value:0}, radius:{value:.018}}});
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; scene.add(mesh);
  return {i, geo, mat, mesh, focus:Number(button.dataset.focus)};

});

const GZ = 8;
let W = 1, H = 1, asp = 1, cols = 3, rows = 2, tanH = .3153;
function resize() {
  W = stage.clientWidth; H = stage.clientHeight; asp = W / H;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
  camera.aspect = asp; camera.fov = asp < 16 / 9 ? Math.atan(.561 / asp) * 360 / Math.PI : FOV; camera.updateProjectionMatrix();
  tanH = Math.tan(camera.fov * Math.PI / 360);
  cols = asp < .9 ? 2 : 3; rows = asp < .9 ? 3 : 2;
  }


/* ---------- pose ---------- */
const op = new THREE.Vector3(), ot = new THREE.Vector3(), up = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), vp = new THREE.Vector3();
function fitPreview(card, aspect) {
  const uniforms = card.mat.uniforms;
  const image = uniforms.map.value.image;
  const width = image?.videoWidth || image?.width;
  const height = image?.videoHeight || image?.height;
  if (!width || !height) return;
  const ratio = width / height;
  uniforms.aspect.value = aspect;
  uniforms.cover.value.set(Math.min(1, aspect / ratio), Math.min(1, ratio / aspect));
}
function poseRibbon(c, head) {
  fitPreview(c, CARD_W / CARD_H);
  const pos = c.geo.attributes.position, centre = head - c.i * STEP;
  for (let iy = 0; iy <= NY; iy++) for (let ix = 0; ix <= NX; ix++) {
    const k = iy * (NX + 1) + ix, lu = ix / NX - .5, lv = .5 - iy / NY;
    at(centre + lu * CARD_W, op, ot);
    // keep the sheet upright, leaning a little into the turn
        up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
    vp.copy(op).addScaledVector(up, lv * CARD_H);
    pos.setXYZ(k, vp.x, vp.y, vp.z);
  }
  pos.needsUpdate = true;
}
track.classList.add('has-ribbon');
buildPath();
resize();
let p = 0, raf = 0, visible = false;
const finish = .84;
const duration = 3600;
let previousFrame = null;
let contextLost = false;
gallery.inert = true;
const railStart = PATH_L * .18;
const railEnd = PATH_L + STEP * cards.length;
function draw(timestamp) {
  raf = 0;
  if (!visible || document.hidden) return;
  if (previousFrame !== null) {
    p = Math.min(finish, p + (timestamp - previousFrame) * finish / duration);
  }
  previousFrame = timestamp;
  const landed = p>=finish;
  const run = span(p,0,.57);
  headline[0].style.transform = `translateX(${-10+110*run}vw)`;
  headline[1].style.transform = `translateX(${10-110*run}vw)`;
  const head = mix(railStart,railEnd,span(p,0,.68));
  for (const c of cards) {
    const end = PATH_L-CARD_W;
    const centre = head-c.i*STEP;
    c.mesh.visible = centre > 0 && centre < end;
    if (c.mesh.visible) poseRibbon(c,head);

    // Once the strip leaves the rail, animate the actual interactive card.
    const exitAt = .68 * (end + c.i * STEP - railStart) / (railEnd - railStart);
    const arrival = span(p, exitAt, exitAt + .14);
    const remaining = 1 - out(arrival);
    const card = buttons[c.i];
    card.style.setProperty('--arrive-opacity', Math.min(1, arrival * 4));
    card.style.setProperty('--arrive-transform',
      `translateY(${remaining * -65}px) rotate(${remaining * (c.i % 2 ? 8 : -8)}deg) scale(${1 - remaining * .16})`);
  }
  track.classList.toggle('is-landed',landed);
  gallery.inert = !landed;
  jump.innerHTML = landed ? '重播动画 ' + window.portfolioIcon('refresh') : '跳过动画 ' + window.portfolioIcon('right');
  renderer.render(scene,camera);
  if (!landed) raf = requestAnimationFrame(draw);
}
function updateVisibility() {
  if (contextLost) return;
  cancelAnimationFrame(raf);
  previousFrame = null;
  if (visible && !document.hidden) {
    raf = requestAnimationFrame(draw);
  }
}
new IntersectionObserver(([entry]) => {
  const inFocus = entry.intersectionRect.height >= Math.min(stage.clientHeight, window.innerHeight) * .45;
  if (!inFocus) {
    visible = false;
    p = 0;
    gallery.scrollLeft = 0;
    buttons.forEach(card => card.style.removeProperty('--arrive-opacity'));
    if (!contextLost) {
      track.classList.remove('is-landed');
      gallery.inert = true;
    }
  } else {
    visible = true;
  }
  updateVisibility();
}, { threshold: Array.from({length:101},(_,i)=>i/100) }).observe(stage);
document.addEventListener('visibilitychange', updateVisibility);
new ResizeObserver(resize).observe(stage);
jump.addEventListener('click', () => {
  p = track.classList.contains('is-landed') ? 0 : finish;
  if (p === 0) {
    track.classList.remove('is-landed');
    gallery.scrollLeft = 0;
    buttons.forEach(card => card.style.removeProperty('--arrive-opacity'));
  }
  updateVisibility();
});
canvas.addEventListener('webglcontextlost',()=>{
  contextLost = true;
  visible = false;
  cancelAnimationFrame(raf);
  track.classList.remove('has-ribbon','is-landed');
  gallery.inert=false;
},{once:true});
}
if (!calm.matches) {
  try { startRibbon(); } catch (error) {
    track.classList.remove('has-ribbon');
    gallery.inert=false;
    console.warn('作品已切换为封面浏览',error);
  }
}

})();
