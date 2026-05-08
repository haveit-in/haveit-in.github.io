# app/models/order_tracking.py

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base
import uuid

class OrderTrackingLog(Base):
    __tablename__ = "order_tracking_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    
    # Tracking information
    status = Column(String(50), nullable=False)  # pending, confirmed, preparing, ready, on_the_way, delivered, cancelled
    message = Column(Text, nullable=True)  # Optional message for status update
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="tracking_logs")
