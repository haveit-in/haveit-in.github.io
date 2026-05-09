# app/routes/payments.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.order import Order
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import CreatePaymentOrderRequest, PaymentResponse, VerifyPaymentRequest
from app.dependencies import get_current_user
from app.utils.razorpay_client import client
from app.config import settings
from app.models.order_tracking import OrderTrackingLog

router = APIRouter()

@router.post("/payments/create-order", response_model=dict)
def create_payment_order(
    request: CreatePaymentOrderRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a Razorpay order for payment
    
    **Example Request:**
    ```json
    {
      "order_id": "550e8400-e29b-41d4-a716-446655440000"
    }
    ```
    
    **Success Response:**
    ```json
    {
      "key": "rzp_test_xxxx",
      "razorpay_order_id": "order_1234567890",
      "amount": 50000,
      "currency": "INR"
    }
    ```
    
    **Error Responses:**
    - 404: Order not found
    - 403: Access denied (user doesn't own order)
    - 400: Order already paid
    """
    # 1. Validate Order Exists
    order = db.query(Order).filter(Order.id == request.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 2. Validate User Owns Order (VERY IMPORTANT security check)
    if str(order.user_id) != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied: You don't own this order")
    
    # 3. Validate Order Not Already Paid
    if order.payment_status.upper() == "PAID":
        raise HTTPException(status_code=400, detail="Order is already paid")
    
    # 4. Create Razorpay Order
    try:
        # Convert amount to paise (Razorpay expects paise, not rupees)
        amount_in_paise = int(float(order.total_amount) * 100)
        
        razorpay_order = client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "payment_capture": 1
        })
        
        razorpay_order_id = razorpay_order["id"]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")
    
    # 5. Save Payment Record
    payment = Payment(
        order_id=request.order_id,
        razorpay_order_id=razorpay_order_id,
        amount=order.total_amount,
        currency="INR",
        payment_status="PENDING",
        payment_provider="RAZORPAY"
    )
    
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    # 6. Return Frontend Payload
    return {
        "key": settings.RAZORPAY_KEY_ID,
        "razorpay_order_id": razorpay_order_id,
        "amount": amount_in_paise,
        "currency": "INR"
    }


@router.post("/payments/verify", response_model=dict)
def verify_payment(
    request: VerifyPaymentRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verify Razorpay payment and update order status
    
    **Example Request:**
    ```json
    {
      "razorpay_order_id": "order_1234567890",
      "razorpay_payment_id": "pay_1234567890",
      "razorpay_signature": "9ef4dff5cd4a5e6c3a4b8c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f"
    }
    ```
    
    **Success Response:**
    ```json
    {
      "success": true,
      "message": "Payment verified successfully"
    }
    ```
    
    **COD Response:**
    ```json
    {
      "success": true,
      "message": "COD order - payment pending until delivery"
    }
    ```
    
    **Error Responses:**
    - 404: Payment not found
    - 400: Payment already verified
    - 400: Invalid payment signature
    """
    # STEP 17 — Validate Payment Exists
    payment = db.query(Payment).filter(Payment.razorpay_order_id == request.razorpay_order_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Get the associated order
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # STEP 18 — Prevent Duplicate Verification
    if payment.payment_status.upper() == "PAID":
        raise HTTPException(status_code=400, detail="Payment already verified")
    
    # STEP 24 — Add COD Handling
    if order.payment_method and order.payment_method.upper() == "CASH":
        # For COD orders, skip Razorpay verification
        # Keep payment status as PENDING, order continues
        return {
            "success": True,
            "message": "COD order - payment pending until delivery"
        }
    
    # STEP 19 — Verify Razorpay Signature (CRITICAL SECURITY STEP)
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": request.razorpay_order_id,
            "razorpay_payment_id": request.razorpay_payment_id,
            "razorpay_signature": request.razorpay_signature
        })
    except Exception as e:
        # IF VERIFICATION FAILS - Update payment status to FAILED
        payment.payment_status = "FAILED"
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # STEP 20 — Update Payment Record (On success)
    payment.payment_status = "PAID"
    payment.payment_id = request.razorpay_payment_id
    payment.razorpay_signature = request.razorpay_signature
    
    # STEP 21 — Update Order Payment Status
    order.payment_status = "PAID"
    
    # STEP 22 — Add Tracking Log
    tracking_log = OrderTrackingLog(
        order_id=order.id,
        status="PAYMENT_COMPLETED",
        message="Payment received successfully"
    )
    db.add(tracking_log)
    
    # Commit all changes
    db.commit()
    
    # STEP 23 — Return Success Response
    return {
        "success": True,
        "message": "Payment verified successfully"
    }
