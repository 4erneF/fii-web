/* =========================================================
   CMS · Факультет ИИ — admin panel logic
   - tab switching
   - modal open/close
   - news form (simulated POST)
   - WYSIWYG toolbar
   - drag & drop photo upload
   - toast notifications
   ========================================================= */

(function () {
  'use strict';

  // ----- Utilities --------------------------------------------------
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const showToast = (msg, duration = 2600) => {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-visible'), duration);
  };

  // ----- Tab switching ----------------------------------------------
  const pageMeta = {
    pages:        { title: 'Страницы сайта', subtitle: 'Управление видимостью плашек на каждой странице' },
    news:         { title: 'Новости',       subtitle: 'Управление публикациями факультета' },
    photos:       { title: 'Фотографии',    subtitle: 'Галерея факультета' },
    achievements: { title: 'Достижения',    subtitle: 'Карточки побед и наград' },
    settings:     { title: 'Настройки сайта', subtitle: 'Тексты, контакты и блоки' },
  };

  // ----- PAGE / TILE REGISTRY ---------------------------------------
  // Общий реестр страниц и плашек вынесен в tile-registry.js, чтобы его
  // могли использовать и админ-панель, и публичные страницы сайта.
  const PAGE_REGISTRY = window.PAGE_REGISTRY || [];

  // Структура реестра для справки (реальное определение — в tile-registry.js):
  //   { key, title, file, tiles: [
  //       { id, name, fields: [
  //           { id, label, selector, type: 'text'|'html'|'multiline', default }
  //       ]}
  //   ]}

  const VISIBILITY_KEY = 'fii_tile_visibility';
  const CONTENT_KEY    = 'fii_tile_content';

  // visibility state: { [pageKey]: { [tileId]: boolean } }; true/undefined = видимо, false = скрыто
  const loadVisibility = () => {
    try { return JSON.parse(localStorage.getItem(VISIBILITY_KEY)) || {}; }
    catch { return {}; }
  };
  const saveVisibility = (state) => {
    localStorage.setItem(VISIBILITY_KEY, JSON.stringify(state));
  };
  const isTileVisible = (state, pageKey, tileId) => {
    const page = state[pageKey];
    if (!page) return true;
    return page[tileId] !== false;
  };
  const setTileVisibility = (pageKey, tileId, visible) => {
    const state = loadVisibility();
    if (!state[pageKey]) state[pageKey] = {};
    state[pageKey][tileId] = visible;
    saveVisibility(state);
  };

  // content overrides: { [pageKey]: { [tileId]: { [fieldId]: string } } }
  const loadContent = () => {
    try { return JSON.parse(localStorage.getItem(CONTENT_KEY)) || {}; }
    catch { return {}; }
  };
  const saveContent = (state) => {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(state));
  };
  const getFieldValue = (state, pageKey, tileId, fieldId, fallback) => {
    const v = state?.[pageKey]?.[tileId]?.[fieldId];
    return v !== undefined ? v : fallback;
  };
  const setFieldValue = (pageKey, tileId, fieldId, value) => {
    const state = loadContent();
    if (!state[pageKey]) state[pageKey] = {};
    if (!state[pageKey][tileId]) state[pageKey][tileId] = {};
    state[pageKey][tileId][fieldId] = value;
    saveContent(state);
  };
  const clearTileContent = (pageKey, tileId) => {
    const state = loadContent();
    if (state[pageKey] && state[pageKey][tileId]) {
      delete state[pageKey][tileId];
      if (!Object.keys(state[pageKey]).length) delete state[pageKey];
      saveContent(state);
    }
  };
  const isTileEdited = (state, pageKey, tileId) => {
    return !!(state[pageKey] && state[pageKey][tileId] && Object.keys(state[pageKey][tileId]).length);
  };

  // ----- Render pages tree ------------------------------------------
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
    // 'multiline' или 'html'
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

  const renderPagesTree = () => {
    const tree = $('#pagesTree');
    if (!tree) return;
    const visState  = loadVisibility();
    const contState = loadContent();
    tree.innerHTML = PAGE_REGISTRY.map(page => {
      const hiddenCount = page.tiles.filter(t => !isTileVisible(visState, page.key, t.id)).length;
      const counterText = hiddenCount > 0
        ? `${page.tiles.length - hiddenCount} / ${page.tiles.length} активно`
        : `${page.tiles.length} плашек`;
      const rows = page.tiles.map(tile => {
        const visible = isTileVisible(visState, page.key, tile.id);
        const edited  = isTileEdited(contState, page.key, tile.id);
        const fieldsHtml = (tile.fields || []).map(field => {
          const current = getFieldValue(contState, page.key, tile.id, field.id, field.default);
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
  };

  const switchSection = (key) => {
    $$('.admin-nav__link').forEach(btn =>
      btn.classList.toggle('is-active', btn.dataset.section === key)
    );
    $$('.admin-section').forEach(sec =>
      sec.classList.toggle('is-active', sec.dataset.section === key)
    );
    const meta = pageMeta[key];
    if (meta) {
      $('#pageTitle').textContent = meta.title;
      $('#pageSubtitle').textContent = meta.subtitle;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  $$('.admin-nav__link').forEach(btn =>
    btn.addEventListener('click', () => switchSection(btn.dataset.section))
  );

  // ----- Pages tree: render + interactions --------------------------
  renderPagesTree();

  const pagesTree = $('#pagesTree');
  if (pagesTree) {
    // Аккордеон: разворачивание/сворачивание страницы
    pagesTree.addEventListener('click', (e) => {
      // Клик по заголовку страницы
      const head = e.target.closest('.page-item__head');
      if (head && !e.target.closest('.switch')) {
        const item = head.closest('.page-item');
        const wasOpen = item.classList.toggle('is-open');
        head.setAttribute('aria-expanded', wasOpen ? 'true' : 'false');
        return;
      }
      // Клик по кнопке «развернуть редактор плашки»
      const expandBtn = e.target.closest('.tile-row__expand');
      if (expandBtn) {
        const row = expandBtn.closest('.tile-row');
        const isOpen = row.classList.toggle('is-editing');
        expandBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        return;
      }
      // Сброс текста плашки к исходному
      const resetTileBtn = e.target.closest('.tile-row__reset');
      if (resetTileBtn) {
        const form = resetTileBtn.closest('form.tile-row__editor');
        if (!form) return;
        const pageKey = form.dataset.page;
        const tileId  = form.dataset.tile;
        if (!confirm('Вернуть исходный текст этой плашки?')) return;
        clearTileContent(pageKey, tileId);
        const pageDef = PAGE_REGISTRY.find(p => p.key === pageKey);
        const tileDef = pageDef && pageDef.tiles.find(t => t.id === tileId);
        if (tileDef) {
          (tileDef.fields || []).forEach(field => {
            const input = form.querySelector(`[data-field="${field.id}"]`);
            if (input) input.value = field.default;
          });
        }
        const row = form.closest('.tile-row');
        const badge = row && row.querySelector('.tile-row__badge');
        if (badge) badge.remove();
        showToast('Текст плашки сброшен к исходному');
      }
    });

    // Сохранение формы редактора плашки
    pagesTree.addEventListener('submit', (e) => {
      const form = e.target.closest('form.tile-row__editor');
      if (!form) return;
      e.preventDefault();
      const pageKey = form.dataset.page;
      const tileId  = form.dataset.tile;
      form.querySelectorAll('[data-field]').forEach(input => {
        const fieldId = input.dataset.field;
        setFieldValue(pageKey, tileId, fieldId, input.value);
      });
      // Отметка «изменено»
      const row = form.closest('.tile-row');
      const nameEl = row && row.querySelector('.tile-row__name');
      if (nameEl && !nameEl.querySelector('.tile-row__badge')) {
        const badge = document.createElement('span');
        badge.className = 'tile-row__badge';
        badge.textContent = 'изменено';
        nameEl.appendChild(badge);
      }
      showToast('Текст плашки сохранён ✓');
    });

    // Переключение видимости плашки
    pagesTree.addEventListener('change', (e) => {
      const input = e.target.closest('input[type="checkbox"][data-tile]');
      if (!input) return;
      const pageKey = input.dataset.page;
      const tileId  = input.dataset.tile;
      const visible = input.checked;
      setTileVisibility(pageKey, tileId, visible);

      // Обновляем счётчик на шапке страницы
      const pageEl = input.closest('.page-item');
      const state  = loadVisibility();
      const pageDef = PAGE_REGISTRY.find(p => p.key === pageKey);
      if (pageEl && pageDef) {
        const hiddenCount = pageDef.tiles.filter(t => !isTileVisible(state, pageKey, t.id)).length;
        const counter = pageEl.querySelector('.page-item__counter');
        if (counter) {
          counter.textContent = hiddenCount > 0
            ? `${pageDef.tiles.length - hiddenCount} / ${pageDef.tiles.length} активно`
            : `${pageDef.tiles.length} плашек`;
        }
      }
      showToast(visible ? 'Плашка показана ✓' : 'Плашка скрыта');
    });
  }

  // Сброс всех настроек (видимость + тексты)
  const resetBtn = $('#pagesReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Сбросить все изменения: показать все плашки и вернуть исходные тексты?')) return;
      localStorage.removeItem(VISIBILITY_KEY);
      localStorage.removeItem(CONTENT_KEY);
      renderPagesTree();
      showToast('Все настройки сброшены');
    });
  }

  // ----- Modal ------------------------------------------------------
  const newsModal = $('#newsModal');
  const openModal = () => { newsModal.classList.add('is-open'); newsModal.setAttribute('aria-hidden', 'false'); };
  const closeModal = () => { newsModal.classList.remove('is-open'); newsModal.setAttribute('aria-hidden', 'true'); };

  $('#openNewsModal').addEventListener('click', openModal);
  newsModal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && newsModal.classList.contains('is-open')) closeModal();
  });

  // ----- WYSIWYG toolbar --------------------------------------------
  $$('.wysiwyg__toolbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      let val  = btn.dataset.value || null;
      if (cmd === 'createLink') {
        val = prompt('URL ссылки:', 'https://');
        if (!val) return;
      }
      document.execCommand(cmd, false, val);
      $('.wysiwyg__area').focus();
    });
  });

  // ----- News form (simulated POST) ---------------------------------
  $('#newsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      title:   data.get('title'),
      content: $('.wysiwyg__area').innerHTML,
      date:    data.get('date'),
      status:  data.get('status'),
      cover:   data.get('cover')?.name || null,
    };

    // Simulated backend call. Swap the URL for your FastAPI endpoint.
    try {
      // await fetch('/api/admin/news', { method: 'POST', body: data });
      await new Promise(r => setTimeout(r, 450));
      console.log('POST /api/admin/news →', payload);

      // Optimistic UI update
      const tbody = $('#newsTbody');
      const row = document.createElement('tr');
      const statusCls = payload.status === 'published' ? 'status--published' : 'status--draft';
      const statusTxt = payload.status === 'published' ? 'Опубликовано' : 'Черновик';
      const dateFmt   = payload.date ? new Date(payload.date).toLocaleDateString('ru-RU') : '—';
      row.innerHTML = `
        <td>${escapeHtml(payload.title)}</td>
        <td>${dateFmt}</td>
        <td><span class="status ${statusCls}">${statusTxt}</span></td>
        <td class="admin-table__actions">
          <button class="icon-btn" title="Редактировать">✎</button>
          <button class="icon-btn icon-btn--danger" title="Удалить">🗑</button>
        </td>`;
      tbody.prepend(row);
      $('#newsCount').textContent = tbody.children.length;

      closeModal();
      form.reset();
      $('.wysiwyg__area').innerHTML = '';
      showToast('Новость сохранена ✓');
    } catch (err) {
      showToast('Не удалось сохранить новость');
      console.error(err);
    }
  });

  // Delegated delete for news rows
  $('#newsTable').addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-btn--danger');
    if (!btn) return;
    const row = btn.closest('tr');
    if (row && confirm('Удалить новость?')) {
      row.remove();
      $('#newsCount').textContent = $('#newsTbody').children.length;
      showToast('Новость удалена');
    }
  });

  // ----- Achievements form ------------------------------------------
  $('#achievementForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Достижение добавлено ✓');
    e.currentTarget.reset();
  });

  // ----- Settings form ----------------------------------------------
  $('#settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Настройки сохранены ✓');
  });

  // ----- Photos: drag & drop ----------------------------------------
  const dropzone = $('#dropzone');
  const photoInput = $('#photoInput');
  const photoGrid = $('#photoGrid');

  dropzone.addEventListener('click', () => photoInput.click());
  $('#photoBrowse').addEventListener('click', (e) => {
    e.stopPropagation();
    photoInput.click();
  });

  ['dragenter', 'dragover'].forEach(evt =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('is-drag');
    })
  );
  ['dragleave', 'drop'].forEach(evt =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-drag');
    })
  );
  dropzone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
  photoInput.addEventListener('change', (e) => handleFiles(e.target.files));

  function handleFiles(fileList) {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const fig = document.createElement('figure');
        fig.className = 'photo-card';
        fig.innerHTML = `
          <div class="photo-card__img" style="background-image:url('${ev.target.result}')"></div>
          <figcaption>
            <span>${escapeHtml(file.name)}</span>
            <button class="icon-btn icon-btn--danger" title="Удалить">🗑</button>
          </figcaption>`;
        photoGrid.prepend(fig);
      };
      reader.readAsDataURL(file);
    });
    showToast(`Загружено файлов: ${files.length}`);

    // In real app: upload via fetch
    // const fd = new FormData();
    // files.forEach(f => fd.append('photos', f));
    // fetch('/api/admin/photos', { method: 'POST', body: fd });
  }

  // Delegated photo delete
  photoGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-btn--danger');
    if (!btn) return;
    btn.closest('.photo-card')?.remove();
    showToast('Фото удалено');
  });

  // Delegated achievement delete
  $('#achievementList').addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-btn--danger');
    if (!btn) return;
    btn.closest('.achievement-item')?.remove();
    showToast('Достижение удалено');
  });

  // ----- Helpers ----------------------------------------------------
  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
})();
