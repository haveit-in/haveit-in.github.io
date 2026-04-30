from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base
import uuid

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("restaurant_profiles.user_id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, preparing, ready, completed, cancelled
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    restaurant = relationship("RestaurantProfile", foreign_keys=[restaurant_id])
