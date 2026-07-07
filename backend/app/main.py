"""Kavach FastAPI application entry point.

Registers every domain router against one shared backend so the app, WhatsApp bot,
and IVR all reach the same classifier core and intelligence layer.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db.neo4j_client import close_driver
from app.db.session import create_tables
from app.api.routers import (
    auth,
    currency,
    evidence,
    graph,
    hotspot,
    messages,
    numbers,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()  # auto-create SQLite tables (no-op if already exist)
    yield
    close_driver()


app = FastAPI(
    title="Kavach API",
    description="AI shield against digital fraud — the shared classifier core and intelligence layer.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Domain routers
app.include_router(auth.router)
app.include_router(messages.router)
app.include_router(numbers.router)
app.include_router(currency.router)
app.include_router(evidence.router)
app.include_router(hotspot.router)
app.include_router(graph.router)


@app.get("/health", tags=["system"])
def health() -> dict:
    return {
        "status": "ok",
        "service": "kavach-backend",
        "classifier": "mock" if settings.use_mock_classifier else "llm",
    }
