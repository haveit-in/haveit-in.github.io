from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import uuid
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.restaurant import Restaurant
from app.models.user import User
from app.dependencies import get_current_user, require_restaurant_owner

router = APIRouter(prefix="/api/restaurants", tags=["restaurants"])

class RestaurantCreateRequest(BaseModel):
    name: str
    description: str = None
    address: str
    city: str
    cuisine_types: str
    fssai_license: str

class RestaurantUpdateRequest(BaseModel):
    name: str = None
    description: str = None
    address: str = None
    city: str = None
    cuisine_types: str = None
    fssai_license: str = None

# ✅ POST /api/restaurants - Create draft restaurant
@router.post("/draft")
def create_restaurant_draft(
    data: RestaurantCreateRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """Create a draft restaurant"""
    try:
        user_id = uuid.UUID(user["user_id"])
        
        # Check if user already has a draft
        existing = db.query(Restaurant).filter(
            Restaurant.owner_id == user_id,
            Restaurant.status == "pending"
        ).first()
        
        if existing:
            raise HTTPException(400, "You already have a pending restaurant application")
        
        restaurant = Restaurant(
            owner_id=user_id,
            name=data.name,
            description=data.description,
            address=data.address,
            city=data.city,
            cuisine_types=data.cuisine_types,
            fssai_license=data.fssai_license,
            status="pending"
        )
        
        db.add(restaurant)
        db.commit()
        db.refresh(restaurant)
        
        return {
            "id": restaurant.id,
            "status": restaurant.status,
            "message": "Draft created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Error creating draft: {str(e)}")

# ✅ PUT /api/restaurants/{id} - Update restaurant
@router.put("/{restaurant_id}")
def update_restaurant(
    restaurant_id: int,
    data: RestaurantUpdateRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """Update restaurant details"""
    try:
        user_id = uuid.UUID(user["user_id"])
        
        restaurant = db.query(Restaurant).filter(
            Restaurant.id == restaurant_id,
            Restaurant.owner_id == user_id
        ).first()
        
        if not restaurant:
            raise HTTPException(404, "Restaurant not found")
        
        # Update only provided fields
        if data.name is not None:
            restaurant.name = data.name
        if data.description is not None:
            restaurant.description = data.description
        if data.address is not None:
            restaurant.address = data.address
        if data.city is not None:
            restaurant.city = data.city
        if data.cuisine_types is not None:
            restaurant.cuisine_types = data.cuisine_types
        if data.fssai_license is not None:
            restaurant.fssai_license = data.fssai_license
        
        db.commit()
        db.refresh(restaurant)
        
        return {
            "id": restaurant.id,
            "status": restaurant.status,
            "message": "Updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Error updating restaurant: {str(e)}")

# ✅ POST /api/restaurants/{id}/submit - Submit restaurant and upgrade user role
@router.post("/{restaurant_id}/submit")
def submit_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """Submit restaurant and add restaurant_owner role to user"""
    try:
        user_id = uuid.UUID(user["user_id"])
        
        restaurant = db.query(Restaurant).filter(
            Restaurant.id == restaurant_id,
            Restaurant.owner_id == user_id
        ).first()
        
        if not restaurant:
            raise HTTPException(404, "Restaurant not found")
        
        # Mark restaurant as submitted
        restaurant.status = "submitted"
        
        # Update user roles - add restaurant_owner role
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user:
            if "restaurant_owner" not in db_user.roles:
                db_user.roles = list(db_user.roles) + ["restaurant_owner"]
        
        db.commit()
        
        return {
            "id": restaurant.id,
            "status": restaurant.status,
            "message": "Restaurant submitted successfully",
            "roles": db_user.roles if db_user else []
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Error submitting restaurant: {str(e)}")

# ✅ GET /api/restaurants/me - Get current user's restaurants
@router.get("/owner/me")
def get_my_restaurants(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """Get all restaurants owned by current user"""
    try:
        user_id = uuid.UUID(user["user_id"])
        
        restaurants = db.query(Restaurant).filter(
            Restaurant.owner_id == user_id
        ).all()
        
        return {
            "restaurants": [
                {
                    "id": r.id,
                    "name": r.name,
                    "address": r.address,
                    "city": r.city,
                    "status": r.status,
                    "created_at": r.created_at.isoformat() if r.created_at else None
                }
                for r in restaurants
            ]
        }
    except Exception as e:
        raise HTTPException(500, f"Error fetching restaurants: {str(e)}")

# ✅ GET /api/restaurants/{id} - Get single restaurant (owner only)
@router.get("/{restaurant_id}")
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """Get restaurant details (owner only)"""
    try:
        user_id = uuid.UUID(user["user_id"])
        
        restaurant = db.query(Restaurant).filter(
            Restaurant.id == restaurant_id,
            Restaurant.owner_id == user_id
        ).first()
        
        if not restaurant:
            raise HTTPException(404, "Restaurant not found")
        
        return {
            "id": restaurant.id,
            "name": restaurant.name,
            "description": restaurant.description,
            "address": restaurant.address,
            "city": restaurant.city,
            "cuisine_types": restaurant.cuisine_types,
            "fssai_license": restaurant.fssai_license,
            "status": restaurant.status
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Error fetching restaurant: {str(e)}")
