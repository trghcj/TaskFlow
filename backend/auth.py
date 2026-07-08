import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User

# Initialize Firebase Admin
firebase_cert_path = "firebase-service-account.json"
if os.path.exists(firebase_cert_path):
    cred = credentials.Certificate(firebase_cert_path)
else:
    firebase_cert_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if not firebase_cert_json:
        raise Exception("Firebase service account credentials not found. Set FIREBASE_SERVICE_ACCOUNT_JSON env variable.")
    cert_dict = json.loads(firebase_cert_json)
    cred = credentials.Certificate(cert_dict)

firebase_admin.initialize_app(cred)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(decoded_token: dict = Depends(verify_token), db: Session = Depends(get_db)):
    uid = decoded_token.get("uid")
    email = decoded_token.get("email")
    name = decoded_token.get("name")
    
    if not uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing UID")
        
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        # Auto-create user if they don't exist in our DB yet
        user = User(id=uid, email=email, display_name=name)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user
