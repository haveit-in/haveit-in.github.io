# app/schemas/auth.py

from pydantic import BaseModel

class TokenRequest(BaseModel):
    token: str
    role: str = "user"


class RefreshTokenRequest(BaseModel):
    refresh_token: str
