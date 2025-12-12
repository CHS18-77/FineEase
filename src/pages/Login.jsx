```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    setIsLoading(false);
    
    if (result.success) {
      toast.success('Login successful!');
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
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue your journey
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Sign in
            </Button>
            
            <div className="text-sm text-center">
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
```
