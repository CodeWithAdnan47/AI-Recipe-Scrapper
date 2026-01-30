"""One-off: print first recipe image_name and whether file exists."""
import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from database.connection import get_db_connection

IMAGES_DIR = os.path.join(backend_dir, "images")

conn = get_db_connection()
cur = conn.cursor()
cur.execute("SELECT id, title, image_name FROM recipes WHERE image_name IS NOT NULL AND image_name != '' LIMIT 1")
row = cur.fetchone()
conn.close()

if not row:
    print("No recipe with image_name in DB")
    sys.exit(0)

r = dict(row)
name = (r.get("image_name") or "").strip()
base = name if name.lower().endswith(".jpg") else f"{name}.jpg"
path = os.path.join(IMAGES_DIR, base)
print("recipe_id:", r["id"])
print("title:", r["title"][:60])
print("image_name:", repr(name))
print("expected file:", base)
print("path:", path)
print("file exists:", os.path.isfile(path))
if os.path.isdir(IMAGES_DIR):
    all_files = os.listdir(IMAGES_DIR)
    match = next((f for f in all_files if f.lower() == base.lower()), None)
    print("case-insensitive match:", match)
