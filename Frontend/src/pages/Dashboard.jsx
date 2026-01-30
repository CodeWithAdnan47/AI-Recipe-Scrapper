import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RecipeList from '../components/RecipeList';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder data for UI visualization
    const stats = [
        { name: 'Total Recipes', value: recipes.length || '0', icon: '📖' },
        { name: 'Categories', value: '1', icon: '🏷️' }, // Placeholder
        { name: 'Favorites', value: '0', icon: '❤️' }, // Placeholder
    ];

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const token = currentUser ? await currentUser.getIdToken() : 'mock_token';

                const response = await fetch('/api/recipes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data = await response.json();
                setRecipes(data);
            } catch (err) {
                console.error("Error fetching recipes:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [currentUser]);

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
                            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg flex items-center p-5">
                                <div className="text-3xl mr-4">{item.icon}</div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 truncate">{item.name}</div>
                                    <div className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recipes Section */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recipes Collection</h2>

                    <RecipeList recipes={recipes} loading={loading} error={error} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;

