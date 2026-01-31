import sqlite3

conn = sqlite3.connect('database/recipes.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()
cursor.execute('SELECT * FROM recipes LIMIT 1')
row = cursor.fetchone()
recipe = dict(row)
print("Recipe keys:", list(recipe.keys()))
print("\nSample recipe:")
for key, value in recipe.items():
    if isinstance(value, str) and len(value) > 100:
        print(f"  {key}: {value[:100]}...")
    else:
        print(f"  {key}: {value}")
conn.close()
