gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* Preloader */
function runPreloader() {
  const tl = gsap.timeline();
  tl.to('.preloader__mono, .preloader__amp', {
      opacity: 1, y: 0, duration: .7, stagger: .12, ease: 'power3.out'
    })
    .to('.preloader__bar span', {
      width: '100%', duration: 1, ease: 'power2.inOut'
    }, '-=.3')
    .to('#preloader', {
      yPercent: -100, duration: .9, ease: 'power4.inOut',
      onComplete: () => {
        document.getElementById('preloader').style.display = 'none';
        ScrollTrigger.refresh();
      }
    }, '+=.15')
    .add(introHero, '-=.5');
}

/* Hero intro */
function introHero() {
  const tl = gsap.timeline();
  tl.from('[data-name] > span', {
      yPercent: 110, opacity: 0, duration: 1.1,
      stagger: .12, ease: 'power4.out'
    })
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, '-=.7')
    .from('.hero__amp', { scale: 0, opacity: 0, duration: .6, ease: 'back.out(2)' }, '-=.6')
    .to('.hero__date', { opacity: 1, duration: .8 }, '-=.4');
}

/* Wrap each name for clean overflow reveal */
document.querySelectorAll('[data-name]').forEach((el) => {
  el.style.overflow = 'hidden';
  el.innerHTML = `<span style="display:inline-block">${el.textContent}</span>`;
});

/* Parallax backgrounds */
gsap.utils.toArray('[data-speed]').forEach((el) => {
  const speed = parseFloat(el.dataset.speed);
  gsap.to(el, {
    yPercent: (1 - speed) * 30,
    ease: 'none',
    scrollTrigger: {
      trigger: el.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});

/* Split-word quote reveal */
const quote = document.querySelector('.split-words');
if (quote) {
  quote.innerHTML = quote.textContent
    .trim().split(' ')
    .map((w) => `<span class="word">${w}</span>`)
    .join(' ');
  gsap.to('.split-words .word', {
    opacity: 1,
    stagger: .06,
    ease: 'none',
    scrollTrigger: {
      trigger: '.intro',
      start: 'top 70%',
      end: 'bottom 70%',
      scrub: true
    }
  });
}

/* fade-up reveals */
gsap.utils.toArray('.fade-up').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

/* Countdown */
const WEDDING_DATE = new Date('2026-09-26T16:00:00').getTime();
const units = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };
const cdEls = {};
document.querySelectorAll('[data-unit]').forEach((el) => (cdEls[el.dataset.unit] = el));

function tickCountdown() {
  let diff = Math.max(0, WEDDING_DATE - Date.now());
  const out = {};
  out.days = Math.floor(diff / units.days); diff %= units.days;
  out.hours = Math.floor(diff / units.hours); diff %= units.hours;
  out.minutes = Math.floor(diff / units.minutes); diff %= units.minutes;
  out.seconds = Math.floor(diff / units.seconds);
  for (const k in cdEls) {
    const v = String(out[k]).padStart(2, '0');
    if (cdEls[k].textContent !== v) cdEls[k].textContent = v;
  }
}
setInterval(tickCountdown, 1000);
tickCountdown();

/* Countdown numbers pop in */
gsap.from('.cd', {
  opacity: 0, y: 30, scale: .9, duration: .8, stagger: .12, ease: 'back.out(1.6)',
  scrollTrigger: { trigger: '.countdown', start: 'top 75%' }
});

/* Horizontal gallery scroll */
const track = document.getElementById('galleryTrack');
if (track) {
  const getScrollAmount = () => track.scrollWidth - window.innerWidth;
  gsap.to(track, {
    x: () => -getScrollAmount(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.gallery',
      start: 'top top',
      end: () => '+=' + getScrollAmount(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });
  gsap.utils.toArray('.gallery__img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.15 }, {
      scale: 1, ease: 'none',
      scrollTrigger: {
        trigger: '.gallery', start: 'top top',
        end: () => '+=' + getScrollAmount(), scrub: 1
      }
    });
  });
}

/* Scroll progress bar */
gsap.to('#progressBar', {
  width: '100%', ease: 'none',
  scrollTrigger: { start: 0, end: 'max', scrub: .3 }
});

/* Scroll cue click */
document.querySelector('.hero__scroll')?.addEventListener('click', () => {
  gsap.to(window, { duration: 1.2, scrollTo: '#story', ease: 'power3.inOut' });
});

/* RSVP form */
const form = document.getElementById('rsvpForm');
const success = document.getElementById('rsvpSuccess');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    gsap.fromTo(form, { x: -8 }, { x: 0, duration: .4, ease: 'elastic.out(1,0.3)' });
    form.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  try { localStorage.setItem('rsvp', JSON.stringify(data)); } catch (_) {}

  gsap.to(form, {
    opacity: 0, y: -20, duration: .5, ease: 'power2.in',
    onComplete: () => {
      form.style.display = 'none';
      success.classList.add('is-visible');
      gsap.from(success, { opacity: 0, y: 20, duration: .7, ease: 'power3.out' });
      gsap.from('.rsvp__check', { scale: 0, rotate: -45, duration: .7, ease: 'back.out(2)' });
    }
  });
});

/* Init */
window.addEventListener('load', runPreloader);
ScrollTrigger.refresh();
