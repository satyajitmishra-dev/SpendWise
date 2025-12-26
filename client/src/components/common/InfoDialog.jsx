import { X, Info, WifiOff, ShieldCheck, Smartphone, Database, ArrowRight, Search, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const InfoDialog = ({ isOpen, onClose }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { version } = useSelector((state) => state.app);
    const navigate = useNavigate();

    // Determine if guest (no email or not authenticated)
    const isGuest = !isAuthenticated || (user && !user.email);

    if (!isOpen) return null;

    // Features based on Guest/User state
    const features = isGuest ? [
        {
            icon: WifiOff,
            title: "Truly Offline",
            desc: "Your data lives on your device. No internet required.",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
        },
        {
            icon: ShieldCheck,
            title: "Zero Login",
            desc: "Jump straight into guest mode. No passwords needed.",
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            icon: Smartphone,
            title: "App Feel",
            desc: "Optimized for mobile. Add to Home Screen for best experience.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        }
    ] : [
        {
            icon: Search,
            title: "Smart Search",
            desc: "Find expenses instantly with the new Search & Date Filters.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            icon: Copy,
            title: "Quick Duplicate",
            desc: "Swipe or click to duplicate recurring expenses in seconds.",
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            icon: Smartphone,
            title: "Cross Platform",
            desc: `Access your finances from any device, anywhere. Now v${version}!`,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Dialog Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-[#0F172A] dark:bg-[#020617] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Content Container */}
                <div className="flex flex-col items-center pt-10 pb-8 px-8 relative">

                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none"></div>

                    {/* App Icon */}
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20 z-10 relative">
                            <Info size={36} className="text-white" />
                        </div>
                        {/* Glow under icon */}
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40"></div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">SpendWise</h2>

                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-10">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase">
                            Student Edition
                        </span>
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] font-bold tracking-widest uppercase">
                            v{version}
                        </span>
                    </div>

                    {/* Feature List */}
                    <div className="w-full space-y-6 mb-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center shrink-0`}>
                                    <feature.icon size={22} className={feature.color} />
                                </div>
                                <div className="pt-0.5">
                                    <h3 className="text-white font-bold text-base mb-1">{feature.title}</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3">
                        {isGuest && (
                            <button
                                onClick={() => { onClose(); navigate('/signup'); }}
                                className="w-full bg-orange-500 text-white py-4 rounded-3xl font-bold text-lg hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                            >
                                <Database size={20} /> Save Data Permanently
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full bg-white text-gray-900 py-4 rounded-3xl font-bold text-lg hover:bg-gray-100 active:scale-95 transition-all shadow-lg shadow-white/5"
                        >
                            Awesome!
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default InfoDialog;
