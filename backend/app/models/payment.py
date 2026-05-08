from sqlalchemy import Column, String, Text, Numeric, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base
import uuid

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    
    # Payment provider information
    payment_provider = Column(String(50))  # razorpay, stripe, etc.
    payment_id = Column(String(255))  # provider's payment ID
    
    # Razorpay specific fields
    razorpay_order_id = Column(String(255))
    razorpay_signature = Column(Text)
    
    # Payment details
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default="INR")
    payment_status = Column(String(50))  # pending, paid, failed, refunded
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="payments")
