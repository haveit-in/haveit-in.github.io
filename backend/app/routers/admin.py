from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.models.restaurant import RestaurantProfile
from app.models.user import User
from app.dependencies import require_admin

router = APIRouter()

@router.get("/admin/restaurants")
def get_pending_restaurants(
    db=Depends(get_db),
    user=Depends(require_admin)
):
    return db.query(RestaurantProfile).filter(
        RestaurantProfile.status == "pending"
    ).all()

@router.post("/admin/restaurants/{id}/approve")
def approve_restaurant(
    id: str,
    db=Depends(get_db),
    user=Depends(require_admin)
):
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == id
    ).first()

    if not profile:
        raise HTTPException(404, "Not found")

    if profile.status != "pending":
        raise HTTPException(400, "Application already processed")

    # Update status
    profile.status = "approved"

    # Update user role
    user_obj = db.query(User).filter(
        User.id == profile.user_id
    ).first()

    user_obj.role = "restaurant_owner"

    db.commit()

    return {"message": "Approved"}

@router.post("/admin/restaurants/{id}/reject")
def reject_restaurant(
    id: str,
    db=Depends(get_db),
    user=Depends(require_admin)
):
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.id == id
    ).first()

    if not profile:
        raise HTTPException(404, "Not found")

    if profile.status != "pending":
        raise HTTPException(400, "Application already processed")

    profile.status = "rejected"
    db.commit()

    return {"message": "Rejected"}
