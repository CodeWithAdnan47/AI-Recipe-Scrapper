
from fastapi import HTTPException, Request
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
import requests

# Load environment variables
load_dotenv()

print("DEBUG: auth.py module loaded", flush=True)

# Initialize Firebase Admin SDK
# Try to initialize with service account key if available, otherwise use project ID
if not firebase_admin._apps:
    try:
        # First, try to use a service account key file if it exists
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
        if service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin initialized with service account")
        else:
            # Fallback: Initialize with project ID from environment
            # This works when deployed on Firebase or GCP, or for basic token verification
            project_id = os.getenv("projectId")
            if project_id:
                try:
                    cred = credentials.ApplicationDefault()
                    firebase_admin.initialize_app(cred, {
                        'projectId': project_id,
                    })
                    print(f"Firebase Admin initialized with project ID: {project_id}")
                except Exception as app_default_error:
                    # ApplicationDefault() failed, initialize without credentials
                    # Token verification will use REST API fallback
                    print(f"ApplicationDefault() failed: {app_default_error}")
                    print("Initializing without credentials, will use REST API for token verification")
                    firebase_admin.initialize_app(options={'projectId': project_id})
            else:
                print("Warning: Firebase Admin SDK not fully initialized. Token verification may fail.")
    except Exception as e:
        print(f"Warning: Firebase Admin initialization error: {e}")
        print("Token verification will be attempted but may fail without proper credentials.")


def verify_token_with_rest_api(id_token: str) -> dict:
    """
    Fallback method to verify Firebase ID token using Google's REST API.
    This works without a service account key.
    """
    try:
        # Use Google's token verification endpoint
        url = f"https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key={os.getenv('apiKey')}"
        response = requests.post(url, json={"idToken": id_token})
        
        if response.status_code == 200:
            data = response.json()
            if 'users' in data and len(data['users']) > 0:
                user = data['users'][0]
                return {
                    "uid": user.get("localId"),
                    "email": user.get("email"),
                    "name": user.get("displayName"),
                }
        
        raise HTTPException(status_code=401, detail="Invalid Authentication Token")
    except requests.RequestException as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")


def verify_token(request: Request):
    """
    Verifies the Firebase authentication token and returns the decoded user information.
    Extracts the unique user ID (uid) from the Firebase token.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authentication Token")
    
    # Extract token from "Bearer <token>" format
    token = auth_header.split(" ")[1] if " " in auth_header else auth_header
    
    # Try Firebase Admin SDK first
    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        print(f"DEBUG: Auth Success (Admin SDK). UID: {uid}")
        
        # Return user information with unique uid
        return {
            "uid": uid,
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name"),
        }
    except auth.InvalidIdTokenError:
        print("DEBUG: Invalid ID Token (Admin SDK)")
        raise HTTPException(status_code=401, detail="Invalid Authentication Token")
    except auth.ExpiredIdTokenError:
        print("DEBUG: Expired ID Token (Admin SDK)")
        raise HTTPException(status_code=401, detail="Expired Authentication Token")
    except Exception as e:
        # If Admin SDK fails, try REST API fallback
        print(f"DEBUG: Admin SDK verification failed: {e}, trying REST API fallback")
        result = verify_token_with_rest_api(token)
        print(f"DEBUG: Auth Success (REST API). UID: {result.get('uid')}")
        return result
