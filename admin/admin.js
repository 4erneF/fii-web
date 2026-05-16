/* =========================================================
   CMS · Факультет ИИ — admin panel logic.
   Talks to the FastAPI backend (window.FiiAdminApi) instead of
   localStorage, so changes are visible on the public site
   immediately on the next page load.
   ========================================================= */

(function () {
  'use strict';

  const api = window.FiiAdminApi;
  if (!api) { console.error('admin-api.js не загружен'); return; }

  // Gatekeep: no token → login page.
  if (!api.getToken()) { location.replace('login.html'); return; }

  // ----- Utilities --------------------------------------------------
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const showToast = (msg, duration = 2600) => {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-visible'), duration);
  };

  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // In-memory mirror of server state. Filled by load*() calls.
  const state = {
    content:    {},  // { [page_key]: { [tile_id]: { [field_id]: value } } }
    visibility: {},  // { [page_key]: { [tile_id]: bool } }
    ticker:     [],
    news:       [],
    photos:     [],
  };

  const PAGE_REGISTRY = window.PAGE_REGISTRY || [];

  // ----- Boot: verify session + fetch state -------------------------
  (async function boot() {
    try {
      const user = await api.me();
      const nameEl = $('#userName');
      const avatarEl = $('#userAvatar');
      if (nameEl) nameEl.textContent = user.username;
      if (avatarEl) avatarEl.textContent = (user.username || '?').slice(0, 2).toUpperCase();

      await Promise.all([loadBlocks(), loadVisibility(), loadTicker(), loadNews(), loadPhotos()]);
      renderPagesTree();
      renderTickerList();
      renderNewsTable();
      renderPhotoGrid();
    } catch (e) {
      console.error(e);
      showToast('Не удалось подключиться к серверу');
    }
  })();

  // ----- Logout -----------------------------------------------------
  $('#logoutBtn')?.addEventListener('click', () => api.logout());

  // ----- Tab switching ---------------------------------------------
  const pageMeta = {
    pages:        { title: 'Страницы сайта',  subtitle: 'Управление видимостью плашек и текстом на каждой странице' },
    news:         { title: 'Новости',         subtitle: 'Управление публикациями факультета' },
    photos:       { title: 'Фотографии',      subtitle: 'Галерея факультета' },
    achievements: { title: 'Достижения',      subtitle: 'Карточки побед и наград' },
    ticker:       { title: 'Бегущая строка',  subtitle: 'Строки под шапкой главной страницы' },
    settings:     { title: 'Настройки сайта', subtitle: 'Тексты, контакты и блоки' },
  };

  const switchSection = (key) => {
    $$('.admin-nav__link').forEach(btn =>
      btn.classList.toggle('is-active', btn.dataset.section === key));
    $$('.admin-section').forEach(sec =>
      sec.classList.toggle('is-active', sec.dataset.section === key));
    const meta = pageMeta[key];
    if (meta) {
      $('#pageTitle').textContent = meta.title;
      $('#pageSubtitle').textContent = meta.subtitle;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  $$('.admin-nav__link').forEach(btn =>
    btn.addEventListener('click', () => switchSection(btn.dataset.section)));

  // =================================================================
  //  BLOCKS / VISIBILITY
  // =================================================================
  async function loadBlocks() {
    const rows = await api.listBlocks();
    state.content = {};
    for (const r of rows) {
      (state.content[r.page_key] ||= {});
      (state.content[r.page_key][r.tile_id] ||= {});
      state.content[r.page_key][r.tile_id][r.field_id] = r.value;
    }
  }

  async function loadVisibility() {
    const rows = await api.listVisibility();
    state.visibility = {};
    for (const r of rows) {
      (state.visibility[r.page_key] ||= {});
      state.visibility[r.page_key][r.tile_id] = r.is_visible;
    }
  }

  const isTileVisible = (pageKey, tileId) =>
    state.visibility[pageKey]?.[tileId] !== false;

  const getFieldValue = (pageKey, tileId, fieldId, fallback) => {
    const v = state.content[pageKey]?.[tileId]?.[fieldId];
    return v !== undefined ? v : fallback;
  };

  const isTileEdited = (pageKey, tileId) =>
    !!(state.content[pageKey]?.[tileId] && Object.keys(state.content[pageKey][tileId]).length);

  // ----- Render pages tree -----------------------------------------
  const renderFieldControl = (pageKey, tileId, field, value) => {
    const name = `${pageKey}__${tileId}__${field.id}`;
    const valueAttr = escapeHtml(value);
    if (field.type === 'text') {
      return `
        <label class="field-editor">
          <span class="field-editor__label">${escapeHtml(field.label)}</span>
          <input type="text" class="field-editor__input" name="${name}"
                 data-field="${field.id}" value="${valueAttr}">
        </label>`;
    }
    const hint = field.type === 'html'
      ? '<span class="field-editor__hint">Поддерживается HTML (например, &lt;br&gt;, &lt;strong&gt;)</span>'
      : '';
    return `
      <label class="field-editor">
        <span class="field-editor__label">${escapeHtml(field.label)}</span>
        <textarea class="field-editor__input field-editor__input--area" rows="3"
                  name="${name}" data-field="${field.id}"
                  data-type="${field.type}">${valueAttr}</textarea>
        ${hint}
      </label>`;
  };

  function renderPagesTree() {
    const tree = $('#pagesTree');
    if (!tree) return;
    tree.innerHTML = PAGE_REGISTRY.map(page => {
      const hiddenCount = page.tiles.filter(t => !isTileVisible(page.key, t.id)).length;
      const counterText = hiddenCount > 0
        ? `${page.tiles.length - hiddenCount} / ${page.tiles.length} активно`
        : `${page.tiles.length} плашек`;
      const rows = page.tiles.map(tile => {
        const visible = isTileVisible(page.key, tile.id);
        const edited  = isTileEdited(page.key, tile.id);
        const fieldsHtml = (tile.fields || []).map(field => {
          const current = getFieldValue(page.key, tile.id, field.id, field.default);
          return renderFieldControl(page.key, tile.id, field, current);
        }).join('');
        return `
          <li class="tile-row" data-tile-id="${escapeHtml(tile.id)}">
            <div class="tile-row__main">
              <button class="tile-row__expand" type="button" aria-expanded="false" aria-label="Редактировать текст">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <div class="tile-row__label">
                <span class="tile-row__name">
                  ${escapeHtml(tile.name)}
                  ${edited ? '<span class="tile-row__badge">изменено</span>' : ''}
                </span>
                <span class="tile-row__id">data-tile="${escapeHtml(tile.id)}"</span>
              </div>
              <label class="switch" title="${visible ? 'Скрыть' : 'Показать'}">
                <input type="checkbox" data-page="${page.key}" data-tile="${tile.id}" ${visible ? 'checked' : ''}>
                <span class="switch__slider"></span>
              </label>
            </div>
            ${fieldsHtml ? `
              <form class="tile-row__editor" data-page="${page.key}" data-tile="${tile.id}">
                <div class="tile-row__fields">${fieldsHtml}</div>
                <div class="tile-row__actions">
                  <button type="button" class="btn btn--ghost tile-row__reset">Сбросить к исходному</button>
                  <button type="submit" class="btn btn--primary">Сохранить текст</button>
                </div>
              </form>` : ''}
          </li>`;
      }).join('');
      return `
        <div class="page-item" data-page-key="${page.key}">
          <button class="page-item__head" type="button" aria-expanded="false">
            <svg class="page-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            <span class="page-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            <span class="page-item__info">
              <span class="page-item__title">${escapeHtml(page.title)}</span>
              <span class="page-item__meta">${escapeHtml(page.file)}</span>
            </span>
            <span class="page-item__counter">${counterText}</span>
          </button>
          <div class="page-item__body">
            <ul class="tile-list">${rows}</ul>
          </div>
        </div>`;
    }).join('');
  }

  // ----- Pages tree interactions -----------------------------------
  const pagesTree = $('#pagesTree');
  if (pagesTree) {
    pagesTree.addEventListener('click', async (e) => {
      const head = e.target.closest('.page-item__head');
      if (head && !e.target.closest('.switch')) {
        const item = head.closest('.page-item');
        const wasOpen = item.classList.toggle('is-open');
        head.setAttribute('aria-expanded', wasOpen ? 'true' : 'false');
        return;
      }
      const expandBtn = e.target.closest('.tile-row__expand');
      if (expandBtn) {
        const row = expandBtn.closest('.tile-row');
        const isOpen = row.classList.toggle('is-editing');
        expandBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        return;
      }
      const resetTileBtn = e.target.closest('.tile-row__reset');
      if (resetTileBtn) {
        const form = resetTileBtn.closest('form.tile-row__editor');
        if (!form) return;
        const pageKey = form.dataset.page;
        const tileId  = form.dataset.tile;
        if (!confirm('Вернуть исходный текст этой плашки?')) return;
        try {
          await api.deleteTile(pageKey, tileId);
          delete state.content[pageKey]?.[tileId];
          const pageDef = PAGE_REGISTRY.find(p => p.key === pageKey);
          const tileDef = pageDef && pageDef.tiles.find(t => t.id === tileId);
          if (tileDef) {
            (tileDef.fields || []).forEach(field => {
              const input = form.querySelector(`[data-field="${field.id}"]`);
              if (input) input.value = field.default;
            });
          }
          const row = form.closest('.tile-row');
          row?.querySelector('.tile-row__badge')?.remove();
          showToast('Текст плашки сброшен к исходному');
        } catch (err) { showToast(err.message); }
      }
    });

    pagesTree.addEventListener('submit', async (e) => {
      const form = e.target.closest('form.tile-row__editor');
      if (!form) return;
      e.preventDefault();
      const pageKey = form.dataset.page;
      const tileId  = form.dataset.tile;
      const inputs = form.querySelectorAll('[data-field]');
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      try {
        for (const input of inputs) {
          const fieldId = input.dataset.field;
          await api.saveBlock({ page_key: pageKey, tile_id: tileId, field_id: fieldId, value: input.value });
          (state.content[pageKey] ||= {});
          (state.content[pageKey][tileId] ||= {});
          state.content[pageKey][tileId][fieldId] = input.value;
        }
        const row = form.closest('.tile-row');
        const nameEl = row?.querySelector('.tile-row__name');
        if (nameEl && !nameEl.querySelector('.tile-row__badge')) {
          const badge = document.createElement('span');
          badge.className = 'tile-row__badge';
          badge.textContent = 'изменено';
          nameEl.appendChild(badge);
        }
        showToast('Текст плашки сохранён ✓');
      } catch (err) {
        showToast('Не удалось сохранить: ' + err.message);
      } finally {
        submitBtn.disabled = false;
      }
    });

    pagesTree.addEventListener('change', async (e) => {
      const input = e.target.closest('input[type="checkbox"][data-tile]');
      if (!input) return;
      const pageKey = input.dataset.page;
      const tileId  = input.dataset.tile;
      const visible = input.checked;
      try {
        await api.setVisibility({ page_key: pageKey, tile_id: tileId, is_visible: visible });
        (state.visibility[pageKey] ||= {});
        state.visibility[pageKey][tileId] = visible;

        const pageEl = input.closest('.page-item');
        const pageDef = PAGE_REGISTRY.find(p => p.key === pageKey);
        if (pageEl && pageDef) {
          const hiddenCount = pageDef.tiles.filter(t => !isTileVisible(pageKey, t.id)).length;
          const counter = pageEl.querySelector('.page-item__counter');
          if (counter) {
            counter.textContent = hiddenCount > 0
              ? `${pageDef.tiles.length - hiddenCount} / ${pageDef.tiles.length} активно`
              : `${pageDef.tiles.length} плашек`;
          }
        }
        showToast(visible ? 'Плашка показана ✓' : 'Плашка скрыта');
      } catch (err) {
        input.checked = !visible;
        showToast('Не удалось сохранить: ' + err.message);
      }
    });
  }

  $('#pagesReset')?.addEventListener('click', async () => {
    if (!confirm('Сбросить все изменения: показать все плашки и вернуть исходные тексты?')) return;
    try {
      await api.resetAll();
      state.content = {};
      state.visibility = {};
      renderPagesTree();
      showToast('Все настройки сброшены');
    } catch (err) { showToast(err.message); }
  });

  // =================================================================
  //  TICKER
  // =================================================================
  async function loadTicker() {
    state.ticker = await api.getTicker();
  }

  function renderTickerList() {
    const list = $('#tickerList');
    const countEl = $('#tickerCount');
    if (!list) return;
    if (countEl) countEl.textContent = state.ticker.length;
    list.innerHTML = state.ticker.map((text, i) => `
      <li class="ticker-admin-item" data-index="${i}">
        <span class="ticker-admin-num">${i + 1}</span>
        <input type="text" class="ticker-admin-input" value="${escapeHtml(text)}" data-index="${i}" placeholder="Текст строки…">
        <button class="icon-btn icon-btn--danger ticker-del-btn" data-index="${i}" title="Удалить">🗑</button>
      </li>`).join('');
  }

  $('#tickerList')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.ticker-del-btn');
    if (!btn) return;
    state.ticker.splice(Number(btn.dataset.index), 1);
    renderTickerList();
  });

  $('#tickerAddItem')?.addEventListener('click', () => {
    state.ticker.push('Новая строка…');
    renderTickerList();
    const lastInput = $('#tickerList').querySelector('.ticker-admin-item:last-child .ticker-admin-input');
    if (lastInput) { lastInput.focus(); lastInput.select(); }
  });

  $('#tickerSave')?.addEventListener('click', async () => {
    const items = $$('.ticker-admin-input').map(i => i.value.trim()).filter(Boolean);
    try {
      state.ticker = await api.replaceTicker(items);
      renderTickerList();
      showToast('Бегущая строка сохранена ✓');
    } catch (err) { showToast(err.message); }
  });

  $('#tickerReset')?.addEventListener('click', async () => {
    if (!confirm('Очистить все строки бегущей строки?')) return;
    try {
      state.ticker = await api.replaceTicker([]);
      renderTickerList();
      showToast('Бегущая строка очищена');
    } catch (err) { showToast(err.message); }
  });

  // =================================================================
  //  NEWS
  // =================================================================
  async function loadNews() {
    state.news = await api.listNews();
  }

  function renderNewsTable() {
    const tbody = $('#newsTbody');
    const countEl = $('#newsCount');
    if (!tbody) return;
    if (countEl) countEl.textContent = state.news.length;
    tbody.innerHTML = state.news.map(n => {
      const statusCls = n.status === 'published' ? 'status--published' : 'status--draft';
      const statusTxt = n.status === 'published' ? 'Опубликовано' : 'Черновик';
      const dateFmt = n.publish_date ? new Date(n.publish_date).toLocaleDateString('ru-RU') : '—';
      return `
        <tr data-news-id="${n.id}">
          <td>${escapeHtml(n.title)}</td>
          <td>${dateFmt}</td>
          <td><span class="status ${statusCls}">${statusTxt}</span></td>
          <td class="admin-table__actions">
            <button class="icon-btn icon-btn--danger" title="Удалить">🗑</button>
          </td>
        </tr>`;
    }).join('');
  }

  // News modal
  const newsModal = $('#newsModal');
  const openModal  = () => { newsModal.classList.add('is-open');    newsModal.setAttribute('aria-hidden', 'false'); };
  const closeModal = () => { newsModal.classList.remove('is-open'); newsModal.setAttribute('aria-hidden', 'true');  };
  $('#openNewsModal')?.addEventListener('click', openModal);
  newsModal?.addEventListener('click', (e) => { if (e.target.matches('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && newsModal?.classList.contains('is-open')) closeModal();
  });

  // WYSIWYG toolbar
  $$('.wysiwyg__toolbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      let val = btn.dataset.value || null;
      if (cmd === 'createLink') {
        val = prompt('URL ссылки:', 'https://');
        if (!val) return;
      }
      document.execCommand(cmd, false, val);
      $('.wysiwyg__area').focus();
    });
  });

  $('#newsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('content', $('.wysiwyg__area').innerHTML);
    // The form field is named `date` in HTML, API expects `publish_date`.
    const d = fd.get('date');
    if (d) fd.set('publish_date', new Date(d).toISOString());
    fd.delete('date');
    const cover = fd.get('cover');
    if (!cover || (cover instanceof File && !cover.size)) fd.delete('cover');

    try {
      const created = await api.createNews(fd);
      state.news.unshift(created);
      renderNewsTable();
      closeModal();
      form.reset();
      $('.wysiwyg__area').innerHTML = '';
      showToast('Новость сохранена ✓');
    } catch (err) {
      showToast('Не удалось сохранить: ' + err.message);
    }
  });

  $('#newsTable')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.icon-btn--danger');
    if (!btn) return;
    const row = btn.closest('tr');
    const id = Number(row?.dataset.newsId);
    if (!id || !confirm('Удалить новость?')) return;
    try {
      await api.deleteNews(id);
      state.news = state.news.filter(n => n.id !== id);
      renderNewsTable();
      showToast('Новость удалена');
    } catch (err) { showToast(err.message); }
  });

  // =================================================================
  //  PHOTOS
  // =================================================================
  async function loadPhotos() {
    state.photos = await api.listPhotos();
  }

  function renderPhotoGrid() {
    const grid = $('#photoGrid');
    if (!grid) return;
    grid.innerHTML = state.photos.map(p => `
      <figure class="photo-card" data-photo-id="${p.id}">
        <div class="photo-card__img" style="background-image:url('${escapeHtml(p.url)}')"></div>
        <figcaption>
          <span>${escapeHtml(p.original_name || p.url.split('/').pop())}</span>
          <button class="icon-btn icon-btn--danger" title="Удалить">🗑</button>
        </figcaption>
      </figure>`).join('');
  }

  const dropzone   = $('#dropzone');
  const photoInput = $('#photoInput');
  const photoGrid  = $('#photoGrid');

  dropzone?.addEventListener('click', () => photoInput.click());
  $('#photoBrowse')?.addEventListener('click', (e) => { e.stopPropagation(); photoInput.click(); });

  ['dragenter', 'dragover'].forEach(evt =>
    dropzone?.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('is-drag'); }));
  ['dragleave', 'drop'].forEach(evt =>
    dropzone?.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('is-drag'); }));
  dropzone?.addEventListener('drop',   (e) => handleFiles(e.dataTransfer.files));
  photoInput?.addEventListener('change', (e) => handleFiles(e.target.files));

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    showToast(`Загружаем ${files.length} файл(ов)…`);
    try {
      const created = await api.uploadPhotos(files);
      state.photos = [...created, ...state.photos];
      renderPhotoGrid();
      showToast(`Загружено: ${created.length}`);
    } catch (err) {
      showToast('Ошибка загрузки: ' + err.message);
    }
  }

  photoGrid?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.icon-btn--danger');
    if (!btn) return;
    const fig = btn.closest('.photo-card');
    const id = Number(fig?.dataset.photoId);
    if (!id || !confirm('Удалить фото?')) return;
    try {
      await api.deletePhoto(id);
      state.photos = state.photos.filter(p => p.id !== id);
      renderPhotoGrid();
      showToast('Фото удалено');
    } catch (err) { showToast(err.message); }
  });

  // =================================================================
  //  ACHIEVEMENTS & SETTINGS — UI stubs (legacy demo forms).
  //  These remain visible but inert until they get DB-backed schemas.
  // =================================================================
  $('#achievementForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Раздел «Достижения» пока редактируется через «Страницы сайта»');
  });
  $('#settingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Эти поля скоро будут привязаны к блокам сайта');
  });
  $('#achievementList')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-btn--danger');
    if (btn) btn.closest('.achievement-item')?.remove();
  });
})();
