import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Check, X, ShieldAlert, Users, Building2, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        total_ngos: 0,
        total_donations: 0,
        total_amount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/admin/statistics');
            setStats(response.data);
        } catch (err) {
            console.error('Error:', err);
            toast.error('Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

};
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 mb-12">System statistics and management</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_users}</p>
                                </div>
                                <Users className="w-12 h-12 text-primary-500 opacity-20" />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total NGOs</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_ngos}</p>
                                </div>
                                <Building2 className="w-12 h-12 text-primary-500 opacity-20" />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Donations</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_donations}</p>
                                </div>
                                <Heart className="w-12 h-12 text-primary-500 opacity-20" />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Amount</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">${stats.total_amount}</p>
                                </div>
                                <TrendingUp className="w-12 h-12 text-primary-500 opacity-20" />
                            </div>
                        </Card>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12">
                    <Card className="p-8 text-center">
                        <ShieldAlert className="w-12 h-12 text-primary-500 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Panel</h3>
                        <p className="text-gray-600">Additional management features coming soon</p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );

export default AdminDashboard;

