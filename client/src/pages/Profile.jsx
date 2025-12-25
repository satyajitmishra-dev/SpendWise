import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight, Wallet, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { y: 10, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const MenuItem = ({ icon: Icon, label, subtitle, statusColor, color = "text-gray-600", bg = "bg-gray-100", onClick, isDestructive }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 group relative overflow-hidden transition-all duration-300 ${isDestructive ? 'hover:bg-red-50/50 dark:hover:bg-red-900/10' : 'hover:bg-white/60 dark:hover:bg-slate-800/60'}`}
        >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDestructive ? '' : 'bg-gradient-to-r from-white/40 to-transparent dark:from-slate-800/40'}`} />

            <div className="flex items-center gap-4 text-left relative z-10">
                <div className={`p-2.5 rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${isDestructive ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : `bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border border-white/50 dark:border-slate-700/50 ${color}`}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <span className={`font-semibold block text-base transition-colors duration-200 ${isDestructive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>{label}</span>
                    {subtitle && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {statusColor && <div className={`w-1.5 h-1.5 rounded-full ${statusColor.replace('text-', 'bg-')} ${statusColor.includes('red') ? 'animate-pulse' : ''}`}></div>}
                            <span className={`text-xs font-medium ${statusColor || 'text-gray-400 dark:text-slate-500'}`}>
                                {subtitle}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10">
                {!isDestructive && (
                    <div className="p-1 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-slate-800 transition-colors">
                        <ChevronRight size={18} className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors group-hover:translate-x-0.5 transform duration-200" />
                    </div>
                )}
            </div>
        </button>
    );

    const MenuSection = ({ title, children }) => (
        <div className="space-y-3">
            {title && (
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-4">{title}</h3>
            )}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/40 dark:border-slate-700/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500 ring-1 ring-black/5 dark:ring-white/5">
                <div className="divide-y divide-gray-100/50 dark:divide-slate-800/50">
                    {children}
                </div>
            </div>
        </div>
    );

    const joinDate = new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen relative w-full overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="p-4 md:p-8 pb-32 max-w-2xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center justify-between mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        My Profile
                        <span className="text-2xl animate-bounce-slow">✨</span>
                    </h1>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {/* Premium Profile Card */}
                    <motion.div variants={item} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-[2.2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-2xl">

                            {/* Pro Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-200 to-yellow-400 dark:from-amber-700 dark:to-yellow-600 text-amber-900 dark:text-amber-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <Sparkles size={10} /> Pro
                            </div>

                            <div className="flex flex-col items-center">
                                {/* Avatar */}
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 bg-gray-50 dark:bg-slate-800 rounded-full p-1 ring-4 ring-white/50 dark:ring-slate-700/50 shadow-xl overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-4xl font-bold text-indigo-500 dark:text-indigo-400">
                                                {user?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 z-20 flex items-center justify-center ${user?.email ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                                        {user?.email && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight text-center">{user?.name || 'Guest User'}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 px-4 py-1.5 rounded-full mb-8 border border-gray-100 dark:border-slate-700/50 max-w-full truncate">
                                    {user?.email || 'Sign in to sync data'}
                                </p>

                                {/* Grid 1: Main Stats (Budget & Status) with Unified 2x2 Grid Styling */}
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    {/* 1. Budget Goal */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/budgets')}
                                        className="bg-gradient-to-b from-indigo-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-3xl flex flex-col items-center border border-indigo-100/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden cursor-pointer group/card"
                                    >
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-full blur-xl -mr-6 -mt-6"></div>
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-300 uppercase tracking-widest leading-none">Budget Goal</span>
                                            <ChevronRight size={10} className="text-indigo-300 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-white tracking-tight">
                                            {user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : '₹'}
                                            {(user?.budget || 0).toLocaleString()}
                                        </span>
                                    </motion.div>

                                    {/* 2. Member Type */}
                                    <div className="bg-gradient-to-b from-purple-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-3xl flex flex-col items-center border border-purple-100/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/5 rounded-full blur-xl -mr-6 -mt-6"></div>
                                        <span className="text-[10px] font-bold text-purple-400 dark:text-purple-300 uppercase tracking-widest mb-1 leading-none">Status</span>
                                        <span className="text-lg sm:text-xl font-black text-purple-600 dark:text-white tracking-tight capitalize">{user?.status || 'Student'}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/edit-profile')}
                                    className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-sm font-bold shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-2xl transition-all w-full md:w-auto mt-8"
                                >
                                    Edit Profile Information
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Grid 2: Secondary Stats (Joined & Currency) - Outside Main Card */}
                    <motion.div variants={item} className="grid grid-cols-2 gap-3 w-full">
                        {/* 3. Joined */}
                        <div className="bg-gradient-to-b from-orange-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-3xl flex flex-col items-center border border-orange-100/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500/5 rounded-full blur-xl -mr-6 -mt-6"></div>
                            <span className="text-[10px] font-bold text-orange-400 dark:text-orange-300 uppercase tracking-widest mb-1 leading-none">Joined</span>
                            <span className="text-sm sm:text-base font-bold text-orange-600 dark:text-white tracking-tight truncate max-w-full">{joinDate}</span>
                        </div>

                        {/* 4. Currency */}
                        <div className="bg-gradient-to-b from-blue-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-3xl flex flex-col items-center border border-blue-100/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-xl -mr-6 -mt-6"></div>
                            <span className="text-[10px] font-bold text-blue-400 dark:text-blue-300 uppercase tracking-widest mb-1 leading-none">Currency</span>
                            <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-white tracking-tight">{user?.currency || 'INR'}</span>
                        </div>
                    </motion.div>


                    {/* Menus */}
                    <motion.div variants={item} className="space-y-8">
                        {/* General */}
                        <MenuSection title="General Settings">
                            <MenuItem icon={Settings} label="Preferences" color="text-slate-600 dark:text-slate-300" onClick={() => navigate('/preferences')} />
                            <MenuItem icon={Bell} label="Notifications" color="text-amber-600 dark:text-amber-400" onClick={() => navigate('/notifications')} />
                            <MenuItem icon={HelpCircle} label="Help & Support" color="text-sky-600 dark:text-sky-400" onClick={() => navigate('/help')} />
                        </MenuSection>

                        {/* Security */}
                        <MenuSection title="Privacy & Security">
                            <MenuItem
                                icon={Shield}
                                label="App Security"
                                subtitle={user?.isPasscodeEnabled ? "Protection Active" : "Not secured • Tap to setup"}
                                statusColor={user?.isPasscodeEnabled ? "text-emerald-500" : "text-red-500"}
                                color="text-emerald-600 dark:text-emerald-400"
                                onClick={() => {
                                    if (!user?.email) {
                                        toast.error("Please login to enable security features");
                                        return;
                                    }
                                    navigate('/security');
                                }}
                            />
                        </MenuSection>

                        {/* Appearance */}
                        <MenuSection title="Appearance">
                            <div className="px-1 py-1">
                                <ThemeToggler showLabel className="w-full justify-between" />
                            </div>
                        </MenuSection>

                        {/* Actions */}
                        <motion.button
                            variants={item}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/20 shadow-sm"
                        >
                            <LogOut size={20} strokeWidth={2.5} />
                            Log Out
                        </motion.button>
                    </motion.div>

                    <motion.div variants={item} className="text-center pb-8 pt-4">
                        <p className="text-xs font-medium text-gray-400 dark:text-slate-600">
                            SpendWise Premium • v2.3.1
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
