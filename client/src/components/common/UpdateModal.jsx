import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { triggerConfetti } from '../../utils/confettiUtils';

// Fallback content if remote config is empty
const DEFAULT_CONTENT = {
    title: "Premium Experience Upgrade",
    description: "Welcome to the new standard. we have overhauled the UI to give you a midnight luxury experience.",
    features: [
        "✨ Midnight Luxury Theme: A deep, sophisticated dark mode.",
        "🎨 Glassmorphism & Micro-interactions: Every touch feels alive.",
        "🛠️ Developer Profile: Meet the creator behind SpendWise.",
        "🔒 Enhanced Security: Bank-grade encryption visual updates.",
        "🚀 Performance Boost: Faster load times and smoother animations."
    ]
};

const UpdateModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { version, featureBanner } = useSelector((state) => state.app);

    useEffect(() => {
        // If version is not yet loaded, don't show
        if (!version) return;

        const lastSeenVersion = localStorage.getItem('lastSeenVersion');

        // Check if we need to show the modal
        if (lastSeenVersion !== version) {
            // Delay slightly for dramatic effect
            const timer = setTimeout(() => {
                setIsOpen(true);
                triggerConfetti();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [version]);

    const handleClose = () => {
        if (version) {
            localStorage.setItem('lastSeenVersion', version);
        }
        setIsOpen(false);
    };

    // Use remote config content if available, otherwise fallback
    const title = featureBanner?.detailTitle || DEFAULT_CONTENT.title;
    const description = featureBanner?.detailDesc || DEFAULT_CONTENT.description;
    // For features list, we currently use static as remote config doesn't support arrays easily yet
    const features = DEFAULT_CONTENT.features;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-all"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Header Background - Deep Emerald/Slate Gradient (No Purple) */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900"></div>

                        {/* Ambient Glows */}
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute top-10 left-[-50px] w-64 h-64 bg-slate-700/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative pt-12 px-6 sm:px-8 pb-8 overflow-y-auto custom-scrollbar z-10">
                            {/* Icon */}
                            <div className="w-24 h-24 mx-auto bg-slate-900 rounded-3xl p-2 mb-6 border border-white/10 shadow-2xl shadow-black relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-inner border border-white/20">
                                    <Sparkles size={40} className="drop-shadow-md" />
                                </div>
                            </div>

                            <CloseButton onClick={handleClose} />

                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[11px] font-bold mb-4 uppercase tracking-widest"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    New in v{version}
                                </motion.div>
                                <motion.h2
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-bold text-white mb-3 tracking-tight leading-tight"
                                >
                                    {title}
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto font-medium"
                                >
                                    {description}
                                </motion.p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {features.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.5 }}
                                        className="flex gap-4 text-sm text-slate-300 items-start bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.06] transition-colors group"
                                    >
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={12} className="text-emerald-400" strokeWidth={3} />
                                        </div>
                                        <span className="leading-snug">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                onClick={handleClose}
                                className="w-full bg-white text-slate-900 font-extrabold py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-xl shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Awesome, Let's Go
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const CloseButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-4 right-4 p-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-full backdrop-blur-md transition-all z-20 border border-white/5"
    >
        <X size={20} />
    </button>
);

export default UpdateModal;
