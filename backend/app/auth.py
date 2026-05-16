import logging
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.config import settings

log = logging.getLogger(__name__)

ALGORITHM = "HS256"
ACCESS_TOKEN_TYP = "access"
REFRESH_TOKEN_TYP = "refresh"


def _decode_jwt_multi_secret(token: str) -> dict[str, Any] | None:
    """Try current signing key first, then optional previous key (rotation window)."""
    secrets: list[str] = [settings.secret_key]
    if settings.secret_key_previous:
        secrets.append(settings.secret_key_previous)

    for secret in secrets:
        try:
            return jwt.decode(token, secret, algorithms=[ALGORITHM])
        except JWTError:
            continue
    return None


def create_access_token(data: dict) -> str:
    to_encode = {**data, "typ": ACCESS_TOKEN_TYP}
    expire = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = {**data, "typ": REFRESH_TOKEN_TYP}
    expire = datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def issue_token_pair(user_id: str, roles: list[str]) -> dict[str, str]:
    """Issue a short-lived access token and a longer-lived refresh token."""
    payload = {"user_id": user_id, "roles": roles}
    return {
        "access_token": create_access_token(payload),
        "refresh_token": create_refresh_token(payload),
    }


def verify_access_token(token: str) -> dict[str, Any] | None:
    payload = _decode_jwt_multi_secret(token)
    if payload is None:
        return None
    typ = payload.get("typ")
    if typ == REFRESH_TOKEN_TYP:
        log.warning("access_verifier_received_refresh_typ")
        return None
    if typ not in (None, ACCESS_TOKEN_TYP):
        log.warning("access_verifier_unknown_typ: %s", typ)
        return None
    log.debug("access_token_verified")
    log.info("JWT_PAYLOAD_DEBUG: %s", payload)
    return payload


def verify_refresh_token(token: str) -> dict[str, Any] | None:
    payload = _decode_jwt_multi_secret(token)
    if payload is None:
        return None
    if payload.get("typ") != REFRESH_TOKEN_TYP:
        return None
    return payload
