from app.auth import create_access_token
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy.orm import Session

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
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://haveit-official.vercel.app"
    ],
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
        print(f"=== LOGIN ATTEMPT ===")
        print(f"Received token type: {type(data.token)}")
        print(f"Received role: {data.role}")
        decoded = verify_firebase_token(data.token)

        firebase_uid = decoded.get("uid")
        email = decoded.get("email")
        phone = decoded.get("phone_number")
        name = decoded.get("name")
        photo_url = decoded.get("picture")

        # Map frontend role to database role
        role_mapped = "restaurant_owner" if data.role == "partner" else "user"
        print(f"Role mapping: {data.role} -> {role_mapped}")

        # 🔍 Check user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        print(f"User found: {user is not None}")
        if user:
            print(f"Existing user role: {user.role}, profile_completed: {user.profile_completed}")

        if not user:
            # First time login - create user with mapped role
            print(f"Creating new user with role: {role_mapped}")
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                phone=phone,
                name=name,
                photo_url=photo_url,
                role=role_mapped,
                profile_completed=False
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Generate access token
            token = create_access_token({
                "user_id": str(user.id),
                "role": user.role
            })

            # If partner and new user, require onboarding
            if data.role == "partner":
                print(f"New partner requires onboarding")
                return {
                    "requiresOnboarding": True,
                    "access_token": token
                }
        else:
            # 🔥 UPDATE EXISTING USER WITH CURRENT INFO
            user.email = email
            user.name = name
            if photo_url:
                user.photo_url = photo_url

            # Enforce role rules - existing user cannot change role
            if user.role != role_mapped:
                print(f"Role mismatch: user.role={user.role}, requested role={data.role}")
                if user.role == "user" and data.role == "partner":
                    raise HTTPException(
                        status_code=403, 
                        detail="This account is registered as a user. Please use the user login page."
                    )
                elif user.role == "restaurant_owner" and data.role == "user":
                    raise HTTPException(
                        status_code=403, 
                        detail="This account is registered as a restaurant owner. Please use the partner login page."
                    )
                else:
                    raise HTTPException(status_code=403, detail="Invalid role login")

            db.commit()
            db.refresh(user)

            # Generate access token
            token = create_access_token({
                "user_id": str(user.id),
                "role": user.role
            })

            # If partner and profile not completed, require onboarding
            if data.role == "partner" and not user.profile_completed:
                print(f"Existing partner requires onboarding")
                return {
                    "requiresOnboarding": True,
                    "access_token": token
                }

        token = create_access_token({
            "user_id": str(user.id),
            "role": user.role
        })

        print(f"Login successful for user: {email}, role: {user.role}")
        return {
            "message": "Login successful",
            "access_token": token,
            "user": {
                "id": str(user.id),
                "role": user.role,
                "email": user.email,
                "name": user.name,
                "photo_url": user.photo_url
            }
        }

    except Exception as e:
        print(f"Firebase token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")

@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {
        "message": "Access granted",
        "user": user
    }