import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Monitor, Bell, HelpCircle, Info, ChevronRight, Check } from 'lucide-react';
import { setTheme } from '../store/slices/themeSliceFixed';
import { updateUser } from '../store/slices/authSlice';
import api from '../services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';

const PreferencesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { mode } = useSelector((state) => state.theme);
    const { version } = useSelector((state) => state.app);

    // Local state for toggles to provide instant feedback while saving
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.preferences?.emailNotifications !== undefined) {
            setEmailEnabled(user.preferences.emailNotifications);
        }
    }, [user]);

    const handleThemeChange = (newMode) => {
        dispatch(setTheme(newMode));
    };

    const handleNotificationToggle = async () => {
        const newValue = !emailEnabled;
        setEmailEnabled(newValue); // Optimistic update

        try {
            await api.post('/auth/update-profile', {
                userId: user.id || user._id,
                preferences: {
                    emailNotifications: newValue
                }
            });
            // Update redux state with the response if needed, 
            // but for now we assume success or revert on error.
            // Ideally dispatch(updateUser(response.data)) but simple toggle is fine.
            const updatedUser = { ...user, preferences: { ...user.preferences, emailNotifications: newValue } };
            dispatch(updateUser(updatedUser));
            toast.success(newValue ? 'Email notifications enabled' : 'Email notifications disabled');
        } catch (error) {
            console.error(error);
            setEmailEnabled(!newValue); // Revert
            toast.error('Failed to update preference');
        }
    };

    const Section = ({ title, children }) => (
        <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">{title}</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                    {children}
                </div>
            </div>
        </div>
    );

    const ThemeOption = ({ themeMode, icon: Icon, label }) => (
        <button
            onClick={() => handleThemeChange(themeMode)}
            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${mode === themeMode
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
        >
            <div className={`p-3 rounded-full ${mode === themeMode
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                }`}>
                <Icon size={24} />
            </div>
            <span className={`font-medium ${mode === themeMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
                }`}>{label}</span>
            {mode === themeMode && (
                <div className="absolute top-2 right-2 text-indigo-500">
                    <Check size={16} />
                </div>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617]">
            <div className="p-4 md:p-8 pb-32 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/profile')} className="p-3 -ml-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors">
                        <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Preferences
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Appearance Section */}
                    <div className="mb-8">
                        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">Appearance</h2>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm">
                            <div className="flex gap-4">
                                <ThemeOption themeMode="light" icon={Sun} label="Light" />
                                <ThemeOption themeMode="dark" icon={Moon} label="Dark" />
                                <ThemeOption themeMode="system" icon={Monitor} label="System" />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <Section title="Notifications">
                        <div className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Email Updates</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive security alerts and digests</p>
                                </div>
                            </div>
                            <button
                                onClick={handleNotificationToggle}
                                className={`w-12 h-7 rounded-full transition-colors relative ${emailEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${emailEnabled ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </Section>

                    {/* About Section */}
                    <Section title="About">
                        <button onClick={() => navigate('/help')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-xl">
                                    <HelpCircle size={20} />
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">Help & Support</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                        </button>

                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">App Version</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Stable Release</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm font-mono font-medium text-gray-600 dark:text-gray-300">
                                v{version}
                            </span>
                        </div>
                    </Section>

                </motion.div>
                <Footer />
            </div>
        </div>
    );
};

export default PreferencesPage;
