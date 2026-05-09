# app/routes/orders.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID
from decimal import Decimal
import random
import string
from datetime import datetime, timedelta

from app.database import get_db
from app.models.cart import Cart, CartItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_tracking import OrderTrackingLog
from app.models.menu_item import MenuItem
from app.models.restaurant import RestaurantProfile
from app.schemas.order import CreateOrderRequest, OrderResponse, OrderListResponse, OrderItemResponse, TrackingLogResponse, RestaurantOrderInfo
from app.dependencies import get_current_user
from app.utils.cart_calculations import calculate_cart_totals
from app.utils.order_status import OrderStatus, PaymentStatus, PaymentMethod

router = APIRouter()

def generate_order_number():
    """Generate unique order number in HVT-YYYYMMDD-NNNN format"""
    from datetime import datetime
    import uuid
    
    date_str = datetime.now().strftime("%Y%m%d")
    uuid_suffix = str(uuid.uuid4())[:4].upper()
    return f"HVT-{date_str}-{uuid_suffix}"

def calculate_estimated_delivery_time(restaurant):
    """Calculate estimated delivery time - temporary 30-40 mins logic"""
    from datetime import datetime, timedelta
    import random
    
    # Temporary logic: 30-40 mins
    min_minutes = 30
    max_minutes = 40
    estimated_minutes = random.randint(min_minutes, max_minutes)
    estimated_time = datetime.now() + timedelta(minutes=estimated_minutes)
    
    return f"{estimated_minutes} mins"

