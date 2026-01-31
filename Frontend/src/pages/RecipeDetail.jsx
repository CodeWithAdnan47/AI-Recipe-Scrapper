import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import IngredientList from '../components/IngredientList';
import InstructionList from '../components/InstructionList';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chatRef = useRef(null);
    const [showChatToggle, setShowChatToggle] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                if (!currentUser) return; // Should be handled by ProtectedRoute but safe to check
                const token = await currentUser.getIdToken();

                const response = await fetch(`http://localhost:8000/api/recipes/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Recipe not found");
                    }
                    throw new Error("Failed to fetch recipe");
                }

                const data = await response.json();
                setRecipe(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && id) {
            fetchRecipe();
        }
    }, [id, currentUser]);

    // Handle scroll for chat toggle visibility
    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down 300px
            if (window.scrollY > 300) {
                setShowChatToggle(true);
            } else {
                setShowChatToggle(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const scrollToChat = () => {
        chatRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={handleBack}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-emerald-600 mb-6 transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Image Section - Using backend image if available, else placeholder */}
                    <div className="w-full h-80 bg-gray-200 relative">
                        {recipe.image_name ? (
                            <img
                                src={`http://localhost:8000/images/${recipe.image_name}`}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/800x400?text=No+Image'; // Fallback
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-white shadow-sm">{recipe.title}</h1>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 space-y-8">
                        {/* Ingredients Section */}
                        <IngredientList ingredients={recipe.cleaned_ingredients || recipe.ingredients} />

                        {/* Instructions Section */}
                        <InstructionList instructions={recipe.instructions} />
                    </div>
                </div>

                {/* RAG Chat */}
                <section ref={chatRef} className="mt-8 transition-opacity duration-500">
                    <ChatInterface recipeId={id} />
                </section>
            </div>

            {/* AI Chat Toggle / Scroll Button */}
            {showChatToggle && (
                <button
                    onClick={scrollToChat}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-10 hover:scale-10 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label="Scroll to AI Chat"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="font-semibold hidden sm:inline">Ask AI Chef</span>
                </button>
            )}
        </div>
    );
};

export default RecipeDetail;
