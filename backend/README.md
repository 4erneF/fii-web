# CMS · Факультет ИИ — бэкенд

FastAPI-приложение, которое крутится **на отдельном хосте** (например,
`admin.fii.example.com`) и одновременно играет три роли:

* отдаёт **админ-SPA** (`/admin/...`) под защитой JWT-логина;
* предоставляет **публичное read-only API** (`/api/public/...`) для
  статического сайта, чтобы тот подтягивал тексты блоков, видимость
  плашек, бегущую строку, новости и фотографии;
* предоставляет **админ API** (`/api/admin/...`) для CMS, защищённое
  Bearer-токеном.

## Запуск локально

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Сгенерируйте JWT_SECRET и заполните INITIAL_ADMIN_PASSWORD в .env.

uvicorn backend.main:app --reload --port 8001
```

После первого запуска:

* `http://localhost:8001/` — экран логина;
* `http://localhost:8001/admin/admin.html` — сама панель (доступ после
  входа, токен лежит в `localStorage` под ключом `fii_admin_token`);
* `http://localhost:8001/api/public/overrides?page_key=index` — пример
  read-only ручки для публичного сайта.

Если не задан `INITIAL_ADMIN_PASSWORD`, при первом старте бэкенд
сгенерирует случайный и распечатает в stdout — сохраните его.

## Публичный сайт

Статика (`index.html`, `about.html`, …) живёт на **другом хосте**.
Чтобы она подтягивала контент из этого API, в `<head>` каждой страницы
добавьте мета-тег:

```html
<meta name="fii-api-base" content="https://admin.fii.example.com">
```

`script.js` сам всё подтянет на `DOMContentLoaded`. Если API недоступен,
страница работает на старых дефолтах + локальном `localStorage` (полезно
для офлайн-разработки).

## Деплой на Railway

1. Создайте проект, подключите этот репозиторий.
2. Добавьте сервис Postgres из маркетплейса — Railway автоматически
   пробросит переменную `DATABASE_URL`. Бэкенд умеет нормализовать
   старый формат `postgres://` в SQLAlchemy-совместимый.
3. В переменных окружения задайте:
   * `JWT_SECRET` (обязательно);
   * `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_PASSWORD`;
   * `FRONTEND_ORIGINS=https://fii.example.com`;
   * `ADMIN_ORIGINS=https://admin.fii.example.com`.
4. Railway подхватит `Procfile` и запустит uvicorn на `$PORT`.
5. Привяжите кастомный поддомен (например, `admin.fii.example.com`) — он
   будет хостом админки и API.
6. Публичный сайт деплойте отдельно (Railway static site / nginx / Vercel),
   на свой домен (`fii.example.com`). Не забудьте мета-тег с API-base.

## Загрузки

Фото и обложки новостей лежат в `backend/uploads/` и раздаются по
`/uploads/...`. На Railway эта папка не персистентна между деплоями —
для продакшена подключите S3 / Cloudflare R2 / Railway Volume и
поправьте `_save_upload()` в `backend/routes/admin.py`.

## Безопасность

* CORS — только указанные `FRONTEND_ORIGINS` + `ADMIN_ORIGINS`.
* Пароли — bcrypt с 12 раундами.
* JWT истекает через `JWT_TTL_HOURS` (по умолчанию 12) — после этого
  фронтенд получит 401 и автоматически перебросит на `login.html`.
* `/api/admin/*` целиком зависит от `get_current_user`; публичный сайт
  ничего, кроме оверрайдов и списка опубликованных новостей, видеть не
  должен.

## Что осталось вне MVP

* SSE/WebSocket — сейчас изменения видны на сайте при перезагрузке
  страницы. Если нужен мгновенный апдейт, добавьте `EventSource` поверх
  публичной ручки.
* WYSIWYG в новостях использует `document.execCommand` — рабочий, но
  устаревший API. Замените на Tiptap / Quill для прода.
* В разделах «Достижения» и «Настройки» формы пока заглушки — содержимое
  редактируется через «Страницы сайта» (по `data-tile`/полям из
  `tile-registry.js`).
