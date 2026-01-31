
import sqlite3
import os
import sys

# Mimic get_db_connection
DB_NAME = "recipes.db"
BASE_DIR = os.path.join(os.getcwd(), 'Backend') # Adjust if running from root
if not os.path.exists(os.path.join(BASE_DIR, 'database')):
    BASE_DIR = os.getcwd() # Try current dir if Backend not found in child

DB_PATH = os.path.join(BASE_DIR, 'database', DB_NAME)

print(f"Using DB_PATH: {DB_PATH}")

if not os.path.exists(DB_PATH):
    print("ERROR: Database file not found!")
    sys.exit(1)

def toggle_favorite_mock(user_id, recipe_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        print(f"Attempting to toggle favorite for user={user_id}, recipe={recipe_id}")
        
        # Check if already favorited
        cursor.execute("SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = ?", (user_id, recipe_id))
        exists = cursor.fetchone()
        
        if exists:
            print("Favorite exists. Deleting...")
            cursor.execute("DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?", (user_id, recipe_id))
            favorited = False
        else:
            print("Favorite does not exist. Inserting...")
            cursor.execute("INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)", (user_id, recipe_id))
            favorited = True
            
        conn.commit()
        print(f"Success! Favorited: {favorited}")
        
    except Exception as e:
        print(f"CRASHED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    toggle_favorite_mock("mock_user_id", 1)
