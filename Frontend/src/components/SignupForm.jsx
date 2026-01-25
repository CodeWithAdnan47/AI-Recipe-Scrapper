import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            tempErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted:', formData);
            // Here you would typically handle the API call
            alert('Signup form submitted (check console for data). Backend integration coming soon!');
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600" id="email-error">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600" id="password-error">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign up
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            Already have an account?
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                    <Link to="/login" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
