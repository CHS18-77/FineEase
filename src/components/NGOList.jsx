import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { MapPin, Mail, Phone, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const NGOList = ({ ngos }) => {
    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ngos.map((ngo, index) => (
                <motion.div
                    key={ngo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card hover className="h-full flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                                    Verified
                                </span>
                                <span className="text-xs text-gray-400">Reg: {ngo.registration_number}</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">{ngo.name}</h3>
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3">{ngo.description}</p>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 mr-3 text-primary-500" />
                                    {ngo.address}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Mail className="w-4 h-4 mr-3 text-primary-500" />
                                    {ngo.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Phone className="w-4 h-4 mr-3 text-primary-500" />
                                    {ngo.phone}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0 mt-auto">
                            <Button className="w-full">Donate Now</Button>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default NGOList;
