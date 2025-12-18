import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../store/slices/authSlice';
import api from '../services/api';
import { toast } from 'sonner';
import { ChevronLeft, User, School, IndianRupee, Wallet, Loader2, Camera, RefreshCw, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        college: user?.college || '',
        currency: user?.currency || 'INR',
        budget: user?.budget || '',
        avatar: user?.avatar || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation based on configuration
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('avatar', file);

        setIsLoading(true);
        try {
            const res = await api.post('/auth/avatar', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, avatar: res.data.avatar }));
            dispatch(updateUser(res.data.user));
            toast.success('Photo uploaded!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload photo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const newAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${randomSeed}`;
        setFormData(prev => ({ ...prev, avatar: newAvatar }));
    };

    const handleDeleteAvatar = async () => {
        if (!window.confirm('Are you sure you want to remove your profile photo?')) return;

        setIsLoading(true);
        try {
            const res = await api.post('/auth/delete-avatar');
            setFormData(prev => ({ ...prev, avatar: '' }));
            dispatch(updateUser(res.data.user));
            toast.success('Profile photo removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove photo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (formData.budget && Number(formData.budget) < 0) {
            toast.error('Budget cannot be negative');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('/auth/update-profile', {
                userId: user.id || user._id,
                ...formData
            });
            dispatch(updateUser(res.data));
            toast.success('Profile updated successfully');
            navigate('/profile');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.msg || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 pb-24 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-3 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
                >
                    Edit Profile
                </motion.h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/20 dark:border-slate-800"
                >

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-6 pb-8 border-b border-gray-100 dark:border-slate-800/50 mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-800 overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300">
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl text-indigo-300 dark:text-slate-600 font-bold bg-gray-50 dark:bg-slate-800">
                                        {formData.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <Camera size={32} className="text-white drop-shadow-lg" />
                                </div>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onChange={handleFileChange} title="Upload Photo" />
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <button
                                type="button"
                                onClick={handleGenerateAvatar}
                                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all hover:scale-105 active:scale-95"
                            >
                                <RefreshCw size={16} /> Random Avatar
                            </button>
                            {formData.avatar && (
                                <button
                                    type="button"
                                    onClick={handleDeleteAvatar}
                                    className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Trash2 size={16} /> Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Full Name</label>
                            <div className="relative transition-all group-focus-within:scale-[1.01]">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none dark:text-white transition-all font-medium"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">College / Workplace</label>
                            <div className="relative transition-all group-focus-within:scale-[1.01]">
                                <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none dark:text-white transition-all font-medium"
                                    placeholder="e.g. IIT Delhi"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Currency</label>
                                <div className="relative transition-all group-focus-within:scale-[1.01]">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none appearance-none dark:text-white transition-all font-medium"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Monthly Budget</label>
                                <div className="relative transition-all group-focus-within:scale-[1.01]">
                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none dark:text-white transition-all font-medium"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={22} />
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <Save size={22} />
                            Save Profile
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
};

export default EditProfile;
