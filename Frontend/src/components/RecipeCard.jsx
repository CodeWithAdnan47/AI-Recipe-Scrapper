import { useNavigate } from 'react-router-dom';

// Inline placeholder when image fails (no external dependency)
const PLACEHOLDER_IMAGE = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect fill="#e5e7eb" width="300" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="sans-serif" font-size="14">No image</text></svg>'
);

// Use relative URL so Vite proxy forwards to backend (avoids mixed-content blocking)
const RecipeCard = ({ recipe, isFavorite, onToggleFavorite }) => {
    const navigate = useNavigate();
    const imageName = recipe?.image_name?.trim?.() || recipe?.imageName?.trim?.();
    const imageUrl = imageName
        ? `/images/${imageName}${imageName.toLowerCase().endsWith(".jpg") ? "" : ".jpg"}`
        : PLACEHOLDER_IMAGE;

    const handleViewRecipe = () => {
        navigate(`/recipes/${recipe.id}`);
    };

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(recipe.id);
        }
    };

    return (
        <div
            onClick={handleViewRecipe}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group relative"
        >
            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                <img
                    src={imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                />

                <div className="absolute top-2 right-2 flex space-x-2">
                    {/* Favorite Button */}
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-full shadow-md transition-all duration-200 ${isFavorite
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500'
                            }`}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <div className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow self-center hidden">
                        New
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]" title={recipe.title}>
                    {recipe.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>By Chef</span>
                    {/* Placeholder for metadata if available */}
                </div>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                    {recipe.cleaned_ingredients ? recipe.cleaned_ingredients.substring(0, 100) + '...' : 'No ingredients preview available.'}
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewRecipe();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                >
                    View Recipe
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
