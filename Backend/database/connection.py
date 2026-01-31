import sqlite3
import os

DB_NAME = "recipes.db"
# Get the absolute path to the database file, assume it's in the Backend/database directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, DB_NAME)

def get_db_connection():
    print(f"DEBUG: Connecting to DB at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database table if it doesn't exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            ingredients TEXT,
            instructions TEXT,
            image_name TEXT,
            cleaned_ingredients TEXT
        );
    ''')
    
    # Favorites table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS favorites (
            user_id TEXT NOT NULL,
            recipe_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, recipe_id),
            FOREIGN KEY (recipe_id) REFERENCES recipes (id)
        );
    ''')
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {DB_PATH}")
