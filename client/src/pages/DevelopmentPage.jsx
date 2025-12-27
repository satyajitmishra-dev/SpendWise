import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Code, Github, Linkedin, Mail, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, X, Globe, Server, Database, Zap, Layout, Users, Star, GitFork, MapPin, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { toast } from 'sonner';

// Tech Stack Icons
const TechIcons = {
    React: <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#61DAFB]"><circle cx="0" cy="0" r="2" fill="currentColor"></circle><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="10" ry="4.5"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse></g></svg>,
    Redux: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#764ABC]"><path d="M12 2L9 7L12 12L15 7L12 2Z" fill="currentColor" /><path d="M8.5 8L4.5 9.5L8.5 16L12 12.5L8.5 8Z" fill="currentColor" opacity="0.6" /><path d="M15.5 8L19.5 9.5L15.5 16L12 12.5L15.5 8Z" fill="currentColor" opacity="0.6" /><path d="M12 13L9 22L12 19L15 22L12 13Z" fill="currentColor" opacity="0.4" /></svg>,
    Node: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#339933]"><path d="M16 3L3 10.5V21.5L16 29L29 21.5V10.5L16 3Z" fill="currentColor" opacity="0.2" /><path d="M16 5L5 11.5V20.5L16 27L27 20.5V11.5L16 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    Mongo: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#47A248]"><path d="M12 22C12 22 5 16 5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10C19 16 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 3V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    Firebase: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#FFCA28]"><path d="M4 15L10 3L13 9L4 15Z" fill="#FFA000" /><path d="M10 3L15.5 13.5L20 15L10 3Z" fill="#F57C00" /><path d="M20 15L13 9L4 15L12 22L20 15Z" fill="#FFCA28" /></svg>,
    Framer: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black dark:text-white"><path d="M4 0H20V8L12 16L4 8V0Z" fill="currentColor" /><path d="M4 16H12V24L4 16Z" fill="currentColor" opacity="0.5" /></svg>,
    Vite: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#646CFF]"><path d="M2 5L12 22L22 5L18 5L12 15L6 5H2Z" fill="currentColor" /></svg>,
    Tailwind: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#38B2AC]"><path d="M12.5 6C12.5 6 12.5 9 15.5 10.5C18.5 12 18.5 15 18.5 15C18.5 15 18.5 12 15.5 10.5C12.5 9 12.5 6 12.5 6Z" fill="currentColor" /><path d="M5.5 12C5.5 12 5.5 15 8.5 16.5C11.5 18 11.5 21 11.5 21C11.5 21 11.5 18 8.5 16.5C5.5 15 5.5 12 5.5 12Z" fill="currentColor" /></svg>,
    Vercel: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black dark:text-white"><path d="M12 1L24 22H0L12 1Z" fill="currentColor" /></svg>,
    Lucide: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#F05033]"><path d="M7 21h10" /><path d="M12 3l5 5-5 5" /><path d="M12 3v18" /></svg>,
    Axios: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5A29E4]"><path d="M11.898 2.012h.204c3.48.066 6.438 1.838 8.163 4.545l.135.216c.414.67.754 1.38 1.016 2.115l.103.295a10.027 10.027 0 01.378 1.874l.006.28.006.28c0 5.522-4.477 10-10 10-5.523 0-10-4.478-10-10 0-.28.012-.558.035-.833l.012-.132.062-.516c.03-.223.067-.444.11-.661l.08-.387C3.966 3.737 7.636 1.758 11.59 2.002z" fill="currentColor" opacity="0.4" /><path d="M18.8 8.2c-.3 1-1.3 1.6-2.3 2.1-1 .5-2.2.7-3.3.7s-2.3-.2-3.3-.7c-1-.5-2-1.1-2.3-2.1-.3-1 .2-2.1 1.1-2.6.9-.5 2-.8 3.1-1.1s2.2-.4 3.3-.4c1.1 0 2.2.1 3.3.4 1.1.2 2.2.6 3.1 1.1 .9.5 1.4 1.6 1.1 2.6z" fill="currentColor" /></svg>,
    Sonner: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-black dark:text-white"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
};

const TechItem = ({ icon, name, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 2 }}
        className="flex items-center gap-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm cursor-default group"
    >
        <div className="group-hover:animate-bounce">{icon}</div>
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{name}</span>
    </motion.div>
);

const AnimatedCounter = ({ value, label }) => {
    return (
        <div className="text-center">
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="block text-xl font-bold text-gray-900 dark:text-white"
            >
                {value}
            </motion.span>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider">{label}</span>
        </div>
    );
};

