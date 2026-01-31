
import sqlite3
import os

DB_PATH = 'database/recipes.db'

def fix_db():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'")
    table_exists = cursor.fetchone()
    
    if table_exists:
        print("Favorites table already exists.")
    else:
        print("Favorites table not found. Creating it...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS favorites (
                user_id TEXT NOT NULL,
                recipe_id INTEGER NOT NULL,
                PRIMARY KEY (user_id, recipe_id),
                FOREIGN KEY (recipe_id) REFERENCES recipes (id)
            );
        ''')
        conn.commit()
        print("Favorites table created successfully.")
    
    conn.close()

if __name__ == "__main__":
    fix_db()
