from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import jobs, sources, scraper

app = FastAPI(
    title=settings.app_name,
    description="Job aggregator for the Peruvian tech market",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
app.include_router(sources.router)
app.include_router(scraper.router)

@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "app": settings.app_name
    }