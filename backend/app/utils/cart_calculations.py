# app/utils/cart_calculations.py

from typing import List, Optional
from decimal import Decimal, ROUND_HALF_UP

# GST Rate (5%)
GST_RATE = Decimal('0.05')

# Free delivery threshold
FREE_DELIVERY_THRESHOLD = Decimal('499.00')

def calculate_subtotal(cart_items: List[dict]) -> Decimal:
    """
    Calculate subtotal from cart items
    
    Args:
        cart_items: List of cart items with total_price field
        
    Returns:
        Decimal: Subtotal amount
    """
    subtotal = Decimal('0.00')
    for item in cart_items:
        subtotal += Decimal(str(item.get('total_price', 0)))
    
    # Round to 2 decimal places
    return subtotal.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def calculate_tax(subtotal: Decimal) -> Decimal:
    """
    Calculate GST tax (5%) on subtotal
    
    Args:
        subtotal: Subtotal amount
        
    Returns:
        Decimal: Tax amount
    """
    tax = subtotal * GST_RATE
    return tax.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def calculate_delivery_fee(subtotal: Decimal, restaurant_delivery_fee: Optional[float] = None) -> Decimal:
    """
    Calculate delivery fee based on subtotal and restaurant fee
    
    Args:
        subtotal: Subtotal amount
        restaurant_delivery_fee: Restaurant's default delivery fee
        
    Returns:
        Decimal: Delivery fee amount
    """
    # Free delivery for orders >= 499
    if subtotal >= FREE_DELIVERY_THRESHOLD:
        return Decimal('0.00')
    
    # Use restaurant's delivery fee if provided, otherwise 0
    if restaurant_delivery_fee is not None:
        return Decimal(str(restaurant_delivery_fee)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    return Decimal('0.00')

def calculate_grand_total(subtotal: Decimal, tax: Decimal, delivery_fee: Decimal) -> Decimal:
    """
    Calculate grand total (subtotal + tax + delivery_fee)
    
    Args:
        subtotal: Subtotal amount
        tax: Tax amount
        delivery_fee: Delivery fee amount
        
    Returns:
        Decimal: Grand total amount
    """
    grand_total = subtotal + tax + delivery_fee
    return grand_total.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def calculate_cart_totals(cart_items: List[dict], restaurant_delivery_fee: Optional[float] = None) -> dict:
    """
    Calculate all cart totals at once
    
    Args:
        cart_items: List of cart items with total_price field
        restaurant_delivery_fee: Restaurant's default delivery fee
        
    Returns:
        dict: Dictionary with all calculated totals
    """
    subtotal = calculate_subtotal(cart_items)
    tax = calculate_tax(subtotal)
    delivery_fee = calculate_delivery_fee(subtotal, restaurant_delivery_fee)
    grand_total = calculate_grand_total(subtotal, tax, delivery_fee)
    
    return {
        'subtotal': float(subtotal),
        'tax': float(tax),
        'delivery_fee': float(delivery_fee),
        'grand_total': float(grand_total)
    }
