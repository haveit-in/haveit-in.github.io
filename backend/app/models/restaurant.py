# app/models/restaurant.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text, func, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base

class RestaurantProfile(Base):
    __tablename__ = "restaurant_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    restaurant_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    owner_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    cuisine = Column(String, nullable=False)  # Will store as JSON string
    fssai = Column(String, nullable=False)
    account_number = Column(String, nullable=False)
    ifsc = Column(String, nullable=False)
    account_holder = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, approved, rejected
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)
    
    # New fields for enhanced restaurant functionality
    banner_image = Column(Text, nullable=True)
    logo = Column(Text, nullable=True)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    minimum_order = Column(Numeric(10, 2), default=0)
    delivery_fee = Column(Numeric(10, 2), default=0)
    delivery_radius_km = Column(Integer, default=5)
    is_open = Column(Boolean, default=True)
    rating = Column(Numeric(2, 1), default=4.0)
    delivery_time = Column(String(50), nullable=True)
    total_reviews = Column(Integer, default=0)

    user = relationship("User", foreign_keys=[user_id])
    approver = relationship("User", foreign_keys=[approved_by])
    orders = relationship("Order", back_populates="restaurant")
    menu_items = relationship("MenuItem", back_populates="restaurant")
    menu_categories = relationship("MenuCategory", back_populates="restaurant")