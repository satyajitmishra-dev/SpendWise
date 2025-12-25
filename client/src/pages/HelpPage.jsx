import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, FileQuestion, ChevronRight, Bug, Shield, ExternalLink, Code, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HelpPage = () => {
    const navigate = useNavigate();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const handleHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(10);
    };

    return (
        <div className="min-h-screen relative w-full overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-500">
            {/* Simple Background - Matches Home */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="p-4 md:p-8 max-w-2xl mx-auto relative z-10 pb-20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            handleHaptic();
                            navigate(-1);
                        }}
                        className="p-3 rounded-full bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-5" // Increased spacing
                >
                    {/* 1. Main Help Card (Updated Copy & Trust) */}
                    <motion.div variants={item}>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
                            {/* Subtle decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/20 transition-colors duration-500"></div>

                            <div className="relative z-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Need help right now?</h2>
                                <p className="text-sm font-medium text-emerald-500 mb-6 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-3 py-1.5 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Usually replies within 24 hours
                                </p>
                                <button
                                    onClick={() => {
                                        handleHaptic();
                                        navigate('/contact-support');
                                    }}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 w-fit group-hover:gap-3"
                                >
                                    <Mail size={18} />
                                    Contact Support
                                    <ArrowRight size={16} className="opacity-70 ml-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Popular Questions (Updated Subtext) */}
                    <motion.button
                        variants={item}
                        onClick={() => {
                            handleHaptic();
                            navigate('/faq');
                        }}
                        className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-sm active:scale-[0.99] group min-h-[80px]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl group-hover:scale-110 transition-transform">
                                <FileQuestion size={22} />
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-gray-900 dark:text-white block">Popular Questions</span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">5 quick answers to common issues</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    </motion.button>

                    {/* 3. App Info (Renamed from Development) */}
                    <motion.button
                        variants={item}
                        onClick={() => {
                            handleHaptic();
                            navigate('/development');
                        }}
                        className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-sm active:scale-[0.99] group min-h-[80px]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                                <Code size={22} />
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-gray-900 dark:text-white block">App Info</span>
                                <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    App running smoothly • v1.0.3
                                </span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    </motion.button>

                    {/* 4. Report a Bug (Friendly Copy) */}
                    <motion.button
                        variants={item}
                        onClick={() => {
                            handleHaptic();
                            navigate('/contact-support', { state: { type: 'Bug / App Crash' } });
                        }}
                        className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/50 transition-all hover:shadow-sm active:scale-[0.99] group mt-6 min-h-[80px]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl group-hover:scale-110 transition-transform">
                                <Bug size={22} />
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-gray-900 dark:text-white block">Report a Bug</span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Something not working? Let us know.</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 dark:text-slate-600 group-hover:text-red-500 transition-colors" />
                    </motion.button>
                </motion.div>

                {/* Footer Trust Section (Refined) */}
                <motion.div
                    variants={item}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800/50 text-center opacity-70"
                >
                    <p className="text-xs font-semibold text-gray-400 dark:text-slate-600 mb-2">
                        App Version 1.0.3
                    </p>
                    <div className="flex items-center justify-center gap-6 text-[11px] text-gray-400 dark:text-slate-600 font-medium uppercase tracking-wider">
                        <button className="hover:text-indigo-500 transition-colors min-h-[30px] flex items-center">Privacy Policy</button>
                        <button className="hover:text-indigo-500 transition-colors min-h-[30px] flex items-center">Terms of Service</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HelpPage;
