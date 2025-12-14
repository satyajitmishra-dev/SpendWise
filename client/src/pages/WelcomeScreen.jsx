import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsGuest } from '../store/slices/authSlice';
import { ArrowRight, Sparkles, LogIn, UserCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const WelcomeScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const handleGuestLogin = async () => {
        const result = await dispatch(loginAsGuest({
            name: 'Guest',
            status: 'student',
            currency: 'INR',
            budget: 0
        }));

        if (loginAsGuest.fulfilled.match(result)) {
            navigate('/onboarding');
        } else {
            toast.error(result.payload?.msg || "Guest login failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-indigo-600 text-white relative overflow-hidden">
            {/* Animated Background Shapes */}
            <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="flex-1 flex flex-col justify-center items-center px-6 z-10 w-full max-w-lg mx-auto">
                {/* Logo / Band */}
                <div className="mb-12 text-center animate-in fade-in zoom-in duration-700">
                    <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 mb-6 shadow-2xl">
                        <Sparkles size={40} className="text-yellow-300" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-2 drop-shadow-md">
                        SpendWise
                    </h1>
                    <p className="text-xl text-indigo-100 font-medium opacity-90 tracking-wide">
                        Student Edition
                    </p>
                </div>

                {/* Main Card */}
                <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 ring-1 ring-white/20 shadow-2xl animate-in slide-in-from-bottom-10 duration-700 delay-200">
                    <div className="space-y-4">
                        {/* Option 1: Login / Cloud */}
                        <button
                            onClick={() => navigate('/login')}
                            className="group w-full bg-white hover:bg-indigo-50 text-indigo-600 p-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-between active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                                    <LogIn size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm text-gray-500 font-normal">Sync across devices</span>
                                    <span>Login / Signup</span>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </button>

                        <div className="flex items-center gap-4 py-2">
                            <div className="h-px bg-white/20 flex-1"></div>
                            <span className="text-indigo-200 text-sm font-medium">OR</span>
                            <div className="h-px bg-white/20 flex-1"></div>
                        </div>

                        {/* Option 2: Guest */}
                        <button
                            onClick={handleGuestLogin}
                            disabled={loading}
                            className="group w-full bg-indigo-900/40 hover:bg-indigo-900/60 text-white p-4 rounded-2xl font-bold text-lg ring-1 ring-white/10 hover:ring-white/30 transition-all flex items-center justify-between active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-full text-indigo-300 group-hover:bg-white/20 transition-colors">
                                    <UserCircle size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm text-indigo-300 font-normal">Local Only</span>
                                    <span>{loading ? 'Setting up...' : 'Continue as Guest'}</span>
                                </div>
                            </div>
                            {!loading && <ArrowRight size={20} className="text-indigo-400 group-hover:text-white transition-colors" />}
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-indigo-200/80 max-w-xs leading-relaxed">
                    Track your expenses, manage subscriptions, and stay debt-free.
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
