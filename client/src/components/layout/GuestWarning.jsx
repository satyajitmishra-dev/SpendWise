import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AlertTriangle, X, Lock } from 'lucide-react';

const GuestWarning = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show if user is authenticated (meaning we have a user object) 
        // BUT they don't have an email (implying Guest status)
        if (user && !user.email) {
            // Check if items (expenses/loans) exist to warrant a warning?
            // For now, always show after a short delay
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [user]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl z-50 border border-gray-700 animate-in slide-in-from-bottom duration-500">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
                <X size={16} />
            </button>

            <div className="flex gap-3">
                <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg h-fit">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-sm mb-1">Don't lose your data!</h4>
                    <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                        You are using a Guest account. Your expenses and data will be lost if you clear your browser or close this session.
                    </p>
                    <div className="flex gap-3">
                        <Link
                            to="/signup"
                            className="text-xs font-bold bg-white text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Secure Account
                        </Link>
                        <Link
                            to="/login"
                            className="text-xs font-medium text-gray-300 px-2 py-1.5 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestWarning;
