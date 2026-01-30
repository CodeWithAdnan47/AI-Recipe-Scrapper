import os
import sqlite3
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import google.generativeai as genai
from dotenv import load_dotenv

from database.connection import get_db_connection
from models.recipe import Recipe
from middleware.auth import verify_token

# Load environment variables from .env file
load_dotenv()

# Initialize Google Generative AI
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    # print("Warning: GOOGLE_API_KEY not found in environment variables.")
    # print("Please create a .env file with: GOOGLE_API_KEY=your_api_key_here")
    genai_configured = False
else:
    genai.configure(api_key=api_key)
    genai_configured = True

app = FastAPI(title="Recipe Organizer API", version="0.1.0")

# Enable CORS (Cross-Origin Resource Sharing) to allow frontend to connect
# This is necessary because the frontend runs on a different port than the backend
# Without CORS, browsers will block requests from frontend to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port and common React port
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Hello from Recipe Organizer Backend!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/random-quote")
async def get_random_quote():
    """
    Sample endpoint to connect Frontend and Backend.
    This is a simple example endpoint that generates a random inspirational quote using Google's Gemini LLM.
    """
    if not genai_configured:
        # Mock response if API key is missing to avoid breaking for students without key
        return {
             "success": True,
             "message": "Random quote generated successfully (Mock)",
             "data": {
                 "quote": "The only way to do great work is to love what you do. - Steve Jobs",
             }
        }
    
    try:
        # Make a simple LLM call to generate a random quote
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content("Tell me a random inspirational quote")
        
        return {
            "success": True,
            "message": "Random quote generated successfully",
            "data": {
                "quote": response.text,
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating quote: {str(e)}"
        )

@app.get("/api/recipes", response_model=List[Recipe])
async def get_recipes(
    user = Depends(verify_token)
):
    """
    Fetch all recipes from the database.
    Requires Authentication.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM recipes")
        rows = cursor.fetchall()
        recipes = [dict(row) for row in rows]
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

# Serve recipe images from Backend/images; files must be named {image_name}.jpg to match CSV Image_Name
IMAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")


def _resolve_image_path(image_name: str) -> Optional[str]:
    """Resolve image_name to full file path. Tries exact match then case-insensitive. Returns None if not found."""
    image_name = (image_name or "").strip()
    if not image_name or ".." in image_name or "/" in image_name or "\\" in image_name:
        return None
    base = image_name if image_name.lower().endswith(".jpg") else f"{image_name}.jpg"
    file_path = os.path.join(IMAGES_DIR, base)
    if os.path.isfile(file_path):
        return file_path
    # Case-insensitive lookup (e.g. on Linux)
    if os.path.isdir(IMAGES_DIR):
        target = base.lower()
        for name in os.listdir(IMAGES_DIR):
            if name.lower() == target:
                return os.path.join(IMAGES_DIR, name)
    return None


@app.get("/images/{image_name:path}")
async def get_recipe_image(image_name: str):
    """Serve recipe image by name. Expects image_name (with or without .jpg). Rejects path traversal."""
    file_path = _resolve_image_path(image_name)
    if not file_path:
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path, media_type="image/jpeg")


@app.get("/api/debug/recipe-image")
async def debug_recipe_image():
    """Return first recipe's image_name and whether the file exists. No auth. Use to debug image loading."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, image_name FROM recipes WHERE image_name IS NOT NULL AND image_name != '' LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if not row:
        return {"found": False, "message": "No recipe with image_name in DB"}
    r = dict(row)
    image_name = (r.get("image_name") or "").strip()
    file_path = _resolve_image_path(image_name) if image_name else None
    return {
        "recipe_id": r["id"],
        "title": r["title"],
        "image_name": image_name,
        "expected_url": f"http://localhost:8000/images/{image_name}.jpg" if image_name else None,
        "file_exists": file_path is not None,
        "resolved_path": file_path,
    }
