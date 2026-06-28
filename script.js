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
  envNote: CFG.envelope?.note,
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

/* Split hero names into chars */
document.querySelectorAll('[data-split]').forEach((el)=>{el.innerHTML=el.textContent.split('').map((c)=>`<span class=\"char\">${c===' '?'&nbsp;':c}</span>`).join('');});

/* ============ Envelope intro ============ */
let introStarted=false;
(function envelope(){
  const stage=document.getElementById('envelopeStage');
  const enabled=CFG.envelope?.enabled!==false;
  if(!stage||!enabled){ if(stage) stage.remove(); document.body.classList.remove('is-locked'); return; }
  document.body.classList.add('is-locked');
  gsap.set('#envLetter',{opacity:0,y:0});

  let opened=false;
  function open(){
    if(opened) return; opened=true;
    enableAudio(); // first user gesture -> allow sound
    const tl=gsap.timeline();
    tl.to('#envSeal',{scale:1.12,duration:.18,ease:'power2.out'})
      .to('#envSeal',{y:-90,rotation:-22,opacity:0,scale:.7,duration:.7,ease:'back.in(1.4)'},'+=.02')
      .to('#envFlap',{rotateX:178,duration:.9,ease:'power3.inOut',transformOrigin:'top center'},'-=.5')
      .set('#envFlap',{zIndex:1})
      .to('#envLetter',{opacity:1,duration:.3},'-=.5')
      .to('#envLetter',{y:'-44%',duration:1,ease:'power3.out'},'-=.1')
      .to('#envelope',{scale:1.15,duration:.8,ease:'power2.in'},'-=.4')
      .to(stage,{opacity:0,duration:.7,ease:'power2.inOut',onStart:()=>{document.body.classList.remove('is-locked');}},'-=.2')
      .add(()=>{stage.classList.add('is-gone');setTimeout(()=>stage.remove(),100);startIntro();});
  }
  stage.addEventListener('click',open);
  stage.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' ')open();});
})();

/* ============ Loader -> hero ============ */
function startIntro(){
  if(introStarted) return; introStarted=true;
  const tl=gsap.timeline();
  tl.to('.loader__cloud',{x:60,duration:1.0,ease:'sine.inOut'})
    .to('.loader',{opacity:0,duration:.6,onComplete:()=>{const l=document.getElementById('loader');if(l)l.style.display='none';ScrollTrigger.refresh();}},'-=.2')
    .add(heroIn,'-=.2');
}
function playHeroVideo(){
  const theme=CFG.THEME||'blue';
  const v=theme==='red'?document.getElementById('heroVideo'):(theme==='blue'?document.getElementById('heroVideoBlue'):null);
  if(!v) return;
  v.muted=true;
  const go=()=>{v.play().catch(()=>{});gsap.to(v,{opacity:1,duration:1.4,ease:'sine.out'});};
  if(v.readyState>=2) go(); else { v.preload='auto'; v.load(); v.addEventListener('canplay',go,{once:true}); }
}
function heroIn(){
  const tl=gsap.timeline();
  playHeroVideo();
  tl.to('.sky__name .char',{y:0,duration:1,stagger:.04,ease:'power4.out'})
    .to('.sky__eyebrow',{opacity:1,y:0,duration:.8},'-=.8')
    .to('.sky__hint',{opacity:1,y:0,duration:.8},'-=.5')
    .add(drawSignature,'-=.4');
}
gsap.set('.sky__eyebrow,.sky__hint',{y:20});

