from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text, func, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .user import Base
import uuid

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("restaurant_profiles.id"), nullable=False)
    
    # Order details
    order_number = Column(String(50), unique=True, nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax_amount = Column(Numeric(10, 2), nullable=False)
    delivery_fee = Column(Numeric(10, 2), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    # Payment information
    payment_method = Column(String(50))  # cash, card, upi, etc.
    payment_status = Column(String(50), default="pending")  # pending, paid, failed, refunded
    
    # Order status
    order_status = Column(String(50), default="pending")  # pending, confirmed, preparing, ready, on_the_way, delivered, cancelled
    
    # Delivery information
    delivery_address = Column(Text)
    customer_lat = Column(Numeric(10, 8))
    customer_lng = Column(Numeric(11, 8))
    estimated_delivery_time = Column(String(50))
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="orders")
    restaurant = relationship("RestaurantProfile", foreign_keys=[restaurant_id], back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    tracking_logs = relationship("OrderTrackingLog", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")
