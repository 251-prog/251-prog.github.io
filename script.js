const foodCover = document.querySelector('[data-text-cover]');
if (new URLSearchParams(location.search).get('cover') === 'text') {
  foodCover.src = foodCover.dataset.textCover;
}

const navLinks = [...document.querySelectorAll('.capsule a')];
const sections = [...document.querySelectorAll('[data-section]')];
const header = document.getElementById('site-header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.getElementById('hello');
const heroVideo = document.getElementById('hero-video');
const heroHoldFrame = document.getElementById('hero-hold-frame');
const replayHero = document.getElementById('replay-hero');
const advanceSpray = document.getElementById('advance-spray');
const heroNext = document.getElementById('hero-copy-next');
const heroFinal = document.getElementById('hero-copy-final');
const heroProgressLabel = document.getElementById('hero-progress-label');
const PEACE_HOLD = 3.04;
// The hand starts lowering just after the held peace sign at 3.04s.
const SECOND_COPY_START = 3.10;
let heroStage = 0;
let segmentPlaying = !reduceMotion.matches;
const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
history.scrollRestoration = 'manual';
if (isReload && window.location.hash !== '#hello') {
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}#hello`);
}
const startsAtLaterSection = !isReload && ['#journey', '#works', '#future'].includes(window.location.hash);
let heroLockActive = !startsAtLaterSection;

function setHeroLock(active) {
  heroLockActive = active;
  document.documentElement.classList.toggle('hero-locked', active);
  document.body.classList.toggle('hero-locked', active);
}
setHeroLock(heroLockActive);

function showHeroStage(stage) {
  hero.classList.toggle('is-final', stage === 1);
  hero.classList.toggle('is-idle', stage === 0 && !segmentPlaying);
  heroNext.setAttribute('aria-hidden', String(stage !== 0));
  heroFinal.setAttribute('aria-hidden', String(stage !== 1));
  heroNext.inert = stage !== 0;
  heroFinal.inert = stage !== 1;
  heroProgressLabel.textContent = ['摸头比耶 · 01 / 02', '喷漆落幕 · 02 / 02'][stage];
}

function showSecondCopy(mediaTime = heroVideo.currentTime) {
  if (!segmentPlaying || mediaTime < SECOND_COPY_START || hero.classList.contains('is-final')) return;
  hero.classList.add('is-final');
  heroNext.setAttribute('aria-hidden', 'true');
  heroFinal.setAttribute('aria-hidden', 'false');
  heroNext.inert = true;
  heroFinal.inert = false;
  heroProgressLabel.textContent = '动作衔接 · 02 / 02';
}

function stopAtTarget(mediaTime = heroVideo.currentTime) {
  if (!segmentPlaying || !Number.isFinite(heroVideo.duration) || mediaTime < heroVideo.duration - .05) return;
  heroVideo.pause();
  heroStage = 1;
  segmentPlaying = false;
  showHeroStage(1);
  setHeroLock(false);
}

function updateHeroPlayback(mediaTime = heroVideo.currentTime) {
  if (segmentPlaying && mediaTime >= PEACE_HOLD) hero.classList.add('is-spraying');
  showSecondCopy(mediaTime);
  stopAtTarget(mediaTime);
}