/* ============ DECORATION on scroll (pin the hero) ============ */
const sky=document.getElementById('sky');
if(sky){
  const theme=CFG.THEME||'blue';
  const vis=(sel)=>gsap.utils.toArray(sel).filter((el)=>getComputedStyle(el).display!=='none');
  const ct=gsap.timeline({scrollTrigger:{trigger:'.sky',start:'top top',end:'+=120%',pin:true,scrub:1}});
  if(theme==='blue'){
    ct.to(vis('.deco--l'),{xPercent:-120,rotation:-8,ease:'none'},0)
      .to(vis('.deco--r'),{xPercent:120,rotation:8,ease:'none'},0)
      .to(vis('.deco--bl'),{yPercent:80,xPercent:-40,ease:'none'},0)
      .to(vis('.deco--br'),{yPercent:80,xPercent:40,ease:'none'},0)
      .to('.sky__center',{scale:1.08,opacity:0,ease:'none'},0)
      .to('.sky__sun',{scale:1.3,opacity:.4,ease:'none'},0);
    gsap.to(vis('.deco--l'),{x:'+=14',duration:6,repeat:-1,yoyo:true,ease:'sine.inOut'});
    gsap.to(vis('.deco--r'),{x:'-=14',duration:7,repeat:-1,yoyo:true,ease:'sine.inOut'});
  } else if(theme==='red'){
    const flowers=vis('.deco');
    gsap.set(flowers,{scale:.1,opacity:0,rotation:-30,transformOrigin:'center center'});
    flowers.forEach((f,i)=>{ct.to(f,{scale:1.05,opacity:1,rotation:(i%2?10:-10),ease:'back.out(1.4)'},0);});
    ct.fromTo('.sky__center',{filter:'brightness(.7)'},{filter:'brightness(1.15)',scale:1.04,ease:'none'},0)
      .to('.sky__sun',{opacity:.6,scale:1.2,ease:'none'},0);
    flowers.forEach((f,i)=>gsap.to(f,{rotation:(i%2?'+=4':'-=4'),duration:5+i,repeat:-1,yoyo:true,ease:'sine.inOut'}));
  } else {
    const flowers=vis('.deco');
    gsap.set(flowers,{scale:.2,opacity:0,yPercent:25,transformOrigin:'bottom center'});
    flowers.forEach((f,i)=>{ct.to(f,{scale:1,opacity:1,yPercent:0,ease:'power3.out'},i*0.04);});
    ct.to('.sky__center',{y:-14,letterSpacing:'+=2px',ease:'none'},0);
    flowers.forEach((f,i)=>gsap.to(f,{y:'+=8',duration:4+i,repeat:-1,yoyo:true,ease:'sine.inOut'}));
  }
}

/* ============ Self-drawing signature ============ */
function drawSignature(){
  const svg=document.getElementById('sigSvg');
  if(!svg||svg.dataset.done) return; svg.dataset.done='1';
  const ns='http://www.w3.org/2000/svg';
  /* Build a flowing script of "name & name" using simple cursive strokes per letter. */
  const one=(CFG.names?.one||'').trim();
  const two=(CFG.names?.two||'').trim();
  const text=document.createElementNS(ns,'text');
  text.setAttribute('x','300');text.setAttribute('y','120');
  text.setAttribute('text-anchor','middle');
  text.setAttribute('font-family','Cormorant Garamond, serif');
  text.setAttribute('font-style','italic');
  text.setAttribute('font-size','86');
  text.setAttribute('fill','none');
  text.setAttribute('stroke','var(--c1)');
  text.setAttribute('stroke-width','1.4');
  text.textContent=one+'  &  '+two;
  svg.appendChild(text);
  /* animate a write-on using stroke dash on the text outline */
  requestAnimationFrame(()=>{
    const len=text.getComputedTextLength()*2.2||1400;
    text.style.strokeDasharray=len; text.style.strokeDashoffset=len;
    gsap.to(text,{strokeDashoffset:0,duration:2.4,ease:'power1.inOut',
      scrollTrigger:{trigger:'#signature',start:'top 80%'}});
    gsap.to(text,{attr:{fill:'var(--c1)'},fillOpacity:.08,duration:1,delay:2.2,
      scrollTrigger:{trigger:'#signature',start:'top 80%'}});
  });
}

/* ============ Split-word quote ============ */
const quote=document.querySelector('.split-words');
if(quote){quote.innerHTML=quote.textContent.trim().split(' ').map((w)=>`<span class=\"word\">${w}</span>`).join(' ');gsap.to('.split-words .word',{opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:'.reveal',start:'top 70%',end:'bottom 75%',scrub:true}});}

