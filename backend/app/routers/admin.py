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
def get_restaurants(
    status: str = None,
    db=Depends(get_db),
    user=Depends(require_admin)
):
    print("=== ADMIN RESTAURANTS REQUEST ===")
    print(f"Status filter: {status}")
    print(f"Admin user: {user}")
    
    # First, let's see ALL restaurants in the database
    all_restaurants = db.query(RestaurantProfile).all()
    print(f"TOTAL RESTAURANTS IN DB: {len(all_restaurants)}")
    for restaurant in all_restaurants:
        print(f"  ALL - {restaurant.restaurant_name} (status: {restaurant.status}, user_id: {restaurant.user_id})")
    
    query = db.query(RestaurantProfile)
    
    if status:
        query = query.filter(RestaurantProfile.status == status)
        print(f"Filtering by status: {status}")
    else:
        # By default, return all restaurants for frontend filtering
        print("Returning all restaurants for frontend filtering")
    
    restaurants = query.order_by(RestaurantProfile.created_at.desc()).all()
    print(f"Found {len(restaurants)} restaurants matching filter")
    for restaurant in restaurants:
        print(f"  FILTERED - {restaurant.restaurant_name} (status: {restaurant.status}, id: {restaurant.id})")
    
    return restaurants

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
        profile.approved_by = user.get("id")
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
        SELECT 
            -- Order fields
            o.id, o.order_number, o.user_id, o.restaurant_id,
            o.subtotal, o.tax_amount, o.delivery_fee, o.total_amount,
            o.payment_method, o.payment_status, o.order_status,
            o.delivery_address, o.customer_lat, o.customer_lng,
            o.estimated_delivery_time, o.created_at, o.updated_at,
            
            -- User fields
            u.email as user_email, u.name as user_name, u.phone as user_phone, 
            u.photo_url as user_photo, u.role as user_role,
            
            -- Restaurant fields  
            r.restaurant_name, r.owner_name as restaurant_owner, r.phone as restaurant_phone,
            r.address as restaurant_address, r.city as restaurant_city, r.cuisine,
            r.logo as restaurant_logo, r.rating as restaurant_rating,
            r.delivery_fee as restaurant_delivery_fee, r.delivery_time as restaurant_delivery_time,
            
            -- Order items count and details
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count,
            (SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'item_name', item_name,
                    'quantity', quantity,
                    'price', price,
                    'total_price', total_price
                )
            ) FROM order_items WHERE order_id = o.id) as order_items
            
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN restaurant_profiles r ON r.id = o.restaurant_id
        ORDER BY o.created_at DESC
        LIMIT 100
    """)).fetchall()
    
    result = []
    for row in rows:
        result.append({
            # Core order fields
            "id": str(row[0]),
            "order_number": row[1],
            "user_id": str(row[2]) if row[2] else None,
            "restaurant_id": str(row[3]) if row[3] else None,
            
            # Order financial details
            "subtotal": float(row[4]) if row[4] else 0,
            "tax_amount": float(row[5]) if row[5] else 0,
            "delivery_fee": float(row[6]) if row[6] else 0,
            "total_amount": float(row[7]) if row[7] else 0,
            
            # Order status and payment
            "payment_method": row[8],
            "payment_status": row[9],
            "order_status": row[10],
            
            # Delivery information
            "delivery_address": row[11],
            "customer_lat": float(row[12]) if row[12] else None,
            "customer_lng": float(row[13]) if row[13] else None,
            "estimated_delivery_time": row[14],
            
            # Timestamps
            "created_at": row[15],
            "updated_at": row[16],
            
            # User information
            "user_email": row[17],
            "user_name": row[18],
            "user_phone": row[19],
            "user_photo": row[20],
            "user_role": row[21],
            
            # Restaurant information
            "restaurant_name": row[22],
            "restaurant_owner": row[23],
            "restaurant_phone": row[24],
            "restaurant_address": row[25],
            "restaurant_city": row[26],
            "restaurant_cuisine": row[27],
            "restaurant_logo": row[28],
            "restaurant_rating": float(row[29]) if row[29] else None,
            "restaurant_delivery_fee": float(row[30]) if row[30] else None,
            "restaurant_delivery_time": row[31],
            
            # Order items
            "items_count": row[32],
            "order_items": row[33] if row[33] else [],
            
            # For frontend compatibility (mapping to existing field names)
            "customer": row[18] or row[17] or "Unknown Customer",
            "restaurant": row[22] or "Unknown Restaurant",
            "items": row[32] or 0,
            "amount": f"${float(row[7]) if row[7] else 0:.2f}",
            "status": row[10],
            "phone": row[19] or row[24] or "No phone",
            "address": row[11] or "No address",
            "time": f"{(datetime.now() - row[15]).total_seconds() / 60:.0f} mins ago" if row[15] else ""
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
