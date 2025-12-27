import { useState, useEffect } from 'react';
import { X, Download, Zap, WifiOff, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = ({ isOpen, onClose }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone
            || document.referrer.includes('android-app://');

        if (isStandalone) {
            return; // Don't show if already installed
        }

        // Listen for beforeinstallprompt event
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {

        }

        setDeferredPrompt(null);
        setIsInstallable(false);
        onClose();
    };

    const handleDismiss = () => {
        // Mark that user has dismissed this prompt
        localStorage.setItem('installPromptDismissed', 'true');
        onClose();
    };

    // Don't show if not installable or not open
    if (!isOpen || !isInstallable) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 md:items-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleDismiss}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Prompt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="relative w-full max-w-md bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh]"
                >
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mb-6 shadow-lg">
                            <Download size={36} className="text-white" strokeWidth={2.5} />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Install SpendWise
                        </h2>

                        {/* Subtitle */}
                        <p className="text-white/80 text-sm mb-6">
                            Add to your home screen for the best experience!
                        </p>

                        {/* Benefits */}
                        <div className="space-y-3 mb-8 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <Zap size={18} className="text-yellow-300" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">Lightning Fast</p>
                                    <p className="text-white/70 text-xs">Instant loading, no delays</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <WifiOff size={18} className="text-blue-300" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">Works Offline</p>
                                    <p className="text-white/70 text-xs">Track expenses anytime, anywhere</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <Rocket size={18} className="text-green-300" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">Native Feel</p>
                                    <p className="text-white/70 text-xs">App-like experience on your device</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={handleInstall}
                                className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold text-base hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
                            >
                                Install Now
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="w-full text-white/80 hover:text-white py-2 text-sm font-medium transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InstallPrompt;
