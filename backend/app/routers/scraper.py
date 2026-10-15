from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.source import Source
from app.models.scrape_log import ScrapeLog
from app.scrapers.computrabajo import ComputrabajoScraper
from datetime import datetime, timezone, timedelta
from sqlalchemy import func
from app.models.job import Job

router = APIRouter(prefix="/scraper", tags=["scraper"])


@router.post("/run")
def run_scraper(source_name: str = "computrabajo", db: Session = Depends(get_db)):
    source = (
        db.query(Source)
        .filter(Source.name.ilike(f"%{source_name}%"), Source.is_active == True)
        .first()
    )

    if not source:
        raise HTTPException(
            status_code=404, detail=f"Fuente '{source_name}' no encontrada o inactiva"
        )

    log = ScrapeLog(
        source_id=source.id, started_at=datetime.now(timezone.utc), status="running"
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    scrapers = {
        "computrabajo": ComputrabajoScraper,
    }

    scraper_class = scrapers.get(source_name.lower())
    if not scraper_class:
        raise HTTPException(
            status_code=400, detail=f"No hay scraper implementado para '{source_name}'"
        )

    scraper = scraper_class(db=db, source_id=source.id)
    results = scraper.run()

    log.finished_at = datetime.now(timezone.utc)
    log.jobs_found = results["jobs_found"]
    log.jobs_new = results["jobs_new"]
    log.jobs_updated = results["jobs_updated"]
    log.status = results["status"]
    log.error_message = results["error_message"]
    db.commit()

    return {
        "source": source.name,
        "log_id": log.id,
        "jobs_found": results["jobs_found"],
        "jobs_new": results["jobs_new"],
        "jobs_updated": results["jobs_updated"],
        "status": results["status"],
        "error_message": results["error_message"],
        "duration_seconds": (log.finished_at - log.started_at).seconds,
    }


@router.get("/logs")
def get_scrape_logs(limit: int = 20, db: Session = Depends(get_db)):
    logs = db.query(ScrapeLog).order_by(ScrapeLog.started_at.desc()).limit(limit).all()
    return [
        {
            "id": log.id,
            "source_id": log.source_id,
            "started_at": log.started_at,
            "finished_at": log.finished_at,
            "jobs_found": log.jobs_found,
            "jobs_new": log.jobs_new,
            "status": log.status,
            "error_message": log.error_message,
        }
        for log in logs
    ]


def expire_old_jobs(db: Session) -> int:
    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    expired = (
        db.query(Job)
        .filter(
            Job.is_active == True,
            func.coalesce(Job.published_at, Job.scraped_at) < cutoff,
        )
        .update({"is_active": False}, synchronize_session=False)
    )
    db.commit()
    print(f"[Expiración] {expired} empleos marcados como inactivos (>7 días)")
    return expired


@router.post("/expire")
def expire_jobs_manually(db: Session = Depends(get_db)):
    count = expire_old_jobs(db)
    return {"expired": count}
