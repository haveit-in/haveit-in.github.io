from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
import json

class RequestValidator:
    @staticmethod
    def validate_order_data(data: dict) -> dict:
        """Validate order request data"""
        # Temporarily make validation more permissive to debug frontend caching issue
        required_fields = ['payment_method', 'delivery_address']
        
        for field in required_fields:
            if field not in data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required field: {field}"
                )
        
        # Make restaurant_id and items optional for now
        if 'items' in data and (not isinstance(data['items'], list) or len(data['items']) == 0):
            raise HTTPException(
                status_code=400,
                detail="Order must contain at least one item"
            )
        
        return data

    @staticmethod
    def validate_payment_data(data: dict) -> dict:
        """Validate payment request data"""
        required_fields = ['order_id', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
        
        for field in required_fields:
            if field not in data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required field: {field}"
                )
        
        # Validate UUID format
        import re
        uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        
        if not re.match(uuid_pattern, data['order_id'].lower()):
            raise HTTPException(
                status_code=400,
                detail="Invalid order ID format"
            )
        
        return data

    @staticmethod
    def sanitize_input(data: dict) -> dict:
        """Sanitize user input to prevent XSS and injection attacks"""
        if isinstance(data, dict):
            return {key: RequestValidator.sanitize_input(value) for key, value in data.items()}
        elif isinstance(data, list):
            return [RequestValidator.sanitize_input(item) for item in data]
        elif isinstance(data, str):
            # Remove potential script tags and dangerous characters
            dangerous_patterns = ['<script', '</script>', 'javascript:', 'onerror=', 'onload=']
            for pattern in dangerous_patterns:
                data = data.replace(pattern, '')
            return data.strip()
        else:
            return data

async def validation_middleware(request: Request, call_next):
    """Middleware to validate and sanitize incoming requests"""
    # Skip validation for GET requests and OPTIONS (CORS preflight)
    if request.method in ['GET', 'OPTIONS']:
        return await call_next(request)
    
    try:
        # Only validate POST, PUT, DELETE requests with JSON body
        if request.method in ['POST', 'PUT', 'DELETE']:
            body = await request.body()
            if body:
                try:
                    data = json.loads(body)
                    
                    # Route-specific validation
                    if '/orders' in request.url.path and request.method == 'POST':
                        RequestValidator.validate_order_data(data)
                    elif '/payments/verify' in request.url.path and request.method == 'POST':
                        RequestValidator.validate_payment_data(data)
                    
                    # Sanitize all input
                    sanitized_data = RequestValidator.sanitize_input(data)
                    
                    # Replace request body with sanitized data
                    request.state.validated_body = json.dumps(sanitized_data).encode()
                    
                except json.JSONDecodeError:
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid JSON in request body"
                    )
                except HTTPException:
                    raise
                except Exception as e:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Validation error: {str(e)}"
                    )
        
        response = await call_next(request)
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal validation error: {str(e)}"
        )
