from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timezone, timedelta

from app.database import get_db
from app.models.job import Job, JobTechnology
from app.models.source import Source

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/top-technologies")
def get_top_technologies(limit: int = 10, db: Session = Depends(get_db)):
    results = (
        db.query(
            JobTechnology.technology,
            func.count(JobTechnology.id).label("count")
        )
        .join(Job, Job.id == JobTechnology.job_id)
        .filter(Job.is_active == True)
        .group_by(JobTechnology.technology)
        .order_by(desc("count"))
        .limit(limit)
        .all()
    )
    return [
        {"technology": row.technology, "count": row.count}
        for row in results
    ]


@router.get("/modality")
def get_modality_distribution(db: Session = Depends(get_db)):
    results = (
        db.query(
            Job.modality,
            func.count(Job.id).label("count")
        )
        .filter(Job.is_active == True)
        .group_by(Job.modality)
        .order_by(desc("count"))
        .all()
    )
    total = sum(row.count for row in results)
    return [
        {
            "modality": row.modality or "unknown",
            "count": row.count,
            "percentage": round((row.count / total) * 100, 1) if total > 0 else 0
        }
        for row in results
    ]


@router.get("/jobs-per-day")
def get_jobs_per_day(days: int = 30, db: Session = Depends(get_db)):
    since = datetime.now(timezone.utc) - timedelta(days=days)
    results = (
        db.query(
            func.date(Job.scraped_at).label("date"),
            func.count(Job.id).label("count")
        )
        .filter(Job.scraped_at >= since)
        .group_by(func.date(Job.scraped_at))
        .order_by("date")
        .all()
    )
    return [
        {"date": str(row.date), "count": row.count}
        for row in results
    ]


@router.get("/top-companies")
def get_top_companies(limit: int = 10, db: Session = Depends(get_db)):
    results = (
        db.query(
            Job.company,
            func.count(Job.id).label("count")
        )
        .filter(Job.is_active == True, Job.company != None)
        .group_by(Job.company)
        .order_by(desc("count"))
        .limit(limit)
        .all()
    )
    return [
        {"company": row.company, "count": row.count}
        for row in results
    ]


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_jobs = db.query(Job).filter(Job.is_active == True).count()
    total_companies = (
        db.query(func.count(func.distinct(Job.company)))
        .filter(Job.is_active == True)
        .scalar()
    )
    total_sources = db.query(Source).filter(Source.is_active == True).count()
    top_tech = (
        db.query(
            JobTechnology.technology,
            func.count(JobTechnology.id).label("count")
        )
        .join(Job, Job.id == JobTechnology.job_id)
        .filter(Job.is_active == True)
        .group_by(JobTechnology.technology)
        .order_by(desc("count"))
        .first()
    )
    return {
        "total_jobs": total_jobs,
        "total_companies": total_companies,
        "total_sources": total_sources,
        "top_technology": top_tech.technology if top_tech else None,
    }