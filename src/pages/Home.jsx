```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import NGOList from '../components/NGOList';
import Button from '../components/ui/Button';
import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await axios.get('/ngo/approved');
        setNgos(res.data.data);
      } catch (error) {
        toast.error('Failed to fetch NGOs');
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
                Empowering Change Together
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Connect with NGOs and <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                  Make a Difference
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                FineEase bridges the gap between donors and verified NGOs. 
                Discover causes you care about and contribute to a better world with transparency and ease.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                    Start Donating <Heart className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="#ngos">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                    Browse NGOs <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NGOs Section */}
      <section id="ngos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verified NGOs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our list of government-approved NGOs and find a cause that resonates with you.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : ngos.length > 0 ? (
            <NGOList ngos={ngos} />
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">No approved NGOs found yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
```
