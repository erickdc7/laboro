from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import math

from app.database import get_db
from app.models.job import Job
from app.schemas.job import JobResponse, JobListResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/", response_model=JobListResponse)
def get_jobs(
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * per_page
    total = db.query(Job).filter(Job.is_active == True).count()
    jobs = (
        db.query(Job)
        .filter(Job.is_active == True)
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