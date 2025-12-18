import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight, Wallet, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggler from '../components/layout/ThemeToggler';
import { motion } from 'framer-motion';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/welcome');
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const MenuItem = ({ icon: Icon, label, color = "text-gray-600", onClick, delay }) => (
        <motion.button
            variants={item}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border-b border-gray-100 dark:border-slate-700/50 last:border-none backdrop-blur-sm group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-700 shadow-sm ${color} dark:text-gray-200 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
        </motion.button>
    );

    const joinDate = new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="p-4 md:p-6 pb-32 max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6 md:mb-8"
            >
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">My Profile</h1>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                {/* Profile Card */}
                <motion.div variants={item} className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/20 dark:border-slate-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-6 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur duration-500 group-hover:blur-md opacity-20 group-hover:opacity-40 transition-all"></div>
                            <div className="w-28 h-28 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl text-indigo-600 dark:text-indigo-400 ring-4 ring-white dark:ring-slate-700 shadow-2xl overflow-hidden relative z-10">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    user?.name?.[0]?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 z-20"></div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user?.name || 'Guest User'}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium bg-gray-100 dark:bg-slate-800/50 px-4 py-1 rounded-full mb-6">
                            {user?.email || 'guest@spendwise.app'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl flex flex-col items-center border border-indigo-100 dark:border-indigo-900/30">
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Budget</span>
                                <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                                    {user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : '₹'}
                                    {user?.budget?.toLocaleString() || 0}
                                </span>
                            </div>
                            <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-2xl flex flex-col items-center border border-purple-100 dark:border-purple-900/30">
                                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Status</span>
                                <span className="text-lg font-bold text-purple-700 dark:text-purple-300 capitalize">{user?.status || 'Student'}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/edit-profile')}
                            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                        >
                            Edit Profile
                        </motion.button>
                    </div>
                </motion.div>

                {/* Account Details */}
                <motion.div variants={item} className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{joinDate}</p>
                        </div>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Currency</p>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{user?.currency || 'INR'}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Menu */}
                <motion.div variants={item} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 overflow-hidden">
                    <MenuItem icon={Settings} label="Preferences" color="text-gray-600" onClick={() => navigate('/preferences')} />
                    <MenuItem icon={Bell} label="Notifications" color="text-yellow-600" onClick={() => navigate('/notifications')} />
                    <MenuItem icon={Shield} label="Security & Passcode" color="text-green-600" onClick={() => navigate('/security')} />
                    <MenuItem icon={HelpCircle} label="Help & Support" color="text-blue-600" onClick={() => navigate('/help')} />
                </motion.div>

                {/* Theme Settings */}
                <motion.div variants={item} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-3xl shadow-sm border border-white/20 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 px-1">Appearance</h3>
                    <ThemeToggler showLabel className="w-full justify-between" />
                </motion.div>

                {/* Logout */}
                <motion.button
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-red-100 dark:border-red-900/20"
                >
                    <LogOut size={20} />
                    Log Out
                </motion.button>

                <motion.p variants={item} className="text-center text-gray-300 dark:text-slate-600 text-xs mt-8">SpendWise ✨ v2.2.0 • Made with ❤️</motion.p>
            </motion.div>
        </div>
    );
};

export default Profile;