/* data-fade reveals */
gsap.utils.toArray('[data-fade]').forEach((el)=>{gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}});});

/* ============ SCRATCH TO REVEAL ============ */
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
    const cs=getComputedStyle(document.body);
    const a=(cs.getPropertyValue('--scratch-a')||'#9fd0ef').trim();
    const b=(cs.getPropertyValue('--scratch-b')||'#1f6fb2').trim();
    const g=ctx.createLinearGradient(0,0,r.width,r.height);
    g.addColorStop(0,a);g.addColorStop(1,b);
    ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);
    ctx.fillStyle='rgba(255,255,255,.9)';ctx.font='600 14px Jost, sans-serif';ctx.textAlign='center';
    ctx.fillText('SCRATCH HERE',r.width/2,r.height/2);
    ctx.globalCompositeOperation='destination-out';
  }
  function pos(e){const r=canvas.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};}
  function scratchAt(p){ctx.beginPath();ctx.arc(p.x,p.y,26,0,Math.PI*2);ctx.fill();}
  function pct(){const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<d.length;i+=40)if(d[i]===0)clear++;return clear/(d.length/40);}
  function check(){if(revealed)return;if(pct()>.5){revealed=true;gsap.to(canvas,{opacity:0,duration:.6,onComplete:()=>canvas.style.display='none'});done.classList.add('is-visible');burst(window.innerWidth/2,window.innerHeight*0.5,60);}}
  function start(e){drawing=true;scratchAt(pos(e));}
  function move(e){if(!drawing)return;e.preventDefault();scratchAt(pos(e));}
  function end(){if(!drawing)return;drawing=false;check();}
  size();window.addEventListener('resize',size);
  canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',end);
})();

