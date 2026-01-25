import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-8 md:mb-0">
                        <span className="text-2xl font-bold text-white">Recipe Scraper</span>
                        <p className="mt-2 text-gray-300 text-sm">Organize your recipes, simplify your cooking.</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link to="#" className="text-gray-400 hover:text-white">
                            About
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-white">
                            Terms of Service
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-white">
                            Contact
                        </Link>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                    <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                        &copy; 2025 Recipe Scraper and Organizer. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
