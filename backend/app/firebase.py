import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth

# Load environment variables from .env.local for local development
load_dotenv('.env.local')

if not firebase_admin._apps:
    try:
        # For production: Use environment variables
        if os.getenv("FIREBASE_PROJECT_ID"):
            private_key = os.getenv("FIREBASE_PRIVATE_KEY", "")
            print(f"Private key length: {len(private_key)}")
            print(f"Private key starts with: {private_key[:50]}...")
            
            # Fix the private key by replacing literal \n with actual newlines
            private_key = private_key.replace("\\n", "\n")
            print(f"Fixed private key starts with: {private_key[:50]}...")
            
            cred_data = {
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": private_key,
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
                "universe_domain": "googleapis.com"
            }
            cred = credentials.Certificate(cred_data)
        # For local development: Use JSON file
        else:
            cred_path = os.path.join(os.path.dirname(__file__), '..', 'firebase_admin.json')
            with open(cred_path, 'r') as f:
                cred_data = json.load(f)
            
            # Fix the private key by replacing literal \n with actual newlines
            if 'private_key' in cred_data:
                cred_data['private_key'] = cred_data['private_key'].replace('\\n', '\n')
            
            cred = credentials.Certificate(cred_data)
        
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"Firebase initialization error: {str(e)}")
        raise

def verify_firebase_token(id_token: str):
    decoded_token = auth.verify_id_token(id_token)
    return decoded_token