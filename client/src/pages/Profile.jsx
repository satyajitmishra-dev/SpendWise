import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets } from '../store/slices/budgetSlice';
import { logout, updateUser } from '../store/slices/authSlice';
import api from '../services/api';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight, Wallet, Calendar, CreditCard, Sparkles, RefreshCw } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { version } = useSelector((state) => state.app);
    const { items: budgets } = useSelector((state) => state.budgets);

    const handleStatusToggle = async () => {
        const statuses = ['student', 'professional', 'freelancer', 'other'];
        const currentIndex = statuses.indexOf(user?.status || 'student');
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];

        try {
            const res = await api.post('/auth/update-profile', {
                userId: user._id || user.id,
                status: nextStatus
            });
            dispatch(updateUser(res.data));
            toast.success(`Switched to ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    useEffect(() => {
        dispatch(fetchBudgets());
    }, [dispatch]);

    // Calculate Effective Budget Goal
    const effectiveBudget = useMemo(() => {
        if (!budgets || budgets.length === 0) return user?.budget || 0;

        // 1. Check for "Overall" budget
        const overallBudget = budgets.find(b => b.category === 'Monthly Budget');
        if (overallBudget) return overallBudget.amount;

        // 2. Sum of categories
        return budgets.reduce((sum, b) => sum + b.amount, 0);
    }, [budgets, user]);

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
        <div className="min-h-screen relative w-full overflow-hidden bg-slate-50 dark:bg-[#020617]">
            {/* Ambient Background - Subtle Deep Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="p-4 md:p-8 pb-32 w-full max-w-lg mx-auto relative z-10 transition-all duration-500">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center justify-between mb-6 px-2"
                >
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Profile
                    </h1>
                    <div className="scale-90 origin-right">

                    </div>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {/* Main Dark Card - Premium Upgrade */}
                    <motion.div variants={item} className="relative group">
                        {/* Animated Glow */}
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-emerald-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

                        <div className="relative bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 border border-slate-700/50 overflow-hidden backdrop-blur-xl">

                            <div className="flex flex-col items-center relative z-10">
                                {/* Avatar with Enhanced Ring */}
                                <div className="relative mb-6 group/avatar">
                                    {/* Animated Pulse Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/30 to-amber-400/30 rounded-full blur-lg opacity-60 group-hover/avatar:opacity-100 transition-opacity duration-500"></div>

                                    <div className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-emerald-400 via-amber-300 to-emerald-300 animate-gradient-xy">
                                        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-1.5 shadow-inner">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400">
                                                    {user?.name?.[0]?.toUpperCase() || 'G'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Status Dot */}
                                    <div className="absolute bottom-2 right-1">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-[#0f172a]"></div>
                                    </div>
                                </div>

                                {/* Name & Email */}
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">{user?.name || 'Guest'}</h2>
                                <div className="mb-6 flex flex-col items-center gap-3">
                                    <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300 text-xs font-medium shadow-sm flex items-center gap-2">
                                        {user?.email || 'student@spendwise.com'}
                                    </span>
                                    {user?.college && (
                                        <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                            <School size={14} className="text-indigo-400" />
                                            {user.college}
                                        </span>
                                    )}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/budgets')}
                                        className="bg-[#1e293b] p-5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-600/30 hover:border-slate-500/50 transition-all cursor-pointer"
                                    >
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Goal</span>
                                        <span className="text-2xl font-black text-white">
                                            {user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : '₹'}
                                            {(effectiveBudget || 0).toLocaleString()}
                                        </span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleStatusToggle}
                                        className="bg-[#1e293b] p-5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-600/30 hover:border-indigo-500/50 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Profession</span>
                                            <RefreshCw size={10} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-xl sm:text-2xl font-black text-white capitalize">{user?.status || 'Student'}</span>
                                    </motion.button>
                                </div>

                                {/* Edit Button - Enhanced */}
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(255,255,255,0.15)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/edit-profile')}
                                    className="relative w-full bg-white text-slate-950 font-bold py-4 rounded-2xl uppercase text-sm tracking-wider shadow-2xl shadow-white/20 hover:bg-gradient-to-r hover:from-white hover:to-slate-100 transition-all overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <span className="relative z-10">
                                        Edit Profile</span>
                                </motion.button>
                            </div>
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



                        {/* Actions */}
                        <motion.div
                            variants={item}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="destructive"
                                fullWidth
                                size="lg"
                                onClick={handleLogout}
                                leftIcon={<LogOut size={20} strokeWidth={2.5} />}
                                className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/20 shadow-sm h-auto py-5 rounded-[2rem]"
                            >
                                Log Out
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={item} className="text-center pb-8 pt-4">
                        <p className="text-xs font-medium text-gray-400 dark:text-slate-600">
                            SpendWise Premium • v{version}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
