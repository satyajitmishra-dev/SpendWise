import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupInit, verifyOtp, clearError, syncGuestData } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, User, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

const SignupPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, otpSent } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        status: 'student',
        currency: 'INR'
    });
    // Explicitly reset error on mount/unmount
    // useEffect(() => { return () => dispatch(clearError()); }, [dispatch]); // Optional refinement

    const [otp, setOtp] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return toast.error("Please fill all fields");

        const result = await dispatch(signupInit(formData));
        if (signupInit.fulfilled.match(result)) {
            toast.success("OTP sent to your email!");
        } else {
            toast.error(result.payload?.msg || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter OTP");

        const result = await dispatch(verifyOtp({ email: formData.email, otp }));
        if (verifyOtp.fulfilled.match(result)) {
            // Trigger Sync for new users too (if they did guest things before signup)
            await dispatch(syncGuestData());

            toast.success("Account created successfully!");
            navigate('/');
        } else {
            toast.error(result.payload?.msg || "Verification failed");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row">
            {/* Left Side - Visual */}
            <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-indigo-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <Sparkles className="text-yellow-300" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">SpendWise</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Master your money,<br />Student style.</h1>
                    <p className="text-indigo-100 text-lg max-w-md">Join thousands of students managing their expenses, loans, and subscriptions smarter.</p>
                </div>

                <div className="relative z-10 flex gap-4 text-sm font-medium text-indigo-200">
                    <span className="flex items-center gap-2"><ShieldCheck size={16} /> Secure & Private</span>
                    <span className="flex items-center gap-2"><Sparkles size={16} /> Free Forever</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-900">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400">Enter your details to get started.</p>
                    </div>

                    {/* Explicit Error Box */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">Error:</span> {typeof error === 'string' ? error : error.msg || "Something went wrong"}
                            </div>
                            {(typeof error === 'string' && error.includes('exists')) || (error.msg && error.msg.includes('exists')) ? (
                                <Link to="/login" className="text-indigo-600 font-bold hover:underline ml-1">
                                    → Login instead?
                                </Link>
                            ) : null}
                        </div>
                    )}


                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        placeholder="john@college.edu"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Continue</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in slide-in-from-right duration-300">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm mb-4">
                                OTP sent to <b>{formData.email}</b>. Please check your inbox (and spam).
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center text-2xl font-bold tracking-widest dark:text-white"
                                    placeholder="••••••"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    'Verify & Signup'
                                )}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
