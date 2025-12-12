import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'donor'
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await register(formData);
        setIsLoading(false);

        if (result.success) {
            toast.success('Registration successful!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card glass className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join our community today
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                I want to join as
                            </label>
                            <select
                                name="role"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="donor">Donor</option>
                                <option value="ngo">NGO</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Register
                        </Button>

                        <div className="text-sm text-center">
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
