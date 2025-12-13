import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-gray-50 ${color}`}>
                    <Icon size={20} />
                </div>
                <span className="font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
        </button>
    );

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold mb-8">My Profile</h1>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mb-4 text-indigo-600 ring-4 ring-indigo-50">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user?.name || 'Guest User'}</h2>
                <p className="text-gray-400 text-sm">{user?.email || 'guest@spendwise.app'}</p>
                <button className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold shadow-lg shadow-gray-200">
                    Edit Profile
                </button>
            </div>

            {/* Menu */}
            <div className="rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <MenuItem icon={Settings} label="Preferences" />
                <MenuItem icon={Bell} label="Notifications" />
                <MenuItem icon={Shield} label="Security" />
                <MenuItem icon={HelpCircle} label="Help & Support" />
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
                <LogOut size={20} />
                Log Out
            </button>

            <p className="text-center text-gray-300 text-xs mt-8">v1.0.0 • ExpenseWise Student</p>
        </div>
    );
};

export default Profile;
