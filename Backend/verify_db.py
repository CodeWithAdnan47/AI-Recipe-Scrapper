import sqlite3
import os

db_path = 'database/recipes.db'
if os.path.exists(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, title FROM recipes LIMIT 1")
        row = cursor.fetchone()
        print(f"Recipe found: {row}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")
else:
    print("Database file not found.")
