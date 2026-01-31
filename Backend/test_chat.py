"""Test script to reproduce the chat error"""
import os
from dotenv import load_dotenv

load_dotenv()

# Test 1: Check if GOOGLE_API_KEY is loaded
print("=" * 60)
print("TEST 1: Environment Variables")
print("=" * 60)
google_key = os.getenv("GOOGLE_API_KEY")
tavily_key = os.getenv("TAVILY_API_KEY")
print(f"GOOGLE_API_KEY: {'[OK] Set' if google_key else '[X] Missing'}")
print(f"TAVILY_API_KEY: {'[OK] Set' if tavily_key else '[X] Missing'}")
print()

# Test 2: Check if required packages are importable
print("=" * 60)
print("TEST 2: Package Imports")
print("=" * 60)
packages = [
    "langchain",
    "langchain_core",
    "langchain_google_genai",
    "langchain_community",
    "tavily",
    "google.generativeai",
]

for pkg in packages:
    try:
        __import__(pkg)
        print(f"[OK] {pkg}")
    except ImportError as e:
        print(f"[X] {pkg} - ERROR: {e}")
print()

# Test 3: Try to create the LLM
print("=" * 60)
print("TEST 3: LLM Initialization")
print("=" * 60)
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        google_api_key=google_key,
        temperature=0.2,
    )
    print("[OK] LLM created successfully")
    print(f"  Model: {llm.model}")
except Exception as e:
    print(f"[X] LLM creation failed: {e}")
print()

# Test 4: Try the RAG chain
print("=" * 60)
print("TEST 4: RAG Chain Test")
print("=" * 60)
try:
    from services.rag_chain import answer_with_rag_or_tavily
    
    # Mock recipe
    recipe = {
        "id": 1,
        "Title": "Test Recipe",
        "Ingredients": "flour, water, salt",
        "Instructions": "Mix and bake",
    }
    
    result = answer_with_rag_or_tavily(recipe, "What are the ingredients?")
    print("[OK] RAG chain executed successfully")
    print(f"  Response: {result[:100]}...")
except Exception as e:
    print(f"[X] RAG chain failed: {e}")
    import traceback
    traceback.print_exc()
