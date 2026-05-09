from app.auth import create_access_token
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from uuid import UUID
import json

from app.websocket.manager import manager

from app.database import Base, engine, get_db
from app.firebase import verify_firebase_token
from app.models import user, restaurant
from app.models.user import User
from app.schemas import TokenRequest
from app.dependencies import get_current_user
from app.routers import restaurant, admin
from app.routes import menu
from app.routes import cart
from app.routes import orders
from app.routes import payments
from app.routes import restaurant_orders
from app.middleware.rate_limit import rate_limit_middleware
from app.middleware.validation import validation_middleware

load_dotenv()

# Debug database connection
from app.database import engine
print("DATABASE URL:", engine.url)

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

app.include_router(restaurant.router)
app.include_router(admin.router)
app.include_router(menu.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(restaurant_orders.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:3000",
        "https://haveit-official.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
    expose_headers=["Content-Length", "Content-Type"]
)

app.middleware("http")(rate_limit_middleware)
# app.middleware("http")(validation_middleware)  # Temporarily disabled to resolve CORS issue

# Add debugging middleware
@app.middleware("http")
async def debug_requests(request, call_next):
    print(f"=== INCOMING REQUEST ===")
    print(f"Method: {request.method}")
    print(f"URL: {request.url}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Origin: {request.headers.get('origin', 'No origin header')}")
    print(f"=========================")
    
    response = await call_next(request)
    
    print(f"=== RESPONSE ===")
    print(f"Status: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"===============")
    
    return response

@app.get("/")
def root():
    return {"message": "HaveIt backend running 🚀"}

@app.get("/test-db")
def test_db():
    try:
        conn = engine.connect()
        conn.close()
        return {"message": "Database connected ✅"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/auth/google")
def google_login(data: TokenRequest, db: Session = Depends(get_db)):
    try:
        print(f"=== GOOGLE LOGIN ATTEMPT ===")
        print(f"Received token type: {type(data.token)}")
        print(f"Received role: {data.role}")
        print(f"Token length: {len(data.token)}")
        print(f"Token segments: {len(data.token.split('.'))}")
        print(f"Token starts with: {data.token[:50]}...")
        print(f"Token ends with: {data.token[-50:]}...")
        decoded = verify_firebase_token(data.token)

        firebase_uid = decoded.get("uid")
        email = decoded.get("email")
        phone = decoded.get("phone_number")
        name = decoded.get("name")
        photo_url = decoded.get("picture")

        # Map frontend role to database role
        if data.role == "partner":
            role_mapped = "restaurant_owner"
        elif data.role == "admin":
            role_mapped = "admin"
        else:
            role_mapped = "user"
        print(f"Role mapping: {data.role} -> {role_mapped}")

        # Check user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        print(f"User found: {user is not None}")
        if user:
            print(f"Existing user role: {user.role}")

        if not user:
            # First time login - create user with mapped role
            print(f"Creating new user with role: {role_mapped}")
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                phone=phone,
                name=name,
                photo_url=photo_url,
                role=role_mapped
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Generate access token
            token = create_access_token({
                "user_id": str(user.id),
                "roles": [user.role]
            })

            # If partner and new user, require onboarding
            if data.role == "partner":
                print(f"New partner requires onboarding")
                return {
                    "requiresOnboarding": True,
                    "access_token": token
                }
        else:
            # UPDATE EXISTING USER WITH CURRENT INFO
            user.email = email
            user.name = name
            if photo_url:
                user.photo_url = photo_url

            # Enforce role rules - existing user cannot change role (except for admin promotion)
            if user.role != role_mapped:
                print(f"Role mismatch: user.role={user.role}, requested role={data.role}")
                
                # Allow admin promotion for existing users
                if data.role == "admin" and user.role == "user":
                    print(f"Promoting user to admin role")
                    user.role = "admin"
                elif user.role == "user" and data.role == "partner":
                    raise HTTPException(
                        status_code=403, 
                        detail="This account is registered as a user. Please use the user login page."
                    )
                elif user.role == "restaurant_owner" and data.role == "user":
                    raise HTTPException(
                        status_code=403, 
                        detail="This account is registered as a restaurant owner. Please use the partner login page."
                    )
                elif user.role == "admin" and data.role != "admin":
                    raise HTTPException(
                        status_code=403, 
                        detail="Admin account cannot login with other roles."
                    )
                else:
                    raise HTTPException(status_code=403, detail="Invalid role login")

            db.commit()
            db.refresh(user)

            # Generate access token
            token = create_access_token({
                "user_id": str(user.id),
                "roles": [user.role]
            })

            # If partner, check if restaurant profile exists
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if not restaurant:
                    print(f"Existing partner requires onboarding")
                    return {
                        "requiresOnboarding": True,
                        "access_token": token
                    }

            # If partner, check restaurant status
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if restaurant:
                    if restaurant.status == "pending":
                        print(f"Partner restaurant is pending approval")
                        return {
                            "requiresApproval": True,
                            "access_token": token
                        }
                    elif restaurant.status == "rejected":
                        print(f"Partner restaurant was rejected")
                        return {
                            "rejected": True,
                            "rejection_reason": restaurant.rejection_reason,
                            "access_token": token
                        }
                    elif restaurant.status == "approved" and not restaurant.is_active:
                        print(f"Partner restaurant is approved but not active")
                        return {
                            "requiresApproval": True,
                            "access_token": token
                        }

        token = create_access_token({
            "user_id": str(user.id),
            "roles": [user.role]
        })

        print(f"Google login successful for user: {email}, role: {user.role}")
        return {
            "message": "Login successful",
            "access_token": token,
            "user": {
                "id": str(user.id),
                "role": user.role,
                "email": user.email,
                "name": user.name,
                "photo_url": user.photo_url
            }
        }

    except Exception as e:
        print(f"Google login error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")

@app.post("/auth/login")
def login(data: TokenRequest, db: Session = Depends(get_db)):
    try:
        print(f"=== LOGIN ATTEMPT ===")
        print(f"Received token type: {type(data.token)}")
        print(f"Received role: {data.role}")
        print(f"Token length: {len(data.token)}")
        print(f"Token segments: {len(data.token.split('.'))}")
        print(f"Token starts with: {data.token[:50]}...")
        print(f"Token ends with: {data.token[-50:]}...")
        decoded = verify_firebase_token(data.token)

        firebase_uid = decoded.get("uid")
        email = decoded.get("email")
        phone = decoded.get("phone_number")
        name = decoded.get("name")
        photo_url = decoded.get("picture")

        # Map frontend role to database role
        if data.role == "partner":
            role_mapped = "restaurant_owner"
        elif data.role == "admin":
            role_mapped = "admin"
        else:
            role_mapped = "user"
        print(f"Role mapping: {data.role} -> {role_mapped}")

        # 🔍 Check user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        print(f"User found: {user is not None}")
        if user:
            print(f"Existing user role: {user.role}")

        if not user:
            # First time login - create user with mapped role
            print(f"Creating new user with role: {role_mapped}")
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                phone=phone,
                name=name,
                photo_url=photo_url,
                role=role_mapped
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Generate access token
            token = create_access_token({
                "user_id": str(user.id),
                "roles": [user.role]
            })

            # If partner and new user, require onboarding
            if data.role == "partner":
                print(f"New partner requires onboarding")
                return {
                    "requiresOnboarding": True,
                    "access_token": token
                }
        else:
            # 🔥 UPDATE EXISTING USER WITH CURRENT INFO
            user.email = email
            user.name = name
            if photo_url:
                user.photo_url = photo_url

            # Enforce role rules - existing user cannot change role (except for admin promotion)
            if user.role != role_mapped:
                print(f"Role mismatch: user.role={user.role}, requested role={data.role}")
                
                # Allow admin promotion for existing users
                if data.role == "admin" and user.role == "user":
                    print(f"Promoting user to admin role")
                    user.role = "admin"
                elif user.role == "user" and data.role == "partner":
                    raise HTTPException(
                        status_code=403, 
                        detail="This account is registered as a user. Please use the user login page."
                    )
                elif user.role == "restaurant_owner" and data.role == "user":
                    raise HTTPException(
                        status_code=403, 
                        detail="This account is registered as a restaurant owner. Please use the partner login page."
                    )
                elif user.role == "admin" and data.role != "admin":
                    raise HTTPException(
                        status_code=403, 
                        detail="Admin account cannot login with other roles."
                    )
                else:
                    raise HTTPException(status_code=403, detail="Invalid role login")

            db.commit()
            db.refresh(user)

            # Generate access token
            token = create_access_token({
                "user_id": str(user.id),
                "roles": [user.role]
            })

            # If partner, check if restaurant profile exists
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if not restaurant:
                    print(f"Existing partner requires onboarding")
                    return {
                        "requiresOnboarding": True,
                        "access_token": token
                    }

            # If partner, check restaurant status
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if restaurant:
                    if restaurant.status == "pending":
                        print(f"Partner restaurant is pending approval")
                        return {
                            "requiresApproval": True,
                            "access_token": token
                        }
                    elif restaurant.status == "rejected":
                        print(f"Partner restaurant was rejected")
                        return {
                            "rejected": True,
                            "rejection_reason": restaurant.rejection_reason,
                            "access_token": token
                        }
                    elif restaurant.status == "approved" and not restaurant.is_active:
                        print(f"Partner restaurant is approved but not active")
                        return {
                            "requiresApproval": True,
                            "access_token": token
                        }

        token = create_access_token({
            "user_id": str(user.id),
            "roles": [user.role]
        })

        print(f"Login successful for user: {email}, role: {user.role}")
        return {
            "message": "Login successful",
            "access_token": token,
            "user": {
                "id": str(user.id),
                "role": user.role,
                "email": user.email,
                "name": user.name,
                "photo_url": user.photo_url
            }
        }

    except Exception as e:
        print(f"Firebase token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")

@app.get("/restaurants")
def get_approved_restaurants(db: Session = Depends(get_db)):
    """Public endpoint to get approved restaurants for all users"""
    try:
        from app.models.restaurant import RestaurantProfile
        
        restaurants = db.query(RestaurantProfile).filter(
            RestaurantProfile.status == "approved",
            RestaurantProfile.is_active == True
        ).order_by(RestaurantProfile.created_at.desc()).all()
        
        result = []
        for restaurant in restaurants:
            result.append({
                "id": str(restaurant.id),
                "restaurant_name": restaurant.restaurant_name,
                "email": restaurant.email,
                "phone": restaurant.phone,
                "address": restaurant.address,
                "city": restaurant.city,
                "state": restaurant.state,
                "zipcode": restaurant.zipcode,
                "cuisine_type": restaurant.cuisine_type,
                "delivery_time": restaurant.delivery_time,
                "rating": float(restaurant.rating) if restaurant.rating else 4.0,
                "approved_at": restaurant.approved_at,
                "created_at": restaurant.created_at,
                # New fields
                "banner_image": restaurant.banner_image,
                "logo": restaurant.logo,
                "latitude": float(restaurant.latitude) if restaurant.latitude else None,
                "longitude": float(restaurant.longitude) if restaurant.longitude else None,
                "minimum_order": float(restaurant.minimum_order) if restaurant.minimum_order else 0,
                "delivery_fee": float(restaurant.delivery_fee) if restaurant.delivery_fee else 0,
                "delivery_radius_km": restaurant.delivery_radius_km,
                "is_open": restaurant.is_open,
                "total_reviews": restaurant.total_reviews
            })
        
        return result
    except Exception as e:
        print(f"Error fetching approved restaurants: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch restaurants")

@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {
        "message": "Access granted",
        "user": user
    }

@app.websocket("/ws/orders/{order_id}")
async def websocket_endpoint(websocket: WebSocket, order_id: str):
    """
    WebSocket endpoint for real-time order tracking
    
    Clients connect to: ws://localhost:8000/ws/orders/{order_id}
    
    Authentication: Token should be passed as query parameter: ?token=firebase_token
    """
    await websocket.accept()
    
    try:
        # Get token from query parameters
        token = websocket.query_params.get("token")
        if not token:
            await websocket.close(code=4001, reason="Authentication token required")
            return
        
        # Verify Firebase token
        decoded = verify_firebase_token(token)
        user_id = decoded.get("uid")
        
        # Validate user has access to this order
        from app.models.order import Order
        from app.models.restaurant import RestaurantProfile
        
        db = next(get_db())
        try:
            order = db.query(Order).filter(Order.id == order_id).first()
            if not order:
                await websocket.close(code=4004, reason="Order not found")
                return
            
            # Check if user owns the order or owns the restaurant
            user_is_owner = order.user_id == user_id
            user_is_restaurant_owner = False
            
            if not user_is_owner:
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user_id,
                    RestaurantProfile.id == order.restaurant_id
                ).first()
                user_is_restaurant_owner = restaurant is not None
            
            if not (user_is_owner or user_is_restaurant_owner):
                await websocket.close(code=4003, reason="Access denied")
                return
            
            # Connect to manager
            await manager.connect(websocket, order_id, user_id)
            
            # Send initial status
            from app.utils.order_transition import get_tracking_message
            initial_message = {
                "type": "connection_established",
                "order_id": order_id,
                "current_status": order.order_status,
                "message": get_tracking_message(order.order_status or "PENDING"),
                "estimated_delivery_time": order.estimated_delivery_time
            }
            await manager.send_personal_message(json.dumps(initial_message), websocket)
            
            # Keep connection alive
            while True:
                try:
                    # Wait for client messages (ping/pong)
                    data = await websocket.receive_text()
                    
                    # Handle ping messages
                    if data == "ping":
                        await websocket.send_text("pong")
                    
                except WebSocketDisconnect:
                    break
                    
        finally:
            db.close()
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, order_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close(code=4000, reason="Internal server error")
    finally:
        manager.disconnect(websocket, order_id)