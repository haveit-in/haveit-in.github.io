import json
import logging

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import app.models.restaurant  # noqa: F401 - register SQLAlchemy mappers
from app.auth import issue_token_pair, verify_refresh_token
from app.config import settings
from app.database import Base, engine, get_db
from app.dependencies import get_current_user
from app.firebase import verify_firebase_token
from app.logging_config import configure_logging
from app.middleware.rate_limit import rate_limit_middleware
from app.models.user import User
from app.routers import admin
from app.routers import restaurant as restaurant_router
from app.routes import cart, menu, orders, payments, restaurant_orders
from app.schemas import RefreshTokenRequest, TokenRequest
from app.websocket.manager import manager

load_dotenv()
configure_logging(settings)
log = logging.getLogger(__name__)

log.info(
    "database configured driver=%s host=%s",
    engine.url.drivername,
    getattr(engine.url, "host", None) or "local",
)

app = FastAPI()


def _login_tokens(db_user: User) -> dict[str, str]:
    return issue_token_pair(str(db_user.id), [db_user.role])


if settings.create_tables_on_startup:
    Base.metadata.create_all(bind=engine)
    log.warning(
        "sqlalchemy_create_all ran (CREATE_TABLES_ON_STARTUP=true); "
        "disable in production and use Alembic only"
    )
else:
    log.info("skipping_sqlalchemy_create_all (deployed environments should use Alembic)")

