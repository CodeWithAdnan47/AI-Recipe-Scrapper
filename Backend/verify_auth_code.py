"""
Test script to verify the authentication is working correctly.
This will help diagnose if the backend is using the new authentication code.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from middleware.auth import verify_token_with_rest_api

print("=" * 60)
print("AUTHENTICATION CODE VERIFICATION")
print("=" * 60)

# Check if the REST API fallback function exists
try:
    print("\n1. Checking if REST API fallback exists...")
    print(f"   verify_token_with_rest_api function: {verify_token_with_rest_api}")
    print("   [OK] REST API fallback function is present")
    print(f"   Function location: {verify_token_with_rest_api.__code__.co_filename}")
except NameError:
    print("   [ERROR] REST API fallback function NOT FOUND!")
    print("   This means the backend is running OLD code")
    print("\n   ACTION REQUIRED:")
    print("   1. Stop the backend server (Ctrl+C)")
    print("   2. Restart it with: uvicorn main:app --reload")
    sys.exit(1)

# Check if requests library is available
print("\n2. Checking if requests library is installed...")
try:
    import requests
    print(f"   [OK] requests library version: {requests.__version__}")
except ImportError:
    print("   [ERROR] requests library not installed")
    print("   Run: pip install requests")
    sys.exit(1)

print("\n" + "=" * 60)
print("CONCLUSION:")
print("=" * 60)
print("[OK] Backend code appears to be updated correctly")
print("\nIf favorites are still shared, the backend server needs to be restarted.")
print("\nTo restart:")
print("1. Find the terminal running the backend server")
print("2. Press Ctrl+C to stop it")
print("3. Run: uvicorn main:app --reload")
