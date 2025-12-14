import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggler from '../components/layout/ThemeToggler';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/welcome');
    };

    const MenuItem = ({ icon: Icon, label, color = "text-gray-600", onClick }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-50 dark:border-slate-700 last:border-none"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-gray-50 dark:bg-slate-700 ${color} dark:text-gray-200`}>
                    <Icon size={20} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
        </button>
    );

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold mb-8">My Profile</h1>

            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-indigo-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-4xl mb-4 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-50 dark:ring-slate-600">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user?.name || 'Guest User'}</h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm">{user?.email || 'guest@spendwise.app'}</p>
                <button
                    onClick={() => navigate('/edit-profile')}
                    className="mt-4 px-6 py-2 bg-gray-900 dark:bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg shadow-gray-200 dark:shadow-none border border-transparent dark:border-slate-700 hover:scale-105 transition-transform"
                >
                    Edit Profile
                </button>
            </div>

            {/* Menu */}
            <div className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-8">
                <MenuItem icon={Settings} label="Preferences" onClick={() => navigate('/preferences')} />
                <MenuItem icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />
                <MenuItem icon={Shield} label="Security" onClick={() => navigate('/security')} />
                <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => navigate('/help')} />
            </div>

            {/* Theme Settings */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 pl-2">Appearance</h3>
                <ThemeToggler showLabel className="w-full justify-between px-2" />
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
                <LogOut size={20} />
                Log Out
            </button>

            <p className="text-center text-gray-300 dark:text-slate-600 text-xs mt-8">v1.1.0 ⭐ SpendWise Student</p>
        </div>
    );
};

export default Profile;