function watchSegment() {
  if (!segmentPlaying || !('requestVideoFrameCallback' in heroVideo)) return;
  heroVideo.requestVideoFrameCallback((_, frame) => {
    updateHeroPlayback(frame.mediaTime);
    if (segmentPlaying) watchSegment();
  });
}
heroVideo.addEventListener('timeupdate', () => {
  updateHeroPlayback();
});
heroVideo.addEventListener('ended', () => {
  if (segmentPlaying) { heroStage = 1; segmentPlaying = false; showHeroStage(1); setHeroLock(false); }
});
function initializeHeroVideo() {
  if (startsAtLaterSection || heroStage === 1) {
    heroVideo.pause();
    heroVideo.currentTime = Math.max(PEACE_HOLD, heroVideo.duration - .04);
    heroStage = 1;
    segmentPlaying = false;
    hero.classList.add('is-spraying');
    heroHoldFrame.style.opacity = '0';
    showHeroStage(1);
    setHeroLock(false);
    return;
  }
  if (reduceMotion.matches) {
    heroVideo.pause();
    heroVideo.currentTime = Math.max(PEACE_HOLD, heroVideo.duration - .04);
    heroHoldFrame.style.opacity = '0';
    segmentPlaying = false;
    heroStage = 1;
    hero.classList.add('is-spraying');
    showHeroStage(1);
    setHeroLock(false);
  } else {
    heroVideo.currentTime = 0;
    watchSegment();
    heroVideo.play().catch(() => {
      heroVideo.currentTime = Math.max(PEACE_HOLD, heroVideo.duration - .04);
      hero.classList.add('is-spraying');
      segmentPlaying = false;
      heroStage = 1;
      showHeroStage(1);
      setHeroLock(false);
    });
  }
}
if (heroVideo.readyState >= 1) initializeHeroVideo();
else heroVideo.addEventListener('loadedmetadata', initializeHeroVideo, { once: true });

function skipHeroAnimation() {
  hero.classList.add('is-spraying');
  heroVideo.pause();
  if (Number.isFinite(heroVideo.duration)) heroVideo.currentTime = Math.max(PEACE_HOLD, heroVideo.duration - .04);
  heroHoldFrame.style.opacity = '0';
  heroStage = 1;
  segmentPlaying = false;
  showHeroStage(1);
  setHeroLock(false);
}

function scrollToChapter(hash, behavior = 'smooth') {
  const section = document.querySelector(hash);
  if (!section) return;
  const kicker = section.querySelector('.section-kicker');
  const top = hash === '#hello'
    ? section.getBoundingClientRect().top
    : kicker.getBoundingClientRect().top - header.getBoundingClientRect().bottom - 16;
  window.scrollTo({ top: Math.max(0, window.scrollY + top), behavior: reduceMotion.matches ? 'instant' : behavior });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (!['#hello', '#journey', '#works', '#future'].includes(link.hash)) return;
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    if (link.hash !== '#hello' && heroLockActive) {
      heroVideo.pause();
      heroStage = 1;
      segmentPlaying = false;
      hero.classList.add('is-spraying');
      heroHoldFrame.style.opacity = '0';
      if (Number.isFinite(heroVideo.duration)) heroVideo.currentTime = Math.max(PEACE_HOLD, heroVideo.duration - .04);
      showHeroStage(1);
      setHeroLock(false);
    }
    scrollToChapter(link.hash);
  });
});

window.addEventListener('wheel', event => {
  if (heroLockActive && event.deltaY > 0 && !document.body.classList.contains('dialog-open')) event.preventDefault();
}, { passive: false });

let touchStartY = null;
let touchStartedInHero = false;
window.addEventListener('touchstart', event => {
  touchStartY = event.touches[0]?.clientY ?? null;
  touchStartedInHero = heroLockActive && !event.target.closest('a, button');
}, { passive: true });
window.addEventListener('touchmove', event => {
  if (touchStartedInHero && touchStartY !== null && touchStartY - event.touches[0].clientY > 12) event.preventDefault();
}, { passive: false });
window.addEventListener('touchend', () => {
  if (touchStartY === null) return;
  touchStartY = null;
  touchStartedInHero = false;
});

