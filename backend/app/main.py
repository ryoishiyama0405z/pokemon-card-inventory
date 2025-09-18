from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
import logging
import os

from .database import engine, get_db, Base
from .models.card import Card, Inventory, PriceHistory

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 起動時の処理
    logger.info("Starting up Pokemon Card Inventory System...")
    # データベーステーブル作成
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    yield
    # 終了時の処理
    logger.info("Shutting down...")

app = FastAPI(
    title="Pokemon Card Inventory System",
    description="ポケモンカード在庫管理システム API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS設定
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Pokemon Card Inventory System API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pokemon-card-api"}

# Include routers
from .routers import cards, pokemon_tcg

app.include_router(cards.router)
app.include_router(pokemon_tcg.router)
