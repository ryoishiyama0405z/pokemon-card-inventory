from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Pokemon Card Inventory System",
    description="ポケモンカード在庫管理システム API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is running!", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
