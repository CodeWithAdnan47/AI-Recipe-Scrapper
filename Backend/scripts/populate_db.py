import csv
import sys
import os

# Debug print
print("Script started.")

# Add parent directory to path to import database connection
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.insert(0, backend_dir) # Use insert at 0 to prioritize

print(f"Added {backend_dir} to sys.path")

try:
    from database.connection import get_db_connection, init_db
    print("Imported database.connection successfully")
except Exception as e:
    print(f"Error importing database.connection: {e}")
    sys.exit(1)

CSV_FILE_PATH = os.path.join(backend_dir, 'food_recipes.csv')
print(f"CSV path: {CSV_FILE_PATH}")

def populate_database():
    if not os.path.exists(CSV_FILE_PATH):
        print(f"Error: CSV file not found at {CSV_FILE_PATH}")
        return

    print("Initializing database...")
    init_db()

    conn = get_db_connection()
    cursor = conn.cursor()

    print(f"Reading CSV from {CSV_FILE_PATH}...")
    
    with open(CSV_FILE_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        # Check if table is empty to avoid duplicates or clear it?
        # User prompt said "insert all of these rows". A safe bet is to clear and reload or just insert.
        # I'll clear it to be safe as per "delete any existing recipes" from previous conversation context if relevant,
        # but for this specific task "Returns all recipes" implies we want the CSV data.
        # I'll clear the table to ensure a clean state matching the CSV.
        cursor.execute("DELETE FROM recipes")
        
        count = 0
        for row in reader:
            # CSV headers: ,Title,Ingredients,Instructions,Image_Name,Cleaned_Ingredients
            # DictReader uses headers. The first column name is empty string '' or similar?
            # Let's check the CSV header line from `view_file` output: ,Title,Ingredients,Instructions,Image_Name,Cleaned_Ingredients
            # The first column is index/id, we can ignore it and let DB auto-increment or use it.
            # I will let DB auto-increment to be safe.
            
            title = row.get('Title')
            ingredients = row.get('Ingredients')
            instructions = row.get('Instructions')
            image_name = row.get('Image_Name')
            cleaned_ingredients = row.get('Cleaned_Ingredients')
            
            cursor.execute('''
                INSERT INTO recipes (title, ingredients, instructions, image_name, cleaned_ingredients)
                VALUES (?, ?, ?, ?, ?)
            ''', (title, ingredients, instructions, image_name, cleaned_ingredients))
            count += 1
            
            if count % 1000 == 0:
                print(f"Inserted {count} recipes...")

    conn.commit()
    conn.close()
    print(f"Successfully inserted {count} recipes into the database.")

if __name__ == "__main__":
    populate_database()
