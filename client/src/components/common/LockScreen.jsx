import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPasscode, logout, loadUser } from '../../store/slices/authSlice';
import { toast } from 'sonner';
import { Shield, Delete, LogOut, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPasscode, resetPasscode } from '../../store/slices/authSlice';

const ForgotPasscodeView = ({ onCancel }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [otp, setOtp] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

    useEffect(() => {
        let interval;
        if (isSent && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSent, resendTimer]);

    const handleSend = async () => {
        setLoading(true);
        try {
            await dispatch(forgotPasscode()).unwrap();
            setIsSent(true);
            setResendTimer(30);
        } catch (err) {
            // Toast handled in thunk
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            await dispatch(forgotPasscode()).unwrap();
            toast.success("Code resent successfully");
            setResendTimer(30);
        } catch (err) {
            toast.error("Failed to resend code");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(resetPasscode(otp)).unwrap();
            // Success handles itself (unlocks app)
        } catch (err) {
            // Toast handled
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md shadow-2xl">
                <Shield size={40} className="text-white drop-shadow-md" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Forgot Passcode?</h2>

            {!isSent ? (
                <>
                    <p className="text-white/60 text-center mb-8 text-sm px-4">
                        We can send a verification code to <strong>{user?.email}</strong> to reset your App Lock.
                    </p>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 mb-4"
                    >
                        {loading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </>
            ) : (
                <form onSubmit={handleVerify} className="w-full">
                    <p className="text-white/60 text-center mb-6 text-sm">
                        Enter the 6-digit code sent to your email.
                    </p>
                    <input
                        className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-center text-2xl tracking-[0.5em] font-medium placeholder:tracking-normal focus:outline-none focus:bg-white/20 transition-all mb-6"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-indigo-900 font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 mb-4"
                    >
                        {loading ? 'Verifying...' : 'Reset Passcode'}
                    </button>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || loading}
                        className="w-full text-xs text-center text-white/40 hover:text-white mb-2 disabled:text-white/20 disabled:cursor-not-allowed transition-colors"
                    >
                        {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Verification Code'}
                    </button>
                </form>
            )}

            <button onClick={onCancel} className="text-white/60 hover:text-white text-sm font-medium">Cancel</button>
        </div>
    );
};

const LockScreen = () => {
    const dispatch = useDispatch();
    const { user, isAppLocked } = useSelector((state) => state.auth);
    const [passcode, setPasscode] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorShake, setErrorShake] = useState(0);
    const [showForgot, setShowForgot] = useState(false);

    const expectedLength = user?.passcodeLength || 4;

    const handleNumberClick = (num) => {
        if (passcode.length < expectedLength) {
            setPasscode(prev => prev + num);
        }
    };

    const handleDelete = () => {
        setPasscode(prev => prev.slice(0, -1));
    };

    const handleSubmit = async () => {
        if (passcode.length !== expectedLength) return;

        setLoading(true);
        try {
            await dispatch(verifyPasscode(passcode)).unwrap();
            // App will unlock via state change
        } catch (err) {
            // Err object from rejectWithValue
            const msg = err?.msg || 'Verification failed';

            if (msg === 'Passcode not enabled') {
                // Backend says disabled, so unlock frontend
                toast.info('Passcode was disabled everywhere');
                dispatch(loadUser());
                return;
            }

            // Normal Incorrect Passcode
            if (navigator.vibrate) navigator.vibrate(200);
            setPasscode('');
            setErrorShake(prev => prev + 1);
            // Optional: Show small visual hint instead of big toast
        } finally {
            setLoading(false);
        }
    };

    // Auto submit when length reached
    useEffect(() => {
        if (!isAppLocked || !user?.isPasscodeEnabled) return;
        if (passcode.length === expectedLength) {
            handleSubmit();
        }
    }, [passcode, expectedLength, isAppLocked, user?.isPasscodeEnabled]);

    // Keyboard Support
    useEffect(() => {
        if (!isAppLocked || !user?.isPasscodeEnabled) return;

        const handleKeyDown = (e) => {
            if (loading) return;

            if (e.key >= '0' && e.key <= '9') {
                handleNumberClick(parseInt(e.key));
            } else if (e.key === 'Backspace') {
                handleDelete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [loading, passcode.length, expectedLength, isAppLocked, user?.isPasscodeEnabled]);

    // Safety check: Don't show if not locked OR if user hasn't enabled passcode
    if (!isAppLocked || !user?.isPasscodeEnabled) return null;



    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[10000] bg-indigo-900/90 dark:bg-slate-950/90 flex flex-col items-center justify-center p-6 text-white"
            >
                {!showForgot ? (
                    <div className="flex flex-col items-center w-full max-w-md">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="mb-8 flex flex-col items-center"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md shadow-2xl shadow-indigo-500/20 border border-white/10 ring-1 ring-white/20">
                                <Lock size={40} className="text-indigo-200 drop-shadow-md" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                            <p className="text-indigo-200/60 mt-2 font-medium">{user?.name || 'SpendWise User'}</p>
                        </motion.div>

                        <motion.div
                            animate={{ x: errorShake % 2 === 0 ? 0 : [-10, 10, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                            className="flex gap-4 mb-8 md:mb-12 h-6 items-center"
                        >
                            {[...Array(expectedLength)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        scale: i < passcode.length ? 1.2 : 1,
                                        backgroundColor: i < passcode.length ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.2)",
                                        boxShadow: i < passcode.length ? "0 0 15px rgba(255,255,255,0.5)" : "none"
                                    }}
                                    className="w-4 h-4 rounded-full border border-white/10"
                                />
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-[240px] md:max-w-[280px] mb-6 md:mb-8"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <motion.button
                                    key={num}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                                    whileTap={{ scale: 0.95, backgroundColor: "rgba(255,255,255,0.2)" }}
                                    onClick={() => handleNumberClick(num)}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-2xl md:text-3xl font-semibold transition-colors border border-white/5 shadow-lg shadow-black/10"
                                >
                                    {num}
                                </motion.button>
                            ))}
                            <div className="flex items-center justify-center">
                                {/* Empty */}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                                whileTap={{ scale: 0.95, backgroundColor: "rgba(255,255,255,0.2)" }}
                                onClick={() => handleNumberClick(0)}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-2xl md:text-3xl font-semibold transition-colors border border-white/5 shadow-lg shadow-black/10"
                            >
                                0
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, color: "#fee2e2" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDelete}
                                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                            >
                                <Delete size={32} />
                            </motion.button>
                        </motion.div>

                        <div className="flex items-center gap-6 mt-4">
                            <button
                                onClick={() => {
                                    setShowForgot(true);
                                }}
                                className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                            >
                                Forgot Passcode?
                            </button>
                            <div className="w-px h-4 bg-white/20"></div>
                            <button
                                onClick={() => dispatch(logout())}
                                className="flex items-center gap-2 text-white/60 hover:text-red-300 transition-colors text-sm font-medium"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <ForgotPasscodeView onCancel={() => setShowForgot(false)} />
                )}

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 z-50 backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default LockScreen;
