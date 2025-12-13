import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsGuest } from '../store/slices/authSlice';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const WelcomeScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const handleGuestLogin = async () => {
        // For now, hardcode guest/student. In real app, might ask before.
        const result = await dispatch(loginAsGuest({
            name: 'Guest',
            status: 'student',
            currency: 'INR',
            budget: 0
        }));

        if (loginAsGuest.fulfilled.match(result)) {
            navigate('/onboarding');
        } else {
            // Show error if guest login fails
            import('sonner').then(({ toast }) => {
                toast.error(result.payload?.msg || "Guest login failed. Please try again.");
            });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-indigo-600 text-white max-w-md mx-auto relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="flex-1 flex flex-col justify-center items-center px-8 z-10 text-center">
                <div className="bg-white/10 p-4 rounded-2xl mb-8 backdrop-blur-sm ring-1 ring-white/20">
                    <Sparkles size={48} className="text-yellow-300" />
                </div>

                <h1 className="text-4xl font-bold mb-4 tracking-tight">
                    SpendWise
                    <span className="block text-xl font-normal opacity-80 mt-2">Student Edition</span>
                </h1>

                <p className="text-indigo-100 text-lg mb-12 leading-relaxed">
                    Track expenses. Control subscriptions. <br />
                    Never forget borrowed money.
                </p>

                <button
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className={cn(
                        "w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-95",
                        loading && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {loading ? 'Setting up...' : 'Continue as Guest'}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </div>

            <div className="p-6 text-center z-10">
                <p className="text-xs text-indigo-300">
                    By continuing, you acknowledge this is a local-only demo.
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
