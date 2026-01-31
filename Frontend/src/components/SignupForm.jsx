import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        // Clear API error if exists
        if (errors.api) {
            setErrors(prev => ({ ...prev, api: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setErrors({}); // Clear previous errors

        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            // Successful signup
            navigate('/login');
        } catch (error) {
            console.error("Signup Error:", error);
            let apiError = "Failed to create an account. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                apiError = "This email is already in use.";
            } else if (error.code === 'auth/weak-password') {
                apiError = "Password should be at least 6 characters.";
            } else if (error.code === 'auth/invalid-email') {
                apiError = "Invalid email address.";
            }
            setErrors(prev => ({ ...prev, api: apiError }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md w-full mx-auto" glass padded>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-secondary-900">Create Account</h2>
                <p className="mt-2 text-sm text-secondary-600">Start your culinary journey today.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {errors.api && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-100 flex items-start animate-fade-in">
                        <svg className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm font-medium text-red-800">{errors.api}</p>
                    </div>
                )}

                <Input
                    label="Email address"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={loading}
                    placeholder="you@example.com"
                />

                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    disabled={loading}
                    placeholder="••••••••"
                />

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={loading}
                >
                    Sign up
                </Button>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-secondary-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-secondary-500">
                            Already have an account?
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        to="/login"
                        variant="secondary"
                        className="w-full"
                    >
                        Log in
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default SignupForm;
