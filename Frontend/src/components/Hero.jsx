import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="bg-gray-50 pt-20 pb-12 lg:pt-32 lg:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Your digital kitchen</span>
                    <span className="block text-indigo-600">simplified and organized</span>
                </h1>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                    Scrape recipes from any website, organize them into collections, and cook with ease. No more cluttered bookmarks or lost notes.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <div className="rounded-md shadow">
                        <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg">
                            Get Started
                        </Link>
                    </div>
                    <div className="rounded-md shadow">
                        <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
