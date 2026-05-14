import logging

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth import verify_access_token

log = logging.getLogger(__name__)

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = verify_access_token(token)

        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        payload.pop("exp", None)
        return payload
    except HTTPException:
        raise
    except Exception:
        log.exception("authentication_dependency_failed")
        raise HTTPException(status_code=401, detail="Authentication error") from None

def require_admin(user=Depends(get_current_user)):
    if "admin" not in user.get("roles", []):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def require_restaurant_owner(user=Depends(get_current_user)):
    if "restaurant_owner" not in user.get("roles", []):
        raise HTTPException(status_code=403, detail="Restaurant owner access required")
    return user