"""
List recipe image_name values from the DB and report which corresponding
.jpg files exist in Backend/images. Use this to fix naming mismatches.
"""
import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from database.connection import get_db_connection

IMAGES_DIR = os.path.join(backend_dir, "images")


def main():
    if not os.path.isdir(IMAGES_DIR):
        print(f"Images directory not found: {IMAGES_DIR}")
        return
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, image_name FROM recipes WHERE image_name IS NOT NULL AND image_name != '' LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    missing = []
    found = 0
    for row in rows:
        image_name = row["image_name"]
        path = os.path.join(IMAGES_DIR, f"{image_name}.jpg")
        if os.path.isfile(path):
            found += 1
        else:
            missing.append((row["id"], row["title"], image_name))
    print(f"Checked first {len(rows)} recipes: {found} images found, {len(missing)} missing.")
    if missing:
        print("\nMissing images (id, title, expected filename):")
        for rid, title, name in missing[:20]:
            print(f"  {rid}: {name}.jpg  ({title[:50]}...)")
        if len(missing) > 20:
            print(f"  ... and {len(missing) - 20} more.")


if __name__ == "__main__":
    main()
