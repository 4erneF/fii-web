"""FastAPI entry point for the Faculty CMS backend.

The app exposes three groups of endpoints:
  * /api/auth/*    — login + current user
  * /api/public/*  — read-only, called by the public website (no auth)
  * /api/admin/*   — full CRUD, requires Bearer JWT

It also serves uploaded files at /uploads and the admin SPA at /admin
(on the admin host). The public static site is served separately
(nginx or Railway frontend) — this app is the admin host.

Run locally:
    pip install -r requirements.txt
    export JWT_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(48))")
    export INITIAL_ADMIN_PASSWORD=changeme
    uvicorn backend.main:app --reload --port 8001
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .routes import admin as admin_routes
from .routes import auth as auth_routes
from .routes import public as public_routes
from .seed import ensure_initial_admin, init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    ensure_initial_admin()
    yield


settings = get_settings()
app = FastAPI(title="Факультет ИИ — CMS API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list({*settings.FRONTEND_ORIGINS, *settings.ADMIN_ORIGINS}),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth_routes.router)
app.include_router(public_routes.router)
app.include_router(admin_routes.router)


# Static files: uploaded user content (read by both admin + public site).
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/shared/tile-registry.js", include_in_schema=False)
def shared_tile_registry() -> FileResponse:
    """Single source of truth for the page/tile registry; consumed by the
    admin SPA so we don't keep a duplicate copy under admin/."""
    return FileResponse(
        settings.PROJECT_ROOT / "tile-registry.js",
        media_type="application/javascript",
    )


# Admin SPA — served from the same host as the API.
# The public site lives on a different host and never sees these files.
if settings.ADMIN_STATIC_DIR.exists():
    app.mount("/admin", StaticFiles(directory=settings.ADMIN_STATIC_DIR, html=True), name="admin")

    @app.get("/", include_in_schema=False)
    def admin_root() -> FileResponse:
        login = settings.ADMIN_STATIC_DIR / "login.html"
        return FileResponse(login)


@app.get("/healthz", include_in_schema=False)
def healthz() -> dict:
    return {"ok": True}
