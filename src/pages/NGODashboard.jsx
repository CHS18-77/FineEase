
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Building2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const NGODashboard = () => {
    const [stats, setStats] = useState({ total_donations: 0, total_users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/admin/statistics');
                setStats(res.data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My NGOs</h1>
                    <p className="text-gray-600 mt-1">Manage your registered organizations.</p>
                </div>
                <Link to="/ngo/add">
                    <Button>
                        <Plus className="w-5 h-5 mr-2" /> Register New NGO
                    </Button>
                </Link>
            </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-2">NGO Dashboard</h1>
                <p className="text-gray-600 mb-12">Welcome to your NGO management panel</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Donations</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_donations || 0}</p>
                                </div>
                                <TrendingUp className="w-12 h-12 text-primary-500 opacity-20" />
                            </div>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_users || 0}</p>
                                </div>
                                <Building2 className="w-12 h-12 text-primary-500 opacity-20" />
                            </div>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <Link to="/ngo/add">
                            <Button className="w-full h-full flex items-center justify-center">
                                <Plus className="w-5 h-5 mr-2" /> Register NGO
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <Card className="p-8 text-center">
                    <p className="text-gray-600">NGO management features coming soon!</p>
                </Card>
        </div>
    );
};

export default NGODashboard;

