import RecipeCard from './RecipeCard';
import Spinner from './ui/Spinner';

const RecipeList = ({ recipes, loading, error, favorites, onToggleFavorite }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" color="text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 p-6 rounded-xl mx-auto max-w-2xl my-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-red-900 mb-1">Error loading recipes</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!recipes || recipes.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-secondary-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-50 mb-4">
                    <svg className="h-8 w-8 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-secondary-900">No recipes found</h3>
                <p className="mt-1 text-secondary-500">Try adjusting your filters or check back later.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1 pb-12">
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites?.has(recipe.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
};

export default RecipeList;
