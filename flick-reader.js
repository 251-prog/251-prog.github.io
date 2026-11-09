(() => {
  const files = [3380, 3223, 11597, 3297, 4519, 3842, 4413, 6800];
  const labels = ['项目介绍', '用户与原型', '品牌与 IP', '设计规范', '首页与会员', '健康计划与发现', '组件展示', '记录与页面总览'];
  const chapters = [['项目介绍',0],['用户与原型',1],['品牌与 IP',2],['设计规范',3],['核心界面',4],['组件与页面',6]];
  const image = n => `assets/projects/flick-detail/${String(n).padStart(2,'0')}.webp`;
  const crop = (n,y,h,alt) => `<div class="flick-crop" style="aspect-ratio:1920/${h}"><img src="${image(n)}" alt="${alt}" width="1920" height="${files[n-1]}" loading="lazy" decoding="async" style="transform:translateY(-${y/files[n-1]*100}%)"></div>`;
  const reader = document.createElement('dialog');
  reader.className = 'project-reader flick-reader is-showcase';
  reader.setAttribute('aria-labelledby','flick-reader-title');
  reader.innerHTML = `
    <header class="reader-bar">
      <button class="reader-back" type="button">${window.portfolioIcon('left')} 返回作品</button>
      <div class="reader-title"><h2 id="flick-reader-title">轻动 App</h2><small>FLICK / UI DESIGN</small></div>
      <div class="reader-tools"><button class="flick-mode" type="button">查看完整作品</button><button class="reader-menu" type="button" aria-expanded="false" aria-controls="flick-toc">目录</button></div>
      <div class="reader-progress" role="progressbar" aria-label="作品阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
    </header>
    <div class="reader-scroll" tabindex="0" aria-label="轻动 App 作品正文">
      <article class="flick-showcase" aria-label="轻动 App 项目精选">
        <section class="flick-cover">
          <div class="flick-cover-meta"><span>SELECTED PROJECT / 02</span><span>UI DESIGN · BRAND · IP</span></div>
          <div class="flick-cover-copy"><h1>轻动<br><span>App.</span></h1><p class="flick-cover-line">让轻运动，<br>更容易开始。</p><button class="flick-pill flick-explore" type="button" data-target="flick-story">探索项目 <span aria-hidden="true">${window.portfolioIcon('down')}</span></button></div>
          <div class="flick-cover-image"><img src="assets/projects/flick.webp" alt="轻动 App 项目完整封面" width="1920" height="1934" loading="lazy"></div>
        </section>
        <section class="flick-section flick-story" id="flick-story">
          <p class="flick-overline">THE IDEA / 项目起点</p>
          <div class="flick-story-main"><h2>把运动和饮食，<br><span>放进同一种日常。</span></h2><div><p>轻动将运动课程与轻食内容放在一起，为忙碌的人提供更容易开始、也更容易坚持的健康生活方式。</p><dl><div><dt>产品方向</dt><dd>运动课程 · 轻食内容</dd></div><div><dt>设计范围</dt><dd>品牌视觉 · App 界面 · IP</dd></div></dl></div></div>
        </section>
        <section class="flick-section flick-people" id="flick-people"><div class="flick-heading"><p class="flick-overline">01 / USER & STRUCTURE</p><h2>从真实的生活节奏出发。</h2><p>用户画像与低保真原型，帮助产品找到更清楚的入口和使用路径。</p></div>${crop(2,0,1380,'轻动 App 用户画像：三类运动需求')}<button class="flick-pill flick-outline" type="button" data-sheet="1">查看用户与原型 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></section>
        <section class="flick-section flick-interface" id="flick-interface"><div class="flick-heading"><p class="flick-overline">02 / DIGITAL EXPERIENCE</p><h2>每一步，都有继续的理由。</h2><p>首页、会员、健康计划与发现，把运动内容、个人进度和互动连接起来。</p></div><div class="flick-feature-grid"><div class="flick-feature-visual" id="flick-feature-panel" role="tabpanel" aria-labelledby="flick-tab-0">${crop(5,0,2100,'轻动 App 首页界面设计')}</div><div class="flick-feature-copy"><p class="flick-feature-count">01 <span>/ 04</span></p><h3 id="flick-feature-title">找到今天<br>想开始的运动。</h3><div class="flick-tabs" role="tablist" aria-label="轻动精选界面"><button id="flick-tab-0" type="button" role="tab" aria-selected="true" aria-controls="flick-feature-panel" data-feature="0"><small>01</small>首页 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button><button id="flick-tab-1" type="button" role="tab" aria-selected="false" tabindex="-1" aria-controls="flick-feature-panel" data-feature="1"><small>02</small>会员 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button><button id="flick-tab-2" type="button" role="tab" aria-selected="false" tabindex="-1" aria-controls="flick-feature-panel" data-feature="2"><small>03</small>健康计划 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button><button id="flick-tab-3" type="button" role="tab" aria-selected="false" tabindex="-1" aria-controls="flick-feature-panel" data-feature="3"><small>04</small>发现 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div><button class="flick-pill flick-outline" type="button" data-sheet="4">查看界面设计 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div></div></section>
        <section class="flick-section flick-brand" id="flick-brand"><div class="flick-heading"><p class="flick-overline">03 / BRAND & CHARACTER</p><h2>让轻动，有可以记住的样子。</h2><p>品牌应用与角色形象，延续产品轻快、亲近的气质。</p></div><div class="flick-brand-grid"><div><div class="flick-brand-frame">${crop(3,1840,1720,'轻动品牌设计与完整水杯应用')}</div><p>品牌应用</p></div><div><div class="flick-brand-frame">${crop(3,7160,1050,'轻动小鹿角色的完整形象与介绍')}</div><p>角色与延展</p></div></div><button class="flick-pill flick-outline" type="button" data-sheet="2">查看品牌与 IP <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></section>
        <footer class="flick-ending"><span>轻动 App · 作品结束</span><button class="flick-pill flick-outline flick-exit" type="button">返回作品文件夹 <span aria-hidden="true">${window.portfolioIcon('left')}</span></button></footer>
      </article>
      <div class="reader-layout" hidden><article class="reader-pages" aria-label="轻动 App 完整设计作品">${files.map((height,i)=>`<figure class="reader-sheet" id="flick-sheet-${i}"><img data-src="${image(i+1)}" width="1920" height="${height}" alt="轻动 App · ${labels[i]}" decoding="async" loading="${i===0?'eager':'lazy'}"></figure>`).join('')}<footer class="reader-footer"><p>FLICK · END OF PROJECT</p><h3>谢谢看到这里。</h3><div><button class="flick-return" type="button">${window.portfolioIcon('left')} 返回项目精选</button><button class="flick-top" type="button">${window.portfolioIcon('up')} 回到顶部</button></div></footer></article><aside class="reader-toc" id="flick-toc"><p class="reader-toc-label">PROJECT INDEX / 项目目录</p><nav aria-label="轻动 App 章节">${chapters.map(([name,index],i)=>`<button type="button" data-chapter="${index}" ${i===0?'aria-current="location"':''}><small>${String(i+1).padStart(2,'0')}</small>${name}</button>`).join('')}</nav><div class="reader-position"><strong>01</strong> / 08</div><p class="reader-hint">向下浏览完整作品</p></aside></div>
    </div>`;
  document.body.append(reader);
  const scroll = reader.querySelector('.reader-scroll');
  const showcase = reader.querySelector('.flick-showcase');
  const detail = reader.querySelector('.reader-layout');
  const mode = reader.querySelector('.flick-mode');
  const back = reader.querySelector('.reader-back');
  const menu = reader.querySelector('.reader-menu');
  const progress = reader.querySelector('.reader-progress');
  const calm = matchMedia('(prefers-reduced-motion:reduce)');
  const sheets = [...reader.querySelectorAll('.reader-sheet')];
  let opener, showcaseScroll = 0, full = false, busy = false;
  function update() {
    const amount = Math.min(1, scroll.scrollTop/Math.max(1,scroll.scrollHeight-scroll.clientHeight));
    progress.style.transform = `scaleX(${amount})`;
    progress.setAttribute('aria-valuenow',String(Math.round(amount*100)));
    if (!full) return;
    const top = scroll.getBoundingClientRect().top;
    let page = 0;
    sheets.forEach((sheet,i)=>{if(sheet.getBoundingClientRect().top<=top+scroll.clientHeight*.25)page=i;});
    reader.querySelector('.reader-position strong').textContent = String(page+1).padStart(2,'0');
    let current = 0;
    chapters.forEach(([,index],i)=>{if(index<=page)current=i;});
    reader.querySelectorAll('[data-chapter]').forEach((button,i)=>{if(i===current)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current');});
  }
  scroll.addEventListener('scroll',update,{passive:true});
  function showFull(index) {
    showcaseScroll = scroll.scrollTop;
    full = true;
    showcase.hidden = true;
    detail.hidden = false;
    mode.hidden = true;
    menu.hidden = false;
    back.innerHTML = window.portfolioIcon('left') + ' 返回';
    reader.classList.remove('is-showcase','toc-open');
    menu.setAttribute('aria-expanded','false');
    reader.querySelectorAll('img[data-src]').forEach(img=>{if(!img.src)img.src=img.dataset.src;});
    scroll.scrollTop = 0;
    if (index !== undefined) requestAnimationFrame(()=>{const target=sheets[index];scroll.scrollTop=target.getBoundingClientRect().top-scroll.getBoundingClientRect().top+scroll.scrollTop;update();});
    else update();
    scroll.focus({preventScroll:true});
  }
  function showCurated() {
    full = false;
    showcase.hidden = false;
    detail.hidden = true;
    mode.hidden = false;
    menu.hidden = true;
    back.innerHTML = window.portfolioIcon('left') + ' 返回作品';
    reader.classList.add('is-showcase');reader.classList.remove('toc-open');
    menu.setAttribute('aria-expanded','false');
    scroll.scrollTop = showcaseScroll;update();scroll.focus({preventScroll:true});
  }
  function close() {
    if (busy) return;
    busy = true;
    reader.close();
    document.body.classList.remove('dialog-open');
    opener?.focus({preventScroll:true});
    busy = false;
  }
  window.openFlickReader = button => {
    if (reader.open) return;
    opener = button; showcaseScroll=0;showCurated();
    reader.showModal();document.body.classList.add('dialog-open');scroll.scrollTop=0;update();back.focus({preventScroll:true});
  };
  back.addEventListener('click',()=>full?showCurated():close());
  reader.querySelector('.flick-exit').addEventListener('click',close);
  reader.querySelector('.flick-return').addEventListener('click',showCurated);
  reader.querySelector('.flick-top').addEventListener('click',()=>scroll.scrollTo({top:0,behavior:calm.matches?'instant':'smooth'}));
  mode.addEventListener('click',()=>showFull());
  reader.addEventListener('cancel',event=>{event.preventDefault();full?showCurated():close();});
  reader.querySelectorAll('[data-sheet]').forEach(button=>button.addEventListener('click',()=>showFull(Number(button.dataset.sheet))));
  reader.querySelectorAll('[data-target]').forEach(button=>button.addEventListener('click',()=>{const target=reader.querySelector('#'+button.dataset.target);scroll.scrollTo({top:target.getBoundingClientRect().top-scroll.getBoundingClientRect().top+scroll.scrollTop,behavior:calm.matches?'instant':'smooth'});}));
  reader.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>{const target=sheets[Number(button.dataset.chapter)];scroll.scrollTo({top:target.getBoundingClientRect().top-scroll.getBoundingClientRect().top+scroll.scrollTop,behavior:calm.matches?'instant':'smooth'});reader.classList.remove('toc-open');menu.setAttribute('aria-expanded','false');}));
  menu.addEventListener('click',()=>{const expanded=reader.classList.toggle('toc-open');menu.setAttribute('aria-expanded',String(expanded));});
  const features = [
    [5,0,'找到今天\n想开始的运动。','轻动 App 首页界面设计'],
    [5,2020,'把个人进度\n放在手边。','轻动 App 会员界面设计'],
    [6,0,'让计划\n变成每天的行动。','轻动 App 健康计划界面设计'],
    [6,1740,'发现更多\n值得坚持的方式。','轻动 App 发现界面设计']
  ];
  const panel = reader.querySelector('#flick-feature-panel');
  const title = reader.querySelector('#flick-feature-title');
  const count = reader.querySelector('.flick-feature-count');
  const tabs = [...reader.querySelectorAll('[data-feature]')];
  function selectFeature(index) {
    const [n,y,words,alt] = features[index];
    panel.innerHTML = crop(n,y,2100,alt);
    panel.setAttribute('aria-labelledby',tabs[index].id);
    title.innerHTML = words.replace('\n','<br>');
    count.innerHTML = `${String(index+1).padStart(2,'0')} <span>/ 04</span>`;
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  }
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectFeature(i));tab.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const next=(i+(event.key==='ArrowDown'||event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;selectFeature(next);tabs[next].focus();});});
})();
