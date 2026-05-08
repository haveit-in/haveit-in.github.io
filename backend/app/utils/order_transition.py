# app/utils/order_transition.py

from typing import Dict, List

# Define valid status transitions
VALID_TRANSITIONS: Dict[str, List[str]] = {
    "PENDING": ["CONFIRMED", "CANCELLED"],
    "CONFIRMED": ["PREPARING", "CANCELLED"],
    "PREPARING": ["READY_FOR_PICKUP", "CANCELLED"],
    "READY_FOR_PICKUP": ["IN_TRANSIT", "CANCELLED"],
    "IN_TRANSIT": ["DELIVERED"],
    "DELIVERED": [],  # Final state
    "CANCELLED": []   # Final state
}

# Define tracking messages for each status
TRACKING_MESSAGES: Dict[str, str] = {
    "PENDING": "Order placed successfully",
    "CONFIRMED": "Your order has been confirmed",
    "PREPARING": "Your order is being prepared",
    "READY_FOR_PICKUP": "Your order is ready for pickup",
    "IN_TRANSIT": "Your order is on the way",
    "DELIVERED": "Your order has been delivered",
    "CANCELLED": "Your order has been cancelled"
}

def is_valid_transition(current_status: str, new_status: str) -> bool:
    """
    Check if the status transition is valid
    
    Args:
        current_status: Current order status
        new_status: New status to transition to
        
    Returns:
        bool: True if transition is valid, False otherwise
    """
    # Normalize statuses to uppercase
    current_status = current_status.upper()
    new_status = new_status.upper()
    
    # Check if current status exists in transitions
    if current_status not in VALID_TRANSITIONS:
        return False
    
    # Check if new status is in the allowed transitions
    return new_status in VALID_TRANSITIONS[current_status]

def get_tracking_message(status: str) -> str:
    """
    Get the appropriate tracking message for a status
    
    Args:
        status: Order status
        
    Returns:
        str: Tracking message
    """
    return TRACKING_MESSAGES.get(status.upper(), f"Order status updated to {status}")

def get_valid_next_statuses(current_status: str) -> List[str]:
    """
    Get list of valid next statuses for current status
    
    Args:
        current_status: Current order status
        
    Returns:
        List[str]: List of valid next statuses
    """
    return VALID_TRANSITIONS.get(current_status.upper(), [])
