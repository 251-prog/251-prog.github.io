(() => {
  const heights = [2947,2814,3880,2379,3971,4304,3631,4875,5676,5491];
  const chapters = [
    ['项目概述',0],['用户与竞品',1],['设计规范',2],['原型设计',3],
    ['品牌与 IP',4],['界面展示',6],['页面总览',9]
  ];
  const descriptions = ['项目封面与项目介绍','竞品分析与用户画像','色彩、字体与图标规范','产品原型','品牌设计与应用','角色 IP 与空状态','界面设计与首页介绍','核心功能界面','课程与社区界面','全部页面与结语'];
  const image=(n)=>`assets/projects/jike-detail/${String(n).padStart(2,'0')}.webp`;
  const reader = document.createElement('dialog');
  reader.className='project-reader';
  reader.setAttribute('aria-labelledby','reader-title');
  reader.innerHTML=`
    <header class="reader-bar">
      <button class="reader-back" type="button">${window.portfolioIcon('left')} 返回作品</button>
      <div class="reader-title"><h2 id="reader-title">极课</h2><small>JIKE / UI DESIGN</small></div>
      <div class="reader-tools"><button class="reader-menu" type="button" aria-expanded="false" aria-controls="reader-toc">目录</button></div>
      <div class="reader-progress" role="progressbar" aria-label="作品阅读进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
    </header>
    <div class="reader-scroll" tabindex="0" aria-label="极课作品正文">
      <div class="reader-layout">
        <article class="reader-pages" aria-label="极课完整设计作品">
          ${heights.map((height,i)=>`<figure class="reader-sheet" id="jike-sheet-${i}"><img data-src="${image(i+1)}" width="1920" height="${height}" alt="极课 · ${descriptions[i]}" decoding="async" loading="${i===0?'eager':'lazy'}"></figure>`).join('')}
          <footer class="reader-footer"><p>JIKE · END OF PROJECT</p><h3>谢谢看到这里。</h3><div><button class="reader-return" type="button">${window.portfolioIcon('left')} 返回作品文件夹</button><button class="reader-top" type="button">${window.portfolioIcon('up')} 回到顶部</button></div></footer>
        </article>
        <aside class="reader-toc" id="reader-toc"><p class="reader-toc-label">PROJECT INDEX / 项目目录</p><nav aria-label="极课章节">${chapters.map(([name,index],i)=>`<button type="button" data-sheet="${index}" ${i===0?'aria-current="location"':''}><small>${String(i+1).padStart(2,'0')}</small>${name}</button>`).join('')}</nav><div class="reader-position"><strong>01</strong> / 10</div><p class="reader-hint">向下浏览完整作品</p></aside>
      </div>
    </div>`;
  document.body.append(reader);
  const scroller=reader.querySelector('.reader-scroll');
  const sheets=[...reader.querySelectorAll('.reader-sheet')];
  const menu=reader.querySelector('.reader-menu');
  const progress=reader.querySelector('.reader-progress');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let opener=null, savedScroll=0, closing=false, opening=false;
  let scrollFrame=0;
  function update(){
    const top=scroller.getBoundingClientRect().top;
    let page=0;
    sheets.forEach((sheet,i)=>{if(sheet.getBoundingClientRect().top<=top+scroller.clientHeight*.25)page=i;});
    let current=0;
    chapters.forEach(([,index],i)=>{if(index<=page)current=i;});
    reader.querySelectorAll('[data-sheet]').forEach((button,i)=>{if(i===current)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current');});
    reader.querySelector('.reader-position strong').textContent=String(page+1).padStart(2,'0');
    const percentage=Math.min(100,Math.max(0,scroller.scrollTop/Math.max(1,scroller.scrollHeight-scroller.clientHeight)*100));
    progress.style.transform=`scaleX(${percentage/100})`;
    progress.setAttribute('aria-valuenow',String(Math.round(percentage)));
  }
  scroller.addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(update);},{passive:true});
  window.addEventListener('resize',()=>{if(reader.open)update();});
  window.openJikeReader=async button=>{
    if(reader.open||opening)return;
    opening=true;opener=button;
    const paper=button.querySelector('.folio-paper');
    if(paper&&!reduced.matches)await paper.animate([{transform:getComputedStyle(paper).transform},{transform:'translateY(-12px) rotate(0deg) scale(1.04)'}],{duration:170,easing:'ease-out'}).finished;
    reader.showModal();
    document.body.classList.add('dialog-open');
    reader.querySelectorAll('img[data-src]').forEach(img=>{if(!img.src)img.src=img.dataset.src;});
    scroller.scrollTop=savedScroll;
    if(!reduced.matches)reader.animate([{opacity:0,transform:'translateY(24px) scale(.985)'},{opacity:1,transform:'none'}],{duration:340,easing:'cubic-bezier(.2,.75,.2,1)'});
    reader.querySelector('.reader-back').focus({preventScroll:true});
    update();opening=false;
  };
  async function close(){
    if(closing)return;closing=true;savedScroll=scroller.scrollTop;
    if(!reduced.matches)await reader.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(16px) scale(.99)'}],{duration:180,easing:'ease-in'}).finished;
    reader.close();closing=false;
  }
  reader.querySelectorAll('.reader-back,.reader-return').forEach(button=>button.addEventListener('click',close));
  reader.addEventListener('cancel',event=>{event.preventDefault();close();});
  reader.addEventListener('close',()=>{document.body.classList.remove('dialog-open');reader.classList.remove('toc-open');menu.setAttribute('aria-expanded','false');opener?.focus({preventScroll:true});});
  function goTo(index){
    const target=sheets[index];
    scroller.scrollTo({top:target.getBoundingClientRect().top-scroller.getBoundingClientRect().top+scroller.scrollTop,behavior:reduced.matches?'instant':'smooth'});
    reader.classList.remove('toc-open');menu.setAttribute('aria-expanded','false');
  }
  reader.querySelectorAll('[data-sheet]').forEach(button=>button.addEventListener('click',()=>goTo(Number(button.dataset.sheet))));
  reader.querySelector('.reader-top').addEventListener('click',()=>scroller.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
  menu.addEventListener('click',()=>{const open=reader.classList.toggle('toc-open');menu.setAttribute('aria-expanded',String(open));});
})();
