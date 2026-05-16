// ===== HERO COUNTDOWN =====
function calculateDaysLeft() {
  const deadline = new Date(2026, 6, 20); // 20 июля 2026 (месяцы с 0)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round((deadline - today) / msPerDay));
}

function pluralizeDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дня';
  return 'дней';
}

document.addEventListener('DOMContentLoaded', () => {
  const countdownEl = document.getElementById('heroCountdown');
  if (!countdownEl) return;
  const days = calculateDaysLeft();
  countdownEl.textContent = `${days} ${pluralizeDays(days)}`;
});

// ===== CHAT WIDGET =====
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

function openChat() {
  if (!chatWidget) return;
  chatWidget.classList.add('is-open');
  chatInput.focus();
}

function closeChat() {
  if (!chatWidget) return;
  chatWidget.classList.remove('is-open');
}

if (chatToggle) {
  chatToggle.addEventListener('click', () => {
    if (chatWidget.classList.contains('is-open')) {
      closeChat();
    } else {
      openChat();
    }
  });
}

// Send message
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-widget__msg chat-widget__msg--user';
  userMsg.textContent = text;
  chatMessages.appendChild(userMsg);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-widget__msg chat-widget__msg--bot';
    botMsg.textContent = 'Спасибо за вопрос! Сейчас я работаю в демо-режиме. Скоро здесь будет настоящий ИИ-ассистент. А пока напишите нам на admission@ai-faculty.ru 😊';
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 800);
}

if (chatSend) chatSend.addEventListener('click', sendMessage);
if (chatInput) chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// ===== SIDEBAR NAV =====
const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('is-open');
  sidebarOverlay.classList.add('is-visible');
  burger.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('is-open');
  sidebarOverlay.classList.remove('is-visible');
  burger.classList.remove('is-active');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  if (sidebar.classList.contains('is-open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Animate cards, reviews, section titles, subtitles, and hero elements
document.querySelectorAll('.card, .review, .section__title, .section__subtitle, .hero__title, .hero__subtitle, .hero__actions, .apply__inner').forEach((el) => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Add stagger delay to grid items
document.querySelectorAll('.cards, .cards--programs, .reviews__grid').forEach((grid) => {
  grid.querySelectorAll('.card, .review').forEach((item, i) => {
    item.classList.add('fade-up-delay-' + (i + 1));
  });
});

// ===== CMS overrides loader =====
// Тянет с админского API:
//   - тексты блоков (data-tile / fields из tile-registry.js)
//   - видимость блоков
//   - бегущую строку
// При недоступности API падает обратно на localStorage (дев-режим).
//
// URL API задаётся одним из способов (в порядке приоритета):
//   1. window.FII_API_BASE = 'https://admin.example.com';
//   2. <meta name="fii-api-base" content="https://admin.example.com">
//   3. пусто → ничего не тянем, работает только localStorage-fallback.
(function () {
  const metaEl = document.querySelector('meta[name="fii-api-base"]');
  const apiBase = (window.FII_API_BASE || (metaEl && metaEl.content) || '').replace(/\/$/, '');

  const pageKey = document.body?.dataset?.page || null;

  // Build a map: tile_id -> field_id -> { selector, type } from the shared registry.
  function buildFieldMap(pageDef) {
    const map = {};
    (pageDef?.tiles || []).forEach(tile => {
      map[tile.id] = {};
      (tile.fields || []).forEach(f => {
        map[tile.id][f.id] = { selector: f.selector, type: f.type };
      });
    });
    return map;
  }

  function applyOverrides(payload) {
    const registry = window.PAGE_REGISTRY || [];
    const pageDef = registry.find(p => p.key === pageKey);
    const fieldMap = buildFieldMap(pageDef);

    const visibility = payload.visibility || {};
    const content    = payload.content || {};

    document.querySelectorAll('[data-tile]').forEach((tileEl) => {
      const tileId = tileEl.dataset.tile;
      if (visibility[tileId] === false) {
        tileEl.setAttribute('hidden', '');
        tileEl.style.display = 'none';
        return;
      }
      const overrides = content[tileId];
      if (!overrides || !fieldMap[tileId]) return;
      Object.entries(overrides).forEach(([fieldId, value]) => {
        const descriptor = fieldMap[tileId][fieldId];
        if (!descriptor) return;
        const target = tileEl.querySelector(descriptor.selector);
        if (!target) return;
        if (descriptor.type === 'html') target.innerHTML = value;
        else target.textContent = value;
      });
    });
  }

  function applyTicker(items) {
    const track = document.querySelector('.ticker__track');
    if (!track || !Array.isArray(items) || !items.length) return;
    const doubled = [...items, ...items];
    track.innerHTML = doubled.map(text => {
      const span = document.createElement('span');
      span.className = 'ticker__item';
      const dot = document.createElement('span');
      dot.className = 'ticker__dot';
      span.appendChild(dot);
      span.appendChild(document.createTextNode(text));
      return span.outerHTML;
    }).join('');
  }

  function readLocalFallback() {
    const safeJson = (key) => {
      try { return JSON.parse(localStorage.getItem(key)) || {}; }
      catch { return {}; }
    };
    return {
      content:    (safeJson('fii_tile_content')[pageKey])    || {},
      visibility: (safeJson('fii_tile_visibility')[pageKey]) || {},
      ticker:     (() => {
        try { const v = JSON.parse(localStorage.getItem('fii_ticker_items')); return Array.isArray(v) ? v : []; }
        catch { return []; }
      })(),
    };
  }

  async function load() {
    if (!pageKey) return;
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/public/overrides?page_key=${encodeURIComponent(pageKey)}`,
                                { credentials: 'omit' });
        if (res.ok) {
          const data = await res.json();
          applyOverrides(data);
          applyTicker(data.ticker || []);
          return;
        }
      } catch (e) {
        console.warn('[FII] API недоступен, использую localStorage:', e.message);
      }
    }
    const fallback = readLocalFallback();
    applyOverrides(fallback);
    applyTicker(fallback.ticker);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, { once: true });
  } else {
    load();
  }
})();

// ===== CAROUSEL NAVIGATION =====
(function initCarousels() {
  const SCROLL_AMOUNT = 300;

  document.querySelectorAll('.carousel-btn').forEach((btn) => {
    const carouselId = btn.dataset.carousel;
    const carousel = document.getElementById(carouselId + 'Carousel');
    if (!carousel) return;

    btn.addEventListener('click', () => {
      const dir = btn.classList.contains('carousel-btn--prev') ? -1 : 1;
      carousel.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: 'smooth' });
    });
  });
})();

