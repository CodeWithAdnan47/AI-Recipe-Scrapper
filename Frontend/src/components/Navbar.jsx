import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md fixed w-full z-10 top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">
                            Recipe Scraper
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150">
                            Login
                        </Link>
                        <Link to="/signup" className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-150">
                            Sign Up
                        </Link>
                    </div>
                    {/* Mobile menu button could go here */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
