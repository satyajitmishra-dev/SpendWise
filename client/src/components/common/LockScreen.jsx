import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPasscode, logout } from '../../store/slices/authSlice';
import { toast } from 'sonner';
import { Shield, Delete, LogOut, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LockScreen = () => {
    const dispatch = useDispatch();
    const { user, isAppLocked } = useSelector((state) => state.auth);
    const [passcode, setPasscode] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorShake, setErrorShake] = useState(0);

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
            // toast handled by api interceptor
            if (navigator.vibrate) navigator.vibrate(200); // Vibrate for 200ms
            setPasscode('');
            setErrorShake(prev => prev + 1); // Trigger shake
        } finally {
            setLoading(false);
        }
    };

    // Auto submit when length reached
    useEffect(() => {
        if (passcode.length === expectedLength) {
            handleSubmit();
        }
    }, [passcode, expectedLength]);

    // Keyboard Support
    useEffect(() => {
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
    }, [loading, passcode.length, expectedLength]);

    if (!isAppLocked) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[10000] bg-indigo-900/90 dark:bg-slate-950/90 flex flex-col items-center justify-center p-6 text-white"
            >
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

                    {/* Dots display */}
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

                    {/* Numpad */}
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
                            {/* Empty or auxiliary button */}
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

                    <button
                        onClick={() => dispatch(logout())}
                        className="mt-8 flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm font-medium py-2 px-4 rounded-full hover:bg-white/5"
                    >
                        <LogOut size={16} /> Logout
                    </button>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 z-50 backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LockScreen;
