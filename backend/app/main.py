from app.auth import create_access_token
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import uuid

from app.database import Base, engine, get_db
from app.firebase import verify_firebase_token
from app.models import user, restaurant
from app.models.user import User
from app.schemas import TokenRequest
from app.dependencies import get_current_user
from app.routers import restaurant, admin

load_dotenv()

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

app.include_router(restaurant.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "HaveIt backend running 🚀"}

@app.get("/test-db")
def test_db():
    try:
        conn = engine.connect()
        conn.close()
        return {"message": "Database connected ✅"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/auth/login")
def login(data: TokenRequest, db: Session = Depends(get_db)):
    try:
        print(f"Received token type: {type(data.token)}")
        print(f"Received token value: {data.token[:50]}..." if len(data.token) > 50 else f"Received token value: {data.token}")
        decoded = verify_firebase_token(data.token)

        firebase_uid = decoded.get("uid")
        email = decoded.get("email")
        phone = decoded.get("phone_number")
        name = decoded.get("name")
        photo_url = decoded.get("picture")

        # 🔍 Check user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

        if not user:
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                phone=phone,
                name=name,
                photo_url=photo_url,
                roles=["user"]  # Initialize with user role
            )
            db.add(user)
        else:
            # 🔥 UPDATE EXISTING USER WITH CURRENT INFO
            user.email = email
            user.name = name
            if photo_url:
                user.photo_url = photo_url

        db.commit()
        db.refresh(user)

        token = create_access_token({
            "user_id": str(user.id),
            "roles": user.roles
        })

        return {
            "message": "Login successful",
            "access_token": token,
            "user": {
                "id": str(user.id),
                "roles": user.roles,
                "email": user.email,
                "name": user.name,
                "photo_url": user.photo_url
            }
        }

    except Exception as e:
        print(f"Firebase token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")

@app.get("/auth/me")
def get_current_user_info(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Get current user info with roles"""
    try:
        user_id = uuid.UUID(user["user_id"])
        db_user = db.query(User).filter(User.id == user_id).first()
        
        if not db_user:
            raise HTTPException(404, "User not found")
        
        return {
            "id": str(db_user.id),
            "roles": db_user.roles,
            "email": db_user.email,
            "name": db_user.name,
            "photo_url": db_user.photo_url
        }
    except Exception as e:
        raise HTTPException(500, f"Error fetching user: {str(e)}")

@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {
        "message": "Access granted",
        "user": user
    }