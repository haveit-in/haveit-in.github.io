# app/schemas/cart.py

from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class AddToCartRequest(BaseModel):
    menu_item_id: UUID
    quantity: int

    class Config:
        from_attributes = True

class UpdateCartItemRequest(BaseModel):
    quantity: int

    class Config:
        from_attributes = True

class CartItemResponse(BaseModel):
    id: str
    menu_item_id: str
    name: str
    image: Optional[str] = None
    price: float
    quantity: int
    total_price: float

    class Config:
        from_attributes = True

class RestaurantInfo(BaseModel):
    id: str
    restaurant_name: str
    logo: Optional[str] = None

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    restaurant: Optional[RestaurantInfo] = None
    items: List[CartItemResponse] = []
    subtotal: float = 0.0
    delivery_fee: float = 0.0
    tax: float = 0.0
    grand_total: float = 0.0

    class Config:
        from_attributes = True
