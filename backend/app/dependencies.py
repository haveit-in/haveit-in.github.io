from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth import verify_access_token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Remove exp field before returning to frontend
    payload.pop("exp", None)

    return payload

def require_admin(user=Depends(get_current_user)):
    if "admin" not in user.get("roles", []):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def require_restaurant_owner(user=Depends(get_current_user)):
    if user.get("role") != "restaurant_owner":
        raise HTTPException(status_code=403, detail="Restaurant owner access required")
    return user