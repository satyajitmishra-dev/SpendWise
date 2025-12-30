import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, Fragment, useRef } from 'react';
import {
    PieChart, ArrowRight, ExternalLink, Globe, Wallet, Activity,
    Sun, Moon, Monitor, TrendingUp, Bell, BarChart3, Check, X,
    Zap, Shield, Users, Star, Github, Twitter, Linkedin, Mail, Heart
} from 'lucide-react';
import { setTheme } from '../store/slices/themeSliceFixed';
import api from '../services/api';
import { updateUser } from '../store/slices/authSlice';
import { remoteConfig } from '../firebase';
import { fetchAndActivate, getValue } from "firebase/remote-config";

// 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ rotateX: "0deg", rotateY: "0deg" }}
            className={`relative transition-all duration-200 ease-out ${className}`}
        >
            {children}
            {/* Glossy Reflection Overlay */}
            <motion.div
                style={{
                    opacity: useTransform(mouseY, [-0.5, 0.5], [0, 0.4]),
                    background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                    transform: "translateZ(1px)"
                }}
                className="absolute inset-0 rounded-3xl pointer-events-none"
            />
        </motion.div>
    );
};

// Spotlight Card Component
const SpotlightCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 rounded-2xl"
                style={{
                    opacity,
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    maskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
                }}
            />
            {children}
        </div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { mode } = useSelector((state) => state.theme);
    const { scrollY } = useScroll();
    const [appVersion, setAppVersion] = useState("2.1.0");

    // Parallax Effects - Subtle
    const opacity = useTransform(scrollY, [0, 600], [1, 0.9]);
    const scale = useTransform(scrollY, [0, 600], [1, 0.98]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                await fetchAndActivate(remoteConfig);
                const version = getValue(remoteConfig, 'latest_version').asString();
                if (version) setAppVersion(version);
            } catch (err) {
                console.error("Failed to fetch remote config:", err);
            }
        };
        fetchConfig();
    }, []);

    const handleGetStarted = async () => {
        await markAsSeenAndNavigate('/signup');
    };

    const handleSeeLiveDemo = async () => {
        await markAsSeenAndNavigate('/welcome');
    };

    const markAsSeenAndNavigate = async (path) => {
        try {
            if (user && user.email) {
                await api.post('/auth/mark-landing-seen');
                dispatch(updateUser({ hasSeenLanding: true }));
            } else {
                localStorage.setItem('hasSeenLanding', 'true');
            }
            navigate(path);
        } catch (err) {
            console.error('Failed to mark landing as seen:', err);
            navigate(path);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 font-sans transition-colors duration-300">
            {/* "Living" Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.2, 0.3],
                        rotate: [0, 45, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 blur-[130px] dark:opacity-10"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 blur-[120px] dark:opacity-10"
                />
            </div>

            <BubbleNav mode={mode} dispatch={dispatch} onGetStarted={handleGetStarted} />

            <div className="relative z-10 w-full">
                {/* 1. Hero Section */}
                <motion.section
                    style={{ opacity, scale }}
                    className="relative min-h-[90vh] w-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-16"
                >
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="text-center max-w-4xl mx-auto mb-12">
                            <div className="relative inline-block">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
                                >
                                    Survive month <br />
                                    <span className="relative inline-block">
                                        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                            like a pro
                                        </span>
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.8, delay: 0.8, ease: "circOut" }}
                                            className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full opacity-60 origin-left"
                                        />
                                    </span>
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className="inline-block ml-2 text-emerald-500"
                                    >
                                        .
                                    </motion.span>
                                </motion.h1>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto"
                            >
                                SpendWise helps students & young professionals understand where their money goes — without spreadsheets or financial jargon.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            >
                                <button
                                    onClick={handleGetStarted}
                                    className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2"
                                >
                                    Start Tracking Free
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={handleSeeLiveDemo}
                                    className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-semibold text-lg hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                >
                                    See How It Works
                                </button>
                            </motion.div>
                        </div>

                        {/* 3D Tilt Dashboard Preview */}
                        <div className="perspective-1000">
                            <TiltCard className="max-w-5xl mx-auto cursor-default">
                                <DashboardPreview />
                            </TiltCard>
                        </div>
                    </div>
                </motion.section>

                {/* 2. Social Proof Section */}
                <section className="relative bg-white dark:bg-slate-900 py-16 sm:py-20 border-y border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-full text-emerald-700 dark:text-emerald-400 font-semibold mb-6">
                                <Users size={18} />
                                Used by 5,000+ students
                            </div>
                        </div>
                    </div>

                    {/* Infinite Carousel */}
                    <div className="relative w-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

                        <motion.div
                            className="flex gap-6 w-max pl-6"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                duration: 80,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                            onHoverStart={() => { }} // Framer Motion sometimes needs handlers to trigger interactions
                        >
                            {/* Duplicate list for seamless loop - Tripled for smoothness on wide screens */}
                            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
                                <SpotlightCard key={i} className="w-[350px] flex-shrink-0 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 backdrop-blur-sm cursor-pointer group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed text-sm">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                            {testimonial.initials}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{testimonial.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* 3. Problem Section */}
                <section className="relative py-20 sm:py-24 bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                Sound familiar?
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400">You're not alone. These are the top money struggles students face.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                            {problems.map((problem, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm backdrop-blur-sm"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                                        <X size={24} className="text-red-500 dark:text-red-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{problem.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{problem.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Solution/Features Section */}
                <section className="relative py-20 sm:py-24 bg-slate-50 dark:bg-slate-950/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                SpendWise makes it simple
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need. Nothing you don't.</p>
                        </div>

                        <div className="relative space-y-8 sm:space-y-0">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.6 }}
                                    className="sticky top-28 sm:top-32"
                                    style={{
                                        paddingBottom: `${(features.length - i) * 1.5}rem`, // Give spacing at bottom
                                        zIndex: i
                                    }}
                                >
                                    <SpotlightCard className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-sm ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''} bg-white dark:bg-slate-900`}>
                                        {/* Feature Content */}
                                        <div className="flex-1">
                                            <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                                                <feature.icon className="text-white" size={32} />
                                            </div>
                                            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{feature.title}</h3>
                                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{feature.description}</p>
                                            <ul className="space-y-3">
                                                {feature.benefits.map((benefit, j) => (
                                                    <li key={j} className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <span className="text-slate-700 dark:text-slate-300 text-lg">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Feature Visual */}
                                        <div className="flex-1 w-full relative">
                                            {/* Inner card for visual with subtle contrast */}
                                            <div className="relative p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                                <FeatureVisual type={feature.visual} />
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. Differentiation Section */}
                <section className="relative py-20 sm:py-24 bg-white dark:bg-slate-900">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                Why SpendWise is different
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400">Built for students, not finance experts</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-700 backdrop-blur-sm">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center pb-6 border-b-2 border-slate-200 dark:border-slate-700">
                                    <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Other Apps</h3>
                                </div>
                                <div className="text-center pb-6 border-b-2 border-indigo-500">
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">SpendWise</h3>
                                </div>

                                {comparisons.map((comp, i) => (
                                    <Fragment key={i}>
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                            <X size={20} className="text-red-400 flex-shrink-0" />
                                            <span>{comp.other}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 font-medium">
                                            <Check size={20} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                                            <span>{comp.spendwise}</span>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Product Walkthrough */}
                <section className="relative py-20 sm:py-24 bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-800">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                Get started in minutes
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400">Four simple steps to financial clarity</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {walkthrough.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                            {i + 1}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                                    </div>
                                    {i < walkthrough.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. Emotional Section */}
                <section className="relative py-24 sm:py-32 bg-gradient-to-br from-indigo-600 to-blue-600 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Money shouldn't be stressful.
                            </h2>
                            <p className="text-2xl sm:text-3xl text-indigo-100 leading-relaxed">
                                SpendWise gives you clarity, not guilt.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 8. Final CTA Section */}
                <section className="relative py-24 sm:py-32 bg-slate-900 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
                            Take control of your money today.
                        </h2>
                        <p className="text-xl text-slate-300 mb-12">
                            Join thousands of students who've found financial clarity with SpendWise.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleGetStarted}
                                className="group px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-xl hover:bg-slate-100 transition-all shadow-2xl flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <p className="mt-8 text-slate-400 text-sm">
                            No credit card required • Free forever • 2 minute setup
                        </p>
                    </div>
                </section>

                {/* 9. Premium Mega Footer */}
                <footer className="relative bg-slate-950 pt-20 pb-10 overflow-hidden border-t border-slate-800">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-16">
                            {/* Brand Column */}
                            <div className="col-span-2 md:col-span-4 lg:col-span-4">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                                        <Globe size={20} className="text-white" />
                                    </div>
                                    <span className="text-2xl font-bold text-white tracking-tight">SpendWise</span>
                                </div>
                                <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
                                    Financial clarity without complexity. Built for students who want to understand their money and build better habits.
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-600/10 transition-all group">
                                        <Twitter size={18} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-600/10 transition-all group">
                                        <Github size={18} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-600/10 transition-all group">
                                        <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            {/* Links Columns */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                <h4 className="font-semibold text-white mb-6">Product</h4>
                                <ul className="space-y-4">
                                    {['Features', 'Security', 'Pricing', 'Updates'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                <h4 className="font-semibold text-white mb-6">Resources</h4>
                                <ul className="space-y-4">
                                    {['Blog', 'Community', 'Help Center', 'Student Guide'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                <h4 className="font-semibold text-white mb-6">Company</h4>
                                <ul className="space-y-4">
                                    {['About', 'Careers', 'Legal', 'Contact'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Newsletter or Badge */}
                            <div className="col-span-2 md:col-span-2 lg:col-span-2 flex flex-col justify-start">
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-blue-900/10 border border-indigo-500/10 backdrop-blur-sm">
                                    <h4 className="font-semibold text-white mb-2">Join the waitlist</h4>
                                    <p className="text-xs text-slate-400 mb-4">Get early access to pro features.</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="edu mail"
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors">
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-slate-500 text-sm">© 2025 SpendWise. All rights reserved.</p>
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                    Made with <Heart size={14} className="fill-rose-500 text-rose-500 animate-pulse" /> for students
                                </span>
                            </div>
                            <div className="flex gap-6 text-sm">
                                <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
                                <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

// Dashboard Preview Component
const DashboardPreview = () => {
    return (
        <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/50 pointer-events-none" />

                <div className="relative space-y-6">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="text-sm opacity-90 mb-2">Total Balance</div>
                        <div className="text-4xl font-bold mb-4">₹45,231</div>
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingUp size={16} />
                            <span>+12% this month</span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="text-xs text-slate-500 mb-1">Income</div>
                            <div className="text-xl font-bold text-slate-900">₹50K</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="text-xs text-slate-500 mb-1">Expenses</div>
                            <div className="text-xl font-bold text-slate-900">₹38K</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="text-xs text-slate-500 mb-1">Saved</div>
                            <div className="text-xl font-bold text-emerald-600">₹12K</div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Wallet size={18} className="text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-900">Transaction #{i}</div>
                                    <div className="text-xs text-slate-500">Today</div>
                                </div>
                                <div className="font-semibold text-slate-900">-₹{i * 100}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Feature Visual Component
const FeatureVisual = ({ type }) => {
    if (type === 'expense-tracking') {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Zap size={20} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-slate-900">Coffee</div>
                        <div className="text-sm text-slate-500">Food & Drinks</div>
                    </div>
                    <div className="font-bold text-slate-900">₹150</div>
                </div>
                <div className="flex gap-2">
                    {['Food', 'Transport', 'Shopping'].map((cat) => (
                        <div key={cat} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium">
                            {cat}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'balance') {
        return (
            <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                    <div className="text-sm opacity-90 mb-2">Net Worth</div>
                    <div className="text-3xl font-bold">₹1,24,500</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">Cash</div>
                        <div className="text-lg font-bold">₹5,200</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">Bank</div>
                        <div className="text-lg font-bold">₹1,19,300</div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'reports') {
        return (
            <div className="space-y-4">
                <div className="h-40 flex items-end justify-between gap-2">
                    {[60, 80, 45, 90, 70, 85].map((height, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-blue-500 rounded-t-lg" style={{ height: `${height}%` }} />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>
            </div>
        );
    }

    if (type === 'budget') {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">Food Budget</span>
                        <span className="text-emerald-600 font-bold">₹3,500 left</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <Bell size={16} className="text-amber-600" />
                    <span className="text-sm text-amber-700">You're doing great! Keep it up.</span>
                </div>
            </div>
        );
    }

    return null;
};

// Bubble Nav Component
const BubbleNav = ({ mode, dispatch, onGetStarted }) => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
        return () => unsubscribe();
    }, [scrollY]);

    const toggleTheme = () => {
        const modes = ['light', 'dark', 'system'];
        const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
        dispatch(setTheme(modes[nextIndex]));
    };

    const ThemeIcon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;

    const navLinks = [
        { name: 'Blogs', href: '/blogs', icon: '📝' },
        { name: 'Expenses', href: '/expenses', icon: '💰' },
        { name: 'Budgets', href: '/budgets', icon: '📊' },
    ];

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`pointer-events-auto flex items-center justify-between p-2 pl-6 pr-2 gap-8 rounded-full border transition-all duration-300 ${isScrolled
                    ? "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-xl"
                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 backdrop-blur-md"
                    }`}
            >
                {/* Logo Branding */}
                <div className="flex items-center gap-3">
                    <img
                        src="/logo1.svg"
                        alt="SpendWise Logo"
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">SpendWise</span>
                </div>

                {/* Right Side: Theme Toggle, Menu, CTA */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        title={`Current theme: ${mode}`}
                    >
                        <ThemeIcon size={18} />
                    </button>

                    {/* Hamburger Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            aria-label="Menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        {/* Bubble Menu Dropdown */}
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl overflow-hidden"
                            >
                                <div className="p-2">
                                    {navLinks.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.href}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="text-xl">{link.icon}</span>
                                            <span className="font-medium">{link.name}</span>
                                            <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 p-2">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            onGetStarted();
                                        }}
                                        className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* CTA Button (Desktop) */}
                    <button
                        onClick={onGetStarted}
                        className="hidden sm:block bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Get Started
                    </button>
                </div>
            </motion.nav>

            {/* Overlay to close menu when clicking outside */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 pointer-events-auto"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </div>
    );
};

// Data
const testimonials = [
    { name: "Swastika Bhattachrya", role: "CSE Student", quote: "Finally an app that understands students. The budget alerts saved me from going broke this month!", initials: "SB" },
    { name: "Debolina Nandi", role: "ECE Student", quote: "Love the simple design. No complicated graphs, just what I need to see.", initials: "DN" },
    { name: "Swadip Santra", role: "ME Student", quote: "Tracking expenses used to be a chore. Now it takes literally 2 seconds.", initials: "SS" },
    { name: "Satyajit Mishra", role: "IT Student", quote: "The 'safe to spend' feature is a game changer. I know exactly what I have left.", initials: "SM" },
    { name: "Tonushree Bhowmik", role: "BBA Student", quote: "Best expense tracker I've used. The dark mode looks absolutely stunning too.", initials: "TB" },
    { name: "Debojit Manna", role: "EE Student", quote: "Helped me save for my new laptop in just 3 months. Highly recommend!", initials: "DM" },
    { name: "Riya Das", role: "Biotech Student", quote: "I used to use Excel, but SpendWise is so much faster and prettier.", initials: "RD" },
    { name: "Ankit Roy", role: "Civil Student", quote: "The visualizations make it so easy to see where I'm overspending.", initials: "AR" },
    { name: "Priya Sharma", role: "CSE Student", quote: "Perfect for splitting bills with roommates and keeping track of personal spending.", initials: "PS" },
    { name: "Rahul Verma", role: "MCA Student", quote: "Simple, fast, and secure. Exactly what I was looking for.", initials: "RV" }
];

const problems = [
    {
        title: "Money disappears by mid-month",
        description: "You start with a full wallet, but somehow it's empty before the month ends. Where did it all go?"
    },
    {
        title: "Excel sheets never stay updated",
        description: "You tried tracking in spreadsheets, but forgot to update them. Now they're useless."
    },
    {
        title: "Finance apps feel too complicated",
        description: "Other apps have too many features, charts, and terms you don't understand. It's overwhelming."
    }
];

const features = [
    {
        title: "Smart Expense Tracking",
        description: "Add expenses in seconds. Our smart categories learn your habits and suggest the right tags automatically.",
        icon: Zap,
        gradient: "from-indigo-500 to-indigo-400",
        benefits: [
            "One-tap expense entry",
            "Auto-categorization",
            "Receipt scanning (coming soon)"
        ],
        visual: "expense-tracking"
    },
    {
        title: "Real-Time Balance & Net Worth",
        description: "See your exact financial position anytime. All your accounts in one place, always accurate.",
        icon: Wallet,
        gradient: "from-emerald-500 to-teal-500",
        benefits: [
            "Multi-account tracking",
            "Real-time updates",
            "Net worth calculation"
        ],
        visual: "balance"
    },
    {
        title: "Simple Visual Reports",
        description: "Understand your spending patterns with clean, easy-to-read charts. No finance degree required.",
        icon: BarChart3,
        gradient: "from-blue-500 to-cyan-500",
        benefits: [
            "Weekly & monthly insights",
            "Category breakdowns",
            "Spending trends"
        ],
        visual: "reports"
    },
    {
        title: "Budget Without Stress",
        description: "Set limits that actually work. Get gentle reminders, not guilt trips. Stay on track without feeling restricted.",
        icon: Shield,
        gradient: "from-blue-600 to-indigo-600",
        benefits: [
            "Flexible budget limits",
            "Friendly alerts",
            "Rollover budgets"
        ],
        visual: "budget"
    }
];

const comparisons = [
    { other: "Too complex", spendwise: "Student-friendly" },
    { other: "Finance jargon", spendwise: "Plain language" },
    { other: "Heavy charts", spendwise: "Clean visuals" },
    { other: "Paid early", spendwise: "Free core features" }
];

const walkthrough = [
    {
        title: "Create account",
        description: "Sign up in 30 seconds with email or Google"
    },
    {
        title: "Add accounts",
        description: "Link your bank, cash, and digital wallets"
    },
    {
        title: "Track expenses",
        description: "One-tap entry or auto-sync from accounts"
    },
    {
        title: "See clarity",
        description: "Understand where your money goes instantly"
    }
];

export default LandingPage;
