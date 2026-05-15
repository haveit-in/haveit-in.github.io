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
    try:
        print(f"=== RESTAURANT APPLICATION DEBUG ===")
        print(f"Received application data: {data}")
        print(f"User from token: {user}")
        
        # Allow users to apply for restaurant ownership
        # This endpoint is for the onboarding flow
        # Check existing application
        user_uuid = uuid.UUID(user["user_id"])
        print(f"User UUID: {user_uuid}")
        
        existing = db.query(RestaurantProfile).filter(
            RestaurantProfile.user_id == user_uuid
        ).first()
        print(f"Existing application found: {existing is not None}")

        if existing:
            print("User already applied - returning 400")
            raise HTTPException(400, "You already applied")

        print("Creating new restaurant profile...")
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

        print("Adding profile to database...")
        db.add(profile)
        print("Committing profile...")
        db.commit()
        print("Profile committed successfully")

        # Update user profile_completed to True (if column exists)
        print("Updating user profile_completed...")
        from app.models.user import User
        user_obj = db.query(User).filter(User.id == user_uuid).first()
        print(f"User object found: {user_obj is not None}")
        
        if user_obj:
            try:
                user_obj.profile_completed = True
                db.commit()
                print("profile_completed updated successfully")
            except Exception as e:
                # If profile_completed column doesn't exist, just continue
                print(f"Warning: Could not update profile_completed: {str(e)}")
                db.rollback()

        print("=== APPLICATION SUCCESSFUL ===")
        return {"success": True}
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"=== RESTAURANT APPLICATION ERROR ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Error details: {repr(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        print("=== END ERROR ===")
        raise HTTPException(500, f"Internal server error: {str(e)}")

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
        "owner_name": profile.owner_name,
        "email": profile.email,
        "phone": profile.phone,
        "address": profile.address,
        "city": profile.city,
        "cuisine": json.loads(profile.cuisine) if profile.cuisine else [],
        "fssai": profile.fssai,
        "account_number": profile.account_number,
        "ifsc": profile.ifsc,
        "account_holder": profile.account_holder,
        "status": profile.status,
        "created_at": profile.created_at.isoformat() if profile.created_at else None,
        "approved_at": profile.approved_at.isoformat() if profile.approved_at else None,
        "rejection_reason": profile.rejection_reason,
        "is_active": profile.is_active,
        "banner_image": profile.banner_image,
        "logo": profile.logo,
        "latitude": float(profile.latitude) if profile.latitude else None,
        "longitude": float(profile.longitude) if profile.longitude else None,
        "minimum_order": float(profile.minimum_order) if profile.minimum_order else 0,
        "delivery_fee": float(profile.delivery_fee) if profile.delivery_fee else 0,
        "delivery_radius_km": profile.delivery_radius_km,
        "is_open": profile.is_open,
        "rating": float(profile.rating) if profile.rating else 4.0,
        "delivery_time": profile.delivery_time,
        "total_reviews": profile.total_reviews
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

    # Update all fields from the request
    profile.restaurant_name = data.restaurant_name
    profile.owner_name = data.owner_name
    profile.email = data.email
    profile.phone = data.phone
    profile.address = data.address
    profile.city = data.city
    profile.cuisine = json.dumps(data.cuisine)
    profile.fssai = data.fssai
    profile.account_number = data.account_number
    profile.ifsc = data.ifsc
    profile.account_holder = data.account_holder
    
    db.commit()

    return {"message": "Profile updated successfully"}
