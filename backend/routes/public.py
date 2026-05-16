"""Read-only endpoints for the public website. No authentication."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import BlockField, News, Photo, TickerItem, TileVisibility
from ..schemas import NewsOut, PhotoOut, PublicOverridesOut

router = APIRouter(prefix="/api/public", tags=["public"])


@router.get("/overrides", response_model=PublicOverridesOut)
def get_overrides(page_key: str, db: Annotated[Session, Depends(get_db)]) -> PublicOverridesOut:
    """Snapshot for one page: text overrides + visibility + ticker."""
    content: dict[str, dict[str, str]] = {}
    for row in db.scalars(select(BlockField).where(BlockField.page_key == page_key)):
        content.setdefault(row.tile_id, {})[row.field_id] = row.value

    visibility: dict[str, bool] = {}
    for row in db.scalars(select(TileVisibility).where(TileVisibility.page_key == page_key)):
        visibility[row.tile_id] = row.is_visible

    ticker = [r.text for r in db.scalars(select(TickerItem).order_by(TickerItem.position, TickerItem.id))]

    return PublicOverridesOut(
        page_key=page_key,
        content=content,
        visibility=visibility,
        ticker=ticker,
    )


@router.get("/news", response_model=list[NewsOut])
def list_published_news(db: Annotated[Session, Depends(get_db)]) -> list[News]:
    return list(
        db.scalars(
            select(News).where(News.status == "published").order_by(News.publish_date.desc().nullslast(), News.id.desc())
        )
    )


@router.get("/photos", response_model=list[PhotoOut])
def list_photos(db: Annotated[Session, Depends(get_db)]) -> list[Photo]:
    return list(db.scalars(select(Photo).order_by(Photo.uploaded_at.desc())))
