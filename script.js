// ===========================
// CUSTOM CURSOR
// ===========================
const cursor = document.createElement('div');
cursor.className = 'cursor';
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor__dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorDot.style.left = `${cursorX}px`;
  cursorDot.style.top = `${cursorY}px`;
});

function animateCursor() {
  dotX += (cursorX - dotX) * 0.15;
  dotY += (cursorY - dotY) * 0.15;
  cursor.style.left = `${dotX}px`;
  cursor.style.top = `${dotY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const hoverTargets = document.querySelectorAll('a, button, .service-card, .highlight-card, .contact__card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor--hover');
    cursorDot.classList.add('cursor__dot--hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor--hover');
    cursorDot.classList.remove('cursor__dot--hover');
  });
});

// ===========================
// DARK MODE
// ===========================
const darkToggle = document.getElementById('darkToggle');

function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('rj_theme', dark ? 'dark' : 'light');
  darkToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

const saved = localStorage.getItem('rj_theme');
if (saved) {
  setTheme(saved === 'dark');
} else {
  setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
});

// ===========================
// NAVIGATION
// ===========================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 20);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

const openMobileMenu = () => {
  navLinks.classList.add('open');
  navToggle.classList.add('active');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
};

const closeMobileMenu = () => {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

navToggle.setAttribute('aria-expanded', 'false');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close when tapping empty menu overlay area
navLinks.addEventListener('click', (event) => {
  if (event.target === navLinks) {
    closeMobileMenu();
  }
});

// Close on escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMobileMenu();
  }
});

// Ensure menu resets when leaving mobile breakpoint
window.addEventListener('resize', () => {
  if (window.innerWidth > 680 && navLinks.classList.contains('open')) {
    closeMobileMenu();
  }
});

// ===========================
// SCROLL REVEAL (staggered)
// ===========================
const revealElements = document.querySelectorAll(
  '.section__header, .about__text, .about__highlights, .highlight-card, ' +
  '.service-card, .process-step, .pricing-card, .pricing__note, .contact__info, .contact__form'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? [...parent.children].filter(c => c.classList.contains('reveal')) : [];
        const index = siblings.indexOf(entry.target);
        const delay = index > 0 ? index * 100 : 0;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ===========================
// ACTIVE NAV LINK HIGHLIGHT
// ===========================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const activateNavLink = () => {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) {
          a.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', activateNavLink);

// ===========================
// MAGNETIC BUTTONS
// ===========================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===========================
// PARALLAX HERO
// ===========================
const heroGradient = document.querySelector('.hero__gradient');
if (heroGradient) {
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight) {
      heroGradient.style.transform = `translateY(${scroll * 0.3}px)`;
    }
  });
}

// ===========================
// TEXT SCRAMBLE (hero name)
// ===========================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.frame = 0;
    this.queue = [];
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    return new Promise(resolve => {
      this.resolve = resolve;
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

const heroName = document.querySelector('.hero__title');
if (heroName) {
  const nameNode = [...heroName.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  if (nameNode) {
    const span = document.createElement('span');
    span.className = 'hero__name-scramble';
    span.textContent = nameNode.textContent.trim();
    nameNode.replaceWith(span);
    setTimeout(() => {
      const fx = new TextScramble(span);
      fx.setText('Rowan Jarvis');
    }, 800);
  }
}

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===========================
// CONTACT FORM
// ===========================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  fetch(contactForm.action, {
    method: 'POST',
    body: new FormData(contactForm),
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        contactForm.reset();
        btn.textContent = 'Message Sent';
        btn.style.background = '#10b981';
      } else {
        btn.textContent = 'Something went wrong';
        btn.style.background = '#ef4444';
      }
    })
    .catch(() => {
      btn.textContent = 'Something went wrong';
      btn.style.background = '#ef4444';
    })
    .finally(() => {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
});

// ===========================
// PAGE LOAD TRANSITION
// ===========================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
