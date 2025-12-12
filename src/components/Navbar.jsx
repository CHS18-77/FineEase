import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(user?.role === 'donor' ? [{ name: 'Dashboard', path: '/donor' }] : []),
    ...(user?.role === 'ngo' ? [{ name: 'Dashboard', path: '/ngo' }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Admin Panel', path: '/admin' }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
              F
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              FineEase
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                  />
                )}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-medium text-gray-500">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <Button variant="ghost" onClick={handleLogout} className="p-2">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden glass border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium ${location.pathname === link.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full">Register</Button>
                  </Link>
                </div>
              )}
              {user && (
                <Button
                  variant="danger"
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full mt-4"
                >
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
