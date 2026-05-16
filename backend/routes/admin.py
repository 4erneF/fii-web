"""Authenticated CRUD endpoints for the CMS admin panel."""

from __future__ import annotations

import shutil
import uuid
from datetime import datetime
from pathlib import Path
from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..config import get_settings
from ..database import engine, get_db
from ..models import BlockField, News, Photo, TickerItem, TileVisibility, User
from ..schemas import (
    BlockFieldIn,
    BlockFieldOut,
    NewsOut,
    NewsStatus,
    PhotoOut,
    PhotoUpdateIn,
    TickerReplaceIn,
    TileVisibilityIn,
    TileVisibilityOut,
)

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_current_user)])


# ---------- Helpers -------------------------------------------------------

def _upsert_dialect():
    """Pick the right `INSERT ... ON CONFLICT` flavour."""
    name = engine.dialect.name
    if name == "postgresql":
        return pg_insert
    return sqlite_insert  # SQLite (default)


def _save_upload(file: UploadFile, subdir: str) -> str:
    s = get_settings()
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in s.ALLOWED_IMAGE_EXTS:
        raise HTTPException(415, f"Недопустимый формат файла: {suffix or '?'}")

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > s.MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Файл слишком большой")

    target_dir = s.UPLOAD_DIR / subdir
    target_dir.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}{suffix}"
    dest = target_dir / name
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    return f"/uploads/{subdir}/{name}"


# ---------- Blocks --------------------------------------------------------

@router.get("/blocks", response_model=list[BlockFieldOut])
def list_blocks(db: Annotated[Session, Depends(get_db)]) -> list[BlockField]:
    return list(db.scalars(select(BlockField)))


@router.put("/blocks", response_model=BlockFieldOut)
def upsert_block(payload: BlockFieldIn, db: Annotated[Session, Depends(get_db)]) -> BlockField:
    insert = _upsert_dialect()
    stmt = (
        insert(BlockField)
        .values(
            page_key=payload.page_key,
            tile_id=payload.tile_id,
            field_id=payload.field_id,
            value=payload.value,
        )
        .returning(BlockField)
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=["page_key", "tile_id", "field_id"],
        set_={"value": payload.value, "updated_at": datetime.utcnow()},
    )
    row = db.execute(stmt).scalar_one()
    db.commit()
    db.refresh(row)
    return row


