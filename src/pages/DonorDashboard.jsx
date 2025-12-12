import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import { Heart, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const DonorDashboard = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total_amount: 0, total_ngos: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ngosRes = await axios.get('/ngos');
                setNgos(ngosRes.data || []);
                const statsRes = await axios.get('/admin/statistics');
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Donor Dashboard</h1>
                <p className="text-gray-600 mb-12">Support verified NGOs and make a difference</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Amount Raised</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">${stats.total_amount || 0}</p>
                            </div>
                            <Heart className="w-12 h-12 text-primary-500 opacity-20" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Verified NGOs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_ngos || 0}</p>
                            </div>
                            <DollarSign className="w-12 h-12 text-primary-500 opacity-20" />
                        </div>
                    </Card>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured NGOs</h2>
                {ngos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ngos.slice(0, 6).map((ngo, index) => (
                            <motion.div
                                key={ngo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 h-full">
                                    <h3 className="text-lg font-bold text-gray-900">{ngo.name}</h3>
                                    <p className="text-gray-600 text-sm mt-2">{ngo.description}</p>
                                    <p className="text-gray-500 text-sm mt-4">{ngo.city}, {ngo.country}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center"><p className="text-gray-500">No NGOs available</p></Card>
                )}
            </div>
        </div>
    );
};

export default DonorDashboard;

