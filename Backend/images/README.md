# Recipe images

Place recipe image files here as `.jpg` files.

**Naming:** Each file must be named **exactly** as in the CSV column `Image_Name` plus `.jpg`. If you see "No image" on cards, the filename does not match the database.

Examples:
- `miso-butter-roast-chicken-acorn-squash-panzanella.jpg`
- `crispy-salt-and-pepper-potatoes-dan-kluger.jpg`
- `thanksgiving-mac-and-cheese-erick-williams.jpg`

The app serves these at `http://localhost:8000/images/{image_name}.jpg`.

To see which recipe images are missing, run from the Backend folder: `python scripts/check_images.py`

**Debug:** If images don't load in the app, with the backend running open `http://localhost:8000/api/debug/recipe-image` in the browser. It shows the first recipe's `image_name`, the expected URL, and whether the file exists.
