import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = "recipes.db"
DB_PATH = os.path.join(BASE_DIR, DB_NAME)

print(f"Current File: {__file__}")
print(f"Base Dir: {BASE_DIR}")
print(f"DB Path: {DB_PATH}")

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)")
    conn.commit()
    conn.close()
    print("Database created successfully.")
except Exception as e:
    print(f"Error creating database: {e}")

if os.path.exists(DB_PATH):
    print("Verification: File exists.")
else:
    print("Verification: File DOES NOT exist.")
