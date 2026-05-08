# app/models/menu_category.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base

class MenuCategory(Base):
    __tablename__ = "menu_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("restaurant_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    restaurant = relationship("RestaurantProfile", back_populates="menu_categories")
    menu_items = relationship("MenuItem", back_populates="category")
