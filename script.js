// ===========================
// NAVIGATION
// ===========================

// Scroll effect on nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 20);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===========================
// SCROLL REVEAL
// ===========================
const revealElements = document.querySelectorAll(
  '.section__header, .about__text, .about__highlights, .highlight-card, ' +
  '.service-card, .contact__info, .contact__form'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
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
// CONTACT FORM
// ===========================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  // Simple client-side feedback (no backend)
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#10b981';
  btn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
  btn.disabled = true;

  contactForm.reset();

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.boxShadow = '';
    btn.disabled = false;
  }, 3000);
});

// ===========================
// SMOOTH SCROLL POLYFILL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===========================
// CHATBOT (OpenAI-powered)
// ===========================
(() => {
  const chatbot = document.getElementById('chatbot');
  const trigger = document.getElementById('chatbotTrigger');
  const messages = document.getElementById('chatbotMessages');
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatbotInput');
  const suggestions = document.getElementById('chatbotSuggestions');
  const settingsBtn = document.getElementById('chatbotSettingsBtn');
  const settingsPanel = document.getElementById('chatbotSettings');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiKeySave = document.getElementById('apiKeySave');

  // API key management
  const STORAGE_KEY = 'rj_openai_key';

  function getApiKey() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  function saveApiKey(key) {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Populate saved key
  apiKeyInput.value = getApiKey();

  // Toggle settings panel
  settingsBtn.addEventListener('click', () => {
    const visible = settingsPanel.style.display !== 'none';
    settingsPanel.style.display = visible ? 'none' : 'block';
    if (!visible) apiKeyInput.focus();
  });

  apiKeySave.addEventListener('click', () => {
    saveApiKey(apiKeyInput.value);
    settingsPanel.style.display = 'none';
    addMessage('API key saved ✓', 'bot');
  });

  // Toggle open/close
  trigger.addEventListener('click', () => {
    chatbot.classList.toggle('open');
    if (chatbot.classList.contains('open')) {
      setTimeout(() => input.focus(), 250);
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (chatbot.classList.contains('open') && !chatbot.contains(e.target)) {
      chatbot.classList.remove('open');
    }
  });

  // System prompt with full context about Rowan
  const SYSTEM_PROMPT = `You are a friendly, professional assistant on Rowan Jarvis's freelance web development website. Your job is to answer questions from prospective clients about Rowan's web development services. Be concise, warm, and confident. Use short paragraphs.

ABOUT ROWAN:
- Name: Rowan Jarvis
- Title: Freelance Web Developer
- Location: London, UK
- Email: rowanjarvis@icloud.com
- LinkedIn: linkedin.com/in/rowanjarvis

WHAT HE BUILDS:
- Custom, hand-coded websites — no WordPress, no templates, no page builders
- Business websites, portfolios, landing pages, and multi-page sites
- Everything is built from scratch with clean HTML, CSS, and JavaScript
- Mobile-first, fully responsive design that works on every device
- Fast-loading, lightweight code optimised for performance and SEO
- Semantic, accessible markup that ranks well on search engines

HIS PROCESS:
1. Discovery — understand your goals, brand, and audience
2. Design — create a visual direction and layout
3. Build — hand-code the site with HTML, CSS, and JS
4. Review — collaborative feedback and revisions
5. Launch — deploy, test across devices, and go live

TECH STACK:
- HTML5, CSS3 (custom properties, flexbox, grid)
- Vanilla JavaScript (no heavy frameworks unless needed)
- Git & GitHub for version control
- Optimised for Core Web Vitals and Lighthouse scores
- Can integrate APIs, contact forms, and third-party tools

PRICING (rough guide):
- Single-page / landing page: from £500
- Multi-page business site: from £1,000
- Custom / complex projects: quoted individually
- All projects include responsive design, basic SEO, and deployment
- Ongoing maintenance available

TIMELINES:
- Landing pages: 1–2 weeks
- Business sites: 2–4 weeks
- Larger projects: scoped individually
- Turnaround depends on content readiness and feedback speed

WHY ROWAN:
- 100% hand-coded — no bloated themes or plugins
- Clean, modern design with attention to detail
- Direct communication — you work with Rowan, not a middleman
- Fair, transparent pricing with no hidden costs
- Based in London, available for in-person or remote projects

IMPORTANT RULES:
- Only answer questions related to Rowan's web development services
- If asked about something you don't know, say so honestly and suggest they email him
- Never make up facts
- Keep answers concise (2-4 sentences max unless more detail is asked for)
- If someone asks to contact him or get a quote, give his email: rowanjarvis@icloud.com
- If asked about pricing, give the rough ranges above and suggest getting in touch for an accurate quote`;

  // Conversation history for context
  let conversationHistory = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chatbot__message chatbot__message--${type}`;
    const p = document.createElement('p');
    p.textContent = text;
    div.appendChild(p);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chatbot__typing';
    div.id = 'chatbotTyping';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('chatbotTyping');
    if (typing) typing.remove();
  }

  async function callOpenAI(userMessage) {
    const apiKey = getApiKey();
    if (!apiKey) {
      return 'Please add your OpenAI API key first — click the ☀ icon in the header above.';
    }

    conversationHistory.push({ role: 'user', content: userMessage });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: conversationHistory,
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 401) {
          return 'Invalid API key. Click the ☀ icon above to update it.';
        }
        if (response.status === 429) {
          return 'Rate limit reached — please wait a moment and try again.';
        }
        return `Something went wrong (${response.status}). Please try again.`;
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I couldn\'t generate a response.';

      // Keep conversation context (limit to last 10 exchanges to control tokens)
      conversationHistory.push({ role: 'assistant', content: reply });
      if (conversationHistory.length > 22) {
        conversationHistory = [
          conversationHistory[0],
          ...conversationHistory.slice(-20)
        ];
      }

      return reply;
    } catch (error) {
      console.error('Chatbot error:', error);
      return 'Connection error — please check your internet and try again.';
    }
  }

  async function handleQuestion(question) {
    // Hide suggestions after first interaction
    if (suggestions) suggestions.style.display = 'none';

    // Add user message
    addMessage(question, 'user');

    // Show typing indicator
    showTyping();

    // Disable input while waiting
    input.disabled = true;

    const answer = await callOpenAI(question);

    removeTyping();
    addMessage(answer, 'bot');
    input.disabled = false;
    input.focus();
  }

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question || input.disabled) return;
    input.value = '';
    handleQuestion(question);
  });

  // Suggestion chips
  document.querySelectorAll('.chatbot__suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question');
      handleQuestion(question);
    });
  });
})();
