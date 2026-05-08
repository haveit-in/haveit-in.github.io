# app/schemas/menu.py

from pydantic import BaseModel
from typing import List, Optional

class MenuItemResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    is_veg: bool = False
    is_available: bool = True
    preparation_time: int = 15

    class Config:
        from_attributes = True

class MenuCategoryResponse(BaseModel):
    id: str
    name: str
    display_order: int = 0
    items: List[MenuItemResponse] = []

    class Config:
        from_attributes = True

class RestaurantMenuResponse(BaseModel):
    restaurant: dict
    categories: List[MenuCategoryResponse] = []

    class Config:
        from_attributes = True
