import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = 'Email is required';
        if (!formData.password) tempErrors.password = 'Password is required';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
        if (errors.api) setErrors(prev => ({ ...prev, api: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setErrors({});

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login Error:", error);
            let apiError = 'Failed to log in. Please check your credentials.';
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                apiError = 'Invalid email or password.';
            }
            setErrors(prev => ({ ...prev, api: apiError }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md w-full mx-auto" glass padded>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-secondary-900">Welcome back</h2>
                <p className="mt-2 text-sm text-secondary-600">Please enter your details to sign in.</p>
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
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    disabled={loading}
                    placeholder="••••••••"
                />

                <div className="flex items-center justify-between">
                    {/* Optional: Add 'Remember me' and 'Forgot password' here if needed later */}
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={loading}
                >
                    Log in
                </Button>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-secondary-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-secondary-500">
                            Don't have an account?
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        to="/signup"
                        variant="secondary"
                        className="w-full"
                    >
                        Create an account
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default LoginForm;
