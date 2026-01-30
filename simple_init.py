import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "Backend", "database", "recipes.db")

# Adjust path if running from root
if not os.path.exists(os.path.dirname(DB_PATH)):
    # try running relative to backend
    DB_PATH = os.path.join(BASE_DIR, "database", "recipes.db")

print(f"Attempting to create DB at: {DB_PATH}")

try:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            ingredients TEXT,
            instructions TEXT,
            image_name TEXT,
            cleaned_ingredients TEXT
        )
    ''')
    
    # Insert a dummy recipe
    cursor.execute("INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)", 
                   ("Test Recipe", "Ingredient 1", "Mix it up"))
    
    conn.commit()
    conn.close()
    print("Database created and populated with sample.")
except Exception as e:
    print(f"Error: {e}")
