#!/usr/bin/env python3
"""
Script to create payments table directly
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env.local
from dotenv import load_dotenv
load_dotenv('.env.local')

from sqlalchemy import create_engine, text
from app.database import DATABASE_URL

def create_payments_table():
    engine = create_engine(DATABASE_URL)
    
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        payment_provider VARCHAR(50),
        payment_id VARCHAR(255),
        razorpay_order_id VARCHAR(255),
        razorpay_signature TEXT,
        amount NUMERIC(10,2),
        currency VARCHAR(10) DEFAULT 'INR',
        payment_status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    with engine.connect() as conn:
        conn.execute(text(create_table_sql))
        conn.commit()
        print("Payments table created successfully!")

if __name__ == "__main__":
    create_payments_table()
