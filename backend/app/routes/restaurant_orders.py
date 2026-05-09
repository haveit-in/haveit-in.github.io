# app/routes/restaurant_orders.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel

from app.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_tracking import OrderTrackingLog
from app.models.restaurant import RestaurantProfile
from app.models.user import User
from app.schemas.order import OrderResponse, OrderItemResponse, RestaurantOrderInfo, TrackingLogResponse
from app.dependencies import get_current_user
from app.utils.order_transition import is_valid_transition, get_tracking_message
from app.websocket.manager import manager

router = APIRouter()

# Request schema for status update
class StatusUpdateRequest(BaseModel):
    status: str

    class Config:
        from_attributes = True

@router.get("/restaurant/orders", response_model=List[OrderResponse])
def get_restaurant_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get orders for restaurant owner's restaurant only
    
    **Security Rule:** Restaurant owners can only access their own restaurant's orders
    
    **Query Parameters:**
    - `status`: Filter by order status (e.g., PREPARING, DELIVERED)
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 20, max: 100)
    
    **Returns:** List of orders with full customer, items, totals, payment status, delivery address
    """
    # STEP 3 — SECURITY: Get restaurant owner's restaurant
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == current_user["user_id"]
    ).first()
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")
    
    # STEP 3 — SECURITY: Build base query with restaurant ownership validation
    query = db.query(Order).options(
        joinedload(Order.user),
        joinedload(Order.order_items),
        joinedload(Order.tracking_logs)
    ).filter(Order.restaurant_id == restaurant.id)
    
    # STEP 4 — Add query filters
    if status:
        query = query.filter(Order.order_status.upper() == status.upper())
    
    # STEP 5 — Order sorting (latest first)
    query = query.order_by(Order.created_at.desc())
    
    # STEP 7 — Add pagination
    offset = (page - 1) * limit
    total_orders = query.count()
    orders = query.offset(offset).limit(limit).all()
    
    # STEP 6 — Build full order data response
    order_responses = []
    for order in orders:
        # Build restaurant info
        restaurant_info = RestaurantOrderInfo(
            id=str(order.id),
            restaurant_name=restaurant.restaurant_name,
            logo=restaurant.logo,
            phone=restaurant.phone,
            address=restaurant.address
        )
        
        # Build order items
        items = [
            OrderItemResponse(
                item_name=item.item_name,
                quantity=item.quantity,
                price=float(item.price),
                total_price=float(item.total_price)
            )
            for item in order.order_items
        ]
        
        # Build tracking logs
        tracking_logs = [
            TrackingLogResponse(
                status=log.status,
                message=log.message,
                created_at=log.created_at
            )
            for log in order.tracking_logs
        ]
        
        # Build complete order response
        order_response = OrderResponse(
            order_id=str(order.id),
            order_number=order.order_number,
            restaurant=restaurant_info,
            items=items,
            subtotal=float(order.subtotal),
            tax_amount=float(order.tax_amount),
            delivery_fee=float(order.delivery_fee),
            total_amount=float(order.total_amount),
            payment_method=order.payment_method or "",
            payment_status=order.payment_status or "",
            order_status=order.order_status or "",
            estimated_delivery_time=order.estimated_delivery_time,
            tracking_logs=tracking_logs,
            created_at=order.created_at
        )
        
        order_responses.append(order_response)
    
    return order_responses


@router.get("/restaurant/orders/count")
def get_restaurant_orders_count(
    status: Optional[str] = Query(None, description="Filter by order status"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get total count of orders for restaurant owner's restaurant
    Useful for pagination and dashboard stats
    """
    # Get restaurant owner's restaurant
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == current_user["user_id"]
    ).first()
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")
    
    # Build query with restaurant ownership validation
    query = db.query(Order).filter(Order.restaurant_id == restaurant.id)
    
    # Add status filter if provided
    if status:
        query = query.filter(Order.order_status.upper() == status.upper())
    
    total_count = query.count()
    
    return {"total_orders": total_count}


@router.put("/restaurant/orders/{order_id}/status")
async def update_order_status(
    order_id: UUID,
    request: StatusUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update order status with validation and automatic tracking log creation
    
    **Valid Status Transitions:**
    - PENDING → CONFIRMED → PREPARING → READY_FOR_PICKUP → IN_TRANSIT → DELIVERED
    - Any status → CANCELLED (except DELIVERED)
    
    **Example Request:**
    ```json
    {
      "status": "PREPARING"
    }
    ```
    
    **Security:** Restaurant owners can only update their own restaurant's orders
    """
    # Get restaurant owner's restaurant
    restaurant = db.query(RestaurantProfile).filter(
        RestaurantProfile.user_id == current_user["user_id"]
    ).first()
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")
    
    # Get order and validate restaurant ownership
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.restaurant_id == restaurant.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Get current status
    current_status = order.order_status or "PENDING"
    new_status = request.status
    
    # STEP 9 — Validate status transition
    if not is_valid_transition(current_status, new_status):
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status transition from {current_status} to {new_status}"
        )
    
    # STEP 12 — Update order status and timestamp
    order.order_status = new_status
    order.updated_at = func.now()
    
    # STEP 11 — Auto create tracking log
    tracking_message = get_tracking_message(new_status)
    tracking_log = OrderTrackingLog(
        order_id=order.id,
        status=new_status,
        message=tracking_message
    )
    db.add(tracking_log)
    
    # Commit changes
    db.commit()
    
    # STEP 18 — Broadcast WebSocket events for real-time updates
    try:
        if new_status.upper() == "DELIVERED":
            # Special delivery celebration
            await manager.broadcast_delivery_confirmation(str(order.id))
        else:
            # Regular status update
            await manager.broadcast_order_status_update(
                str(order.id), 
                new_status, 
                tracking_message,
                order.estimated_delivery_time
            )
    except Exception as e:
        print(f"WebSocket broadcast error: {e}")
        # Don't fail the API if WebSocket fails
    
    return {
        "success": True,
        "message": f"Order status updated to {new_status}",
        "order_id": str(order.id),
        "new_status": new_status,
        "tracking_message": tracking_message
    }
