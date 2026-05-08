# app/schemas/order.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CreateOrderRequest(BaseModel):
    payment_method: str
    delivery_address: str
    customer_lat: float
    customer_lng: float

    class Config:
        from_attributes = True

class OrderItemResponse(BaseModel):
    item_name: str
    quantity: int
    price: float
    total_price: float

    class Config:
        from_attributes = True

class TrackingLogResponse(BaseModel):
    status: str
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RestaurantOrderInfo(BaseModel):
    id: str
    restaurant_name: str
    logo: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    order_id: str
    order_number: str
    restaurant: RestaurantOrderInfo
    items: List[OrderItemResponse] = []
    subtotal: float
    tax_amount: float
    delivery_fee: float
    total_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    estimated_delivery_time: Optional[str] = None
    tracking_logs: List[TrackingLogResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    order_id: str
    order_number: str
    restaurant_name: str
    total_amount: float
    order_status: str
    created_at: datetime

    class Config:
        from_attributes = True
