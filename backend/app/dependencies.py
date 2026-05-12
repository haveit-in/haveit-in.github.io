from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth import verify_access_token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        print(f"=== AUTH DEBUG ===")
        print(f"Credentials received: {credentials}")
        token = credentials.credentials
        print(f"Token length: {len(token) if token else 'None'}")
        print(f"Token first 20 chars: {token[:20] if token else 'None'}...")

        payload = verify_access_token(token)
        print(f"Token payload: {payload}")

        if payload is None:
            print("Token verification failed - payload is None")
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        # Remove exp field before returning to frontend
        payload.pop("exp", None)
        print(f"Final payload: {payload}")
        print("=== AUTH SUCCESS ===")

        return payload
    except HTTPException:
        raise
    except Exception as e:
        print(f"=== AUTH ERROR ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        print("=== END AUTH ERROR ===")
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")

def require_admin(user=Depends(get_current_user)):
    if "admin" not in user.get("roles", []):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def require_restaurant_owner(user=Depends(get_current_user)):
    if "restaurant_owner" not in user.get("roles", []):
        raise HTTPException(status_code=403, detail="Restaurant owner access required")
    return user