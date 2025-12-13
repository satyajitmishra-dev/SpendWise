import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, X } from 'lucide-react';

const ProfileReminder = () => {
    const { user } = useSelector(state => state.auth);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show if user is logged in (not guest?) AND missing college info
        // And hasn't dismissed it this session? (using state)
        if (user && user.email && !user.college) {
            const timer = setTimeout(() => setIsVisible(true), 5000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [user]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-4 right-4 md:top-6 md:left-auto md:right-6 md:w-80 bg-white/95 backdrop-blur-md text-gray-800 p-4 rounded-xl shadow-xl z-50 border border-indigo-100 animate-in slide-in-from-top duration-500 ring-1 ring-gray-100">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
                <X size={16} />
            </button>

            <div className="flex gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full h-fit">
                    <User size={18} />
                </div>
                <div>
                    <h4 className="font-bold text-sm mb-1 text-indigo-900">Complete your profile</h4>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        Add your college or profession to get personalized insights.
                    </p>
                    <Link
                        to="/onboarding"
                        onClick={() => setIsVisible(false)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                        Update Profile →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileReminder;
