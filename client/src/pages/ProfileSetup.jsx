import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../store/slices/authSlice'; // We need an async thunk for this really
import api from '../services/api';
import { ChevronRight, User, School, IndianRupee, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';

const ProfileSetup = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        college: user?.college || '',
        status: user?.status || 'student',
        currency: user?.currency || 'INR',
        budget: user?.budget || ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                college: user.college || '',
                status: user.status || 'student',
                currency: user.currency || 'INR',
                budget: user.budget || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkip = async () => {
        try {
            // Just mark complete without changing details
            const res = await api.post('/auth/update-profile', {
                userId: user._id,
                onboardingComplete: true
            });
            dispatch(updateUser(res.data));
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/update-profile', {
                userId: user._id,
                ...formData,
                onboardingComplete: true
            });

            dispatch(updateUser(res.data));
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white max-w-md mx-auto p-6">
            <div className="mt-8 mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Let's get to know you</h1>
                    <p className="text-gray-500">Customize SpendWise for your needs.</p>
                </div>
                <button
                    onClick={handleSkip}
                    className="text-sm font-medium text-gray-400 hover:text-gray-600 px-3 py-1 bg-gray-50 rounded-lg"
                >
                    Skip
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                {/* ... fields ... */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">What should we call you?</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College / Workplace</label>
                        <div className="relative">
                            <School className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                placeholder="e.g. IIT Bombay"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-3 text-gray-400" size={18} />
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget</label>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pb-4">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        Start Tracking <ChevronRight size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSetup;
