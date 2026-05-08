# app/schemas/payment.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class CreatePaymentOrderRequest(BaseModel):
    order_id: UUID

    class Config:
        from_attributes = True

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

    class Config:
        from_attributes = True

class PaymentResponse(BaseModel):
    payment_status: str
    payment_id: Optional[str] = None
    order_id: UUID
    amount: float
    currency: str
    created_at: datetime

    class Config:
        from_attributes = True
