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

// ===== ADMIN PANEL FAB =====
// Внедряем плавающую кнопку «Панель администратора» на всех страницах сайта.
// В свёрнутом состоянии — небольшая шестерёнка, при наведении курсора — разворачивается.
(function injectAdminFab() {
  if (document.querySelector('.admin-fab')) return;

  const fab = document.createElement('a');
  fab.href = 'admin.html';
  fab.className = 'admin-fab admin-fab--collapsed';
  fab.setAttribute('aria-label', 'Открыть панель администратора');
  fab.title = 'Панель администратора';
  fab.innerHTML = `
    <span class="admin-fab__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
      </svg>
    </span>
    <span class="admin-fab__label">Панель администратора</span>
  `;
  document.body.appendChild(fab);
})();

// ===== TILE VISIBILITY + CONTENT LOADER =====
// Читает из localStorage настройки, сделанные в CMS (раздел «Страницы сайта»):
//   - fii_tile_visibility — скрывает плашки, которые админ отключил;
//   - fii_tile_content    — подставляет изменённый текст для полей плашек.
// Описание страниц и плашек берётся из window.PAGE_REGISTRY (tile-registry.js).
(function applyTileOverrides() {
  const pageKey = document.body && document.body.dataset ? document.body.dataset.page : null;
  if (!pageKey) return;

  const readJSON = (key) => {
    try { return JSON.parse(localStorage.getItem(key)) || {}; }
    catch { return {}; }
  };

  const visibilityState = readJSON('fii_tile_visibility')[pageKey] || {};
  const contentState    = readJSON('fii_tile_content')[pageKey] || {};

  // Строим карту id плашки → описание полей (из общего реестра)
  const registry = window.PAGE_REGISTRY || [];
  const pageDef  = registry.find(p => p.key === pageKey);
  const fieldMap = {}; // { tileId: { fieldId: { selector, type } } }
  if (pageDef) {
    pageDef.tiles.forEach(tile => {
      fieldMap[tile.id] = {};
      (tile.fields || []).forEach(f => {
        fieldMap[tile.id][f.id] = { selector: f.selector, type: f.type };
      });
    });
  }

  document.querySelectorAll('[data-tile]').forEach((tileEl) => {
    const tileId = tileEl.dataset.tile;

    // 1) Видимость
    if (visibilityState[tileId] === false) {
      tileEl.setAttribute('hidden', '');
      tileEl.style.display = 'none';
      return; // скрытую плашку переписывать не нужно
    }

    // 2) Контент: подстановка значений полей
    const overrides = contentState[tileId];
    if (!overrides || !fieldMap[tileId]) return;

    Object.entries(overrides).forEach(([fieldId, value]) => {
      const descriptor = fieldMap[tileId][fieldId];
      if (!descriptor) return;
      const target = tileEl.querySelector(descriptor.selector);
      if (!target) return;
      if (descriptor.type === 'html') {
        target.innerHTML = value;
      } else {
        target.textContent = value;
      }
    });
  });
})();
