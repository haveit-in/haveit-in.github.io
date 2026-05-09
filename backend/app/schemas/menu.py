# app/schemas/menu.py

from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class CreateCategoryRequest(BaseModel):
    name: str
    display_order: Optional[int] = 0


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    display_order: int
    is_active: bool

    class Config:
        from_attributes = True


class CreateMenuItemRequest(BaseModel):
    category_id: str  # Accept as string, convert to UUID in the endpoint
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    is_veg: bool = False
    is_available: bool = True
    preparation_time: Optional[int] = 20


class MenuItemResponse(BaseModel):
    id: UUID
    category_id: UUID
    name: str
    description: Optional[str]
    image: Optional[str]
    price: float
    discount_price: Optional[float]
    is_veg: bool
    is_available: bool
    preparation_time: Optional[int]

    class Config:
        from_attributes = True

# Legacy schemas for existing endpoints
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
