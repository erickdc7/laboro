from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.source import Source
from app.schemas.source import SourceResponse

router = APIRouter(prefix="/sources", tags=["sources"])


@router.get("/", response_model=List[SourceResponse])
def get_sources(db: Session = Depends(get_db)):
    return db.query(Source).filter(Source.is_active == True).all()