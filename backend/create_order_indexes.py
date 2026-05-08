#!/usr/bin/env python3
"""
Create indexes for order tables to improve performance
"""

from sqlalchemy import text
from app.database import engine, SessionLocal

def check_table_structure():
    """Check actual table structure to create correct indexes"""
    db = SessionLocal()
    try:
        # Check orders table structure
        result = db.execute(text("PRAGMA table_info(orders)"))
        print("Orders table structure:")
        for row in result:
            print(f"  {row}")
        
        # Check order_tracking_logs table structure
        result = db.execute(text("PRAGMA table_info(order_tracking_logs)"))
        print("\nOrder tracking logs table structure:")
        for row in result:
            print(f"  {row}")
        
        # Check order_items table structure
        result = db.execute(text("PRAGMA table_info(order_items)"))
        print("\nOrder items table structure:")
        for row in result:
            print(f"  {row}")
            
    finally:
        db.close()

def create_order_indexes():
    """Create indexes for order-related tables"""
    
    # Basic indexes that should work for most tables
    indexes = [
        # Index for orders table - using common column names
        "CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);",
        
        # Index for order tracking logs
        "CREATE INDEX IF NOT EXISTS idx_order_tracking ON order_tracking_logs(order_id);",
        "CREATE INDEX IF NOT EXISTS idx_order_tracking_created_at ON order_tracking_logs(created_at);",
        
        # Index for order items
        "CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);"
    ]
    
    db = SessionLocal()
    try:
        for index_sql in indexes:
            print(f"Creating index: {index_sql}")
            db.execute(text(index_sql))
        
        db.commit()
        print("All order indexes created successfully!")
        
    except Exception as e:
        print(f"Error creating indexes: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Checking table structure...")
    check_table_structure()
    print("\nCreating indexes...")
    create_order_indexes()
