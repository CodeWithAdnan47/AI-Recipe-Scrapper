import os
import sqlite3
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import google.generativeai as genai
from dotenv import load_dotenv

from database.connection import get_db_connection, init_db
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

@app.on_event("startup")
def on_startup():
    print("DEBUG: Executing init_db on startup...")
    init_db()
    print("DEBUG: init_db executed.")

@app.get("/api/debug/fix-db")
async def debug_fix_db():
    try:
        init_db()
        return {"status": "success", "message": "Database initialized (tables created if missing)."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

@app.get("/api/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe_by_id(
    recipe_id: int,
    user = Depends(verify_token)
):
    """
    Fetch a single recipe by its ID.
    Requires Authentication.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM recipes WHERE id = ?", (recipe_id,))
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return dict(row)
    except HTTPException:
        raise
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


    return {
        "recipe_id": r["id"],
        "title": r["title"],
        "image_name": image_name,
        "expected_url": f"http://localhost:8000/images/{image_name}.jpg" if image_name else None,
        "file_exists": file_path is not None,
        "resolved_path": file_path,
    }

@app.get("/api/favorites", response_model=List[int])
async def get_favorites(
    user = Depends(verify_token)
):
    """
    Get list of recipe IDs favorited by the current user.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Assuming verify_token returns a user dict with 'uid' or similar from Firebase
        user_id = user.get('uid') 
        cursor.execute("SELECT recipe_id FROM favorites WHERE user_id = ?", (user_id,))
        rows = cursor.fetchall()
        return [row['recipe_id'] for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@app.post("/api/favorites/{recipe_id}")
async def toggle_favorite(
    recipe_id: int,
    user = Depends(verify_token)
):
    """
    Toggle favorite status for a recipe. 
    Returns {"favorited": boolean}.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        user_id = user.get('uid')
        
        # Check if already favorited
        cursor.execute("SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = ?", (user_id, recipe_id))
        exists = cursor.fetchone()
        
        if exists:
            # Remove favorite
            cursor.execute("DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?", (user_id, recipe_id))
            favorited = False
        else:
            # Add favorite
            cursor.execute("INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)", (user_id, recipe_id))
            favorited = True
            
        conn.commit()
        return {"favorited": favorited}
    except Exception as e:
        conn.rollback()
        print(f"ERROR in toggle_favorite: {e}") # Debug print
        import traceback
        traceback.print_exc() # Print full stack trace
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
