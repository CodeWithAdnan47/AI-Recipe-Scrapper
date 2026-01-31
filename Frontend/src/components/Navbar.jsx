import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`
                fixed w-full z-50 top-0 left-0 transition-all duration-300
                ${isScrolled ? 'glass shadow-glass' : 'bg-transparent'}
            `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-display font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            Recipe Scraper
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {currentUser ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`text-sm font-medium transition-colors duration-200 ${isActive('/dashboard') ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'}`}
                                >
                                    Dashboard
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`text-sm font-medium transition-colors duration-200 ${isActive('/login') ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'}`}
                                >
                                    Login
                                </Link>
                                <Button
                                    to="/signup"
                                    variant="primary"
                                    size="sm"
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-secondary-600 hover:text-primary-600 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`
                    md:hidden absolute w-full glass border-b border-white/20 shadow-glass
                    transition-all duration-300 ease-in-out origin-top
                    ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}
                `}
            >
                <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col items-center">
                    {currentUser ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={`block w-full text-center py-2 text-base font-medium rounded-md ${isActive('/dashboard') ? 'text-primary-600 bg-primary-50' : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'}`}
                            >
                                Dashboard
                            </Link>
                            <Button
                                variant="outline"
                                size="md"
                                onClick={handleLogout}
                                className="w-full"
                            >
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={`block w-full text-center py-2 text-base font-medium rounded-md ${isActive('/login') ? 'text-primary-600 bg-primary-50' : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'}`}
                            >
                                Login
                            </Link>
                            <Button
                                to="/signup"
                                variant="primary"
                                size="md"
                                className="w-full"
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
