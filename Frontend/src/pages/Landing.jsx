import Features from '../components/Features';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <Features />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
