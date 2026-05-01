from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv('.env.local')

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str):
    try:
        print(f"=== TOKEN VERIFICATION DEBUG ===")
        print(f"SECRET_KEY exists: {SECRET_KEY is not None}")
        print(f"SECRET_KEY length: {len(SECRET_KEY) if SECRET_KEY else 0}")
        print(f"Algorithm: {ALGORITHM}")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Token decoded successfully: {payload}")
        print("=== TOKEN VERIFICATION SUCCESS ===")
        return payload
    except JWTError as e:
        print(f"=== TOKEN VERIFICATION ERROR ===")
        print(f"JWT Error: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        print("=== END TOKEN ERROR ===")
        return None
    except Exception as e:
        print(f"=== UNEXPECTED TOKEN ERROR ===")
        print(f"Error: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        print("=== END UNEXPECTED TOKEN ERROR ===")
        return None