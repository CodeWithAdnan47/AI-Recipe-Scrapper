import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SignupForm from '../components/SignupForm';

const Signup = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Start organizing your recipes today
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <SignupForm />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
