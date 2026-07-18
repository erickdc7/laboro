from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import math

from app.database import get_db
from app.models.job import Job, JobTechnology
from app.models.source import Source
from app.schemas.job import JobResponse, JobListResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/", response_model=JobListResponse)
def get_jobs(
    page: int = 1,
    per_page: int = 20,
    stack: Optional[str] = Query(None, description="Tecnología requerida (ej: react, python)"),
    modality: Optional[str] = Query(None, description="Modalidad: remote, hybrid, on-site"),
    city: Optional[str] = Query(None, description="Ciudad (ej: lima)"),
    source: Optional[str] = Query(None, description="Portal de origen (ej: computrabajo)"),
    search: Optional[str] = Query(None, description="Búsqueda por texto en título y descripción"),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.is_active == True)

    if stack:
        query = query.join(JobTechnology).filter(
            JobTechnology.technology.ilike(f"%{stack}%")
        )

    if modality:
        query = query.filter(Job.modality.ilike(f"%{modality}%"))

    if city:
        query = query.filter(Job.location.ilike(f"%{city}%"))

    if source:
        query = query.join(Source).filter(
            Source.name.ilike(f"%{source}%")
        )

    if search:
        query = query.filter(
            or_(
                Job.title.ilike(f"%{search}%"),
                Job.description.ilike(f"%{search}%"),
                Job.company.ilike(f"%{search}%")
            )
        )

    query = query.distinct()

    total = query.count()
    offset = (page - 1) * per_page
    jobs = (
        query
        .order_by(Job.scraped_at.desc())
        .offset(offset)
        .limit(per_page)
        .all()
    )

    return JobListResponse(
        data=jobs,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=math.ceil(total / per_page) if total > 0 else 0
    )


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.is_active == True
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job