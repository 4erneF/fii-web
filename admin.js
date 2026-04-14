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
    news:         { title: 'Новости',       subtitle: 'Управление публикациями факультета' },
    photos:       { title: 'Фотографии',    subtitle: 'Галерея факультета' },
    achievements: { title: 'Достижения',    subtitle: 'Карточки побед и наград' },
    settings:     { title: 'Настройки сайта', subtitle: 'Тексты, контакты и блоки' },
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
