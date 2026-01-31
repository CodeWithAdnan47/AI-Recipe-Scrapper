import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';

// Inline placeholder when image fails (no external dependency)
const PLACEHOLDER_IMAGE = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect fill="#e5e7eb" width="300" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="sans-serif" font-size="14">No image</text></svg>'
);

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
        <Card
            hover
            padded={false}
            onClick={handleViewRecipe}
            className="h-full flex flex-col group"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 ${isFavorite
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/90 backdrop-blur-sm text-secondary-400 hover:text-red-500 hover:bg-white'
                            }`}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Optional New Badge if needed based on recipe data */}
                    {/* <Badge variant="warning" className="shadow-lg">New</Badge> */}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                    <h3 className="text-lg font-display font-bold text-secondary-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors" title={recipe.title}>
                        {recipe.title}
                    </h3>
                </div>

                <p className="text-sm text-secondary-500 line-clamp-3 mb-4 flex-1">
                    {recipe.cleaned_ingredients ? recipe.cleaned_ingredients.substring(0, 120) + '...' : 'No ingredients preview available.'}
                </p>

                <div className="mt-auto pt-4 border-t border-secondary-100 flex items-center justify-between">
                    <span className="text-xs text-secondary-400 font-medium uppercase tracking-wider">View Recipe</span>
                    <svg className="w-5 h-5 text-primary-500 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </Card>
    );
};

export default RecipeCard;
