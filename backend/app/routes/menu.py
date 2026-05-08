# app/routes/menu.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.menu_category import MenuCategory
from app.models.menu_item import MenuItem
from app.models.restaurant import RestaurantProfile
from app.schemas.menu import MenuItemResponse, MenuCategoryResponse, RestaurantMenuResponse
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/restaurants/{restaurant_id}/menu", response_model=RestaurantMenuResponse)
def get_restaurant_menu(
    restaurant_id: str,
    db: Session = Depends(get_db)
):
    """Get complete menu for a restaurant"""
    try:
        # Get restaurant info
        restaurant = db.query(RestaurantProfile).filter(
            RestaurantProfile.id == restaurant_id,
            RestaurantProfile.status == "approved",
            RestaurantProfile.is_active == True
        ).first()
        
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Get menu categories with items
        categories = db.query(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant_id,
            MenuCategory.is_active == True
        ).order_by(MenuCategory.display_order).all()
        
        category_responses = []
        for category in categories:
            # Get items for this category
            items = db.query(MenuItem).filter(
                MenuItem.category_id == category.id,
                MenuItem.is_available == True
            ).order_by(MenuItem.name).all()
            
            item_responses = [
                MenuItemResponse(
                    id=str(item.id),
                    name=item.name,
                    description=item.description,
                    image=item.image,
                    price=float(item.price),
                    discount_price=float(item.discount_price) if item.discount_price else None,
                    is_veg=item.is_veg,
                    is_available=item.is_available,
                    preparation_time=item.preparation_time
                )
                for item in items
            ]
            
            category_responses.append(
                MenuCategoryResponse(
                    id=str(category.id),
                    name=category.name,
                    display_order=category.display_order,
                    items=item_responses
                )
            )
        
        # Restaurant info for response
        restaurant_info = {
            "id": str(restaurant.id),
            "restaurant_name": restaurant.restaurant_name,
            "email": getattr(restaurant, 'email', ''),
            "phone": getattr(restaurant, 'phone', ''),
            "address": getattr(restaurant, 'address', ''),
            "city": getattr(restaurant, 'city', ''),
            "state": getattr(restaurant, 'state', ''),
            "zipcode": getattr(restaurant, 'zipcode', ''),
            "cuisine_type": getattr(restaurant, 'cuisine_type', getattr(restaurant, 'cuisine', '')),
            "delivery_time": getattr(restaurant, 'delivery_time', 30),
            "rating": float(getattr(restaurant, 'rating', 4.0)),
            "approved_at": getattr(restaurant, 'approved_at', None),
            "created_at": restaurant.created_at,
            "banner_image": getattr(restaurant, 'banner_image', None),
            "logo": getattr(restaurant, 'logo', None),
            "latitude": float(getattr(restaurant, 'latitude', 0)) if getattr(restaurant, 'latitude', None) else None,
            "longitude": float(getattr(restaurant, 'longitude', 0)) if getattr(restaurant, 'longitude', None) else None,
            "minimum_order": float(getattr(restaurant, 'minimum_order', 0)),
            "delivery_fee": float(getattr(restaurant, 'delivery_fee', 0)),
            "delivery_radius_km": getattr(restaurant, 'delivery_radius_km', 5),
            "is_open": getattr(restaurant, 'is_open', True),
            "total_reviews": getattr(restaurant, 'total_reviews', 0)
        }
        
        return RestaurantMenuResponse(
            restaurant=restaurant_info,
            categories=category_responses
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching restaurant menu: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch menu")

@router.get("/restaurants/{restaurant_id}/categories", response_model=List[MenuCategoryResponse])
def get_restaurant_categories(
    restaurant_id: str,
    db: Session = Depends(get_db)
):
    """Get menu categories for a restaurant"""
    try:
        # Verify restaurant exists
        restaurant = db.query(RestaurantProfile).filter(
            RestaurantProfile.id == restaurant_id,
            RestaurantProfile.status == "approved",
            RestaurantProfile.is_active == True
        ).first()
        
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Get categories
        categories = db.query(MenuCategory).filter(
            MenuCategory.restaurant_id == restaurant_id,
            MenuCategory.is_active == True
        ).order_by(MenuCategory.display_order).all()
        
        return [
            MenuCategoryResponse(
                id=str(category.id),
                name=category.name,
                display_order=category.display_order,
                items=[]  # Items not included in this endpoint
            )
            for category in categories
        ]
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching restaurant categories: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")

@router.get("/restaurants/{restaurant_id}/categories/{category_id}/items", response_model=List[MenuItemResponse])
def get_category_items(
    restaurant_id: str,
    category_id: str,
    db: Session = Depends(get_db)
):
    """Get menu items for a specific category"""
    try:
        # Verify restaurant and category exist
        restaurant = db.query(RestaurantProfile).filter(
            RestaurantProfile.id == restaurant_id,
            RestaurantProfile.status == "approved",
            RestaurantProfile.is_active == True
        ).first()
        
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        category = db.query(MenuCategory).filter(
            MenuCategory.id == category_id,
            MenuCategory.restaurant_id == restaurant_id,
            MenuCategory.is_active == True
        ).first()
        
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Get items
        items = db.query(MenuItem).filter(
            MenuItem.category_id == category_id,
            MenuItem.is_available == True
        ).order_by(MenuItem.name).all()
        
        return [
            MenuItemResponse(
                id=str(item.id),
                name=item.name,
                description=item.description,
                image=item.image,
                price=float(item.price),
                discount_price=float(item.discount_price) if item.discount_price else None,
                is_veg=item.is_veg,
                is_available=item.is_available,
                preparation_time=item.preparation_time
            )
            for item in items
        ]
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching category items: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch items")
