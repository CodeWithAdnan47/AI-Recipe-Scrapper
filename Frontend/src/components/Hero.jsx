import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Hero = () => {
    const { currentUser } = useAuth();
    return (
        <section className="relative overflow-hidden bg-white pt-20 lg:pt-32 pb-16 lg:pb-32">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl opacity-60 animate-float"></div>
                <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-secondary-100/60 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="animate-slide-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6">
                        Revolutionize your cooking
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold text-secondary-900 tracking-tight mb-6 leading-tight">
                        Your digital kitchen <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">
                            simplified & organized
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-secondary-500 mx-auto mb-10 leading-relaxed">
                        Scrape recipes from any website, organize them into beautiful collections, and cook with ease. No more cluttered bookmarks or lost notes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {currentUser ? (
                            <Button
                                to="/dashboard"
                                variant="primary"
                                size="lg"
                                className="shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all"
                            >
                                Go To Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    to="/signup"
                                    variant="primary"
                                    size="lg"
                                    className="shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all"
                                >
                                    Get Started Free
                                </Button>
                                <Button
                                    to="/login"
                                    variant="secondary"
                                    size="lg"
                                    className="hover:bg-white"
                                >
                                    Log In to Account
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Optional: Add a visual element/placeholder for hero image/dashboard preview */}
                {/*<div className="mt-16 relative mx-auto w-full max-w-5xl lg:mt-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="relative rounded-2xl bg-secondary-900/5 p-2 lg:p-4 ring-1 ring-inset ring-secondary-900/10">
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-[300px] flex items-center justify-center bg-gradient-to-br from-secondary-50 to-white">
                            <img src="/dashboard-preview.png" alt="App Screenshot" className="w-full rounded-lg" />
                            <p className="text-secondary-400 font-medium italic">Dashboard Preview Placeholder</p>
                        </div>
                    </div>
                </div>*/}
            </div>
        </section>
    );
};

export default Hero;
