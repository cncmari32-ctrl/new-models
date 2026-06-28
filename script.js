gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* Split hero names into characters */
document.querySelectorAll('[data-split]').forEach((el) => {
  el.innerHTML = el.textContent.split('').map((c) => `<span class="char">${c}</span>`).join('');
});

/* Floating particles */
(function buildParticles(){
  const wrap = document.getElementById('particles');
  if(!wrap) return;
  const n = window.innerWidth < 640 ? 16 : 30;
  for(let i=0;i<n;i++){
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random()*100 + 'vw';
    p.style.top = Math.random()*100 + 'vh';
    wrap.appendChild(p);
    gsap.to(p,{opacity:gsap.utils.random(.15,.6),duration:gsap.utils.random(1,3),delay:gsap.utils.random(0,3),repeat:-1,yoyo:true,ease:'sine.inOut'});
    gsap.to(p,{y:gsap.utils.random(-60,60),x:gsap.utils.random(-40,40),duration:gsap.utils.random(6,12),repeat:-1,yoyo:true,ease:'sine.inOut'});
  }
})();

/* Curtain intro -> hero */
function intro(){
  const tl = gsap.timeline();
  tl.to('#curtainSub',{opacity:1,duration:.7,ease:'power2.out'})
    .to('#curtainWord',{opacity:1,y:0,duration:.9,ease:'power3.out'},'-=.3')
    .to('.curtain__brand',{opacity:0,duration:.5,delay:.5})
    .to('.curtain',{yPercent:-100,duration:1,ease:'power4.inOut',onComplete:()=>{document.getElementById('curtain').style.display='none';ScrollTrigger.refresh();}})
    .add(heroIn,'-=.45');
}
function heroIn(){
  const tl = gsap.timeline();
  tl.to('.hero__name .char',{y:0,duration:1,stagger:.04,ease:'power4.out'})
    .to('.hero__eyebrow',{opacity:1,y:0,duration:.8},'-=.8')
    .to('.hero__amp',{opacity:1,scale:1,duration:.6,ease:'back.out(2)'},'-=.7')
    .to('[data-rule]',{width:'min(220px,60vw)',duration:.9,ease:'power2.out'},'-=.4')
    .to('.hero__date',{opacity:1,y:0,duration:.8},'-=.5');
}
gsap.set('.hero__amp',{scale:0});

/* Parallax */
gsap.utils.toArray('[data-speed]').forEach((el)=>{
  const s=parseFloat(el.dataset.speed);
  gsap.to(el,{yPercent:(1-s)*30,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
});

/* Marquee loop */
const row=document.querySelector('.marquee__row span');
if(row){row.parentElement.appendChild(row.cloneNode(true));gsap.to('.marquee__row',{xPercent:-50,duration:18,repeat:-1,ease:'none'});}

/* SVG flourish draw */
gsap.to('.flourish__path',{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.intro',start:'top 75%',end:'top 35%',scrub:true}});

/* Split-word quote */
const quote=document.querySelector('.split-words');
if(quote){
  quote.innerHTML=quote.textContent.trim().split(' ').map((w)=>`<span class="word">${w}</span>`).join(' ');
  gsap.to('.split-words .word',{opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:'.intro',start:'top 65%',end:'bottom 70%',scrub:true}});
}

/* data-fade reveals */
gsap.utils.toArray('[data-fade]').forEach((el)=>{
  gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}});
});

/* 3D tilt on cards (pointer) */
gsap.utils.toArray('[data-tilt]').forEach((card)=>{
  card.addEventListener('pointermove',(e)=>{
    const r=card.getBoundingClientRect();
    const rx=((e.clientY-r.top)/r.height-.5)*-8;
    const ry=((e.clientX-r.left)/r.width-.5)*8;
    gsap.to(card,{rotateX:rx,rotateY:ry,duration:.4,ease:'power2.out',transformPerspective:800});
  });
  card.addEventListener('pointerleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'power3.out'}));
});

/* Countdown */
const WEDDING_DATE=new Date('2026-09-26T16:00:00').getTime();
const U={days:864e5,hours:36e5,minutes:6e4,seconds:1e3};
const cd={};document.querySelectorAll('[data-unit]').forEach((el)=>cd[el.dataset.unit]=el);
function tick(){let d=Math.max(0,WEDDING_DATE-Date.now());const o={};o.days=Math.floor(d/U.days);d%=U.days;o.hours=Math.floor(d/U.hours);d%=U.hours;o.minutes=Math.floor(d/U.minutes);d%=U.minutes;o.seconds=Math.floor(d/U.seconds);for(const k in cd){const v=String(o[k]).padStart(2,'0');if(cd[k].textContent!==v)cd[k].textContent=v;}}
setInterval(tick,1000);tick();
gsap.from('.cd',{opacity:0,y:30,scale:.9,duration:.8,stagger:.12,ease:'back.out(1.6)',scrollTrigger:{trigger:'.countdown',start:'top 75%'}});

/* Horizontal gallery + image mask reveal */
const track=document.getElementById('galleryTrack');
if(track){
  const amt=()=>track.scrollWidth-window.innerWidth;
  gsap.to(track,{x:()=>-amt(),ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:()=>'+='+amt(),pin:true,scrub:1,invalidateOnRefresh:true}});
  gsap.utils.toArray('.gallery__img').forEach((img)=>{
    gsap.to(img,{scale:1,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:()=>'+='+amt(),scrub:1}});
  });
}

/* Progress bar */
gsap.to('#progressBar',{width:'100%',ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});

/* Scroll cue */
document.querySelector('.hero__scroll')?.addEventListener('click',()=>gsap.to(window,{duration:1.2,scrollTo:'#story',ease:'power3.inOut'}));

/* RSVP */
const form=document.getElementById('rsvpForm');
const success=document.getElementById('rsvpSuccess');
form?.addEventListener('submit',(e)=>{
  e.preventDefault();
  if(!form.checkValidity()){gsap.fromTo(form,{x:-8},{x:0,duration:.4,ease:'elastic.out(1,0.3)'});form.reportValidity();return;}
  try{localStorage.setItem('rsvp',JSON.stringify(Object.fromEntries(new FormData(form).entries())));}catch(_){}
  gsap.to(form,{opacity:0,y:-20,duration:.5,ease:'power2.in',onComplete:()=>{form.style.display='none';success.classList.add('is-visible');gsap.from(success,{opacity:0,y:20,duration:.7,ease:'power3.out'});gsap.from('.rsvp__check',{scale:0,rotate:-45,duration:.7,ease:'back.out(2)'});}});
});

/* Init */
gsap.set('.hero__eyebrow,.hero__date',{y:20});
window.addEventListener('load',intro);
