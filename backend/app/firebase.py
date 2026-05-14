import json
import logging
import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import auth, credentials

load_dotenv(".env.local")

log = logging.getLogger(__name__)

if os.getenv("SKIP_FIREBASE_INIT", "").lower() in ("1", "true", "yes"):
    log.warning("firebase_admin_skipped (SKIP_FIREBASE_INIT is set)")
elif not firebase_admin._apps:
    try:
        if os.getenv("FIREBASE_PROJECT_ID"):
            private_key = os.getenv("FIREBASE_PRIVATE_KEY", "")
            private_key = private_key.replace("\\n", "\n")
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
                "universe_domain": "googleapis.com",
            }
            cred = credentials.Certificate(cred_data)
        else:
            cred_path = os.path.join(os.path.dirname(__file__), "..", "firebase_admin.json")
            with open(cred_path) as f:
                cred_data = json.load(f)
            if "private_key" in cred_data:
                cred_data["private_key"] = cred_data["private_key"].replace("\\n", "\n")
            cred = credentials.Certificate(cred_data)

        firebase_admin.initialize_app(cred)
        log.info("firebase_admin_initialized")
    except Exception:
        log.exception("firebase_initialization_failed")
        raise


def verify_firebase_token(id_token: str):
    if not firebase_admin._apps:
        raise RuntimeError("Firebase Admin SDK is not initialized")
    return auth.verify_id_token(id_token)
