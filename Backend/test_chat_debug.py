
import os
import sys
import traceback
from dotenv import load_dotenv

# Add parent directory to path to allow imports from services
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

print("DEBUG: Loaded environment variables")
print(f"DEBUG: GOOGLE_API_KEY present: {bool(os.getenv('GOOGLE_API_KEY'))}")

try:
    from services.rag_chain import answer_with_rag_or_tavily
    print("DEBUG: Successfully imported rag_chain")
except Exception as e:
    print(f"ERROR: Failed to import rag_chain: {e}")
    traceback.print_exc()
    sys.exit(1)

# Mock recipe
mock_recipe = {
    "title": "Debug Pasta",
    "ingredients": "Pasta, Water, Salt",
    "instructions": "Boil water. Add salt. Add pasta. Cook.",
    "id": 1
}

user_message = "How do I cook this?"

print("\nDEBUG: Running answer_with_rag_or_tavily...")
try:
    response = answer_with_rag_or_tavily(mock_recipe, user_message)
    print(f"\nSUCCESS! Response:\n{response}")
except Exception as e:
    print(f"\nERROR: Crash in answer_with_rag_or_tavily: {e}")
    traceback.print_exc()
