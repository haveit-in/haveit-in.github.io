-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  restaurant_id UUID,
  total_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for analytics (optional but recommended)
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Add foreign key constraints
ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE orders ADD CONSTRAINT fk_orders_restaurant_id 
  FOREIGN KEY (restaurant_id) REFERENCES restaurant_profiles(user_id);
