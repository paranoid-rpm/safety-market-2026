document.addEventListener('DOMContentLoaded',()=>{
  const header=document.querySelector('.site-header');
  const menuBtn=document.querySelector('.menu-btn');
  const nav=document.querySelector('.nav');
  const setHeader=()=>header?.classList.toggle('scrolled',scrollY>24);
  setHeader(); addEventListener('scroll',setHeader,{passive:true});
  menuBtn?.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')!=='true';menuBtn.setAttribute('aria-expanded',String(open));nav?.classList.toggle('open',open);document.body.classList.toggle('menu-open',open)});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuBtn?.setAttribute('aria-expanded','false');nav.classList.remove('open');document.body.classList.remove('menu-open')}));
  addEventListener('keydown',e=>{if(e.key==='Escape'){menuBtn?.setAttribute('aria-expanded','false');nav?.classList.remove('open');document.body.classList.remove('menu-open')}});
  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
  const animateNumber=el=>{const end=Number(el.dataset.count);const suffix=el.dataset.suffix||'';const start=performance.now();const run=now=>{const p=Math.min((now-start)/1100,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+suffix;if(p<1)requestAnimationFrame(run)};requestAnimationFrame(run)};
  const counterObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animateNumber(e.target);counterObs.unobserve(e.target)}}),{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el=>counterObs.observe(el));
  const filters=document.querySelectorAll('.filter-btn');
  const products=document.querySelectorAll('.product');
  filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});btn.classList.add('active');btn.setAttribute('aria-pressed','true');const value=btn.dataset.filter;products.forEach(card=>card.classList.toggle('hidden',value!=='all'&&card.dataset.category!==value))}));
  document.querySelectorAll('.details-btn').forEach(btn=>btn.addEventListener('click',()=>{const panel=document.getElementById(btn.getAttribute('aria-controls'));const open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!open));panel.style.maxHeight=open?'0px':panel.scrollHeight+'px'}));
  const line=document.querySelector('.history-line');
  if(line){const progress=()=>{const r=line.getBoundingClientRect();const p=Math.max(0,Math.min(100,((innerHeight*.55-r.top)/r.height)*100));line.style.setProperty('--timeline-progress',p+'%')};progress();addEventListener('scroll',progress,{passive:true})}
});
