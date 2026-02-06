
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

print("--- API Key Diagnostics ---")

# 1. Test Firebase API Key (used for Auth Fallback)
firebase_api_key = os.getenv("apiKey")
print(f"\n1. Testing Firebase API Key (apiKey): {firebase_api_key[:10] if firebase_api_key else 'MISSING'}...")

if firebase_api_key:
    # We can't easily test verify_id_token without a valid user token, 
    # but we can try to hit the signup endpoint with a dummy email to see if the KEY is accepted (even if auth fails)
    # Or better, just check if the key format triggers a prompt 401 vs 403 or 400.
    # Actually, the identitytoolkit endpoint 'createAuthUri' is a good public test.
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key={firebase_api_key}"
    try:
        resp = requests.post(url, json={"identifier": "test@test.com", "continueUri": "http://localhost"})
        if resp.status_code in [200, 400]: # 400/200 means key was accepted/processed. 403 means bad key.
             print(f"   [OK] Firebase Key seems valid (Status: {resp.status_code})")
        else:
             print(f"   [ERROR] Firebase Key check failed. Status: {resp.status_code}")
             print(f"   Response: {resp.text}")
    except Exception as e:
        print(f"   [ERROR] Request failed: {e}")
else:
    print("   [ERROR] 'apiKey' is missing in .env")


# 2. Test Google GenAI Key (used for Chat)
genai_key = os.getenv("GOOGLE_API_KEY")
print(f"\n2. Testing Google GenAI Key (GOOGLE_API_KEY): {genai_key[:10] if genai_key else 'MISSING'}...")

if genai_key:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={genai_key}"
    data = { "contents": [{"parts": [{"text": "Hello"}]}] }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("   [OK] GenAI Key is VALID.")
        else:
            print(f"   [ERROR] GenAI Key is INVALID. Status: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   [ERROR] Request failed: {e}")
else:
    print("   [ERROR] 'GOOGLE_API_KEY' is missing in .env")
