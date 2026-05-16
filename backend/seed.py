"""One-shot helpers: create tables, seed initial admin user."""

from __future__ import annotations

import secrets

from sqlalchemy import select

from .auth import hash_password
from .config import get_settings
from .database import Base, SessionLocal, engine
from .models import User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def ensure_initial_admin() -> None:
    """Create the seed admin user if no users exist yet.

    If INITIAL_ADMIN_PASSWORD is not set, generate a random one and print it
    to stdout once — copy it from the deploy logs.
    """
    s = get_settings()
    with SessionLocal() as db:
        exists = db.scalar(select(User).limit(1))
        if exists:
            return

        password = s.INITIAL_ADMIN_PASSWORD or secrets.token_urlsafe(16)
        user = User(
            username=s.INITIAL_ADMIN_USERNAME,
            password_hash=hash_password(password),
            is_active=True,
        )
        db.add(user)
        db.commit()

        if not s.INITIAL_ADMIN_PASSWORD:
            print("=" * 60)
            print("Создан первый администратор. Сохраните пароль — он не повторится:")
            print(f"  username: {s.INITIAL_ADMIN_USERNAME}")
            print(f"  password: {password}")
            print("=" * 60)
