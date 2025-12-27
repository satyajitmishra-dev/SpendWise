import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, FileQuestion, ChevronRight, Bug, Shield, ExternalLink, Code, ArrowRight, BookOpen, LifeBuoy } from 'lucide-react';
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

            <div className="p-4 md:p-8 max-w-3xl mx-auto relative z-10 pb-20">
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
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">How can we support you today?</p>
                    </div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {/* 1. Main Hero Card - Contact Support */}
                    <motion.div variants={item}>
                        <button
                            onClick={() => {
                                handleHaptic();
                                navigate('/contact-support');
                            }}
                            className="w-full bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 border border-white/20 relative overflow-hidden group text-left"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Response time: ~24h
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Need Direct Support?</h2>
                                    <p className="text-indigo-100 text-sm max-w-md leading-relaxed">
                                        Our support team is here to help with account issues, premium features, and technical problems.
                                    </p>
                                </div>
                                <div className="shrink-0">
                                    <div className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 group-hover:gap-3 transition-all w-fit">
                                        <Mail size={18} />
                                        Contact Us
                                        <ArrowRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </motion.div>

                    {/* 2. Grid for Sub-Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* FAQ */}
                        <motion.button
                            variants={item}
                            onClick={() => {
                                handleHaptic();
                                navigate('/faq');
                            }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-900 transition-all group text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <BookOpen size={80} className="text-sky-500" />
                            </div>
                            <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/30 text-sky-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FileQuestion size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Knowledge Base</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Common questions & guides</p>
                        </motion.button>

                        {/* Report Bug */}
                        <motion.button
                            variants={item}
                            onClick={() => {
                                handleHaptic();
                                navigate('/contact-support', { state: { type: 'Bug / App Crash' } });
                            }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all group text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <Bug size={80} className="text-red-500" />
                            </div>
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Bug size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Report a Bug</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve the app</p>
                        </motion.button>

                        {/* App Info */}
                        <motion.button
                            variants={item}
                            onClick={() => {
                                handleHaptic();
                                navigate('/development');
                            }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group text-left relative overflow-hidden md:col-span-2"
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 right-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 hidden md:block">
                                <Code size={100} className="text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Code size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">App Info & Version</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">View changelog and developer info</p>
                                </div>
                                <div className="ml-auto md:hidden">
                                    <ChevronRight size={20} className="text-gray-300" />
                                </div>
                            </div>
                        </motion.button>
                    </div>


                </motion.div>

                {/* Footer Links */}
                <motion.div
                    variants={item}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex flex-col items-center justify-center gap-4 text-center opacity-60"
                >
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-slate-600">
                        <Shield size={12} />
                        <span>Secure & Encrypted</span>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-[11px] text-gray-400 dark:text-slate-600 font-medium uppercase tracking-wider">
                        <button className="hover:text-indigo-500 transition-colors">Privacy</button>
                        <button className="hover:text-indigo-500 transition-colors">Terms</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HelpPage;
