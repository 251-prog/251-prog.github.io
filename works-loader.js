/* Load the ribbon near its chapter. All paths stay relative for file:// preview. */
(() => {
  const section = document.getElementById('works');
  if (!section) return;
  const local = location.protocol === 'file:';
  const sources = [
    'assets/ribbon/three.global.min.js',
    ...(local ? ['assets/ribbon/embedded-covers.js?v=perf-a-1'] : []),
    'works.js?v=icons-b-1',
    ...(local ? ['assets/works-character-data.js?v=perf-a-1'] : []),
    'works-character.js?v=perf-a-1',
  ];
  let pending;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => { script.remove(); reject(new Error(`加载作品资源失败：${src}`)); };
      document.head.appendChild(script);
    });
  }
  // One shared promise prevents duplicate initialization during rapid navigation.
  function load() {
    if (!pending) pending = (async () => {
      for (const src of sources) await loadScript(src);
      observer?.disconnect();
    })().catch(error => { console.warn(error); });
    return pending;
  }
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) load();
    }, { rootMargin: `${Math.round(innerHeight * 1.75)}px 0px` });
    observer.observe(section);
  } else load();
  // The site's smooth navigation uses pushState, which does not emit hashchange.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (link && new URL(link.href, location.href).hash === '#works') load();
  }, true);
  addEventListener('hashchange', () => { if (location.hash === '#works') load(); });
  addEventListener('popstate', () => { if (location.hash === '#works') load(); });
  if (location.hash === '#works') load();
})();
