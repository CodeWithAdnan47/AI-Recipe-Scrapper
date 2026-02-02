import sqlite3
import os

# Get the database path
db_path = os.path.join(os.path.dirname(__file__), "database", "recipes.db")

# Connect to the database
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Check favorites table
print("=" * 50)
print("FAVORITES TABLE CONTENTS:")
print("=" * 50)
cursor.execute("SELECT * FROM favorites")
rows = cursor.fetchall()

if rows:
    for row in rows:
        print(f"User ID: {row['user_id']}, Recipe ID: {row['recipe_id']}")
else:
    print("No favorites found in database")

print(f"\nTotal favorites: {len(rows)}")

# Check unique user IDs
cursor.execute("SELECT DISTINCT user_id FROM favorites")
unique_users = cursor.fetchall()
print(f"\nUnique user IDs: {len(unique_users)}")
for user in unique_users:
    print(f"  - {user['user_id']}")

conn.close()
