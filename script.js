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
  '.service-card, .timeline__item, .skill-group, .contact__info, .contact__form'
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
  const SYSTEM_PROMPT = `You are a friendly, professional assistant on Rowan Jarvis's personal website. Your job is to answer questions from prospective clients, recruiters, and hiring managers about Rowan. Be concise, warm, and confident. Use short paragraphs. Here is everything you know:

ABOUT ROWAN:
- Name: Rowan Jarvis
- Title: AI Strategy Consultant & Web Developer
- Location: London, UK
- Email: rowanjarvis@icloud.com
- LinkedIn: linkedin.com/in/rowanjarvis

CURRENT ROLE (May 2024 – Present):
- AI Analyst in Gen AI Strategy & Operations at HSBC, London
- Manages the lifecycle of 150+ Generative AI use cases from POC to Production
- Works within CIB (Corporate & Institutional Banking), impacting 51,000+ colleagues
- Navigates complex risk frameworks and governance processes
- Delivered millions of pounds in process optimisation savings
- Built Python automation that reduced a fortnightly reporting task from 4 hours to 10 minutes
- Created a reusable NLP script for thematic usage analysis, saving hours of manual review
- Advises senior leadership on AI commercialisation and technical feasibility
- Drives AI adoption through targeted stakeholder engagements

PREVIOUS EXPERIENCE:
- DataKind Data Analyst Volunteer (February 2024)
- Analysed complex datasets for Youth Sport Trust
- Uncovered positive correlation between physical activity and GCSE results
- Work influenced UK government policy on youth physical activity

TECHNICAL SKILLS:
- Languages: Python, JavaScript, HTML/CSS, SQL, VBA
- AI & Data: LLMs, Prompt Engineering, NLP, Pandas, NumPy, Data Visualisation
- Automation: Power Query, Advanced Excel, workflow automation
- Web: Responsive design, Git/GitHub, UI/UX principles, performance optimisation

STRATEGIC SKILLS:
- AI Governance, Product Strategy, Commercialisation, Risk Frameworks
- Stakeholder Management, Agile/Scrum

SERVICES HE OFFERS:
1. AI Strategy & Governance consulting
2. Process Automation (Python, VBA, Power Query)
3. Data Science & Analytics (NLP, dashboards, data viz)
4. Web Design & Development (HTML/CSS/JS, responsive, clean design)

KEY DIFFERENTIATORS:
- Bridges technical AI expertise with commercial/strategic thinking — rare combination
- Hands-on builder (Python, web dev) who also advises at the strategic level
- 2+ years of experience in Tier 1 Financial Services AI
- 150+ Gen AI use cases managed, 60,000+ end users impacted
- Passionate web developer as a creative side craft

WHAT HE'S LOOKING FOR:
- Open to consulting, freelance, and full-time opportunities
- Interested in roles focused on AI product management, strategy, and commercialisation
- Available for web development projects

IMPORTANT RULES:
- Only answer questions related to Rowan, his work, skills, and services
- If asked about something you don't know about Rowan, say so honestly and suggest they email him
- Never make up facts about Rowan
- Keep answers concise (2-4 sentences max unless more detail is asked for)
- If someone asks to contact him, give his email: rowanjarvis@icloud.com`;

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
