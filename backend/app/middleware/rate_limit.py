from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta
import time

# Simple in-memory rate limiter (for production, use Redis)
class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.max_requests = 1000  # requests per minute (increased for development)
        self.window_seconds = 60  # 1 minute window

    def is_allowed(self, client_id: str) -> bool:
        now = datetime.now()
        window_start = now - timedelta(seconds=self.window_seconds)
        
        # Clean old requests
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id] 
            if req_time > window_start
        ]
        
        # Check if under limit
        if len(self.requests[client_id]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[client_id].append(now)
        return True

rate_limiter = RateLimiter()

async def rate_limit_middleware(request: Request, call_next):
    client_id = request.client.host if request.client else "unknown"
    
    if not rate_limiter.is_allowed(client_id):
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Too many requests. Please try again later.",
                "retry_after": rate_limiter.window_seconds
            }
        )
    
    response = await call_next(request)
    return response

# Stricter rate limiting for sensitive endpoints
class StrictRateLimiter:
    def __init__(self, max_requests=10, window_seconds=60):
        self.requests = defaultdict(list)
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    def is_allowed(self, client_id: str) -> bool:
        now = datetime.now()
        window_start = now - timedelta(seconds=self.window_seconds)
        
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id] 
            if req_time > window_start
        ]
        
        if len(self.requests[client_id]) >= self.max_requests:
            return False
        
        self.requests[client_id].append(now)
        return True

auth_rate_limiter = StrictRateLimiter(max_requests=5, window_seconds=60)
