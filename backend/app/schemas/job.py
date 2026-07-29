from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class JobTechnologyResponse(BaseModel):
    id: int
    technology: str

    class Config:
        from_attributes = True


class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    modality: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    url_original: str


class JobResponse(JobBase):
    id: int
    source_id: int
    source_name: str
    is_active: bool
    scraped_at: datetime
    published_at: Optional[datetime] = None
    technologies: List[JobTechnologyResponse] = []

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    data: List[JobResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
