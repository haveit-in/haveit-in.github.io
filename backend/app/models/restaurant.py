# app/models/restaurant.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base

class RestaurantProfile(Base):
    __tablename__ = "restaurant_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    restaurant_name = Column(String, nullable=False)
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
    status = Column(String, default="pending")

    user = relationship("User")