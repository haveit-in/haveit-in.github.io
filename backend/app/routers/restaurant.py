from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import uuid
import json
from app.database import get_db
from app.models.restaurant import RestaurantProfile
from app.dependencies import get_current_user, require_restaurant_owner

router = APIRouter()

class ApplyRequest(BaseModel):
    restaurant_name: str
    owner_name: str
    email: str
    phone: str
    address: str
    city: str
    cuisine: list[str]
    fssai: str
    account_number: str
    ifsc: str
    account_holder: str

@router.post("/restaurant/apply")
def apply_restaurant(
    data: ApplyRequest,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    # Allow users to apply for restaurant ownership
    # This endpoint is for the onboarding flow
    # Check existing application
    user_uuid = uuid.UUID(user["user_id"])
    existing = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()

    if existing:
        raise HTTPException(400, "You already applied")

    profile = RestaurantProfile(
        user_id=user_uuid,
        restaurant_name=data.restaurant_name,
        owner_name=data.owner_name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        city=data.city,
        cuisine=json.dumps(data.cuisine),
        fssai=data.fssai,
        account_number=data.account_number,
        ifsc=data.ifsc,
        account_holder=data.account_holder,
        status="pending"
    )

    db.add(profile)
    db.commit()

    # Update user profile_completed to True (if column exists)
    from app.models.user import User
    user_obj = db.query(User).filter(User.id == user_uuid).first()
    if user_obj:
        try:
            user_obj.profile_completed = True
            db.commit()
        except Exception as e:
            # If profile_completed column doesn't exist, just continue
            print(f"Warning: Could not update profile_completed: {str(e)}")
            db.rollback()

    return {"success": True}

@router.get("/restaurants")
def get_approved_restaurants(db=Depends(get_db)):
    """Get all approved and active restaurants for public users"""
    return db.query(RestaurantProfile).filter(
        RestaurantProfile.status == "approved",
        RestaurantProfile.is_active == True
    ).order_by(RestaurantProfile.created_at.desc()).all()

@router.get("/restaurant/profile")
def get_restaurant_profile(
    db=Depends(get_db),
    user=Depends(require_restaurant_owner)
):
    user_uuid = uuid.UUID(user["user_id"])
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()

    if not profile:
        raise HTTPException(404, "Restaurant profile not found")

    return {
        "id": str(profile.id),
        "restaurant_name": profile.restaurant_name,
        "status": profile.status
    }

@router.put("/restaurant/profile")
def update_restaurant_profile(
    data: ApplyRequest,
    db=Depends(get_db),
    user=Depends(require_restaurant_owner)
):
    user_uuid = uuid.UUID(user["user_id"])
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()

    if not profile:
        raise HTTPException(404, "Restaurant profile not found")

    profile.restaurant_name = data.restaurant_name
    db.commit()

    return {"message": "Profile updated"}
