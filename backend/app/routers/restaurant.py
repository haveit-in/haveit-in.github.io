from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import uuid
import json
from datetime import datetime, timedelta
from app.database import get_db
from app.models.restaurant import RestaurantProfile
from app.models.order import Order
from app.models.payment import Payment
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

@router.get("/restaurant/earnings")
def get_restaurant_earnings(
    db=Depends(get_db),
    user=Depends(require_restaurant_owner)
):
    """Get earnings for the logged-in restaurant owner's restaurant only"""
    from sqlalchemy import text

    user_uuid = uuid.UUID(user["user_id"])

    # Step 1: Get restaurant profile by user_id (logged-in owner)
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()

    if not profile:
        raise HTTPException(404, "Restaurant profile not found")

    # Step 2: Get earnings ONLY for this restaurant (filtered by restaurant_id)
    result = db.execute(text("""
        SELECT
            COALESCE(SUM(CAST(o.total_amount AS NUMERIC)), 0) as total_earnings,
            COUNT(CASE WHEN o.payment_status = 'PAID' THEN 1 END) as paid_orders,
            COUNT(*) as total_orders
        FROM orders o
        WHERE o.restaurant_id = :restaurant_id
        AND o.payment_status = 'PAID'
    """), {"restaurant_id": str(profile.id)}).first()

    total_earnings, paid_orders, total_orders = result

    return {
        "restaurant_id": str(profile.id),
        "total_earnings": float(total_earnings),
        "paid_orders": paid_orders or 0,
        "total_orders": total_orders or 0
    }

@router.get("/restaurant/earnings/analytics")
def get_restaurant_earnings_analytics(
    db=Depends(get_db),
    user=Depends(require_restaurant_owner)
):
    """Get daily earnings trend for the logged-in restaurant owner's restaurant only"""
    from sqlalchemy import text

    user_uuid = uuid.UUID(user["user_id"])

    # Step 1: Get restaurant profile by user_id (logged-in owner)
    profile = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == user_uuid
    ).first()

    if not profile:
        raise HTTPException(404, "Restaurant profile not found")

    # Step 2: Get daily earnings ONLY for this restaurant
    data = db.execute(text("""
        SELECT DATE(o.created_at) as date,
               COUNT(*) as orders,
               COALESCE(SUM(CAST(o.total_amount AS NUMERIC)), 0) as revenue
        FROM orders o
        WHERE o.restaurant_id = :restaurant_id
        AND o.payment_status = 'PAID'
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
    """), {"restaurant_id": str(profile.id)}).fetchall()

    return {
        "restaurant_id": str(profile.id),
        "earningsTrend": [{"date": row[0], "orders": row[1], "revenue": float(row[2])} for row in data]
    }

@router.get("/partner/dashboard/earnings")
def get_partner_dashboard_earnings(
    db=Depends(get_db),
    user=Depends(require_restaurant_owner)
):
    """
    Get comprehensive earnings dashboard for the logged-in restaurant owner's restaurant.
    
    Uses payments table with joins to orders and restaurant_profiles.
    Filters by logged-in user ID from JWT.
    """
    from sqlalchemy import text
    
    logged_in_user_id = user["user_id"]
    import logging
    log = logging.getLogger(__name__)
    log.info("EARNINGS_DEBUG: current_user=%s, user_id=%s", user, logged_in_user_id)
    
    # Step 5: Main earnings query (total earnings from payments)
    total_earnings_result = db.execute(text("""
        SELECT 
            COALESCE(SUM(p.amount), 0) AS total_earnings
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
        AND p.payment_status = 'PAID'
    """), {"logged_in_user_id": logged_in_user_id}).first()
    
    # Step 6: Weekly earnings query (last 7 days)
    weekly_earnings_result = db.execute(text("""
        SELECT 
            COALESCE(SUM(p.amount), 0) AS weekly_earnings
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
        AND p.payment_status = 'PAID'
        AND p.created_at >= NOW() - INTERVAL '7 days'
    """), {"logged_in_user_id": logged_in_user_id}).first()
    
    # Step 7: Monthly earnings query (current month)
    monthly_earnings_result = db.execute(text("""
        SELECT 
            COALESCE(SUM(p.amount), 0) AS monthly_earnings
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
        AND p.payment_status = 'PAID'
        AND DATE_TRUNC('month', p.created_at) = DATE_TRUNC('month', NOW())
    """), {"logged_in_user_id": logged_in_user_id}).first()
    
    # Step 8: Pending earnings query
    pending_amount_result = db.execute(text("""
        SELECT 
            COALESCE(SUM(p.amount), 0) AS pending_amount
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
        AND p.payment_status = 'PENDING'
    """), {"logged_in_user_id": logged_in_user_id}).first()
    
    # Step 9: Weekly graph query
    weekly_chart_result = db.execute(text("""
        SELECT
            TO_CHAR(p.created_at, 'Dy') AS day,
            SUM(p.amount) AS total
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
        AND p.payment_status = 'PAID'
        AND p.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(p.created_at), day
        ORDER BY DATE(p.created_at)
    """), {"logged_in_user_id": logged_in_user_id}).fetchall()
    
    weekly_chart = [
        {"day": row[0], "amount": float(row[1]) if row[1] else 0.0}
        for row in weekly_chart_result
    ]
    
    # Step 10: Transactions query
    transactions_result = db.execute(text("""
        SELECT
            p.payment_id,
            p.amount,
            p.payment_status,
            p.created_at,
            o.order_number
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        JOIN restaurant_profiles rp ON o.restaurant_id = rp.id
        WHERE rp.user_id = :logged_in_user_id
        ORDER BY p.created_at DESC
        LIMIT 10
    """), {"logged_in_user_id": logged_in_user_id}).fetchall()
    
    transactions = [
        {
            "payment_id": row[0],
            "order_number": row[4],
            "amount": float(row[1]),
            "payment_status": row[2]
        }
        for row in transactions_result
    ]
    
    # Step 11: Return structured API response
    return {
        "weekly_earnings": float(weekly_earnings_result[0]) if weekly_earnings_result and weekly_earnings_result[0] else 0.0,
        "monthly_earnings": float(monthly_earnings_result[0]) if monthly_earnings_result and monthly_earnings_result[0] else 0.0,
        "pending_amount": float(pending_amount_result[0]) if pending_amount_result and pending_amount_result[0] else 0.0,
        "weekly_chart": weekly_chart,
        "transactions": transactions
    }
