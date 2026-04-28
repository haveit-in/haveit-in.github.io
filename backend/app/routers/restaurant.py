from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import uuid
from app.database import get_db
from app.models.restaurant import RestaurantProfile
from app.dependencies import get_current_user

router = APIRouter()

class ApplyRequest(BaseModel):
    restaurant_name: str

@router.post("/restaurant/apply")
def apply_restaurant(
    data: ApplyRequest,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
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
        status="pending"
    )

    db.add(profile)
    db.commit()

    return {"message": "Application submitted"}
