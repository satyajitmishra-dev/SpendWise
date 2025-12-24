import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSendOtp, verifyOtp, syncGuestData } from '../store/slices/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
            await dispatch(syncGuestData());
            toast.success("Welcome back!");
            navigate('/');
        } else {
            toast.error(result.payload?.msg || "Verification failed");
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6">

            {/* Ambient Lighting */}
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[100px]"></div>


            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Back Link */}
                <div className="text-center mb-8">
                    <Link to="/welcome" className="inline-block mb-6">
                        <img src="/logo1.svg" alt="SpendWise" className="w-16 h-16 object-contain drop-shadow-2xl" />
                    </Link>
                    <h2 className="text-3xl font-medium text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 mt-2 text-sm">Enter your email to access your account</p>
                </div>

                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                                        placeholder="you@university.edu"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-slate-950 h-12 rounded-full font-semibold text-base hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Continue <ArrowRight size={18} className="inline opacity-60 ml-1" /></span>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in">
                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs text-center">
                                OTP sent to <span className="text-white font-medium">{email}</span>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-center text-2xl font-medium tracking-[0.5em] text-white"
                                    placeholder="••••••"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-slate-950 h-12 rounded-full font-semibold text-base hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Login'}
                            </button>

                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                Use a different email
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Don't have an account? <Link to="/signup" className="text-white font-medium hover:text-indigo-400 transition-colors">Create one</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
