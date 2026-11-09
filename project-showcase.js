(() => {
  const reader=document.querySelector('.project-reader');
  const scroll=reader.querySelector('.reader-scroll');
  const detail=reader.querySelector('.reader-layout');
  const calm=matchMedia('(prefers-reduced-motion:reduce)');
  const image=(n)=>`assets/projects/jike-detail/${String(n).padStart(2,'0')}.webp`;
  function crop(n,y,h,alt,cls=''){
    return `<div class="jike-crop ${cls}" style="aspect-ratio:1920/${h}"><img src="${image(n)}" alt="${alt}" loading="lazy" style="transform:translateY(-${y/[2947,2814,3880,2379,3971,4304,3631,4875,5676,5491][n-1]*100}%)"></div>`;
  }
  const showcase=document.createElement('article');
  showcase.className='jike-showcase';showcase.setAttribute('aria-label','极课项目精选');
  showcase.innerHTML=`
    <section class="jike-opening" id="jike-overview">
      <div class="jike-opening-meta"><span>SELECTED PROJECT / 01</span><span>UI DESIGN · BRAND · IP</span></div>
      <div class="jike-hero-grid">
        <div class="jike-hero-copy"><p class="jike-overline">在线教育 · 移动端体验</p><h1>极课<span>JIKE</span></h1><p class="jike-hero-sub">让学习，<br>更进一步。</p><button class="jike-explore" type="button" data-show-anchor="jike-interface">探索项目</button></div>
        <div class="jike-hero-image"><img src="assets/projects/jike.webp" alt="极课学习 App 界面设计" width="1920" height="1313" loading="lazy"></div>
      </div>
      <div class="jike-opening-end"><span>杨化超 / UI 设计作品</span><span>01 — 03 <i></i> SCROLL TO EXPLORE</span></div>
    </section>
    <section class="jike-statement jike-space" data-show-section>
      <p class="jike-overline">THE PROJECT / 关于极课</p>
      <div><h2>学习，也可以<br>更有<span>吸引力。</span></h2><p class="jike-body">面向年轻学习者的在线教育产品。<br>将课程、直播与社区交流，连接成完整的学习体验。</p></div>
      <dl><div><dt>产品形态</dt><dd>在线教育 App</dd></div><div><dt>设计内容</dt><dd>界面 / 品牌 / IP</dd></div><div><dt>视觉关键词</dt><dd>年轻 · 清晰 · 活力</dd></div></dl>
    </section>
    <section class="jike-interface jike-space" id="jike-interface" data-show-section>
      <div class="jike-section-heading"><p class="jike-overline">01 / DIGITAL EXPERIENCE</p><h2>界面里的每一步。</h2></div>
      <div class="jike-feature-grid">
        <div class="jike-feature-copy"><p class="jike-feature-count">01 <span>/ 04</span></p><h3 id="jike-feature-title">发现你的<br>下一堂好课。</h3><div class="jike-feature-tabs" role="tablist" aria-label="精选界面"><button type="button" role="tab" aria-selected="true" aria-controls="jike-feature-panel" id="jike-tab-0" data-feature="0"><small>01</small> 首页发现</button><button type="button" role="tab" aria-selected="false" tabindex="-1" aria-controls="jike-feature-panel" id="jike-tab-1" data-feature="1"><small>02</small> 课程专题</button><button type="button" role="tab" aria-selected="false" tabindex="-1" aria-controls="jike-feature-panel" id="jike-tab-2" data-feature="2"><small>03</small> 学习社区</button><button type="button" role="tab" aria-selected="false" tabindex="-1" aria-controls="jike-feature-panel" id="jike-tab-3" data-feature="3"><small>04</small> 积分激励</button></div><button class="jike-text-link" type="button" data-full-sheet="6">查看界面设计说明</button></div>
        <div class="jike-feature-panel" id="jike-feature-panel" role="tabpanel" aria-labelledby="jike-tab-0" tabindex="0">${crop(7,1800,1831,'极课首页发现界面','jike-feature-crop')}</div>
      </div>
    </section>
    <section class="jike-brand jike-space" id="jike-brand" data-show-section>
      <div class="jike-section-heading"><p class="jike-overline">02 / BRAND PERSONALITY</p><h2>让品牌，有自己的<span>性格。</span></h2></div>
      <div class="jike-brand-stack">
        <section class="jike-brand-block jike-ip" aria-labelledby="jike-ip-title">
          <header class="jike-brand-block-heading"><h3 id="jike-ip-title"><small>01</small>IP 形象</h3><button class="jike-text-link" type="button" data-full-sheet="5">查看 IP 设计</button></header>
          ${crop(6,540,888,'极小喵品牌 IP 形象')}
        </section>
        <section class="jike-brand-block jike-brand-applications" aria-labelledby="jike-applications-title">
          <header class="jike-brand-block-heading"><h3 id="jike-applications-title"><small>02</small>品牌应用</h3><button class="jike-text-link" type="button" data-full-sheet="4">查看品牌设计</button></header>
          <div class="jike-applications-grid"><figure><div class="jike-application-visual">${crop(5,1437,1185,'极课文创周边和应用图标展示')}</div><figcaption>文创与数字应用</figcaption></figure><figure><div class="jike-application-visual">${crop(5,2622,1349,'极课品牌名片设计')}</div><figcaption>品牌名片</figcaption></figure></div>
        </section>
      </div>
    </section>
    <footer class="jike-ending jike-space"><span class="jike-overline">极课 · 作品结束</span><button class="jike-end-return" type="button">返回作品文件夹</button></footer>`;
  scroll.prepend(showcase);reader.classList.add('is-showcase');
  const actionIcon = (direction='right') => `<svg class="portfolio-icon jike-action-icon is-${direction}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  showcase.querySelectorAll('.jike-text-link').forEach(button=>button.insertAdjacentHTML('beforeend',actionIcon(button.hasAttribute('data-show-anchor')?'up':'right')));
  showcase.querySelectorAll('[data-feature]').forEach(button=>button.insertAdjacentHTML('beforeend',`<span class="jike-tab-indicator" aria-hidden="true">${actionIcon()}</span>`));
  showcase.querySelector('.jike-explore').insertAdjacentHTML('beforeend',actionIcon('down'));
  showcase.querySelector('.jike-end-return').insertAdjacentHTML('beforeend',`<span class="jike-action-disc">${actionIcon('left')}</span>`);
  const mode=document.createElement('button');mode.className='reader-mode';mode.type='button';mode.textContent='查看完整作品';
  reader.querySelector('.reader-tools').prepend(mode);
  const back=reader.querySelector('.reader-back');
  const returnFromDetail=reader.querySelector('.reader-return');
  returnFromDetail.innerHTML=window.portfolioIcon('left')+' 返回项目精选';
  let showcaseScroll=0;
  function setMode(full,index){
    if(full){
      if(reader.classList.contains('is-showcase'))showcaseScroll=scroll.scrollTop;
      reader.classList.remove('is-showcase');showcase.hidden=true;detail.hidden=false;mode.hidden=true;back.innerHTML=window.portfolioIcon('left')+' 返回';
      scroll.scrollTo({top:0,behavior:'instant'});
      if(index!==undefined){const sheet=reader.querySelector(`#jike-sheet-${index}`);scroll.scrollTo({top:sheet.getBoundingClientRect().top-scroll.getBoundingClientRect().top+scroll.scrollTop,behavior:'instant'});}
    }else{
      reader.classList.add('is-showcase');showcase.hidden=false;detail.hidden=true;mode.hidden=false;back.innerHTML=window.portfolioIcon('left')+' 返回作品';scroll.scrollTo({top:showcaseScroll,behavior:'instant'});
    }
    reader.classList.remove('toc-open');reader.querySelector('.reader-menu').setAttribute('aria-expanded','false');
    scroll.dispatchEvent(new Event('scroll'));
    if(!calm.matches)scroll.animate([{opacity:.2},{opacity:1}],{duration:250});
    scroll.focus({preventScroll:true});
  }
  detail.hidden=true;
  mode.addEventListener('click',()=>setMode(true));
  const returnToShowcase=event=>{
    if(reader.classList.contains('is-showcase'))return;
    event.preventDefault();event.stopImmediatePropagation();setMode(false);
  };
  back.addEventListener('click',returnToShowcase,true);
  returnFromDetail.addEventListener('click',returnToShowcase,true);
  reader.addEventListener('cancel',returnToShowcase,true);
  showcase.querySelectorAll('[data-full-sheet]').forEach(button=>button.addEventListener('click',()=>setMode(true,Number(button.dataset.fullSheet))));
  showcase.querySelectorAll('[data-show-anchor]').forEach(button=>button.addEventListener('click',()=>{
    const target=showcase.querySelector('#'+button.dataset.showAnchor);
    scroll.scrollTo({top:target.getBoundingClientRect().top-scroll.getBoundingClientRect().top+scroll.scrollTop,behavior:calm.matches?'instant':'smooth'});
  }));
  showcase.querySelector('.jike-end-return').addEventListener('click',()=>reader.querySelector('.reader-back').click());
  const features=[
    {n:7,y:1800,h:1831,title:'发现你的<br>下一堂好课。',alt:'极课首页发现界面'},
    {n:9,y:0,h:1767,title:'让每一份好奇，<br>找到方向。',alt:'极课课程分类与专题界面'},
    {n:8,y:0,h:2244,title:'学习之外，<br>让交流发生。',alt:'极课学习社区界面'},
    {n:9,y:1767,h:2241,title:'让每一次进步，<br>被看见。',alt:'极课积分签到与排行榜界面'}
  ];
  let active=0;
  const tabs=[...showcase.querySelectorAll('[data-feature]')];
  const panel=showcase.querySelector('.jike-feature-panel');
  const slot=panel.querySelector('.jike-feature-crop');
  function selectFeature(index){
    active=index;const feature=features[index];
    tabs.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
    panel.setAttribute('aria-labelledby',tabs[index].id);
    slot.innerHTML=crop(feature.n,feature.y,feature.h,feature.alt);
    slot.style.aspectRatio=`1920/${feature.h}`;
    showcase.querySelector('.jike-feature-count').innerHTML=`0${index+1} <span>/ 04</span>`;
    showcase.querySelector('#jike-feature-title').innerHTML=feature.title;
    showcase.querySelector('.jike-feature-copy [data-full-sheet]').dataset.fullSheet=String(feature.n-1);
    if(!calm.matches)slot.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'});
  }
  tabs.forEach((button,i)=>{button.addEventListener('click',()=>selectFeature(i));button.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?3:(i+(['ArrowDown','ArrowRight'].includes(event.key)?1:3))%4;selectFeature(next);tabs[next].focus();});});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{root:scroll,threshold:.08});
  showcase.querySelectorAll('[data-show-section]').forEach(section=>observer.observe(section));
})();
