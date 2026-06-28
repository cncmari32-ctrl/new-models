gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============ Apply config ============ */
const CFG = window.WEDDING_CONFIG || {};
document.body.setAttribute('data-theme', CFG.THEME || 'blue');

const cfgMap = {
  eyebrow: CFG.display?.eyebrow,
  nameOne: CFG.names?.one,
  nameTwo: CFG.names?.two,
  monogram: CFG.names?.monogram,
  pretty: CFG.display?.pretty,
  quote: CFG.quote,
  deadline: CFG.rsvpDeadline,
  ceremonyTitle: CFG.ceremony?.title, ceremonyTime: CFG.ceremony?.time, ceremonyPlace: CFG.ceremony?.place,
  receptionTitle: CFG.reception?.title, receptionTime: CFG.reception?.time, receptionPlace: CFG.reception?.place,
  venue: CFG.address?.venue, addrLine: CFG.address?.line,
  dressLabel: CFG.dressCode?.[CFG.THEME]?.label,
};
document.querySelectorAll('[data-cfg]').forEach((el)=>{
  const v = cfgMap[el.dataset.cfg];
  if (v != null) el.innerHTML = v;
});

/* Dress code swatches */
(function(){
  const wrap=document.getElementById('dressSwatches');
  const colors=CFG.dressCode?.[CFG.THEME]?.colors||[];
  if(wrap) colors.forEach((c)=>{const s=document.createElement('span');s.className='dress__swatch';s.style.background=c;wrap.appendChild(s);});
})();

/* Map embed + directions */
(function(){
  const q=encodeURIComponent(CFG.address?.query||'');
  const frame=document.getElementById('mapFrame');
  const dir=document.getElementById('mapDirections');
  if(frame&&q) frame.src='https://www.google.com/maps?q='+q+'&output=embed';
  if(dir&&q) dir.href='https://www.google.com/maps/dir/?api=1&destination='+q;
})();

/* Split hero names */
document.querySelectorAll('[data-split]').forEach((el)=>{el.innerHTML=el.textContent.split('').map((c)=>`<span class="char">${c}</span>`).join('');});

/* Loader -> hero */
function intro(){
  const tl=gsap.timeline();
  tl.to('.loader__cloud',{x:60,duration:1.2,ease:'sine.inOut'})
    .to('.loader',{opacity:0,duration:.6,onComplete:()=>{document.getElementById('loader').style.display='none';ScrollTrigger.refresh();}},'-=.2')
    .add(heroIn,'-=.2');
}
function heroIn(){
  const tl=gsap.timeline();
  tl.to('.sky__name .char',{y:0,duration:1,stagger:.04,ease:'power4.out'})
    .to('.sky__eyebrow',{opacity:1,y:0,duration:.8},'-=.8')
    .to('.sky__hint',{opacity:1,y:0,duration:.8},'-=.5');
}
gsap.set('.sky__eyebrow,.sky__hint',{y:20});

/* DECORATION on scroll (pin the hero). Behaviour depends on theme:
   - blue (clouds): part outward to reveal
   - red/white (flowers): bloom & grow from small to full as you scroll */
const sky=document.getElementById('sky');
if(sky){
  const theme=CFG.THEME||'blue';
  const vis=(sel)=>gsap.utils.toArray(sel).filter((el)=>getComputedStyle(el).display!=='none');
  const ct=gsap.timeline({scrollTrigger:{trigger:'.sky',start:'top top',end:'+=120%',pin:true,scrub:1}});

  if(theme==='blue'){
    /* clouds part outward */
    ct.to(vis('.deco--l'),{xPercent:-120,rotation:-8,ease:'none'},0)
      .to(vis('.deco--r'),{xPercent:120,rotation:8,ease:'none'},0)
      .to(vis('.deco--bl'),{yPercent:80,xPercent:-40,ease:'none'},0)
      .to(vis('.deco--br'),{yPercent:80,xPercent:40,ease:'none'},0)
      .to('.sky__center',{scale:1.08,opacity:0,ease:'none'},0)
      .to('.sky__sun',{scale:1.3,opacity:.4,ease:'none'},0);
    gsap.to(vis('.deco--l'),{x:'+=14',duration:6,repeat:-1,yoyo:true,ease:'sine.inOut'});
    gsap.to(vis('.deco--r'),{x:'-=14',duration:7,repeat:-1,yoyo:true,ease:'sine.inOut'});
  } else {
    /* flowers bloom: start tiny + faded, grow to full while gently rotating */
    const flowers=vis('.deco');
    gsap.set(flowers,{scale:.15,opacity:0,transformOrigin:'center center'});
    flowers.forEach((f,i)=>{
      ct.to(f,{scale:1,opacity:1,rotation:(i%2?6:-6),ease:'power2.out'},0);
    });
    ct.to('.sky__center',{y:-10,ease:'none'},0);
    /* gentle idle sway after bloom */
    flowers.forEach((f,i)=>gsap.to(f,{rotation:(i%2?'+=3':'-=3'),duration:5+i,repeat:-1,yoyo:true,ease:'sine.inOut'}));
  }
}

/* Parallax */
gsap.utils.toArray('[data-speed]').forEach((el)=>{const s=parseFloat(el.dataset.speed);gsap.to(el,{yPercent:(1-s)*30,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}});});

