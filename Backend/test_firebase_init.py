"""
Debug script to test Firebase authentication without actually running the server.
This will help us see if there are any initialization errors.
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("FIREBASE ADMIN SDK INITIALIZATION TEST")
print("=" * 60)

# Check environment variables
print("\n1. Checking environment variables:")
print(f"   - projectId: {os.getenv('projectId')}")
print(f"   - FIREBASE_SERVICE_ACCOUNT_PATH: {os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')}")

# Try to import and initialize Firebase Admin
print("\n2. Importing Firebase Admin SDK...")
try:
    import firebase_admin
    from firebase_admin import auth, credentials
    print("   [OK] Firebase Admin SDK imported successfully")
except ImportError as e:
    print(f"   [ERROR] Failed to import Firebase Admin SDK: {e}")
    sys.exit(1)

# Try to initialize
print("\n3. Initializing Firebase Admin SDK...")
if firebase_admin._apps:
    print("   [WARNING] Firebase Admin already initialized")
    app = firebase_admin.get_app()
    print(f"   App name: {app.name}")
else:
    try:
        # First, try to use a service account key file if it exists
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
        if service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("   [OK] Firebase Admin initialized with service account")
        else:
            # Fallback: Initialize with project ID from environment
            project_id = os.getenv("projectId")
            if project_id:
                try:
                    cred = credentials.ApplicationDefault()
                    firebase_admin.initialize_app(cred, {
                        'projectId': project_id,
                    })
                    print(f"   [OK] Firebase Admin initialized with project ID: {project_id}")
                except Exception as e:
                    print(f"   [WARNING] ApplicationDefault() failed: {e}")
                    print("   [INFO] This is expected if not running on GCP/Firebase hosting")
                    print("   [INFO] Token verification may still work without full initialization")
            else:
                print("   [ERROR] No projectId found in environment")
    except Exception as e:
        print(f"   [ERROR] Initialization error: {e}")
        import traceback
        traceback.print_exc()

print("\n" + "=" * 60)
print("CONCLUSION:")
print("=" * 60)

if not firebase_admin._apps:
    print("[WARNING] Firebase Admin SDK is NOT initialized")
    print("\nThis means token verification will FAIL.")
    print("\nTo fix this, you need a Firebase service account key:")
    print("1. Go to Firebase Console > Project Settings > Service Accounts")
    print("2. Click 'Generate New Private Key'")
    print("3. Save the JSON file as 'serviceAccountKey.json' in the Backend directory")
    print("4. Add to .env: FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json")
else:
    print("[OK] Firebase Admin SDK is initialized and ready")
    print("\nToken verification should work correctly.")