/* ============ 3D tilt cards ============ */
gsap.utils.toArray('[data-tilt]').forEach((card)=>{
  card.addEventListener('pointermove',(e)=>{const r=card.getBoundingClientRect();const rx=((e.clientY-r.top)/r.height-.5)*-8;const ry=((e.clientX-r.left)/r.width-.5)*8;gsap.to(card,{rotateX:rx,rotateY:ry,duration:.4,ease:'power2.out',transformPerspective:800});});
  card.addEventListener('pointerleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'power3.out'}));
});

/* ============ Magnetic buttons ============ */
if(!matchMedia('(pointer:coarse)').matches){
  gsap.utils.toArray('[data-magnetic]').forEach((el)=>{
    const strength=22;
    el.addEventListener('pointermove',(e)=>{const r=el.getBoundingClientRect();const mx=e.clientX-(r.left+r.width/2);const my=e.clientY-(r.top+r.height/2);gsap.to(el,{x:(mx/r.width)*strength,y:(my/r.height)*strength,duration:.4,ease:'power3.out'});});
    el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
}

/* ============ Countdown ============ */
const WEDDING_DATE=new Date(CFG.date||'2026-09-26T16:00:00').getTime();
const U={days:864e5,hours:36e5,minutes:6e4,seconds:1e3};
const cd={};document.querySelectorAll('[data-unit]').forEach((el)=>cd[el.dataset.unit]=el);
function tick(){let d=Math.max(0,WEDDING_DATE-Date.now());const o={};o.days=Math.floor(d/U.days);d%=U.days;o.hours=Math.floor(d/U.hours);d%=U.hours;o.minutes=Math.floor(d/U.minutes);d%=U.minutes;o.seconds=Math.floor(d/U.seconds);for(const k in cd){const v=String(o[k]).padStart(2,'0');if(cd[k].textContent!==v)cd[k].textContent=v;}}
setInterval(tick,1000);tick();
gsap.from('.cd',{opacity:0,y:30,scale:.9,duration:.8,stagger:.12,ease:'back.out(1.6)',scrollTrigger:{trigger:'.countdown',start:'top 75%'}});

/* ============ Add to calendar (.ics) ============ */
(function calendar(){
  const btn=document.getElementById('addCal');
  if(!btn) return;
  function pad(n){return String(n).padStart(2,'0');}
  function fmt(dt){return dt.getUTCFullYear()+pad(dt.getUTCMonth()+1)+pad(dt.getUTCDate())+'T'+pad(dt.getUTCHours())+pad(dt.getUTCMinutes())+'00Z';}
  btn.addEventListener('click',()=>{
    const start=new Date(CFG.date||'2026-09-26T16:00:00');
    const end=new Date(start.getTime()+(CFG.calendar?.durationHours||4)*36e5);
    const loc=(CFG.address?.query||CFG.address?.venue||'').replace(/[,;]/g,'\\$&');
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',
      'UID:'+Date.now()+'@wedding','DTSTAMP:'+fmt(new Date()),'DTSTART:'+fmt(start),'DTEND:'+fmt(end),
      'SUMMARY:'+((CFG.calendar?.title||'Wedding').replace(/[,;]/g,'\\$&')),
      'DESCRIPTION:'+((CFG.calendar?.details||'').replace(/[,;]/g,'\\$&')),
      'LOCATION:'+loc,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='wedding.ics';document.body.appendChild(a);a.click();a.remove();
    burst(window.innerWidth/2,window.innerHeight*0.4,40);
  });
})();

/* ============ Schedule timeline ============ */
(function schedule(){
  const inner=document.getElementById('scheduleInner');
  const items=CFG.schedule||[];
  if(!inner||!items.length) return;
  items.forEach((it)=>{
    const row=document.createElement('div');row.className='tl';row.setAttribute('data-fade','');
    row.innerHTML=`<span class=\"tl__dot\"></span><div><div class=\"tl__time\">${it.time}</div><div class=\"tl__title\">${it.title}</div><div class=\"tl__desc\">${it.desc||''}</div></div>`;
    inner.appendChild(row);
  });
  gsap.utils.toArray('.tl').forEach((row)=>{
    gsap.fromTo(row,{opacity:0,y:40},{opacity:1,y:0,duration:.7,ease:'power3.out',scrollTrigger:{trigger:row,start:'top 85%'}});
    gsap.fromTo(row.querySelector('.tl__dot'),{scale:0},{scale:1,duration:.5,ease:'back.out(2)',scrollTrigger:{trigger:row,start:'top 85%'}});
  });
  const prog=document.getElementById('scheduleProgress');
  if(prog) gsap.to(prog,{height:'100%',ease:'none',scrollTrigger:{trigger:inner,start:'top 60%',end:'bottom 70%',scrub:.4}});
  const marker=document.getElementById('scheduleMarker');
  const ICONS={
    ring:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><circle cx=\"12\" cy=\"15\" r=\"6\"/><path d=\"M9 6l3-3 3 3-3 3z\"/></svg>',
    flower:'<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"6\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"12\" r=\"3\"/><circle cx=\"9\" cy=\"18\" r=\"3\"/><circle cx=\"15\" cy=\"18\" r=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"2.4\" fill=\"#fff\"/></svg>',
    star:'<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2l2.6 6.6L21 9.3l-5 4.5L17.5 21 12 17.3 6.5 21 8 13.8l-5-4.5 6.4-.7z\"/></svg>',
    bird:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><path d=\"M2 12c4-4 8-4 10 0 2-4 6-4 10 0\"/></svg>',
  };
  const byTheme={blue:'bird',red:'flower',white:'star'};
  let key=CFG.timelineMarker&&CFG.timelineMarker!=='auto'?CFG.timelineMarker:(byTheme[CFG.THEME]||'ring');
  marker.innerHTML=ICONS[key]||ICONS.ring;
  ScrollTrigger.create({
    trigger:inner,start:'top 60%',end:'bottom 70%',
    onUpdate:(self)=>{const r=inner.getBoundingClientRect();const y=r.top+r.height*self.progress;gsap.set(marker,{x:window.innerWidth/2,y,opacity:1,rotation:self.progress*360});},
    onLeave:()=>gsap.to(marker,{opacity:0,duration:.3}),onLeaveBack:()=>gsap.to(marker,{opacity:0,duration:.3}),
    onEnter:()=>gsap.to(marker,{opacity:1,duration:.3}),onEnterBack:()=>gsap.to(marker,{opacity:1,duration:.3}),
  });
})();

/* ============ Horizontal gallery ============ */
const track=document.getElementById('galleryTrack');
if(track){
  const amt=()=>track.scrollWidth-window.innerWidth;
  gsap.to(track,{x:()=>-amt(),ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:()=>'+='+amt(),pin:true,scrub:1,invalidateOnRefresh:true}});
  gsap.utils.toArray('.gallery__img').forEach((img)=>{gsap.to(img,{scale:1,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:()=>'+='+amt(),scrub:1}});});
}

/* Progress bar */
gsap.to('#progressBar',{width:'100%',ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});

/* ============ Confetti / petal burst ============ */
let _cc,_ctx,_parts=[],_raf;
function palette(){const raw=(getComputedStyle(document.body).getPropertyValue('--confetti')||'').trim();return raw?raw.split(',').map((s)=>s.trim()):['#d8b15a','#ffffff','#1f6fb2'];}
function ensureCanvas(){if(_cc)return;_cc=document.createElement('canvas');_cc.className='confetti-canvas';document.body.appendChild(_cc);_ctx=_cc.getContext('2d');resizeCC();window.addEventListener('resize',resizeCC);}
function resizeCC(){if(!_cc)return;_cc.width=window.innerWidth;_cc.height=window.innerHeight;}
function burst(x,y,count){
  ensureCanvas();
  const cols=palette();
  const petal=CFG.THEME==='red'||CFG.THEME==='white';
  for(let i=0;i<(count||50);i++){
    const a=Math.random()*Math.PI*2,sp=4+Math.random()*8;
    _parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-4,g:.12+Math.random()*.1,
      size:petal?(8+Math.random()*8):(5+Math.random()*6),rot:Math.random()*6.28,vr:(Math.random()-.5)*.3,
      col:cols[i%cols.length],life:60+Math.random()*40,age:0,petal});
  }
  if(!_raf) _raf=requestAnimationFrame(loopCC);
}
function loopCC(){
  _ctx.clearRect(0,0,_cc.width,_cc.height);
  _parts=_parts.filter((p)=>p.age<p.life);
  _parts.forEach((p)=>{
    p.age++;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.rot+=p.vr;
    const al=Math.max(0,1-p.age/p.life);_ctx.save();_ctx.globalAlpha=al;_ctx.translate(p.x,p.y);_ctx.rotate(p.rot);_ctx.fillStyle=p.col;
    if(p.petal){_ctx.beginPath();_ctx.ellipse(0,0,p.size,p.size*.55,0,0,Math.PI*2);_ctx.fill();}
    else{_ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.5);}
    _ctx.restore();
  });
  if(_parts.length) _raf=requestAnimationFrame(loopCC); else {_raf=null;_ctx.clearRect(0,0,_cc.width,_cc.height);}
}