/* Split-word quote */
const quote=document.querySelector('.split-words');
if(quote){quote.innerHTML=quote.textContent.trim().split(' ').map((w)=>`<span class="word">${w}</span>`).join(' ');gsap.to('.split-words .word',{opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:'.reveal',start:'top 70%',end:'bottom 75%',scrub:true}});}

/* data-fade reveals */
gsap.utils.toArray('[data-fade]').forEach((el)=>{gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}});});

/* SCRATCH TO REVEAL */
(function scratch(){
  const card=document.getElementById('scratchCard');
  const canvas=document.getElementById('scratchCanvas');
  const done=document.getElementById('scratchDone');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let drawing=false,revealed=false;
  function size(){
    const r=card.getBoundingClientRect();
    canvas.width=r.width;canvas.height=r.height;
    const g=ctx.createLinearGradient(0,0,r.width,r.height);
    g.addColorStop(0,'#9fd0ef');g.addColorStop(1,'#1f6fb2');
    ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);
    ctx.fillStyle='rgba(255,255,255,.9)';ctx.font='600 14px Jost, sans-serif';ctx.textAlign='center';
    ctx.fillText('SCRATCH HERE',r.width/2,r.height/2);
    ctx.globalCompositeOperation='destination-out';
  }
  function pos(e){const r=canvas.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};}
  function scratchAt(p){ctx.beginPath();ctx.arc(p.x,p.y,26,0,Math.PI*2);ctx.fill();}
  function pct(){const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<d.length;i+=40)if(d[i]===0)clear++;return clear/(d.length/40);}
  function check(){if(revealed)return;if(pct()>.5){revealed=true;gsap.to(canvas,{opacity:0,duration:.6,onComplete:()=>canvas.style.display='none'});done.classList.add('is-visible');}}
  function start(e){drawing=true;scratchAt(pos(e));}
  function move(e){if(!drawing)return;e.preventDefault();scratchAt(pos(e));}
  function end(){if(!drawing)return;drawing=false;check();}
  size();window.addEventListener('resize',size);
  canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',end);
})();

/* 3D tilt cards */
gsap.utils.toArray('[data-tilt]').forEach((card)=>{
  card.addEventListener('pointermove',(e)=>{const r=card.getBoundingClientRect();const rx=((e.clientY-r.top)/r.height-.5)*-8;const ry=((e.clientX-r.left)/r.width-.5)*8;gsap.to(card,{rotateX:rx,rotateY:ry,duration:.4,ease:'power2.out',transformPerspective:800});});
  card.addEventListener('pointerleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'power3.out'}));
});

/* Countdown */
const WEDDING_DATE=new Date('2026-09-26T16:00:00').getTime();
const U={days:864e5,hours:36e5,minutes:6e4,seconds:1e3};
const cd={};document.querySelectorAll('[data-unit]').forEach((el)=>cd[el.dataset.unit]=el);
function tick(){let d=Math.max(0,WEDDING_DATE-Date.now());const o={};o.days=Math.floor(d/U.days);d%=U.days;o.hours=Math.floor(d/U.hours);d%=U.hours;o.minutes=Math.floor(d/U.minutes);d%=U.minutes;o.seconds=Math.floor(d/U.seconds);for(const k in cd){const v=String(o[k]).padStart(2,'0');if(cd[k].textContent!==v)cd[k].textContent=v;}}
setInterval(tick,1000);tick();
gsap.from('.cd',{opacity:0,y:30,scale:.9,duration:.8,stagger:.12,ease:'back.out(1.6)',scrollTrigger:{trigger:'.countdown',start:'top 75%'}});

/* Horizontal gallery + mask reveal */
const track=document.getElementById('galleryTrack');
if(track){
  const amt=()=>track.scrollWidth-window.innerWidth;
  gsap.to(track,{x:()=>-amt(),ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:()=>'+='+amt(),pin:true,scrub:1,invalidateOnRefresh:true}});
  gsap.utils.toArray('.gallery__img').forEach((img)=>{gsap.to(img,{scale:1,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:()=>'+='+amt(),scrub:1}});});
}

/* Progress bar */
gsap.to('#progressBar',{width:'100%',ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});

/* RSVP */
const form=document.getElementById('rsvpForm');
const success=document.getElementById('rsvpSuccess');
form?.addEventListener('submit',(e)=>{
  e.preventDefault();
  if(!form.checkValidity()){gsap.fromTo(form,{x:-8},{x:0,duration:.4,ease:'elastic.out(1,0.3)'});form.reportValidity();return;}
  const data=Object.fromEntries(new FormData(form).entries());
  try{localStorage.setItem('rsvp',JSON.stringify(data));}catch(_){}
  /* Send to Google Sheet if endpoint configured (see README) */
  const endpoint=CFG.rsvpEndpoint;
  if(endpoint){
    const body=new URLSearchParams(data);
    fetch(endpoint,{method:'POST',body}).catch(()=>{});
  }
  gsap.to(form,{opacity:0,y:-20,duration:.5,ease:'power2.in',onComplete:()=>{form.style.display='none';success.classList.add('is-visible');gsap.from(success,{opacity:0,y:20,duration:.7,ease:'power3.out'});gsap.from('.rsvp__check',{scale:0,rotate:-45,duration:.7,ease:'back.out(2)'});}});
});

/* Init */
window.addEventListener('load',intro);
