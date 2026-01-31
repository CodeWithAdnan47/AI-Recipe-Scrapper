import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RecipeList from '../components/RecipeList';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder data for UI visualization
    const stats = [
        { name: 'Total Recipes', value: recipes.length || '0', icon: '📖' },
        { name: 'Categories', value: '1', icon: '🏷️' }, // Placeholder
        {
            name: 'Favorites',
            value: favorites.size.toString(),
            icon: '❤️',
            onClick: () => setShowFavoritesOnly(prev => !prev),
            isActive: showFavoritesOnly,
            color: 'text-red-500'
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!currentUser) return;

                const token = await currentUser.getIdToken();
                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch recipes
                const recipesRes = await fetch('/api/recipes', { headers });
                if (!recipesRes.ok) throw new Error('Failed to fetch recipes');
                const recipesData = await recipesRes.json();
                setRecipes(recipesData);

                // Fetch favorites
                const favRes = await fetch('/api/favorites', { headers });
                if (favRes.ok) {
                    const favData = await favRes.json();
                    setFavorites(new Set(favData));
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const handleToggleFavorite = async (recipeId) => {
        try {
            // Optimistic update
            const isFav = favorites.has(recipeId);
            const newFavorites = new Set(favorites);
            if (isFav) newFavorites.delete(recipeId);
            else newFavorites.add(recipeId);
            setFavorites(newFavorites);

            const token = await currentUser.getIdToken();
            const response = await fetch(`/api/favorites/${recipeId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Revert on error
                setFavorites(favorites);
                console.error("Failed to toggle favorite");
            }
        } catch (error) {
            setFavorites(favorites);
            console.error("Error toggling favorite:", error);
        }
    };

    const displayedRecipes = showFavoritesOnly
        ? recipes.filter(recipe => favorites.has(recipe.id))
        : recipes;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Welcome Header */}
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Dashboard</h1>
                            <p className="mt-1 text-sm text-gray-500">Welcome back, {currentUser?.email}</p>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            + Add Recipe
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                        {stats.map((item) => (
                            <div
                                key={item.name}
                                onClick={item.onClick}
                                className={`bg-white overflow-hidden shadow rounded-lg flex items-center p-5 transition-all duration-200 ${item.onClick ? 'cursor-pointer hover:shadow-md' : ''
                                    } ${item.isActive ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
                            >
                                <div className={`text-3xl mr-4 ${item.isActive ? 'text-red-500' : ''}`}>{item.icon}</div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 truncate">{item.name}</div>
                                    <div className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recipes Section */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            {showFavoritesOnly ? 'Your Favorite Recipes' : 'Recipes Collection'}
                        </h2>
                        {showFavoritesOnly && (
                            <button
                                onClick={() => setShowFavoritesOnly(false)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Show All Recipes
                            </button>
                        )}
                    </div>

                    <RecipeList
                        recipes={displayedRecipes}
                        loading={loading}
                        error={error}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;