@router.delete("/blocks", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_block(
    page_key: str,
    tile_id: str,
    db: Annotated[Session, Depends(get_db)],
    field_id: str | None = None,
) -> Response:
    stmt = delete(BlockField).where(
        BlockField.page_key == page_key, BlockField.tile_id == tile_id,
    )
    if field_id is not None:
        stmt = stmt.where(BlockField.field_id == field_id)
    db.execute(stmt)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/blocks/all", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def reset_all_blocks(db: Annotated[Session, Depends(get_db)]) -> Response:
    db.execute(delete(BlockField))
    db.execute(delete(TileVisibility))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------- Visibility ----------------------------------------------------

@router.get("/visibility", response_model=list[TileVisibilityOut])
def list_visibility(db: Annotated[Session, Depends(get_db)]) -> list[TileVisibility]:
    return list(db.scalars(select(TileVisibility)))


@router.put("/visibility", response_model=TileVisibilityOut)
def upsert_visibility(
    payload: TileVisibilityIn, db: Annotated[Session, Depends(get_db)],
) -> TileVisibility:
    insert = _upsert_dialect()
    stmt = (
        insert(TileVisibility)
        .values(
            page_key=payload.page_key,
            tile_id=payload.tile_id,
            is_visible=payload.is_visible,
        )
        .returning(TileVisibility)
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=["page_key", "tile_id"],
        set_={"is_visible": payload.is_visible, "updated_at": datetime.utcnow()},
    )
    row = db.execute(stmt).scalar_one()
    db.commit()
    db.refresh(row)
    return row


# ---------- Ticker --------------------------------------------------------

@router.get("/ticker", response_model=list[str])
def list_ticker(db: Annotated[Session, Depends(get_db)]) -> list[str]:
    return [r.text for r in db.scalars(select(TickerItem).order_by(TickerItem.position, TickerItem.id))]


@router.put("/ticker", response_model=list[str])
def replace_ticker(
    payload: TickerReplaceIn, db: Annotated[Session, Depends(get_db)],
) -> list[str]:
    db.execute(delete(TickerItem))
    for pos, text in enumerate(payload.items):
        text = text.strip()
        if text:
            db.add(TickerItem(text=text, position=pos))
    db.commit()
    return [r.text for r in db.scalars(select(TickerItem).order_by(TickerItem.position, TickerItem.id))]


# ---------- News ----------------------------------------------------------

@router.get("/news", response_model=list[NewsOut])
def list_news(db: Annotated[Session, Depends(get_db)]) -> list[News]:
    return list(db.scalars(select(News).order_by(News.created_at.desc())))


@router.post("/news", response_model=NewsOut, status_code=status.HTTP_201_CREATED)
async def create_news(
    db: Annotated[Session, Depends(get_db)],
    title:        str = Form(..., min_length=1, max_length=255),
    content:      str = Form(""),
    publish_date: Optional[str] = Form(None),
    status_:      NewsStatus = Form("draft", alias="status"),
    cover:        Optional[UploadFile] = File(None),
) -> News:
    cover_url: str | None = None
    if cover is not None and cover.filename:
        cover_url = _save_upload(cover, "news")

    pd = datetime.fromisoformat(publish_date) if publish_date else None
    news = News(
        title=title.strip(),
        content=content,
        publish_date=pd,
        status=status_,
        cover_url=cover_url,
    )
    db.add(news)
    db.commit()
    db.refresh(news)
    return news


@router.delete("/news/{news_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_news(news_id: int, db: Annotated[Session, Depends(get_db)]) -> Response:
    n = db.get(News, news_id)
    if not n:
        raise HTTPException(404, "Новость не найдена")
    db.delete(n)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------- Photos --------------------------------------------------------

@router.get("/photos", response_model=list[PhotoOut])
def list_photos(db: Annotated[Session, Depends(get_db)]) -> list[Photo]:
    return list(db.scalars(select(Photo).order_by(Photo.uploaded_at.desc())))


@router.post("/photos", response_model=list[PhotoOut], status_code=status.HTTP_201_CREATED)
async def upload_photos(
    db: Annotated[Session, Depends(get_db)],
    files: list[UploadFile] = File(...),
    caption: Optional[str] = Form(None),
) -> list[Photo]:
    created: list[Photo] = []
    for f in files:
        if not f.filename:
            continue
        url = _save_upload(f, "photos")
        photo = Photo(url=url, original_name=f.filename, caption=caption)
        db.add(photo)
        created.append(photo)
    db.commit()
    for p in created:
        db.refresh(p)
    return created


@router.patch("/photos/{photo_id}", response_model=PhotoOut)
def update_photo(
    photo_id: int,
    payload: PhotoUpdateIn,
    db: Annotated[Session, Depends(get_db)],
) -> Photo:
    p = db.get(Photo, photo_id)
    if not p:
        raise HTTPException(404, "Фото не найдено")
    if payload.caption is not None:
        p.caption = payload.caption
    db.commit()
    db.refresh(p)
    return p


@router.delete("/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_photo(photo_id: int, db: Annotated[Session, Depends(get_db)]) -> Response:
    p = db.get(Photo, photo_id)
    if not p:
        raise HTTPException(404, "Фото не найдено")
    try:
        path = get_settings().PROJECT_ROOT / "backend" / p.url.lstrip("/")
        if path.exists():
            path.unlink()
    except OSError:
        pass
    db.delete(p)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------- Uploads for inline use (e.g. attaching to a block) ------------

@router.post("/uploads/image", status_code=status.HTTP_201_CREATED)
async def upload_image(
    _user: Annotated[User, Depends(get_current_user)],
    file: UploadFile = File(...),
) -> dict:
    if not file.filename:
        raise HTTPException(400, "Файл не передан")
    url = _save_upload(file, "blocks")
    return {"url": url, "original_name": file.filename}
