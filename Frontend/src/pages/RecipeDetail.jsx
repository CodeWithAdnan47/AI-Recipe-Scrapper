import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import IngredientList from '../components/IngredientList';
import InstructionList from '../components/InstructionList';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import API_BASE_URL from '../config';
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
                if (!currentUser) return;
                const token = await currentUser.getIdToken();

                const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
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
                <Spinner size="lg" color="text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-secondary-600 mb-6">{error}</p>
                <Button onClick={handleBack} variant="primary">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const imageName = recipe.image_name?.trim?.() || recipe.imageName?.trim?.();
    const imageUrl = imageName
        ? `${API_BASE_URL}/images/${imageName}${imageName.toLowerCase().endsWith(".jpg") ? "" : ".jpg"}`
        : null;

    return (
        <div className="min-h-screen bg-gray-50 pb-12 relative">
            {/* Hero Image Section */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden bg-secondary-900">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover opacity-90"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex'; // Show placeholder
                        }}
                    />
                ) : null}

                {/* Fallback/Placeholder if no image or error */}
                <div className={`w-full h-full flex items-center justify-center bg-secondary-800 text-secondary-700 ${imageUrl ? 'hidden' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Back Button positioned absolutely */}
                <div className="absolute top-6 left-4 md:left-8 z-20">
                    <Button
                        onClick={handleBack}
                        variant="ghost"
                        className="text-white hover:bg-white/20 backdrop-blur-sm"
                        icon={({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>}
                    >
                        Back
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto z-10">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white shadow-sm leading-tight mb-2">
                        {recipe.title}
                    </h1>
                    {/* Placeholder for metadata if available */}
                    <div className="flex items-center space-x-4 text-white/80 text-sm font-medium">
                        {/* <span>20 mins</span>
                        <span>•</span>
                        <span>Easy</span> */}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Ingredients */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl shadow-secondary-200/50 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <IngredientList ingredients={recipe.cleaned_ingredients || recipe.ingredients} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Instructions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl shadow-secondary-200/50 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <InstructionList instructions={recipe.instructions} />
                            </div>
                        </div>

                        {/* RAG Chat Section */}
                        <div ref={chatRef} className="scroll-mt-24">
                            <ChatInterface recipeId={id} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Toggle */}
            {showChatToggle && (
                <button
                    onClick={scrollToChat}
                    className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-primary-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/30"
                    aria-label="Ask AI Chef"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span className="font-bold tracking-wide">Ask AI Chef</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default RecipeDetail;
