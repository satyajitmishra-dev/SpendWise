import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSendOtp, verifyOtp, syncGuestData } from '../store/slices/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, otpSent } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
            // Optional: Auto-submit? No, let user confirm.
            toast.info("Please login to continue.");
        }
    }, [location.state]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        const result = await dispatch(loginSendOtp(email));
        if (loginSendOtp.fulfilled.match(result)) {
            toast.success("OTP sent to your email!");
        } else {
            const msg = result.payload?.msg || "Failed to send OTP";
            if (msg.toLowerCase().includes("not found")) {
                toast.error("Account not found. Redirecting to Signup...", { duration: 2000 });
                setTimeout(() => navigate('/signup', { state: { email } }), 1500);
                return;
            }
            toast.error(msg);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter OTP");

        const result = await dispatch(verifyOtp({ email, otp }));
        if (verifyOtp.fulfilled.match(result)) {
            // Trigger Sync
            await dispatch(syncGuestData());
            toast.success("Welcome back!");
            navigate('/');
        } else {
            toast.error(result.payload?.msg || "Verification failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800">
                <Link to="/welcome" className="flex items-center gap-2 mb-8 justify-center group">
                    <img src="/logo1.svg" alt="SpendWise Logo" className="w-16 h-16 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300 ease-out cursor-pointer" />
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">SpendWise</span>
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Login to access your expenses</p>
                </div>

                {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                    placeholder="somu@abc.com"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 dark:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-black dark:hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send OTP</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm mb-4">
                            OTP sent to <b>{email}</b>. Please check your inbox (and spam).
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center text-2xl font-bold tracking-widest dark:text-white"
                                placeholder="••••••"
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full text-sm text-gray-400 font-medium hover:text-gray-600"
                        >
                            Use a different email
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
                    <p className="text-sm text-gray-500">
                        New here? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
