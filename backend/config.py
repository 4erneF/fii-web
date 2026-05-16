"""Application configuration loaded from environment variables.

All sensitive values (JWT secret, admin password) must be provided via env
and never hard-coded in source. For local development put them in `.env`.
"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


class Settings:
    PROJECT_ROOT: Path = Path(__file__).resolve().parent.parent

    # Database — SQLite by default for local dev; Postgres on Railway via DATABASE_URL.
    # Railway provides a `postgres://` scheme that SQLAlchemy 2.x rejects; normalize it.
    @property
    def DATABASE_URL(self) -> str:
        url = os.getenv("DATABASE_URL", "").strip()
        if not url:
            db_path = self.PROJECT_ROOT / "backend" / "data" / "fii.db"
            db_path.parent.mkdir(parents=True, exist_ok=True)
            return f"sqlite:///{db_path}"
        if url.startswith("postgres://"):
            url = "postgresql+psycopg://" + url[len("postgres://"):]
        elif url.startswith("postgresql://") and "+psycopg" not in url:
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    JWT_ALGORITHM: str = "HS256"
    JWT_TTL_HOURS: int = int(os.getenv("JWT_TTL_HOURS", "12"))

    # CORS — comma-separated origins allowed to call the admin/public APIs.
    @property
    def FRONTEND_ORIGINS(self) -> list[str]:
        raw = os.getenv("FRONTEND_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500")
        return [o.strip() for o in raw.split(",") if o.strip()]

    @property
    def ADMIN_ORIGINS(self) -> list[str]:
        raw = os.getenv("ADMIN_ORIGINS", "http://localhost:8001,http://127.0.0.1:8001")
        return [o.strip() for o in raw.split(",") if o.strip()]

    # Initial admin account — created on first startup if no users exist.
    INITIAL_ADMIN_USERNAME: str = os.getenv("INITIAL_ADMIN_USERNAME", "admin")
    INITIAL_ADMIN_PASSWORD: str = os.getenv("INITIAL_ADMIN_PASSWORD", "")

    # File uploads
    @property
    def UPLOAD_DIR(self) -> Path:
        path = self.PROJECT_ROOT / "backend" / "uploads"
        path.mkdir(parents=True, exist_ok=True)
        return path

    MAX_UPLOAD_BYTES: int = int(os.getenv("MAX_UPLOAD_BYTES", str(8 * 1024 * 1024)))  # 8 MB
    ALLOWED_IMAGE_EXTS: set[str] = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}

    # Static admin SPA served by FastAPI on the admin host.
    @property
    def ADMIN_STATIC_DIR(self) -> Path:
        return self.PROJECT_ROOT / "admin"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    s = Settings()
    if not s.JWT_SECRET:
        raise RuntimeError(
            "JWT_SECRET is not set. Generate one with `python -c \"import secrets; "
            "print(secrets.token_urlsafe(48))\"` and put it in the environment."
        )
    return s
