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
        <div className="min-h-screen relative w-full overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
            {/* Global Ambient Background - Onyx Theme */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none dark:opacity-20"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none dark:opacity-20"></div>

            <div className="p-4 md:p-8 max-w-3xl mx-auto relative z-10 pb-24">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            handleHaptic();
                            navigate(-1);
                        }}
                        className="p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center group"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Help Center</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">How can we support you today?</p>
                    </div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {/* 1. Main Hero Card - Contact Support - Premium Gradient */}
                    <motion.div variants={item}>
                        <button
                            onClick={() => {
                                handleHaptic();
                                navigate('/contact-support');
                            }}
                            className="w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-indigo-900/20 border border-white/10 relative overflow-hidden group text-left"
                        >
                            {/* Animated Background Mesh */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-indigo-500/30 transition-all duration-700"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full text-indigo-300 text-xs font-bold border border-white/10 uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                                        Response time: ~24h
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Need Direct Support?</h2>
                                    <p className="text-slate-400 text-sm max-w-md leading-relaxed font-medium">
                                        Our dedicated team is ready to assist you with account issues, premium features, and technical inquiries.
                                    </p>
                                </div>
                                <div className="shrink-0">
                                    <div className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-white/5 flex items-center gap-3 group-hover:scale-105 active:scale-95 transition-all w-fit">
                                        <Mail size={18} />
                                        Contact Us
                                        <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
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
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all group text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 group-hover:rotate-12">
                                <BookOpen size={100} />
                            </div>
                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-indigo-100 dark:border-indigo-500/20">
                                <FileQuestion size={26} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Knowledge Base</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">Most common questions answered for you.</p>
                        </motion.button>

                        {/* Report Bug */}
                        <motion.button
                            variants={item}
                            onClick={() => {
                                handleHaptic();
                                navigate('/contact-support', { state: { type: 'Bug / App Crash' } });
                            }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-rose-500/30 dark:hover:border-rose-500/30 transition-all group text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 group-hover:-rotate-12">
                                <Bug size={100} />
                            </div>
                            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 border border-rose-100 dark:border-rose-500/20">
                                <Bug size={26} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report a Bug</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">Found a glitch? Let our engineers know.</p>
                        </motion.button>

                        {/* App Info */}
                        <motion.button
                            variants={item}
                            onClick={() => {
                                handleHaptic();
                                navigate('/development');
                            }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all group text-left relative overflow-hidden md:col-span-2 flex items-center gap-6"
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 right-12 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 hidden md:block">
                                <Code size={120} />
                            </div>
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-emerald-100 dark:border-emerald-500/20">
                                <Code size={26} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Developer Info & Version</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">View changelog, tech stack, and developer profile.</p>
                            </div>
                            <div className="ml-auto md:hidden">
                                <ChevronRight size={20} className="text-gray-300" />
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
                    className="mt-16 flex flex-col items-center justify-center gap-4 text-center opacity-60"
                >
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-slate-600 bg-gray-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                        <Shield size={12} className="text-emerald-500" />
                        <span>256-BIT ENCRYPTION</span>
                    </div>
                    <div className="flex items-center justify-center gap-8 text-[11px] text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest">
                        <button className="hover:text-indigo-500 transition-colors">Privacy Policy</button>
                        <button className="hover:text-indigo-500 transition-colors">Terms of Service</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HelpPage;
