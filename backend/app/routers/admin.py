from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from app.database import get_db
from app.models.restaurant import RestaurantProfile
from app.models.user import User
from app.dependencies import require_admin, get_current_user

router = APIRouter()

@router.get("/admin/restaurants")
def get_pending_restaurants(
    status: str = "pending",
    db=Depends(get_db),
    user=Depends(require_admin)
):
    return db.query(RestaurantProfile).filter(
        RestaurantProfile.status == status
    ).order_by(RestaurantProfile.created_at.desc()).all()

@router.patch("/admin/restaurants/{id}/approve")
def approve_restaurant(
    id: str,
    db=Depends(get_db),
    user=Depends(require_admin)
):
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == id
    ).first()

    if not profile:
        raise HTTPException(404, "Restaurant not found")

    if profile.status != "pending":
        raise HTTPException(400, "Application already processed")

    # Update status and approval fields
    profile.status = "approved"
    profile.is_active = True
    profile.approved_by = user["user_id"]
    profile.approved_at = datetime.utcnow()

    # Update user role
    user_obj = db.query(User).filter(
        User.id == profile.user_id
    ).first()

    user_obj.role = "restaurant_owner"

    db.commit()

    return {"message": "Restaurant approved successfully"}

class RejectRequest(BaseModel):
    rejection_reason: str

@router.patch("/admin/restaurants/{id}/reject")
def reject_restaurant(
    id: str,
    request: RejectRequest,
    db=Depends(get_db),
    user=Depends(require_admin)
):
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == id
    ).first()

    if not profile:
        raise HTTPException(404, "Restaurant not found")

    if profile.status != "pending":
        raise HTTPException(400, "Application already processed")

    profile.status = "rejected"
    profile.rejection_reason = request.rejection_reason
    db.commit()

    return {"message": "Restaurant rejected successfully"}

@router.post("/admin/setup")
def create_admin_user(
    email: str,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Create an admin user (for initial setup only)"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if not existing_user:
        raise HTTPException(404, "User not found")
    
    # Check if already admin
    if existing_user.role == "admin":
        raise HTTPException(400, "User is already an admin")
    
    # Update user role to admin
    existing_user.role = "admin"
    db.commit()
    
    return {"message": "Admin user created successfully"}
