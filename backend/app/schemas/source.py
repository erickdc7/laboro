from pydantic import BaseModel
from datetime import datetime


class SourceBase(BaseModel):
    name: str
    base_url: str
    is_active: bool = True


class SourceResponse(SourceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True