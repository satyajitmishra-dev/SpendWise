import { useState } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const OfflinePage = () => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-6">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 max-w-md w-full"
            >
                {/* Main Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-10 shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                            <div className="relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-5 rounded-2xl border border-blue-500/20">
                                <WifiOff className="w-12 h-12 text-blue-400" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center mb-3 text-white">
                        No Connection
                    </h1>

                    {/* Description */}
                    <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed">
                        Unable to reach the server. Please check your internet connection and try again.
                    </p>

                    {/* Retry Button */}
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
                        />
                        <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900/50 px-3 text-slate-500">
                                Common Issues
                            </span>
                        </div>
                    </div>

                    {/* Tips List */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm text-slate-400">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-slate-500 flex-shrink-0" />
                            <span>Check your Wi-Fi or mobile data</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-400">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-slate-500 flex-shrink-0" />
                            <span>Verify network signal strength</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-400">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-slate-500 flex-shrink-0" />
                            <span>Try disabling VPN if active</span>
                        </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span>Offline Mode</span>
                </div>
            </motion.div>
        </div>
    );
};

export default OfflinePage;
