(() => {
  const files = [2300, 2972, 4087, 6435, 4401, 3278, 7399];
  const labels = ["项目开场", "设计展示 02", "设计展示 03", "设计展示 04", "设计展示 05", "设计展示 06", "设计展示 07"];
  const chapters = labels.map((label,i)=>[label,i]);
  const image = n => `assets/projects/oa-detail/${String(n).padStart(2,'0')}.webp`;
  const crop = (n,y,h,alt) => `<div class="flick-crop" style="aspect-ratio:1920/${h}"><img src="${image(n)}" alt="${alt}" width="1920" height="${files[n-1]}" loading="lazy" decoding="async" style="transform:translateY(-${y/files[n-1]*100}%)"></div>`;
  const reader = document.createElement('dialog');
  reader.className = 'project-reader flick-reader remaining-reader is-showcase';
  reader.setAttribute('aria-labelledby','oa-reader-title');
  reader.innerHTML = `
    <header class="reader-bar">
      <button class="reader-back" type="button">${window.portfolioIcon('left')} 返回作品</button>
      <div class="reader-title"><h2 id="oa-reader-title">易乓乒 OA</h2><small>OA SYSTEM</small></div>
      <div class="reader-tools"><button class="flick-mode" type="button">查看完整作品</button><button class="reader-menu" type="button" aria-expanded="false" aria-controls="oa-toc">目录</button></div>
      <div class="reader-progress" role="progressbar" aria-label="作品阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
    </header>
    <div class="reader-scroll" tabindex="0" aria-label="易乓乒 OA 作品正文">
      <article class="flick-showcase" aria-label="易乓乒 OA 项目精选">
<section class="flick-cover"><div class="flick-cover-meta"><span>SELECTED PROJECT / 03</span><span>UI DESIGN · WEB</span></div><div class="flick-cover-copy"><h1>易乓乒 OA<br><span>OA</span></h1><p class="flick-cover-line">让协作，<br>更清楚地发生。</p><button class="flick-pill" type="button" data-target="oa-selection">探索项目 <span aria-hidden="true">${window.portfolioIcon('down')}</span></button></div><div class="flick-cover-image remaining-cover"><img src="assets/projects/oa.webp" alt="易乓乒 OA完整封面" loading="lazy"></div></section>
<section class="flick-section" id="oa-selection"><div class="flick-heading"><p class="flick-overline">01 / SELECTED DESIGN</p><h2>协作，从清晰开始。</h2><p>把日常任务、时间安排与沟通入口放在清楚的位置。</p></div><div class="remaining-selection"><div class="remaining-board">${crop(4,1450,1700,'工作台')}</div><div class="remaining-controls"><p class="flick-overline">03 SELECTED VIEWS</p><h3 class="remaining-caption">从一张工作台，掌握今天的安排。</h3><div class="flick-tabs"><button type="button" data-board="0" aria-pressed="true"><small>01</small>工作台<span aria-hidden="true">${window.portfolioIcon('right')}</span></button><button type="button" data-board="1" aria-pressed="false"><small>02</small>日程面板<span aria-hidden="true">${window.portfolioIcon('right')}</span></button><button type="button" data-board="2" aria-pressed="false"><small>03</small>消息中心<span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div><button class="flick-pill" type="button" data-sheet="3">查看设计详情 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div></div></section><footer class="flick-ending"><span>易乓乒 OA · 作品结束</span><button class="flick-pill flick-exit" type="button">返回作品文件夹 <span aria-hidden="true">${window.portfolioIcon('left')}</span></button></footer>
      </article>
      <div class="reader-layout" hidden><article class="reader-pages" aria-label="易乓乒 OA 完整设计作品">${files.map((height,i)=>`<figure class="reader-sheet" id="oa-sheet-${i}"><img data-src="${image(i+1)}" width="1920" height="${height}" alt="易乓乒 OA · ${labels[i]}" decoding="async" loading="${i===0?'eager':'lazy'}"></figure>`).join('')}<footer class="reader-footer"><p>OA SYSTEM · END OF PROJECT</p><h3>谢谢看到这里。</h3><div><button class="flick-return" type="button">${window.portfolioIcon('left')} 返回项目精选</button><button class="flick-top" type="button">${window.portfolioIcon('up')} 回到顶部</button></div></footer></article><aside class="reader-toc" id="oa-toc"><p class="reader-toc-label">PROJECT INDEX / 项目目录</p><nav aria-label="易乓乒 OA 章节">${chapters.map(([name,index],i)=>`<button type="button" data-chapter="${index}" ${i===0?'aria-current="location"':''}><small>${String(i+1).padStart(2,'0')}</small>${name}</button>`).join('')}</nav><div class="reader-position"><strong>01</strong> / 07</div><p class="reader-hint">向下浏览完整作品</p></aside></div>
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
  window.openOaReader = button => {
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
  const selected = [[4, 1450, 1700, "工作台", "从一张工作台，掌握今天的安排。"], [4, 3150, 1660, "日程面板", "让时间与任务，一起变得清晰。"], [6, 0, 1640, "消息中心", "让沟通回到具体的工作中。"]];
  reader.querySelectorAll('[data-board]').forEach(button=>button.addEventListener('click',()=>{
    const [n,y,h,label,words]=selected[Number(button.dataset.board)];
    reader.querySelector('.remaining-board').innerHTML=crop(n,y,h,label);
    reader.querySelector('.remaining-caption').textContent=words;
    reader.querySelectorAll('[data-board]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    reader.querySelector('.remaining-controls [data-sheet]').dataset.sheet=String(n-1);
  }));
})();
(() => {
  const files = [6079, 3203, 4490, 6043, 7915];
  const labels = ["项目开场", "设计展示 02", "设计展示 03", "设计展示 04", "设计展示 05"];
  const chapters = labels.map((label,i)=>[label,i]);
  const image = n => `assets/projects/dlk-detail/${String(n).padStart(2,'0')}.webp`;
  const crop = (n,y,h,alt) => `<div class="flick-crop" style="aspect-ratio:1920/${h}"><img src="${image(n)}" alt="${alt}" width="1920" height="${files[n-1]}" loading="lazy" decoding="async" style="transform:translateY(-${y/files[n-1]*100}%)"></div>`;
  const reader = document.createElement('dialog');
  reader.className = 'project-reader flick-reader remaining-reader is-showcase';
  reader.setAttribute('aria-labelledby','dlk-reader-title');
  reader.innerHTML = `
    <header class="reader-bar">
      <button class="reader-back" type="button">${window.portfolioIcon('left')} 返回作品</button>
      <div class="reader-title"><h2 id="dlk-reader-title">德丽卡</h2><small>DLK WEBSITE</small></div>
      <div class="reader-tools"><button class="flick-mode" type="button">查看完整作品</button><button class="reader-menu" type="button" aria-expanded="false" aria-controls="dlk-toc">目录</button></div>
      <div class="reader-progress" role="progressbar" aria-label="作品阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
    </header>
    <div class="reader-scroll" tabindex="0" aria-label="德丽卡 作品正文">
      <article class="flick-showcase" aria-label="德丽卡 项目精选">
<section class="flick-cover"><div class="flick-cover-meta"><span>SELECTED PROJECT / 04</span><span>WEB · BRAND</span></div><div class="flick-cover-copy"><h1>德丽卡<br><span>DLK</span></h1><p class="flick-cover-line">让空间，<br>成为品牌的语言。</p><button class="flick-pill" type="button" data-target="dlk-selection">探索项目 <span aria-hidden="true">${window.portfolioIcon('down')}</span></button></div><div class="flick-cover-image remaining-cover"><img src="assets/projects/dlk.webp" alt="德丽卡完整封面" loading="lazy"></div></section>
<section class="flick-section" id="dlk-selection"><div class="flick-heading"><p class="flick-overline">01 / SELECTED DESIGN</p><h2>在空间里，认识品牌。</h2><p>用空间影像建立第一印象，再把浏览引向具体产品。</p></div><div class="remaining-selection"><div class="remaining-board">${crop(3,1200,2460,'首页设计')}</div><div class="remaining-controls"><p class="flick-overline">02 SELECTED VIEWS</p><h3 class="remaining-caption">从空间氛围，走向产品浏览。</h3><div class="flick-tabs"><button type="button" data-board="0" aria-pressed="true"><small>01</small>首页设计<span aria-hidden="true">${window.portfolioIcon('right')}</span></button><button type="button" data-board="1" aria-pressed="false"><small>02</small>产品中心<span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div><button class="flick-pill" type="button" data-sheet="2">查看设计详情 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div></div></section><footer class="flick-ending"><span>德丽卡 · 作品结束</span><button class="flick-pill flick-exit" type="button">返回作品文件夹 <span aria-hidden="true">${window.portfolioIcon('left')}</span></button></footer>
      </article>
      <div class="reader-layout" hidden><article class="reader-pages" aria-label="德丽卡 完整设计作品">${files.map((height,i)=>`<figure class="reader-sheet" id="dlk-sheet-${i}"><img data-src="${image(i+1)}" width="1920" height="${height}" alt="德丽卡 · ${labels[i]}" decoding="async" loading="${i===0?'eager':'lazy'}"></figure>`).join('')}<footer class="reader-footer"><p>DLK WEBSITE · END OF PROJECT</p><h3>谢谢看到这里。</h3><div><button class="flick-return" type="button">${window.portfolioIcon('left')} 返回项目精选</button><button class="flick-top" type="button">${window.portfolioIcon('up')} 回到顶部</button></div></footer></article><aside class="reader-toc" id="dlk-toc"><p class="reader-toc-label">PROJECT INDEX / 项目目录</p><nav aria-label="德丽卡 章节">${chapters.map(([name,index],i)=>`<button type="button" data-chapter="${index}" ${i===0?'aria-current="location"':''}><small>${String(i+1).padStart(2,'0')}</small>${name}</button>`).join('')}</nav><div class="reader-position"><strong>01</strong> / 05</div><p class="reader-hint">向下浏览完整作品</p></aside></div>
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
  window.openDlkReader = button => {
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
  const selected = [[3, 1200, 2460, "首页设计", "从空间氛围，走向产品浏览。"], [4, 2850, 3193, "产品中心", "让不同空间的产品，有清楚的入口。"]];
  reader.querySelectorAll('[data-board]').forEach(button=>button.addEventListener('click',()=>{
    const [n,y,h,label,words]=selected[Number(button.dataset.board)];
    reader.querySelector('.remaining-board').innerHTML=crop(n,y,h,label);
    reader.querySelector('.remaining-caption').textContent=words;
    reader.querySelectorAll('[data-board]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    reader.querySelector('.remaining-controls [data-sheet]').dataset.sheet=String(n-1);
  }));
})();
(() => {
  const files = [2954, 2637, 4500];
  const labels = ["项目开场", "设计展示 02", "设计展示 03"];
  const chapters = labels.map((label,i)=>[label,i]);
  const image = n => `assets/projects/campaign-detail/${String(n).padStart(2,'0')}.webp`;
  const crop = (n,y,h,alt) => `<div class="flick-crop" style="aspect-ratio:1920/${h}"><img src="${image(n)}" alt="${alt}" width="1920" height="${files[n-1]}" loading="lazy" decoding="async" style="transform:translateY(-${y/files[n-1]*100}%)"></div>`;
  const reader = document.createElement('dialog');
  reader.className = 'project-reader flick-reader remaining-reader is-showcase';
  reader.setAttribute('aria-labelledby','campaign-reader-title');
  reader.innerHTML = `
    <header class="reader-bar">
      <button class="reader-back" type="button">${window.portfolioIcon('left')} 返回作品</button>
      <div class="reader-title"><h2 id="campaign-reader-title">燃脂战，赢好礼</h2><small>CAMPAIGN</small></div>
      <div class="reader-tools"><button class="flick-mode" type="button">查看完整作品</button><button class="reader-menu" type="button" aria-expanded="false" aria-controls="campaign-toc">目录</button></div>
      <div class="reader-progress" role="progressbar" aria-label="作品阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
    </header>
    <div class="reader-scroll" tabindex="0" aria-label="燃脂战，赢好礼 作品正文">
      <article class="flick-showcase" aria-label="燃脂战，赢好礼 项目精选">
<section class="flick-cover"><div class="flick-cover-meta"><span>SELECTED PROJECT / 05</span><span>VISUAL · AIGC</span></div><div class="flick-cover-copy"><h1>燃脂战，赢好礼<br><span>CAMPAIGN</span></h1><p class="flick-cover-line">让运动，<br>多一点参与感。</p><button class="flick-pill" type="button" data-target="campaign-selection">探索项目 <span aria-hidden="true">${window.portfolioIcon('down')}</span></button></div><div class="flick-cover-image remaining-cover"><img src="assets/projects/campaign.webp" alt="燃脂战，赢好礼完整封面" loading="lazy"></div></section>
<section class="flick-section" id="campaign-selection"><div class="flick-heading"><p class="flick-overline">01 / SELECTED DESIGN</p><h2>把活力，带进画面。</h2><p>从活动主视觉延伸到参与页面，保持鲜明的运动氛围。</p></div><div class="remaining-selection"><div class="remaining-board">${crop(3,2320,2180,'活动页面')}</div><div class="remaining-controls"><p class="flick-overline">01 SELECTED VIEWS</p><h3 class="remaining-caption">把主题、奖励与参与信息放在一起。</h3><div class="flick-tabs"></div><button class="flick-pill" type="button" data-sheet="2">查看设计详情 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div></div></section><footer class="flick-ending"><span>燃脂战，赢好礼 · 作品结束</span><button class="flick-pill flick-exit" type="button">返回作品文件夹 <span aria-hidden="true">${window.portfolioIcon('left')}</span></button></footer>
      </article>
      <div class="reader-layout" hidden><article class="reader-pages" aria-label="燃脂战，赢好礼 完整设计作品">${files.map((height,i)=>`<figure class="reader-sheet" id="campaign-sheet-${i}"><img data-src="${image(i+1)}" width="1920" height="${height}" alt="燃脂战，赢好礼 · ${labels[i]}" decoding="async" loading="${i===0?'eager':'lazy'}"></figure>`).join('')}<footer class="reader-footer"><p>CAMPAIGN · END OF PROJECT</p><h3>谢谢看到这里。</h3><div><button class="flick-return" type="button">${window.portfolioIcon('left')} 返回项目精选</button><button class="flick-top" type="button">${window.portfolioIcon('up')} 回到顶部</button></div></footer></article><aside class="reader-toc" id="campaign-toc"><p class="reader-toc-label">PROJECT INDEX / 项目目录</p><nav aria-label="燃脂战，赢好礼 章节">${chapters.map(([name,index],i)=>`<button type="button" data-chapter="${index}" ${i===0?'aria-current="location"':''}><small>${String(i+1).padStart(2,'0')}</small>${name}</button>`).join('')}</nav><div class="reader-position"><strong>01</strong> / 03</div><p class="reader-hint">向下浏览完整作品</p></aside></div>
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
  window.openCampaignReader = button => {
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
  const selected = [[3, 2320, 2180, "活动页面", "把主题、奖励与参与信息放在一起。"]];
  reader.querySelectorAll('[data-board]').forEach(button=>button.addEventListener('click',()=>{
    const [n,y,h,label,words]=selected[Number(button.dataset.board)];
    reader.querySelector('.remaining-board').innerHTML=crop(n,y,h,label);
    reader.querySelector('.remaining-caption').textContent=words;
    reader.querySelectorAll('[data-board]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    reader.querySelector('.remaining-controls [data-sheet]').dataset.sheet=String(n-1);
  }));
})();
(() => {
  const files = [2450, 3575];
  const labels = ["项目开场", "设计展示 02"];
  const chapters = labels.map((label,i)=>[label,i]);
  const image = n => `assets/projects/lightfood-detail/${String(n).padStart(2,'0')}.webp`;
  const crop = (n,y,h,alt) => `<div class="flick-crop" style="aspect-ratio:1920/${h}"><img src="${image(n)}" alt="${alt}" width="1920" height="${files[n-1]}" loading="lazy" decoding="async" style="transform:translateY(-${y/files[n-1]*100}%)"></div>`;
  const reader = document.createElement('dialog');
  reader.className = 'project-reader flick-reader remaining-reader is-showcase';
  reader.setAttribute('aria-labelledby','lightfood-reader-title');
  reader.innerHTML = `
    <header class="reader-bar">
      <button class="reader-back" type="button">${window.portfolioIcon('left')} 返回作品</button>
      <div class="reader-title"><h2 id="lightfood-reader-title">轻食燃脂新尚</h2><small>LIGHT FOOD</small></div>
      <div class="reader-tools"><button class="flick-mode" type="button">查看完整作品</button><button class="reader-menu" type="button" aria-expanded="false" aria-controls="lightfood-toc">目录</button></div>
      <div class="reader-progress" role="progressbar" aria-label="作品阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
    </header>
    <div class="reader-scroll" tabindex="0" aria-label="轻食燃脂新尚 作品正文">
      <article class="flick-showcase" aria-label="轻食燃脂新尚 项目精选">
<section class="flick-cover"><div class="flick-cover-meta"><span>SELECTED PROJECT / 06</span><span>VISUAL · CAMPAIGN</span></div><div class="flick-cover-copy"><h1>轻食燃脂新尚<br><span>LIGHT</span></h1><p class="flick-cover-line">让轻食，<br>有新鲜的表达。</p><button class="flick-pill" type="button" data-target="lightfood-selection">探索项目 <span aria-hidden="true">${window.portfolioIcon('down')}</span></button></div><div class="flick-cover-image remaining-cover"><img src="assets/projects/lightfood.webp" alt="轻食燃脂新尚完整封面" loading="lazy"></div></section>
<section class="flick-section" id="lightfood-selection"><div class="flick-heading"><p class="flick-overline">01 / SELECTED DESIGN</p><h2>让日常，多一点新鲜。</h2><p>人物、食物与醒目标题，共同构成活动的第一眼印象。</p></div><div class="remaining-selection"><div class="remaining-board">${crop(1,900,850,'活动主视觉')}</div><div class="remaining-controls"><p class="flick-overline">01 SELECTED VIEWS</p><h3 class="remaining-caption">让主题与角色，一眼被记住。</h3><div class="flick-tabs"></div><button class="flick-pill" type="button" data-sheet="0">查看设计详情 <span aria-hidden="true">${window.portfolioIcon('right')}</span></button></div></div></section><footer class="flick-ending"><span>轻食燃脂新尚 · 作品结束</span><button class="flick-pill flick-exit" type="button">返回作品文件夹 <span aria-hidden="true">${window.portfolioIcon('left')}</span></button></footer>
      </article>
      <div class="reader-layout" hidden><article class="reader-pages" aria-label="轻食燃脂新尚 完整设计作品">${files.map((height,i)=>`<figure class="reader-sheet" id="lightfood-sheet-${i}"><img data-src="${image(i+1)}" width="1920" height="${height}" alt="轻食燃脂新尚 · ${labels[i]}" decoding="async" loading="${i===0?'eager':'lazy'}"></figure>`).join('')}<footer class="reader-footer"><p>LIGHT FOOD · END OF PROJECT</p><h3>谢谢看到这里。</h3><div><button class="flick-return" type="button">${window.portfolioIcon('left')} 返回项目精选</button><button class="flick-top" type="button">${window.portfolioIcon('up')} 回到顶部</button></div></footer></article><aside class="reader-toc" id="lightfood-toc"><p class="reader-toc-label">PROJECT INDEX / 项目目录</p><nav aria-label="轻食燃脂新尚 章节">${chapters.map(([name,index],i)=>`<button type="button" data-chapter="${index}" ${i===0?'aria-current="location"':''}><small>${String(i+1).padStart(2,'0')}</small>${name}</button>`).join('')}</nav><div class="reader-position"><strong>01</strong> / 02</div><p class="reader-hint">向下浏览完整作品</p></aside></div>
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
  window.openLightfoodReader = button => {
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
  const selected = [[1, 900, 850, "活动主视觉", "让主题与角色，一眼被记住。"]];
  reader.querySelectorAll('[data-board]').forEach(button=>button.addEventListener('click',()=>{
    const [n,y,h,label,words]=selected[Number(button.dataset.board)];
    reader.querySelector('.remaining-board').innerHTML=crop(n,y,h,label);
    reader.querySelector('.remaining-caption').textContent=words;
    reader.querySelectorAll('[data-board]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    reader.querySelector('.remaining-controls [data-sheet]').dataset.sheet=String(n-1);
  }));
})();
