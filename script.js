/* ============================================================
   GRIND & GATHER COFFEE — script.js
   ============================================================ */

/* ─── CUSTOM CURSOR ─────────────────────────────────────── */
const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(hover: hover)').matches) {
  let mx = -100, my = -100, cx = -100, cy = -100;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const animCursor = () => {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animCursor);
  };
  animCursor();
  document.querySelectorAll('a, button, .menu-card, .review-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--grow'));
  });
}

/* ─── STICKY NAV ─────────────────────────────────────────── */
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── MOBILE NAV ─────────────────────────────────────────── */
const toggle   = document.querySelector('.site-nav__toggle');
const navLinks = document.querySelector('.site-nav__links');
const navCta   = document.querySelector('.site-nav__cta');
let   mobileOpen = false;

if (toggle) {
  toggle.addEventListener('click', () => {
    mobileOpen = !mobileOpen;
    toggle.setAttribute('aria-expanded', mobileOpen);

    const bars = toggle.querySelectorAll('span');
    if (mobileOpen) {
      bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      // Build inline mobile menu
      let mobileMenu = document.getElementById('mobile-menu');
      if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        Object.assign(mobileMenu.style, {
          position: 'fixed', inset: '0', top: '70px',
          background: 'rgba(26,15,7,.97)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '2rem', zIndex: '99',
          animation: 'fadeUp .4s ease both'
        });
        ['About','Menu','Process','Reviews','Contact'].forEach(label => {
          const a = document.createElement('a');
          a.href = '#' + label.toLowerCase();
          a.textContent = label;
          Object.assign(a.style, {
            fontFamily: 'var(--ff-display)', fontSize: '2rem',
            fontWeight: '700', color: 'var(--cream)',
            transition: 'color .2s'
          });
          a.addEventListener('click', () => closeMenu());
          a.addEventListener('mouseenter', () => a.style.color = 'var(--honey)');
          a.addEventListener('mouseleave', () => a.style.color = 'var(--cream)');
          mobileMenu.appendChild(a);
        });
        document.body.appendChild(mobileMenu);
      } else {
        mobileMenu.style.display = 'flex';
      }
    } else {
      closeMenu();
    }

    function closeMenu() {
      mobileOpen = false;
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
      const mm = document.getElementById('mobile-menu');
      if (mm) mm.style.display = 'none';
    }
  });
}

/* ─── SCROLL REVEAL ─────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Find sibling index for stagger
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.08) + 's';
      entry.target.classList.add('is-visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id     = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
  });
});

/* ─── MENU TABS ─────────────────────────────────────────── */
const tabs  = document.querySelectorAll('.menu__tab');
const cards = document.querySelectorAll('.menu-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    const filter = tab.dataset.filter;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity .4s, transform .4s';
      if (show) {
        card.style.opacity   = '1';
        card.style.transform = '';
        card.style.pointerEvents = '';
      } else {
        card.style.opacity   = '0.2';
        card.style.transform = 'scale(.95)';
        card.style.pointerEvents = 'none';
      }
    });
  });
});

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec    = el.dataset.decimals || 0;
    const dur    = 1800;
    const start  = performance.now();
    const tick   = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      el.textContent = (target * ease).toFixed(dec) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => countObs.observe(el));

/* ─── PARALLAX HERO ─────────────────────────────────────── */
const heroBg = document.querySelector('.hero__panel--right');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if (offset < window.innerHeight) {
      heroBg.style.transform = `translateY(${offset * 0.25}px)`;
    }
  }, { passive: true });
}

/* ─── FORM SUBMISSION ────────────────────────────────────── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = contactForm.querySelector('.btn--primary');
    const orig = btn.innerHTML;
    btn.innerHTML   = '☕ Message Sent!';
    btn.style.background = '#2a7a4e';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.reset();
      btn.innerHTML   = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
}

/* ─── NEWSLETTER FORM ────────────────────────────────────── */
const nlForm = document.querySelector('.newsletter__form');
if (nlForm) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = nlForm.querySelector('.newsletter__btn');
    btn.textContent = '✓ You\'re in!';
    btn.style.background = '#2a7a4e';
    setTimeout(() => {
      nlForm.reset();
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  });
}

/* ─── ACTIVE NAV LINK SCROLL SPY ────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.site-nav__links a');
const spyObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--cream)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spyObs.observe(s));

/* ─── REDUCED MOTION ─────────────────────────────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--ease', 'linear');
  document.querySelectorAll('.hero__bg-image').forEach(el => {
    el.style.animation = 'none';
  });
}

/* ─── FOOTER YEAR ────────────────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();