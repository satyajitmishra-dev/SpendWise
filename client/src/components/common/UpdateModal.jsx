import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, CheckCircle2, Megaphone, Snowflake, ScanLine, MessageSquare } from 'lucide-react';
import { triggerConfetti } from '../../utils/confettiUtils';

// Fallback content if remote config is empty
const DEFAULT_CONTENT = {
    title: "🚀 AI Features Coming Soon!",
    description: "Get ready for the most powerful update yet. SpendWise is getting smarter with cutting-edge AI capabilities.",
    features: [
        "🤖 AI-Powered Insights: Get intelligent spending patterns and recommendations.",
        "📸 Smart Receipt Scanning: Snap a photo, AI extracts all details instantly.",
        "💬 Natural Language Entry: Just type 'Lunch 200' - AI handles the rest.",
        "🧠 Predictive Budgeting: AI learns your habits and suggests optimal budgets.",
        "✨ Coming Very Soon: Stay tuned for the AI revolution in expense tracking!"
    ]
};

const UpdateModal = ({ isOpen, onClose }) => {
    const { version, featureBanner } = useSelector((state) => state.app);

    const handleClose = () => {
        if (version) {
            localStorage.setItem(`spendwise_update_seen_${version}`, 'true');
        }
        if (onClose) {
            onClose();
        }
    };

    // Use remote config content if available, otherwise fallback
    const title = featureBanner?.detailTitle || DEFAULT_CONTENT.title;
    const description = featureBanner?.detailDesc || DEFAULT_CONTENT.description;
    const imageUrl = featureBanner?.imageUrl || DEFAULT_CONTENT.imageUrl;
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
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-all"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-cyan-900/50 rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col group"
                    >
                        {/* Header Background - Deep Winter Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0B1A2E] via-slate-900 to-slate-900"></div>

                        {/* Frost Texture Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

                        {/* Ambient Winter Glows */}
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse-glow"></div>
                        <div className="absolute top-10 left-[-50px] w-64 h-64 bg-slate-700/30 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative pt-12 px-6 sm:px-8 pb-8 overflow-y-auto custom-scrollbar z-10">
                            {/* Icon */}
                            {/* Image or Icon */}
                            {imageUrl ? (
                                <div className="w-full h-48 mb-8 rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/10 group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10" />
                                    <img
                                        src={imageUrl}
                                        alt="New Feature"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 mx-auto bg-slate-900/50 rounded-3xl p-2 mb-6 border border-cyan-500/20 shadow-2xl shadow-black relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-full bg-gradient-to-br from-[#0e2a47] to-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 shadow-inner border border-white/5 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50" />
                                        <Megaphone size={40} className="drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] relative z-10" />
                                        <Snowflake size={20} className="absolute top-3 right-3 text-white/30 animate-spin-slow" />
                                    </div>
                                </div>
                            )}

                            <CloseButton onClick={handleClose} />

                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-950/50 border border-cyan-500/30 rounded-full text-cyan-300 text-[11px] font-bold mb-4 uppercase tracking-widest backdrop-blur-sm"
                                >
                                    <Snowflake size={10} className="animate-spin-slow" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse hidden"></span>
                                    Winter Update v{version}
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