/* ============ Audio toggle ============ */
let _audio,_audioReady=false;
function enableAudio(){
  if(_audioReady||!CFG.audio?.url) return; _audioReady=true;
  _audio=new Audio(CFG.audio.url);_audio.loop=true;_audio.volume=0;
  const btn=document.getElementById('audioToggle');
  if(btn) btn.style.display='flex';
  _audio.play().then(()=>{
    if(btn){btn.classList.remove('is-muted');btn.classList.add('is-playing');}
    gsap.to(_audio,{volume:.45,duration:2,ease:'sine.out'});
  }).catch(()=>{/* blocked: stays muted until user taps */});
}
(function audioUI(){
  const btn=document.getElementById('audioToggle');
  if(!btn||!CFG.audio?.url) return;
  btn.addEventListener('click',()=>{
    if(!_audioReady){enableAudio();return;}
    if(_audio.paused){_audio.play();btn.classList.remove('is-muted');btn.classList.add('is-playing');gsap.to(_audio,{volume:.45,duration:1});}
    else{gsap.to(_audio,{volume:0,duration:.5,onComplete:()=>_audio.pause()});btn.classList.add('is-muted');btn.classList.remove('is-playing');}
  });
})();

/* ============ RSVP (with confetti on accept) ============ */
const form=document.getElementById('rsvpForm');
const success=document.getElementById('rsvpSuccess');
const attending=document.getElementById('attending');
attending?.addEventListener('change',()=>{
  if(attending.value==='yes'){const r=attending.getBoundingClientRect();burst(r.left+r.width/2,r.top,70);}
});
form?.addEventListener('submit',(e)=>{
  e.preventDefault();
  if(!form.checkValidity()){gsap.fromTo(form,{x:-8},{x:0,duration:.4,ease:'elastic.out(1,0.3)'});form.reportValidity();return;}
  const data=Object.fromEntries(new FormData(form).entries());
  try{localStorage.setItem('rsvp',JSON.stringify(data));}catch(_){}
  const endpoint=CFG.rsvpEndpoint;
  if(endpoint){fetch(endpoint,{method:'POST',body:new URLSearchParams(data)}).catch(()=>{});}
  if(data.attending==='yes') burst(window.innerWidth/2,window.innerHeight*0.5,120);
  if(data.message&&data.message.trim()) addGuestNote({name:data.name,message:data.message},true);
  gsap.to(form,{opacity:0,y:-20,duration:.5,ease:'power2.in',onComplete:()=>{form.style.display='none';success.classList.add('is-visible');gsap.from(success,{opacity:0,y:20,duration:.7,ease:'power3.out'});gsap.from('.rsvp__check',{scale:0,rotate:-45,duration:.7,ease:'back.out(2)'});}});
});

