import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();

    // Placeholder data for UI visualization
    const stats = [
        { name: 'Saved Recipes', value: '12', icon: '📖' },
        { name: 'Categories', value: '4', icon: '🏷️' },
        { name: 'Favorites', value: '3', icon: '❤️' },
    ];

    const recentRecipes = [1, 2, 3]; // Just array to map placeholders

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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Recipes</h2>
                    {recentRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Placeholder Recipe Cards */}
                            {recentRecipes.map((i) => (
                                <div key={i} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                                    <div className="h-48 bg-gray-200 w-full animate-pulse flex items-center justify-center text-gray-400">
                                        Recipe Image Preview
                                    </div>
                                    <div className="p-5">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-indigo-600 bg-indigo-200 last:mr-0 mr-1">
                                                Dinner
                                            </span>
                                            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500">No recipes found. Start adding some!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
