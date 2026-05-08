#!/usr/bin/env python3
"""
Create all tables for the order management system
"""

from app.database import engine
from app.models import order, order_item, order_tracking, cart, menu_item, restaurant, user

def create_all_tables():
    """Create all database tables"""
    try:
        # Import all models to ensure they are registered with Base
        from app.models.user import User
        from app.models.restaurant import RestaurantProfile  
        from app.models.menu_item import MenuItem
        from app.models.cart import Cart, CartItem
        from app.models.order import Order
        from app.models.order_item import OrderItem
        from app.models.order_tracking import OrderTrackingLog
        
        # Create all tables
        user.Base.metadata.create_all(bind=engine)
        print("All tables created successfully!")
        
    except Exception as e:
        print(f"Error creating tables: {str(e)}")
        raise

if __name__ == "__main__":
    create_all_tables()
