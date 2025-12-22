import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupInit, verifyOtp, syncGuestData } from '../store/slices/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, otpSent } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        status: 'student',
        currency: 'INR'
    });

    useEffect(() => {
        if (location.state?.email) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
            toast.info("Please create an account to proceed.");
        }
    }, [location.state]);

    const [otp, setOtp] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return toast.error("Please fill all fields");

        const result = await dispatch(signupInit(formData));
        if (signupInit.fulfilled.match(result)) {
            toast.success("OTP sent to your email!");
        } else {
            const msg = result.payload?.msg || "Failed to send OTP";
            if (msg.toLowerCase().includes("exists")) {
                toast.error("Account already exists. Redirecting to Login...", { duration: 2000 });
                setTimeout(() => navigate('/login', { state: { email: formData.email } }), 1500);
                return;
            }
            toast.error(msg);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter OTP");

        const result = await dispatch(verifyOtp({ email: formData.email, otp }));
        if (verifyOtp.fulfilled.match(result)) {
            await dispatch(syncGuestData());
            toast.success("Account created successfully!");
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
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/welcome" className="inline-block mb-6">
                        <img src="/logo1.svg" alt="SpendWise" className="w-16 h-16 object-contain drop-shadow-2xl" />
                    </Link>
                    <h2 className="text-3xl font-medium text-white tracking-tight">Create Account</h2>
                    <p className="text-slate-400 mt-2 text-sm">Start your journey to financial freedom</p>
                </div>

                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Explicit Error Box */}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">Error:</span> {typeof error === 'string' ? error : error.msg || "Something went wrong"}
                            </div>
                            {(typeof error === 'string' && error.includes('exists')) || (error.msg && error.msg.includes('exists')) ? (
                                <Link to="/login" className="text-white font-bold hover:underline ml-1">
                                    → Login instead?
                                </Link>
                            ) : null}
                        </div>
                    )}

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                                        placeholder="you@university.edu"
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
                                OTP sent to <span className="text-white font-medium">{formData.email}</span>
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
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Create'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-white font-medium hover:text-indigo-400 transition-colors">Login</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