function markSection(id) {
  navLinks.forEach(link => {
    const active = link.hash === `#${id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function onScroll() {
  if (heroLockActive && window.scrollY > hero.offsetTop + 2) {
    window.scrollTo({ top: hero.offsetTop, behavior: 'instant' });
    if (!segmentPlaying) skipHeroAnimation();
  }
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  const marker = window.innerHeight * .36 + 85;
  let current = 'hello';
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= marker) current = section.id;
  });
  markSection(current);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

advanceSpray.addEventListener('click', () => {
  skipHeroAnimation();
});
function restartHeroIntro() {
  heroVideo.pause();
  heroHoldFrame.style.opacity = '0';
  window.scrollTo({ top: hero.offsetTop, behavior: 'instant' });
  setHeroLock(true);
  hero.classList.remove('is-spraying');
  showHeroStage(0);
  heroStage = 0;
  heroVideo.currentTime = 0;
  segmentPlaying = !reduceMotion.matches;
  hero.classList.remove('is-idle');
  if (reduceMotion.matches) {
    skipHeroAnimation();
  }
  else {
    watchSegment();
    heroVideo.play().catch(skipHeroAnimation);
  }
}
replayHero.addEventListener('click', restartHeroIntro);
window.addEventListener('pageshow', event => {
  if (isReload || event.persisted) restartHeroIntro();
  else if (['#journey', '#works', '#future'].includes(location.hash)) scrollToChapter(location.hash, 'instant');
});

const revealObserver = 'IntersectionObserver' in window && !reduceMotion.matches
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .15 })
  : null;
document.querySelectorAll('.reveal').forEach(element => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

const journeyVisual = document.querySelector('.journey-visual');
const journeyVideo = document.getElementById('journey-video');
let journeyVisible = false;
let journeyFinished = false;

function playJourney() {
  if (document.hidden || journeyFinished) return;
  journeyVideo.play().catch(() => {});
}

function enterJourney() {
  if (journeyVisible) return;
  journeyVisible = true;
  journeyFinished = false;
  journeyVideo.currentTime = 0;
  playJourney();
}

function leaveJourney() {
  if (!journeyVisible) return;
  journeyVisible = false;
  journeyVideo.pause();
  journeyVideo.currentTime = 0;
  journeyFinished = false;
}

journeyVideo.addEventListener('loadeddata', () => journeyVisual.classList.add('has-live-video'));
if (journeyVideo.readyState >= 2) journeyVisual.classList.add('has-live-video');
journeyVideo.addEventListener('ended', () => { journeyFinished = true; });
const journeyObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) enterJourney();
      else leaveJourney();
    }, { threshold: .1 })
  : null;
if (journeyObserver) journeyObserver.observe(journeyVisual);
else enterJourney();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) journeyVideo.pause();
  else if (journeyVisible) playJourney();
});

const experiences = [
  {
    label: 'UI 设计师 · 2025.03 — 2026.11',
    title: '把设计规范，带进产品与 AI 工作流。',
    body: '主导 AI 开发平台设计侧落地，并负责多款平台、移动端及 Pad 端产品从 0 到上线的设计。',
    points: [
      '制定 AI 生成 UI 的内容、交互与视觉规范，内部验证产品整体开发效率提升 40%。',
      '累计输出 800+ 页面，跟进研发还原与走查，保障上线质量。',
      '从 0 搭建统一设计组件库，覆盖基础组件、业务组件与使用文档。'
    ]
  },
  {
    label: 'UI 设计师 · 2023.07 — 2025.03',
    title: '让品牌与产品，说同一种视觉语言。',
    body: '负责 App、Web 系统、品牌官网及线下活动的全链路视觉设计。',
    points: [
      '覆盖品牌视觉、IP 形象、界面 UI、图标体系、运营插画与宣传物料。',
      '搭建多套产品视觉规范与组件资产库，图标与组件复用率提升约 35%。',
      '独立完成 10+ 份活动主视觉、海报、H5 与线下展板物料。'
    ]
  },
  {
    label: 'UI 设计师（实习）· 2022.11 — 2023.06',
    title: '从每一个界面细节开始。',
    body: '参与 Web、App 与后台系统的 UI 设计，学习从需求到研发落地的完整协作过程。',
    points: [
      '协助需求拆解、页面绘制与视觉输出。',
      '按团队规范完成 Figma 设计稿、切图与标注，并参与评审和界面细节优化。'
    ]
  }
];
const experienceWorkspace = document.querySelector('.journey-workspace');
const experienceDetail = document.querySelector('.experience-detail');
const experienceTimeline = document.querySelector('.journey .timeline');

function fillExperience(container, experience) {
  container.querySelector('span').textContent = experience.label;
  container.querySelector('h3').textContent = experience.title;
  container.querySelector('p').textContent = experience.body;
  container.querySelector('ul').replaceChildren(...experience.points.map(point => {
    const item = document.createElement('li');
    item.textContent = point;
    return item;
  }));
}

function sizeExperienceWorkspace() {
  experienceWorkspace.style.height = '';
  experienceTimeline.style.height = 'auto';
  const detailWidth = experienceDetail.getBoundingClientRect().width;
  let longestDetail = 0;
  experiences.forEach(experience => {
    const measure = experienceDetail.cloneNode(true);
    measure.removeAttribute('aria-live');
    measure.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    fillExperience(measure, experience);
    Object.assign(measure.style, {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      width: `${detailWidth}px`,
      height: 'auto',
      minHeight: '0',
      overflow: 'visible'
    });
    experienceWorkspace.appendChild(measure);
    longestDetail = Math.max(longestDetail, measure.getBoundingClientRect().height);
    measure.remove();
  });
  const selectorHeight = experienceTimeline.getBoundingClientRect().height;
  const stacked = window.matchMedia('(max-width: 600px)').matches;
  const gap = parseFloat(getComputedStyle(experienceWorkspace).rowGap) || 0;
  const height = stacked ? selectorHeight + gap + longestDetail : Math.max(selectorHeight, longestDetail);
  experienceWorkspace.style.height = `${Math.ceil(height)}px`;
  experienceTimeline.style.height = '';
}

let experienceTransition = 0;
document.querySelectorAll('[data-experience]').forEach(button => {
  button.addEventListener('click', async () => {
    const chosen = Number(button.dataset.experience);
    const experience = experiences[chosen];
    if (!experience) return;
    if (button.classList.contains('is-active')) return;
    const transition = ++experienceTransition;
    document.querySelectorAll('[data-experience]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    experienceDetail.getAnimations().forEach(animation => animation.cancel());
    if (!reduceMotion.matches) {
      try {
        await experienceDetail.animate([
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-12px)' }
        ], { duration: 140, easing: 'ease-in', fill: 'forwards' }).finished;
      } catch (_) { /* A newer selection takes over. */ }
    }
    if (transition !== experienceTransition) return;
    fillExperience(experienceDetail, experience);
    experienceDetail.getAnimations().forEach(animation => animation.cancel());
    if (!reduceMotion.matches) experienceDetail.animate([
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 260, easing: 'cubic-bezier(.2,.75,.2,1)' });
  });
});
sizeExperienceWorkspace();
document.fonts?.ready.then(sizeExperienceWorkspace);
let experienceResizeFrame;
window.addEventListener('resize', () => {
  cancelAnimationFrame(experienceResizeFrame);
  experienceResizeFrame = requestAnimationFrame(sizeExperienceWorkspace);
});

const caseImage = document.querySelector('.folio-preview');
const caseDialog = document.getElementById('case-dialog');
const closeDialog = document.getElementById('dialog-close');
let returnFocus = null;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.project === '0' && window.openJikeReader) {
      window.openJikeReader(button);
      return;
    }
    if (button.dataset.project === '1' && window.openFlickReader) {
      window.openFlickReader(button);
      return;
    }
    const remaining = {2: 'openOaReader', 3: 'openDlkReader', 4: 'openCampaignReader', 5: 'openLightfoodReader'}[button.dataset.project];
    if (remaining && window[remaining]) { window[remaining](button); return; }
    returnFocus = button;
    const index = Number(button.dataset.project);
    document.getElementById('case-kicker').textContent = `项目作品 / 0${index + 1}`;
    document.getElementById('case-title').textContent = button.dataset.name;
    caseImage.src = button.dataset.original;
    caseImage.alt = button.dataset.name + '完整设计图';
    caseDialog.showModal();
    caseDialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
  });
});
closeDialog.addEventListener('click', () => caseDialog.close());
caseDialog.addEventListener('click', event => {
  if (event.target === caseDialog) caseDialog.close();
});
caseDialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  caseImage.removeAttribute('src');
  returnFocus?.focus({preventScroll:true});
});

const possibilities = ['新的灵感', '有趣的产品', '一次合作', '未知的领域'];
let possibilityIndex = 0;
document.getElementById('shuffle').addEventListener('click', () => {
  possibilityIndex = (possibilityIndex + 1) % possibilities.length;
  document.getElementById('possibility').textContent = possibilities[possibilityIndex];
  document.querySelector('.future-orbit').dataset.variant = String(possibilityIndex);
});
