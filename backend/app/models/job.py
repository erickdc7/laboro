from sqlalchemy import (
    Column, Integer, String, Text,
    Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255))
    description = Column(Text)
    location = Column(String(255))
    modality = Column(String(50))        # remote, hybrid, on-site
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    url_original = Column(String(500), unique=True, nullable=False)
    published_at = Column(DateTime(timezone=True))
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    is_duplicate = Column(Boolean, default=False)

    source = relationship("Source", back_populates="jobs")
    technologies = relationship(
        "JobTechnology",
        back_populates="job",
        cascade="all, delete-orphan"
    )


class JobTechnology(Base):
    __tablename__ = "job_technologies"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    technology = Column(String(100), nullable=False)

    job = relationship("Job", back_populates="technologies")