/* ============ Guestbook wall ============ */
const DEMO_NOTES=[
  {name:'Aunt Rosa',message:'So overjoyed for you both. Counting the days!'},
  {name:'Marco & Lina',message:'A love like yours is rare. Congratulations!'},
  {name:'The Bianchi family',message:'Wishing you a lifetime of laughter and lake views.'},
  {name:'Sofia',message:'Cannot wait to dance the night away with you two.'},
  {name:'Grandpa Joe',message:'Welcome to the family, James. Take care of our girl.'},
];
function addGuestNote(n,prepend){
  const wall=document.getElementById('guestbookWall');
  if(!wall||!n||!n.message) return;
  const el=document.createElement('div');el.className='gb-note';
  el.innerHTML=`<p class=\"gb-note__msg\">“${escapeHtml(n.message)}”</p><p class=\"gb-note__name\">${escapeHtml(n.name||'A guest')}</p>`;
  if(prepend) wall.prepend(el); else wall.appendChild(el);
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('in')));
}
function escapeHtml(s){return String(s).replace(/[&<>\"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
(function guestbook(){
  const wall=document.getElementById('guestbookWall');
  if(!wall) return;
  const ep=CFG.guestbookEndpoint;
  const render=(notes)=>{
    if(!notes||!notes.length){wall.innerHTML='<p class=\"guestbook__empty\">Be the first to leave a note in your RSVP.</p>';return;}
    notes.forEach((n,i)=>setTimeout(()=>addGuestNote(n),i*90));
  };
  if(ep){
    fetch(ep,{method:'GET'}).then((r)=>r.json()).then((rows)=>{
      const notes=(Array.isArray(rows)?rows:rows.notes||rows.data||[])
        .map((r)=>({name:r.name||r.Name,message:r.message||r.Message||r.note}))
        .filter((r)=>r.message);
      render(notes.length?notes:DEMO_NOTES);
    }).catch(()=>render(DEMO_NOTES));
  } else { render(DEMO_NOTES); }
})();

/* ============ Init ============ */
let introRan = false;
function triggerIntro() {
  if (introRan) return;
  introRan = true;
  if (typeof CFG !== 'undefined' && CFG.envelope?.enabled === false) { startIntro(); }
}
window.addEventListener('load', triggerIntro);
document.addEventListener('DOMContentLoaded', () => setTimeout(triggerIntro, 2000));
