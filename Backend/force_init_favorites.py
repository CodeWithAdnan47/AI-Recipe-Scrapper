
import sqlite3
import os
import sys

# DEBUG: Current working directory
print(f"Current working directory: {os.getcwd()}")

# Define path explicitly as seen in connection.py logic
# Assuming we are running this from 'Backend/' directory
curr_dir = os.getcwd()
if 'Backend' not in curr_dir:
    # If running from root, append Backend
    BASE_DIR = os.path.join(curr_dir, 'Backend', 'database')
else:
    # If running from Backend, just database
    BASE_DIR = os.path.join(curr_dir, 'database')
    
DB_NAME = "recipes.db"
DB_PATH = os.path.join(BASE_DIR, DB_NAME)

print(f"Target Database Path: {DB_PATH}")

if not os.path.exists(DB_PATH):
    print(f"CRITICAL ERROR: Database file does not exist at {DB_PATH}")
    # Creating it just in case to avoid error, but this implies main app is looking elsewhere
    print("Creating new DB file...")
else:
    print("Database file exists.")

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Connected to database.")
    
    # create table
    print("Attempting to create favorites table...")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS favorites (
            user_id TEXT NOT NULL,
            recipe_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, recipe_id),
            FOREIGN KEY (recipe_id) REFERENCES recipes (id)
        );
    ''')
    conn.commit()
    print("CREATE TABLE command executed.")
    
    # Verify
    print("Verifying table existence...")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'")
    row = cursor.fetchone()
    if row:
        print(f"SUCCESS: Table '{row[0]}' found in database.")
    else:
        print("FAILURE: Favorites table still NOT found after creation attempt.")
        
    conn.close()
    
except Exception as e:
    print(f"EXCEPTION: {e}")
    import traceback
    traceback.print_exc()
