
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsGuest } from '../store/slices/authSlice';
import { ArrowRight, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
        <div className="relative h-screen w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-between py-12 px-6">

            {/* Ambient Lighting - Even subtler for 'Clean' look */}
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[100px]"></div>



            {/* Top Section */}
            <div className="relative z-10 flex flex-col items-center text-center mt-16 space-y-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, blur: 10 }}
                    animate={{ scale: 1, opacity: 1, blur: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    {/* Refined Glow */}
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl transform scale-150"></div>
                    <img src="/logo1.svg" alt="SpendWise" className="relative w-40 h-40 object-contain drop-shadow-2xl" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="space-y-3"
                >
                    <h1 className="text-5xl font-medium text-white tracking-tight">
                        SpendWise
                    </h1>
                    <p className="text-slate-400 font-light text-sm tracking-[0.3em] uppercase">
                        Student Edition
                    </p>
                </motion.div>
            </div>

            {/* Middle Section: Typewriter Tagline */}
            <div className="flex-1 flex flex-col items-center justify-center z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-center space-y-4"
                >
                    <p className="text-2xl font-light text-white/90 leading-relaxed tracking-wide">
                        "Stop wondering where your <br /> <span className="text-indigo-400 font-normal">money went.</span>"
                    </p>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 2, duration: 1.5, ease: "easeInOut" }}
                        className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent mx-auto max-w-[100px]"
                    ></motion.div>
                </motion.div>
            </div>

            {/* Bottom Actions */}
            <motion.div
                className="relative z-10 w-full max-w-sm space-y-5 mb-safe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                {/* Minimal Primary Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="group w-full bg-white text-slate-950 h-14 rounded-full font-semibold text-lg hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/10"
                >
                    Get Started
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 opacity-60" />
                </button>

                {/* Minimal Secondary Link */}
                <button
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="w-full h-12 text-slate-400 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                    <UserCircle size={16} />
                    {loading ? 'Entering...' : 'Continue as Guest'}
                </button>
            </motion.div>

        </div>
    );
};

export default WelcomeScreen;
