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
    try:
        print(f"=== APPROVE RESTaurant REQUEST ===")
        print(f"Restaurant ID: {id}")
        print(f"User: {user}")
        
        profile = db.query(RestaurantProfile).filter(
            RestaurantProfile.id == id
        ).first()

        if not profile:
            print(f"Restaurant not found: {id}")
            raise HTTPException(status_code=404, detail="Restaurant not found")

        if profile.status != "pending":
            print(f"Restaurant already processed: {profile.status}")
            raise HTTPException(status_code=400, detail="Application already processed")

        # Update status and approval fields
        profile.status = "approved"
        profile.is_active = True
        profile.approved_by = user["user_id"]
        profile.approved_at = datetime.utcnow()

        # Update user role
        user_obj = db.query(User).filter(
            User.id == profile.user_id
        ).first()

        if not user_obj:
            print(f"User not found for restaurant: {profile.user_id}")
            raise HTTPException(status_code=404, detail="User not found")

        # Update user role to restaurant_owner if not already set
        if user_obj.role != "restaurant_owner":
            user_obj.role = "restaurant_owner"

        db.commit()
        print(f"Restaurant approved successfully: {id}")

        return {"message": "Restaurant approved successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error approving restaurant: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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

@router.get("/admin/dashboard")
def admin_dashboard(
    db=Depends(get_db),
    user=Depends(require_admin)
):
    from app.models.user import User
    from app.models.restaurant import RestaurantProfile
    from sqlalchemy import text
    
    users = db.query(User).count()
    restaurants = db.query(RestaurantProfile).filter(RestaurantProfile.status == 'approved').count()
    pending = db.query(RestaurantProfile).filter(RestaurantProfile.status == 'pending').count()
    orders = db.execute(text("SELECT COUNT(*) FROM orders")).scalar()

    return {
        "totalUsers": users,
        "totalRestaurants": restaurants,
        "pendingRestaurants": pending,
        "totalOrders": orders,
        "revenue": 0  # wire later
    }

@router.get("/admin/users")
def admin_users(
    db=Depends(get_db),
    user=Depends(require_admin)
):
    from app.models.user import User
    users = db.query(User).order_by(User.id.desc()).all()
    result = []
    for user_record in users:
        result.append({
            "id": str(user_record.id),
            "email": user_record.email,
            "role": user_record.role or "user",
            "created_at": None  # User model doesn't have created_at field
        })
    return result

@router.get("/admin/orders")
def admin_orders(
    db=Depends(get_db),
    user=Depends(require_admin)
):
    from sqlalchemy import text
    rows = db.execute(text("""
        SELECT o.id, o.total_amount, o.status, o.created_at,
               u.email as user_email
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 100
    """)).fetchall()
    
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "total_amount": float(row[1]) if row[1] else 0,
            "status": row[2],
            "created_at": row[3],
            "user_email": row[4]
        })
    return result

@router.get("/admin/analytics")
def admin_analytics(
    db=Depends(get_db),
    user=Depends(require_admin)
):
    from sqlalchemy import text
    
    data = db.execute(text("""
        SELECT DATE(created_at) as date,
               COUNT(*) as orders
        FROM orders
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    """)).fetchall()

    return {
        "ordersTrend": [dict(row) for row in data]
    }

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
