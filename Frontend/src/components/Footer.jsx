import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-secondary-900 text-secondary-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-display font-bold text-white">Recipe Scraper</span>
                        <p className="mt-4 text-secondary-400 text-sm max-w-sm">
                            Your personal digital kitchen. Scrape, organize, and cook your favorite recipes with ease.
                        </p>
                    </div>
                    {/* <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h3>
                          <ul className="space-y-3">
                            <li><Link to="#" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>*/}
                    <div>
                        {/*<h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>*/}
                        <ul className="space-y-3">
                            <li><Link to="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-secondary-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-secondary-500">
                        &copy; 2025 Recipe Scraper. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {/* Social icons could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
