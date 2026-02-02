import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RecipeList from '../components/RecipeList';
import Card from '../components/ui/Card';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder data for UI visualization
    const stats = [
        { name: 'Total Recipes', value: recipes.length || '0', icon: '📖', color: 'bg-blue-100 text-red-600' },
        //{ name: 'Categories', value: '1', icon: '🏷️', color: 'bg-purple-100 text-purple-600' }, // Placeholder
        {
            name: 'Favorites',
            value: favorites.size.toString(),
            icon: '❤️',
            onClick: () => setShowFavoritesOnly(prev => !prev),
            isActive: showFavoritesOnly,
            color: showFavoritesOnly ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-red-100 text-red-600'
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
                const recipesRes = await fetch(`${API_BASE_URL}/api/recipes`, { headers });
                if (!recipesRes.ok) throw new Error('Failed to fetch recipes');
                const recipesData = await recipesRes.json();
                setRecipes(recipesData);

                // Fetch favorites
                const favRes = await fetch(`${API_BASE_URL}/api/favorites`, { headers });
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
            const response = await fetch(`${API_BASE_URL}/api/favorites/${recipeId}`, {
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

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = (recipe.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (recipe.cleaned_ingredients?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (recipe.ingredients?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesFavorite = showFavoritesOnly ? favorites.has(recipe.id) : true;
        return matchesSearch && matchesFavorite;
    });

    const displayedRecipes = filteredRecipes;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <Navbar />

            <main className="flex-grow">
                {/* Welcome Header */}
                <div className="bg-white border-b border-secondary-200">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-secondary-900 leading-tight">Dashboard</h1>
                            <p className="mt-1 text-secondary-500">Welcome back, <span className="font-medium text-primary-600">{currentUser?.email}</span></p>
                        </div>
                        {/* <Button
                            variant="primary"
                            icon={({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                        >
                            Add Recipe
                        </Button> */}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
                        {stats.map((item) => (
                            <Card
                                key={item.name}
                                hover={!!item.onClick}
                                padded
                                onClick={item.onClick}
                                className={`flex items-center transition-all duration-200 ${item.isActive ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
                            >
                                <div className={`flex-shrink-0 p-3 rounded-lg ${item.color}`}>
                                    <span className="text-2xl">{item.icon}</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-secondary-500 truncate">
                                        {item.name}
                                    </dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-secondary-900">
                                            {item.value}
                                        </div>
                                    </dd>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Recipes Section */}
                    <div className="flex justify-between items-end mb-6 border-b border-secondary-200 pb-2">
                        <h2 className="text-2xl font-display font-bold text-secondary-900">
                            {showFavoritesOnly ? 'Your Favorite Recipes' : 'Recipes Collection'}
                        </h2>
                        {showFavoritesOnly && (
                            <button
                                onClick={() => setShowFavoritesOnly(false)}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                ← Show All Recipes
                            </button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search recipes by title or ingredients..."
                            className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-xl leading-5 bg-white placeholder-secondary-400 focus:outline-none focus:placeholder-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm transition-all duration-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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

