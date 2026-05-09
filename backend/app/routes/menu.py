# app/routes/menu.py

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
import json

from app.database import get_db
from app.models import (
    RestaurantProfile,
    MenuCategory,
    MenuItem,
)
from app.schemas.menu import (
    CreateCategoryRequest,
    CategoryResponse,
    CreateMenuItemRequest,
    MenuItemResponse,
    MenuCategoryResponse,
    RestaurantMenuResponse,
)
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/restaurant",
    tags=["Restaurant Menu"]
)

@router.post("/categories", response_model=CategoryResponse)
def create_category(
    data: CreateCategoryRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id_str = current_user.get("user_id")
    print("CURRENT USER ID:", user_id_str)
    print("CURRENT USER ROLE:", current_user.get("role"))
    print("CURRENT USER FULL:", current_user)
    
    # Convert string to UUID for database comparison
    try:
        user_uuid = UUID(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()
    
    print("RESTAURANT:", restaurant)
    
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant profile not found. Please complete restaurant onboarding first."
        )
    
    category = MenuCategory(
        restaurant_id=restaurant.id,
        name=data.name,
        display_order=data.display_order
    )
    
    db.add(category)
    db.commit()
    db.refresh(category)

    return category

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id_str = current_user.get("user_id")
    
    # Convert string to UUID for database comparison
    try:
        user_uuid = UUID(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant profile not found. Please complete restaurant onboarding first."
        )
    
    categories = db.query(MenuCategory).filter(
        MenuCategory.restaurant_id == restaurant.id,
        MenuCategory.is_active == True
    ).order_by(MenuCategory.display_order).all()
    
    return categories

@router.post("/menu/items", response_model=MenuItemResponse)
async def create_menu_item(
    request: Request,
    data: CreateMenuItemRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Get raw request body
        body = await request.body()
        print(f"=== RAW REQUEST BODY ===")
        print(f"Body: {body.decode()}")
        print(f"Content-Type: {request.headers.get('content-type')}")
        print(f"========================")
        
        print(f"=== DEBUG: Received menu item data ===")
        print(f"category_id: {data.category_id} (type: {type(data.category_id)})")
        print(f"name: {data.name}")
        print(f"price: {data.price} (type: {type(data.price)})")
        print(f"discount_price: {data.discount_price}")
        print(f"is_veg: {data.is_veg}")
        print(f"is_available: {data.is_available}")
        print(f"preparation_time: {data.preparation_time}")
        print(f"================================")
        
        user_id_str = current_user.get("user_id")
        
        # Convert string to UUID for database comparison
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        restaurant = db.query(RestaurantProfile).filter(
            RestaurantProfile.user_id == user_uuid
        ).first()
        
        if not restaurant:
            raise HTTPException(
                status_code=404,
                detail="Restaurant profile not found. Please complete restaurant onboarding first."
            )
        
        try:
            category_uuid = UUID(data.category_id)
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="Invalid category_id format"
            )
        
        category = db.query(MenuCategory).filter(
            MenuCategory.id == category_uuid,
            MenuCategory.restaurant_id == restaurant.id
        ).first()
        
        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )
        
        item = MenuItem(
            restaurant_id=restaurant.id,
            category_id=category_uuid,
            name=data.name,
            description=data.description,
            image=data.image,
            price=data.price,
            discount_price=data.discount_price,
            is_veg=data.is_veg,
            is_available=data.is_available,
            preparation_time=data.preparation_time
        )
        
        db.add(item)
        db.commit()
        db.refresh(item)

        return item
        
    except Exception as e:
        print(f"=== ERROR IN CREATE MENU ITEM ===")
        print(f"Error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        print(f"================================")
        raise HTTPException(status_code=422, detail=f"Validation error: {str(e)}")

@router.get("/menu/items", response_model=List[MenuItemResponse])
def get_menu_items(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id_str = current_user.get("user_id")
    
    # Convert string to UUID for database comparison
    try:
        user_uuid = UUID(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant profile not found. Please complete restaurant onboarding first."
        )
    
    items = db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant.id
    ).order_by(MenuItem.name).all()
    
    return items

@router.put("/menu/items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: str,
    data: CreateMenuItemRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id_str = current_user.get("user_id")
    
    # Convert string to UUID for database comparison
    try:
        user_uuid = UUID(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant profile not found. Please complete restaurant onboarding first."
        )
    
    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )
    
    category = db.query(MenuCategory).filter(
        MenuCategory.id == data.category_id,
        MenuCategory.restaurant_id == restaurant.id
    ).first()
    
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    item.category_id = data.category_id
    item.name = data.name
    item.description = data.description
    item.image = data.image
    item.price = data.price
    item.discount_price = data.discount_price
    item.is_veg = data.is_veg
    item.is_available = data.is_available
    item.preparation_time = data.preparation_time
    
    db.commit()
    db.refresh(item)
    
    return item

@router.delete("/menu/items/{item_id}")
def delete_menu_item(
    item_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id_str = current_user.get("user_id")
    
    # Convert string to UUID for database comparison
    try:
        user_uuid = UUID(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant profile not found. Please complete restaurant onboarding first."
        )
    
    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )
    
    db.delete(item)
    db.commit()
    
    return {"message": "Menu item deleted successfully"}

@router.get("/restaurants/{restaurant_id}/menu", response_model=RestaurantMenuResponse)
def get_restaurant_menu(
    restaurant_id: str,
    db: Session = Depends(get_db)
):
    """Get complete menu for a restaurant"""
    print(f"=== GET RESTAURANT MENU ===")
    print(f"Restaurant ID: {restaurant_id}")
    try:
        # Get restaurant info
        restaurant = db.query(RestaurantProfile).filter(
            RestaurantProfile.id == restaurant_id,
            RestaurantProfile.status == "approved",
            RestaurantProfile.is_active == True
        ).first()
        
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant profile not found. Please complete restaurant onboarding first.")
        
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
                    category_id=str(item.category_id),
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
            raise HTTPException(status_code=404, detail="Restaurant profile not found. Please complete restaurant onboarding first.")
        
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
            raise HTTPException(status_code=404, detail="Restaurant profile not found. Please complete restaurant onboarding first.")
        
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

