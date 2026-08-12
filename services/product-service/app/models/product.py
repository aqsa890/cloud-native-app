from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class ProductORM(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