app.include_router(restaurant_router.router)
app.include_router(admin.router)
app.include_router(menu.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(restaurant_orders.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
    expose_headers=["Content-Length", "Content-Type"]
)

app.middleware("http")(rate_limit_middleware)
# app.middleware("http")(validation_middleware)  # Temporarily disabled to resolve CORS issue

if settings.debug_http:

    @app.middleware("http")
    async def debug_requests(request, call_next):
        log.debug(
            "http_request method=%s path=%s origin=%s",
            request.method,
            request.url.path,
            request.headers.get("origin", ""),
        )
        response = await call_next(request)
        log.debug("http_response status=%s", response.status_code)
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
        log.debug("google_login_attempt role=%s", data.role)
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
        log.debug("auth_role_mapping frontend=%s db=%s", data.role, role_mapped)

        # Check user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        log.debug("auth_user_lookup found=%s", user is not None)
        if user:
            log.debug("auth_existing_role=%s", user.role)

        if not user:
            # First time login - create user with mapped role
            log.info("auth_user_created role=%s", role_mapped)
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

            # If partner and new user, require onboarding
            if data.role == "partner":
                log.info("partner_onboarding_required")
                return {
                    "requiresOnboarding": True,
                    **_login_tokens(user),
                }
        else:
            # UPDATE EXISTING USER WITH CURRENT INFO
            user.email = email
            user.name = name
            if photo_url:
                user.photo_url = photo_url

            # Enforce role rules - existing user cannot change role (except for admin promotion)
            if user.role != role_mapped:
                log.warning("auth_role_conflict stored=%s requested_flow=%s", user.role, data.role)
                
                # Allow admin promotion for existing users
                if data.role == "admin" and user.role == "user":
                    log.info("auth_admin_promotion")
                    user.role = "admin"
                elif user.role == "user" and data.role == "partner":
                    raise HTTPException(
                        status_code=403,
                        detail=(
                            "This account is registered as a user. "
                            "Please use the user login page."
                        ),
                    )
                elif user.role == "restaurant_owner" and data.role == "user":
                    raise HTTPException(
                        status_code=403,
                        detail=(
                            "This account is registered as a restaurant owner. "
                            "Please use the partner login page."
                        ),
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

            # If partner, check if restaurant profile exists
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if not restaurant:
                    log.info("partner_onboarding_required_existing")
                    return {
                        "requiresOnboarding": True,
                        **_login_tokens(user),
                    }

            # If partner, check restaurant status
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if restaurant:
                    if restaurant.status == "pending":
                        log.info("partner_restaurant_pending")
                        return {
                            "requiresApproval": True,
                            **_login_tokens(user),
                        }
                    elif restaurant.status == "rejected":
                        log.info("partner_restaurant_rejected")
                        return {
                            "rejected": True,
                            "rejection_reason": restaurant.rejection_reason,
                            **_login_tokens(user),
                        }
                    elif restaurant.status == "approved" and not restaurant.is_active:
                        log.info("partner_restaurant_inactive")
                        return {
                            "requiresApproval": True,
                            **_login_tokens(user),
                        }

        log.info("google_login_success email=%s role=%s", email, user.role)
        return {
            "message": "Login successful",
            **_login_tokens(user),
            "user": {
                "id": str(user.id),
                "role": user.role,
                "email": user.email,
                "name": user.name,
                "photo_url": user.photo_url
            }
        }

    except HTTPException:
        raise
    except Exception:
        log.exception("google_login_failed")
        raise HTTPException(status_code=401, detail="Invalid Google token") from None

@app.post("/auth/login")
def login(data: TokenRequest, db: Session = Depends(get_db)):
    try:
        log.debug("login_attempt role=%s", data.role)
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
        log.debug("auth_role_mapping frontend=%s db=%s", data.role, role_mapped)

        # 🔍 Check user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        log.debug("auth_user_lookup found=%s", user is not None)
        if user:
            log.debug("auth_existing_role=%s", user.role)

        if not user:
            # First time login - create user with mapped role
            log.info("auth_user_created role=%s", role_mapped)
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

            # If partner and new user, require onboarding
            if data.role == "partner":
                log.info("partner_onboarding_required")
                return {
                    "requiresOnboarding": True,
                    **_login_tokens(user),
                }
        else:
            # 🔥 UPDATE EXISTING USER WITH CURRENT INFO
            user.email = email
            user.name = name
            if photo_url:
                user.photo_url = photo_url

            # Enforce role rules - existing user cannot change role (except for admin promotion)
            if user.role != role_mapped:
                log.warning("auth_role_conflict stored=%s requested_flow=%s", user.role, data.role)
                
                # Allow admin promotion for existing users
                if data.role == "admin" and user.role == "user":
                    log.info("auth_admin_promotion")
                    user.role = "admin"
                elif user.role == "user" and data.role == "partner":
                    raise HTTPException(
                        status_code=403,
                        detail=(
                            "This account is registered as a user. "
                            "Please use the user login page."
                        ),
                    )
                elif user.role == "restaurant_owner" and data.role == "user":
                    raise HTTPException(
                        status_code=403,
                        detail=(
                            "This account is registered as a restaurant owner. "
                            "Please use the partner login page."
                        ),
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

            # If partner, check if restaurant profile exists
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if not restaurant:
                    log.info("partner_onboarding_required_existing")
                    return {
                        "requiresOnboarding": True,
                        **_login_tokens(user),
                    }

            # If partner, check restaurant status
            if data.role == "partner":
                from app.models.restaurant import RestaurantProfile
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == user.id
                ).first()
                
                if restaurant:
                    if restaurant.status == "pending":
                        log.info("partner_restaurant_pending")
                        return {
                            "requiresApproval": True,
                            **_login_tokens(user),
                        }
                    elif restaurant.status == "rejected":
                        log.info("partner_restaurant_rejected")
                        return {
                            "rejected": True,
                            "rejection_reason": restaurant.rejection_reason,
                            **_login_tokens(user),
                        }
                    elif restaurant.status == "approved" and not restaurant.is_active:
                        log.info("partner_restaurant_inactive")
                        return {
                            "requiresApproval": True,
                            **_login_tokens(user),
                        }

        log.info("login_success email=%s role=%s", email, user.role)
        return {
            "message": "Login successful",
            **_login_tokens(user),
            "user": {
                "id": str(user.id),
                "role": user.role,
                "email": user.email,
                "name": user.name,
                "photo_url": user.photo_url
            }
        }

    except HTTPException:
        raise
    except Exception:
        log.exception("login_failed")
        raise HTTPException(status_code=401, detail="Invalid Firebase token") from None


@app.post("/auth/refresh")
def refresh_tokens(data: RefreshTokenRequest):
    """Exchange a valid refresh JWT for a new access + refresh pair (refresh rotation)."""
    payload = verify_refresh_token(data.refresh_token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    user_id = payload.get("user_id")
    roles = payload.get("roles")
    if not user_id or not isinstance(roles, list) or not roles:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return issue_token_pair(str(user_id), [str(r) for r in roles])


@app.get("/restaurants")
def get_approved_restaurants(db: Session = Depends(get_db)):
    """Public endpoint to get approved restaurants for all users"""
    try:
        from app.models.restaurant import RestaurantProfile
        
        restaurants = db.query(RestaurantProfile).filter(
            RestaurantProfile.status == "approved",
            RestaurantProfile.is_active
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
    except Exception:
        log.exception("approved_restaurants_failed")
        raise HTTPException(status_code=500, detail="Failed to fetch restaurants") from None

@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {
        "message": "Access granted",
        "user": user
    }

@app.websocket("/ws/orders/{order_id}")
async def websocket_endpoint(websocket: WebSocket, order_id: str):
    """
    WebSocket endpoint for real-time order tracking.

    Clients connect to: ``ws://.../ws/orders/{order_id}?token=<firebase_id_token>``.

    The connection is accepted only after the Firebase token is verified and the
    caller is the ordering user or the owning restaurant.
    """
    try:
        token = websocket.query_params.get("token")
        if not token:
            await websocket.close(code=4001, reason="Authentication token required")
            return

        decoded = verify_firebase_token(token)
        firebase_uid = decoded.get("uid")
        if not firebase_uid:
            await websocket.close(code=4001, reason="Invalid token")
            return

        from app.models.order import Order
        from app.models.restaurant import RestaurantProfile

        db = next(get_db())
        try:
            app_user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
            if not app_user:
                await websocket.close(code=4003, reason="User not registered")
                return

            order = db.query(Order).filter(Order.id == order_id).first()
            if not order:
                await websocket.close(code=4004, reason="Order not found")
                return

            user_is_owner = order.user_id == app_user.id
            user_is_restaurant_owner = False

            if not user_is_owner:
                restaurant = db.query(RestaurantProfile).filter(
                    RestaurantProfile.user_id == app_user.id,
                    RestaurantProfile.id == order.restaurant_id,
                ).first()
                user_is_restaurant_owner = restaurant is not None

            if not (user_is_owner or user_is_restaurant_owner):
                await websocket.close(code=4003, reason="Access denied")
                return

            await websocket.accept()

            await manager.connect(websocket, order_id, str(app_user.id))

            from app.utils.order_transition import get_tracking_message

            initial_message = {
                "type": "connection_established",
                "order_id": order_id,
                "current_status": order.order_status,
                "message": get_tracking_message(order.order_status or "PENDING"),
                "estimated_delivery_time": order.estimated_delivery_time,
            }
            await manager.send_personal_message(json.dumps(initial_message), websocket)

            while True:
                try:
                    data = await websocket.receive_text()
                    if data == "ping":
                        await websocket.send_text("pong")
                except WebSocketDisconnect:
                    break

        finally:
            db.close()

    except WebSocketDisconnect:
        manager.disconnect(websocket, order_id)
    except Exception:
        log.exception("websocket_error")
        try:
            await websocket.close(code=4000, reason="Internal server error")
        except Exception:
            pass
    finally:
        manager.disconnect(websocket, order_id)