@router.post("/orders", response_model=OrderResponse)
def create_order(
    request: CreateOrderRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create order from cart (checkout endpoint)"""
    try:
        print(f"=== ORDER CREATION DEBUG ===")
        print(f"Payment method: {request.payment_method}")
        print(f"Request data: {request}")
        
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Handle both old and new request structures
        if request.items and len(request.items) > 0 and request.restaurant_id:
            # NEW STRUCTURE: Use cart data from request
            print(f"=== DEBUG: Using new request structure ===")
            print(f"User UUID: {user_uuid}")
            print(f"Restaurant ID: {request.restaurant_id}")
            print(f"Cart items: {len(request.items)}")
            for item in request.items:
                print(f"  - Item: {item.get('name', 'Unknown')}, Quantity: {item.get('quantity', 0)}")
            
            # Convert restaurant_id from string to UUID
            try:
                restaurant_uuid = UUID(request.restaurant_id)
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Invalid restaurant ID format")
            
            # STEP 1: Validate Restaurant
            restaurant = db.query(RestaurantProfile).filter(
                RestaurantProfile.id == restaurant_uuid,
                RestaurantProfile.status == "approved",
                RestaurantProfile.is_active == True
            ).first()
            
            if not restaurant:
                raise HTTPException(status_code=404, detail="Restaurant not found")
            
            if not restaurant.is_open:
                raise HTTPException(status_code=400, detail="Restaurant is closed")
            
            # STEP 3: Generate Unique Order Number
            order_number = generate_order_number()
            
            # STEP 4: Create Order Record (with placeholder totals)
            order = Order(
                user_id=user_uuid,
                restaurant_id=restaurant_uuid,
                order_number=order_number,
                subtotal=Decimal("0.0"),  # Will be updated after items processing
                tax_amount=Decimal("0.0"),  # Will be updated after items processing
                delivery_fee=Decimal("0.0"),  # Will be updated after items processing
                total_amount=Decimal("0.0"),  # Will be updated after items processing
                payment_method=request.payment_method,
                payment_status=PaymentStatus.PENDING.value,
                order_status=OrderStatus.ORDER_CONFIRMED.value,
                delivery_address=request.delivery_address,
                customer_lat=request.customer_lat,
                customer_lng=request.customer_lng,
                estimated_delivery_time=calculate_estimated_delivery_time(restaurant)
            )
            db.add(order)
            db.flush()
            
            # STEP 5: Create Order Items
            order_items = []
            subtotal = Decimal("0.0")
            
            for item_data in request.items:
                # Fetch menu item from database with validation
                menu_item = db.query(MenuItem).filter(
                    MenuItem.id == UUID(item_data.get("menu_item_id")),
                    MenuItem.restaurant_id == restaurant_uuid,
                    MenuItem.is_available == True
                ).first()
                
                if not menu_item:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Menu item not found: {item_data.get('menu_item_id')}"
                    )
                
                quantity = int(item_data.get("quantity", 1))
                print(f"DEBUG: item_data: {item_data}")
                print(f"DEBUG: subtotal type: {type(subtotal)}")
                print(f"DEBUG: menu_item.price type: {type(menu_item.price)}")
                print(f"DEBUG: raw quantity: {item_data.get('quantity', 1)} type: {type(item_data.get('quantity', 1))}")
                print(f"DEBUG: quantity type: {type(quantity)}")
                item_total = menu_item.price * quantity
                print(f"DEBUG: item_total type: {type(item_total)}")
                print(f"DEBUG: About to add: {subtotal} += {item_total}")
                subtotal += item_total
                
                order_item = OrderItem(
                    order_id=order.id,
                    menu_item_id=menu_item.id,
                    item_name=menu_item.name,
                    quantity=quantity,
                    price=menu_item.price,
                    total_price=item_total
                )
                db.add(order_item)
                order_items.append(order_item)
            
            # STEP 6: Update Order Totals
            tax_amount = subtotal * Decimal("0.05")
            delivery_fee = Decimal(str(restaurant.delivery_fee or 0))
            total_amount = subtotal + tax_amount + delivery_fee
            
            order.subtotal = subtotal
            order.tax_amount = tax_amount
            order.delivery_fee = delivery_fee
            order.total_amount = total_amount
        else:
            # OLD STRUCTURE: Use database cart (temporary fallback)
            print(f"=== DEBUG: Using old database cart structure ===")
            print(f"User UUID: {user_uuid}")
            
            # STEP 1: Validate User Cart Exists
            cart = db.query(Cart).options(
                joinedload(Cart.cart_items).joinedload(CartItem.menu_item),
                joinedload(Cart.restaurant)
            ).filter(Cart.user_id == user_uuid).first()
            
            print(f"Cart found: {cart is not None}")
            print(f"Cart items: {len(cart.cart_items) if cart else 'None'}")
            
            if not cart or not cart.cart_items:
                raise HTTPException(status_code=400, detail="Cart is empty")
            
            # STEP 2: Validate Restaurant Open
            if not cart.restaurant.is_open:
                raise HTTPException(status_code=400, detail="Restaurant is closed")
            
            # STEP 3: Validate Menu Items Still Available
            for cart_item in cart.cart_items:
                if not cart_item.menu_item.is_available:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Item '{cart_item.menu_item.name}' is no longer available"
                    )
            
            # STEP 4: Recalculate Totals
            cart_items_data = [{'total_price': item.total_price for item in cart.cart_items}]
            restaurant_delivery_fee = cart.restaurant.delivery_fee
            totals = calculate_cart_totals(cart_items_data, restaurant_delivery_fee)
            
            # STEP 5: Generate Unique Order Number
            order_number = generate_order_number()
            
            # STEP 6: Create Order Record
            order = Order(
                user_id=user_uuid,
                restaurant_id=cart.restaurant_id,
                order_number=order_number,
                subtotal=totals['subtotal'],
                tax_amount=totals['tax'],
                delivery_fee=totals['delivery_fee'],
                total_amount=totals['grand_total'],
                payment_method=request.payment_method,
                payment_status=PaymentStatus.PENDING.value,
                order_status=OrderStatus.ORDER_CONFIRMED.value,
                delivery_address=request.delivery_address,
                customer_lat=request.customer_lat,
                customer_lng=request.customer_lng,
                estimated_delivery_time=calculate_estimated_delivery_time(cart.restaurant)
            )
            db.add(order)
            db.flush()
            
            # STEP 7: Create Order Items
            order_items = []
            for cart_item in cart.cart_items:
                order_item = OrderItem(
                    order_id=order.id,
                    menu_item_id=cart_item.menu_item.id,
                    item_name=cart_item.menu_item.name,
                    quantity=cart_item.quantity,
                    price=cart_item.item_price,
                    total_price=cart_item.total_price
                )
                db.add(order_item)
                order_items.append(order_item)
            
            restaurant = cart.restaurant
        
        # STEP 8: Create Initial Tracking Log
        tracking_log = OrderTrackingLog(
            order_id=order.id,
            status=OrderStatus.ORDER_CONFIRMED.value,
            message="Your order has been confirmed"
        )
        db.add(tracking_log)
        
        db.commit()
        
        # STEP 9: Return Full Order Response
        restaurant_info = RestaurantOrderInfo(
            id=str(restaurant.id),
            restaurant_name=restaurant.restaurant_name,
            logo=restaurant.logo,
            phone=restaurant.phone,
            address=restaurant.address
        )
        
        item_responses = [
            OrderItemResponse(
                item_name=item.item_name,
                quantity=item.quantity,
                price=float(item.price),
                total_price=float(item.total_price)
            )
            for item in order_items
        ]
        
        tracking_responses = [
            TrackingLogResponse(
                status=tracking_log.status,
                message=tracking_log.message,
                created_at=tracking_log.created_at
            )
        ]
        
        return OrderResponse(
            order_id=str(order.id),
            order_number=order.order_number,
            restaurant=restaurant_info,
            items=item_responses,
            subtotal=float(order.subtotal),
            tax_amount=float(order.tax_amount),
            delivery_fee=float(order.delivery_fee),
            total_amount=float(order.total_amount),
            payment_method=order.payment_method,
            payment_status=order.payment_status,
            order_status=order.order_status,
            estimated_delivery_time=order.estimated_delivery_time,
            tracking_logs=tracking_responses,
            created_at=order.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print("=== ORDER ERROR ===")
        print(str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/orders", response_model=List[OrderListResponse])
def get_user_orders(
    page: int = 1,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's order history with pagination (latest first)"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        offset = (page - 1) * limit
        
        orders = db.query(Order).options(
            joinedload(Order.restaurant)
        ).filter(
            Order.user_id == user_uuid
        ).order_by(
            Order.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return [
            OrderListResponse(
                order_id=str(order.id),
                order_number=order.order_number,
                restaurant_name=order.restaurant.restaurant_name if order.restaurant else "Unknown",
                total_amount=float(order.total_amount),
                order_status=order.order_status,
                created_at=order.created_at
            )
            for order in orders
        ]
        
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")

@router.get("/orders/{order_id}", response_model=OrderResponse)
def get_order_details(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed order information"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        order = db.query(Order).options(
            joinedload(Order.order_items),
            joinedload(Order.tracking_logs),
            joinedload(Order.restaurant)
        ).filter(
            Order.id == order_id,
            Order.user_id == user_uuid
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Build response
        restaurant_info = RestaurantOrderInfo(
            id=str(order.restaurant.id),
            restaurant_name=order.restaurant.restaurant_name,
            logo=order.restaurant.logo,
            phone=order.restaurant.phone,
            address=order.restaurant.address
        )
        
        item_responses = [
            OrderItemResponse(
                item_name=item.item_name,
                quantity=item.quantity,
                price=float(item.price),
                total_price=float(item.total_price)
            )
            for item in order.order_items
        ]
        
        tracking_responses = [
            TrackingLogResponse(
                status=log.status,
                message=log.message,
                created_at=log.created_at
            )
            for log in order.tracking_logs
        ]
        
        return OrderResponse(
            order_id=str(order.id),
            order_number=order.order_number,
            restaurant=restaurant_info,
            items=item_responses,
            subtotal=float(order.subtotal),
            tax_amount=float(order.tax_amount),
            delivery_fee=float(order.delivery_fee),
            total_amount=float(order.total_amount),
            payment_method=order.payment_method,
            payment_status=order.payment_status,
            order_status=order.order_status,
            estimated_delivery_time=order.estimated_delivery_time,
            tracking_logs=tracking_responses,
            created_at=order.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching order details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch order details")

@router.get("/orders/{order_id}/tracking")
def get_order_tracking(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order tracking information"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        order = db.query(Order).filter(
            Order.id == order_id,
            Order.user_id == user_uuid
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        tracking_logs = db.query(OrderTrackingLog).filter(
            OrderTrackingLog.order_id == order.id
        ).order_by(OrderTrackingLog.created_at.asc()).all()
        
        timeline = [
            {
                "status": log.status,
                "message": log.message,
                "created_at": log.created_at
            }
            for log in tracking_logs
        ]
        
        return {
            "order_status": order.order_status,
            "estimated_delivery_time": order.estimated_delivery_time,
            "timeline": timeline
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching tracking: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch tracking")
