from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.source import Source
from app.models.scrape_log import ScrapeLog
from app.scrapers.computrabajo import ComputrabajoScraper
from app.scrapers.bumeran import BumeranScraper
from datetime import datetime, timezone

scheduler = BackgroundScheduler()


def expire_old_jobs(db: Session) -> int:
    from app.models.job import Job
    from datetime import datetime, timezone, timedelta

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


def run_scraper_task(source_name: str, scraper_class):
    print(f"[Scheduler] Iniciando tarea automática: {source_name}")
    db: Session = SessionLocal()

    try:
        source = (
            db.query(Source)
            .filter(Source.name.ilike(f"%{source_name}%"), Source.is_active == True)
            .first()
        )

        if not source:
            print(f"[Scheduler] Fuente '{source_name}' no encontrada")
            return

        log = ScrapeLog(
            source_id=source.id, started_at=datetime.now(timezone.utc), status="running"
        )
        db.add(log)
        db.commit()
        db.refresh(log)

        scraper = scraper_class(db=db, source_id=source.id)
        results = scraper.run()

        log.finished_at = datetime.now(timezone.utc)
        log.jobs_found = results["jobs_found"]
        log.jobs_new = results["jobs_new"]
        log.jobs_updated = results["jobs_updated"]
        log.status = results["status"]
        log.error_message = results["error_message"]
        db.commit()

        print(f"[Scheduler] Tarea completada: {source_name} — {results}")

        expire_old_jobs(db)

    except Exception as e:
        print(f"[Scheduler] Error en tarea {source_name}: {e}")
    finally:
        db.close()


def start_scheduler():
    scheduler.add_job(
        func=run_scraper_task,
        trigger=CronTrigger(hour=8, minute=0),
        kwargs={"source_name": "computrabajo", "scraper_class": ComputrabajoScraper},
        id="computrabajo_daily",
        name="Computrabajo Daily Scraper",
        replace_existing=True,
    )

    scheduler.add_job(
        func=run_scraper_task,
        trigger=CronTrigger(hour=9, minute=0),
        kwargs={"source_name": "bumeran", "scraper_class": BumeranScraper},
        id="bumeran_daily",
        name="Bumeran Daily Scraper",
        replace_existing=True,
    )

    scheduler.start()
    print("[Scheduler] Iniciado — Computrabajo 8AM, Bumeran 9AM")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        print("[Scheduler] Detenido")