// 3D Tilt Card Component
const TiltCard = ({ children, onClose }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50"
        >
            {/* Dynamic Holographic Gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 54%)' }} />

            {children}
        </motion.div>
    );
};


const DeveloperModal = ({ isOpen, onClose, githubData }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[60]"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="w-full max-w-md pointer-events-auto perspective-1000"
                        >
                            <TiltCard onClose={onClose}>
                                {/* Header Art */}
                                <div className="h-36 bg-slate-900 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                    <div className="absolute -top-[50%] -left-[20%] w-[150%] h-[200%] bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent rotate-12 blur-3xl animate-pulse" />

                                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-red-500/20 text-white/70 hover:text-white rounded-full transition-all z-30 backdrop-blur-sm group">
                                        <X size={20} className="group-hover:rotate-90 transition-transform" />
                                    </button>
                                </div>

                                <div className="relative px-6 pb-8 -mt-20">
                                    {/* Profile Avatar with Status Ring */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="relative inline-block mb-4"
                                    >
                                        <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-40 rounded-full scale-125 animate-pulse" />
                                        <div className="w-32 h-32 bg-white dark:bg-[#0B1120] rounded-full p-2 shadow-2xl relative z-10 transition-transform hover:scale-105 duration-300">
                                            <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden relative border-4 border-white dark:border-slate-800">
                                                <img
                                                    src={githubData?.avatar_url || "https://ui-avatars.com/api/?name=Satyajit+Mishra&background=0f172a&color=fff"}
                                                    alt={githubData?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* Hireable/Online Badge */}
                                            <div className="absolute bottom-2 right-2 flex h-5 w-5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Name & Bio */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-center mb-6"
                                    >
                                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">{githubData?.name || "Satyajit Mishra"}</h2>
                                        <p className="text-emerald-500 font-bold text-sm tracking-wide uppercase mb-3 flex items-center justify-center gap-1">
                                            @{githubData?.login || "satyajitmishra-dev"}
                                            <button onClick={() => copyToClipboard(githubData?.login || "satyajitmishra-dev")} className="text-gray-400 hover:text-emerald-500 transition">
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                            {githubData?.bio || "Building digital experiences that matter."}
                                        </p>
                                    </motion.div>

                                    {/* Contribution Graph */}
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mb-8 bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-slate-700/50 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Contributions</span>
                                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Last Year</span>
                                        </div>
                                        <div className="w-full overflow-hidden rounded-lg opacity-80 hover:opacity-100 transition-opacity">
                                            <img
                                                src="https://ghchart.rshah.org/10b981/satyajitmishra-dev"
                                                alt="Satyajit's Github Chart"
                                                className="w-full h-auto object-cover dark:invert dark:hue-rotate-180"
                                            />
                                            {/* Note: The dark:invert trick works well for standard black/white charts, but for colored ones we might need a specific color. receiving '10b981' (emerald) looks good on light. 
                                                 On dark mode, if we invert, emerald becomes its complement. 
                                                 Actually, ghchart is transparent. Text is usually black/gray.
                                                 Better approach for dark mode: Just keep it as is, or use a specific dark mode URL if available. 
                                                 Since we can't detect client theme in the URL dynamically easily without a refresh or complex logic, we'll stick to a balanced color '10b981' which is visible on both. 
                                                 Text labels on the chart are usually small and gray. 
                                             */}
                                        </div>
                                    </motion.div>

                                    {/* Action Links */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href={githubData?.html_url || "https://github.com/satyajitmishra-dev"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg shadow-gray-200 dark:shadow-none hover:shadow-xl transition-all"
                                        >
                                            <Github size={20} />
                                            <span>GitHub</span>
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href="https://linkedin.com/in/satyajitmishra1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-3.5 bg-[#0077b5] text-white rounded-xl font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:shadow-xl transition-all"
                                        >
                                            <Linkedin size={20} />
                                            <span>LinkedIn</span>
                                        </motion.a>
                                    </div>

                                    {/* Location & Blog */}
                                    <div className="mt-6 flex items-center justify-center gap-4 text-xs font-semibold text-gray-400 dark:text-slate-500">
                                        {githubData?.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin size={12} /> {githubData.location}
                                            </div>
                                        )}
                                        {githubData?.blog && (
                                            <a href={githubData.blog.startsWith('http') ? githubData.blog : `https://${githubData.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-500 transition">
                                                <LinkIcon size={12} /> Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const DevelopmentPage = () => {
    const navigate = useNavigate();
    const { version } = useSelector((state) => state.app);
    const [showDevModal, setShowDevModal] = useState(false);
    const [githubData, setGithubData] = useState(null);

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                const res = await fetch('https://api.github.com/users/satyajitmishra-dev');
                if (res.ok) {
                    const data = await res.json();
                    setGithubData(data);
                }
            } catch (error) {
                console.error("Failed to fetch GitHub data", error);
            }
        };

        fetchGithubData();
    }, []);

    const isUpdateAvailable = false; // Always up to date with remote

    const handleUpdate = () => {
        toast.loading("Refreshing application...");
        localStorage.setItem('simulated_app_version', version);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    return (
        <div className="h-[100vh] h-[100dvh] bg-gray-50 dark:bg-[#020617] transition-colors duration-500 relative flex flex-col overflow-hidden">
            <DeveloperModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} githubData={githubData} />

            {/* Premium Ambient Lights - Dynamic */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-slate-300/40 dark:bg-slate-800/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Header */}
            <div className="shrink-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800/60 relative z-30 px-4 py-4 md:px-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition"
                >
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">About Development</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 relative z-20 scrollbar-hide">
                <div className="max-w-xl mx-auto space-y-8">

                    {/* App Hero Card - Ultra Premium 3D Feel */}
                    <div className="relative bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-8 text-center shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-slate-800 overflow-hidden group perspective-1000">
                        {/* Dynamic Gradient Mesh */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-transparent to-emerald-50/50 dark:from-slate-800/20 dark:to-transparent opacity-100" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30"></div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative w-32 h-32 mx-auto mb-6"
                        >
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500 p-4">
                                <img src="/logo1.svg" alt="SpendWise Logo" className="w-full h-full object-contain" />
                            </div>
                        </motion.div>

                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">SpendWise</h2>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/50 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-8 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                            <span>Student Edition</span>
                            <span className="text-gray-300 dark:text-slate-600 px-1">|</span>
                            <span>v{version}</span>
                        </div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            onClick={handleUpdate}
                            className="flex items-center justify-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-900/20 dark:text-emerald-400"
                        >
                            <div className="shrink-0 p-2 bg-emerald-200 dark:bg-emerald-900/40 rounded-full">
                                <CheckCircle2 size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">You're up to date</p>
                                <p className="text-xs opacity-80">Running version {version}</p>
                            </div>
                        </motion.div>

                        <p className="text-[10px] text-gray-400 dark:text-slate-600 font-medium uppercase tracking-[0.2em] mt-8">
                            Designed with Precision
                        </p>
                    </div>

                    {/* Developer Profile Trigger Card - Magnetic Effect */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDevModal(true)}
                        className="w-full bg-white dark:bg-[#0F172A] rounded-3xl p-1 border border-gray-100 dark:border-slate-800 shadow-lg shadow-gray-100/50 dark:shadow-none group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer z-10 pointer-events-none" />

                        <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-900/50 rounded-[1.25rem] backdrop-blur-sm">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-slate-800 overflow-hidden shadow-inner rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                        <img
                                            src={githubData?.avatar_url || "https://ui-avatars.com/api/?name=SM&background=000&color=fff"}
                                            alt="Dev"
                                            className="w-full h-full object-cover scale-110"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full shadow-sm border-2 border-white dark:border-slate-900">
                                        <Code size={12} strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        Lead Architect
                                        {githubData && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{githubData?.name || "Satyajit Mishra"}</h3>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 shadow-sm transition-colors ring-1 ring-gray-100 dark:ring-slate-700">
                                <ExternalLink size={20} />
                            </div>
                        </div>
                    </motion.button>

                    {/* Tech Stack Grid */}
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-[0.2em]">Powered By</h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-100 to-transparent dark:from-slate-800"></div>
                        </div>
                        <div className="flex flex-wrap gap-2.5 justify-center">
                            <TechItem name="React 19" icon={TechIcons.React} delay={0.1} />
                            <TechItem name="Redux" icon={TechIcons.Redux} delay={0.15} />
                            <TechItem name="Node.js" icon={TechIcons.Node} delay={0.2} />
                            <TechItem name="MongoDB" icon={TechIcons.Mongo} delay={0.3} />
                            <TechItem name="Firebase" icon={TechIcons.Firebase} delay={0.4} />
                            <TechItem name="Framer" icon={TechIcons.Framer} delay={0.45} />
                            <TechItem name="Vite" icon={TechIcons.Vite} delay={0.5} />
                            <TechItem name="Tailwind" icon={TechIcons.Tailwind} delay={0.55} />
                            <TechItem name="Vercel" icon={TechIcons.Vercel} delay={0.6} />
                            <TechItem name="Lucide" icon={TechIcons.Lucide} delay={0.65} />
                            <TechItem name="Axios" icon={TechIcons.Axios} delay={0.7} />
                            <TechItem name="Sonner" icon={TechIcons.Sonner} delay={0.75} />
                        </div>
                    </div>

                    <div className="h-4"></div>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentPage;
