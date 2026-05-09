# app/routes/cart.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.cart import Cart, CartItem
from app.models.menu_item import MenuItem
from app.models.restaurant import RestaurantProfile
from app.schemas.cart import AddToCartRequest, UpdateCartItemRequest, CartItemResponse, CartResponse, RestaurantInfo
from app.dependencies import get_current_user
from app.utils.cart_calculations import calculate_cart_totals

router = APIRouter()

@router.get("/cart", response_model=CartResponse)
def get_cart(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's cart"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Get user's cart with optimized loading
        cart = db.query(Cart).options(
            joinedload(Cart.cart_items).joinedload(CartItem.menu_item),
            joinedload(Cart.restaurant)
        ).filter(Cart.user_id == user_uuid).first()
        
        if not cart:
            return CartResponse()
        
        # Build cart items response
        items = []
        cart_items_data = []
        
        for cart_item in cart.cart_items:
            item_response = CartItemResponse(
                id=str(cart_item.id),
                menu_item_id=str(cart_item.menu_item_id),
                name=cart_item.menu_item.name,
                image=cart_item.menu_item.image,
                price=float(cart_item.item_price),
                quantity=cart_item.quantity,
                total_price=float(cart_item.total_price)
            )
            items.append(item_response)
            cart_items_data.append({
                'total_price': float(cart_item.total_price)
            })
        
        # Get restaurant info
        restaurant_info = None
        restaurant_delivery_fee = None
        
        if cart.restaurant:
            restaurant_info = RestaurantInfo(
                id=str(cart.restaurant.id),
                restaurant_name=cart.restaurant.restaurant_name,
                logo=cart.restaurant.logo
            )
            restaurant_delivery_fee = float(cart.restaurant.delivery_fee) if cart.restaurant.delivery_fee else None
        
        # Calculate totals using utility
        totals = calculate_cart_totals(cart_items_data, restaurant_delivery_fee)
        
        return CartResponse(
            restaurant=restaurant_info,
            items=items,
            **totals
        )
        
    except Exception as e:
        print(f"Error fetching cart: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch cart")

@router.post("/cart/add", response_model=CartResponse)
def add_to_cart(
    request: AddToCartRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to cart"""
    try:
        # Get menu item
        menu_item = db.query(MenuItem).filter(MenuItem.id == request.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        if not menu_item.is_available:
            raise HTTPException(status_code=400, detail="Menu item is not available")
        
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Get or create user's cart
        cart = db.query(Cart).filter(Cart.user_id == user_uuid).first()
        
        if not cart:
            # Create new cart
            cart = Cart(
                user_id=user_uuid,
                restaurant_id=menu_item.restaurant_id
            )
            db.add(cart)
            db.flush()  # Get cart ID
        else:
            # Check if adding item from different restaurant
            if cart.restaurant_id != menu_item.restaurant_id:
                raise HTTPException(
                    status_code=400, 
                    detail="Cannot add items from different restaurants to existing cart"
                )
        
        # Check if item already exists in cart
        existing_item = db.query(CartItem).filter(
            CartItem.cart_id == cart.id,
            CartItem.menu_item_id == request.menu_item_id
        ).first()
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + request.quantity
            existing_item.quantity = new_quantity
            existing_item.total_price = float(existing_item.item_price) * new_quantity
        else:
            # Add new item
            price = float(menu_item.discount_price) if menu_item.discount_price else float(menu_item.price)
            cart_item = CartItem(
                cart_id=cart.id,
                menu_item_id=request.menu_item_id,
                quantity=request.quantity,
                item_price=price,
                total_price=price * request.quantity
            )
            db.add(cart_item)
        
        db.commit()
        
        # Return updated cart
        return get_cart(current_user, db)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error adding to cart: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add item to cart")

@router.put("/cart/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: str,
    request: UpdateCartItemRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update cart item quantity"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Get user's cart
        cart = db.query(Cart).filter(Cart.user_id == user_uuid).first()
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Get cart item
        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        if request.quantity <= 0:
            # Remove item if quantity is 0 or less
            db.delete(cart_item)
        else:
            # Update quantity
            cart_item.quantity = request.quantity
            cart_item.total_price = float(cart_item.item_price) * request.quantity
        
        db.commit()
        
        # Return updated cart
        return get_cart(current_user, db)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating cart item: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update cart item")

@router.delete("/cart/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from cart"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Get user's cart
        cart = db.query(Cart).filter(Cart.user_id == user_uuid).first()
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Get cart item
        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        db.delete(cart_item)
        db.commit()
        
        # Return updated cart
        return get_cart(current_user, db)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error removing cart item: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to remove cart item")

@router.get("/cart/count")
def get_cart_item_count(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get total number of items in cart for navbar badge"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Get user's cart with optimized loading
        cart = db.query(Cart).options(
            joinedload(Cart.cart_items)
        ).filter(Cart.user_id == user_uuid).first()
        
        if not cart or not cart.cart_items:
            return {"total_items": 0}
        
        # Count total items (sum of quantities)
        total_items = sum(item.quantity for item in cart.cart_items)
        
        return {"total_items": total_items}
        
    except Exception as e:
        print(f"Error getting cart count: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get cart count")

@router.delete("/cart", response_model=CartResponse)
def clear_cart(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear entire cart"""
    try:
        # Convert user_id from string to UUID for database comparison
        user_id_str = current_user.get("user_id")
        try:
            user_uuid = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Get user's cart
        cart = db.query(Cart).filter(Cart.user_id == user_uuid).first()
        if not cart:
            return CartResponse()
        
        # Delete all cart items
        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()
        
        return CartResponse()
        
    except Exception as e:
        print(f"Error clearing cart: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to clear cart")
