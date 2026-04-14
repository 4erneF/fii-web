"""
CMS · Факультет ИИ — пример бэкенда на FastAPI.

Этот файл показывает, как принимать запрос на добавление новости
из админ-панели (admin.html / admin.js). В реальном проекте замените
in-memory хранилище на БД (PostgreSQL + SQLAlchemy / Tortoise / etc).

Запуск:
    pip install fastapi uvicorn python-multipart
    uvicorn backend.admin_api:app --reload
"""

from __future__ import annotations

import shutil
import uuid
from datetime import date, datetime
from pathlib import Path
from typing import Literal, Optional

from fastapi import FastAPI, Form, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ---------- App & CORS ----------------------------------------------------

app = FastAPI(title="Faculty CMS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # В проде укажите домен сайта
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads/news")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# ---------- Schemas --------------------------------------------------------

NewsStatus = Literal["draft", "published"]


class NewsOut(BaseModel):
    id: str
    title: str
    content: str
    date: date
    status: NewsStatus
    cover_url: Optional[str] = None
    created_at: datetime


# ---------- In-memory storage (demo) --------------------------------------

_news_db: dict[str, NewsOut] = {}


# ---------- Endpoints ------------------------------------------------------

@app.get("/api/admin/news", response_model=list[NewsOut])
def list_news() -> list[NewsOut]:
    return sorted(_news_db.values(), key=lambda n: n.created_at, reverse=True)


@app.post(
    "/api/admin/news",
    response_model=NewsOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_news(
    title:   str          = Form(..., min_length=3, max_length=200),
    content: str          = Form(...),
    date_:   date         = Form(..., alias="date"),
    status_: NewsStatus   = Form("draft", alias="status"),
    cover:   UploadFile | None = File(None),
) -> NewsOut:
    """
    Принимает multipart/form-data от админ-панели (fetch с FormData).

    Поля совпадают с теми, что шлёт admin.js:
        title, content, date, status, cover
    """
    if not title.strip():
        raise HTTPException(422, "Заголовок не может быть пустым")

    # Сохраняем обложку, если пришла
    cover_url: Optional[str] = None
    if cover is not None and cover.filename:
        suffix = Path(cover.filename).suffix.lower()
        if suffix not in {".png", ".jpg", ".jpeg", ".webp"}:
            raise HTTPException(415, "Недопустимый формат изображения")
        file_id = f"{uuid.uuid4().hex}{suffix}"
        dest = UPLOAD_DIR / file_id
        with dest.open("wb") as f:
            shutil.copyfileobj(cover.file, f)
        cover_url = f"/uploads/news/{file_id}"

    news = NewsOut(
        id=uuid.uuid4().hex[:12],
        title=title.strip(),
        content=content,
        date=date_,
        status=status_,
        cover_url=cover_url,
        created_at=datetime.utcnow(),
    )
    _news_db[news.id] = news
    return news


@app.delete("/api/admin/news/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(news_id: str) -> None:
    if news_id not in _news_db:
        raise HTTPException(404, "Новость не найдена")
    _news_db.pop(news_id)
