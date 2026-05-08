from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    
    # Razorpay
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    
    # Firebase
    FIREBASE_PROJECT_ID: str
    FIREBASE_PRIVATE_KEY_ID: str
    FIREBASE_PRIVATE_KEY: str
    FIREBASE_CLIENT_EMAIL: str
    FIREBASE_CLIENT_ID: str
    FIREBASE_CLIENT_CERT_URL: str
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env.local",
        case_sensitive=True,
        extra="ignore"  # This fixes the crash by ignoring extra env vars
    )


settings = Settings()
