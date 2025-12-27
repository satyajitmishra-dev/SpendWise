import { Github, Heart, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <footer className="w-full mt-6 md:mt-12 pb-24 md:pb-8 relative z-10 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col items-center justify-center text-center px-6 relative"
            >
                {/* 1. Main Tagline - Big & Bold like the reference */}
                <motion.div variants={item} className="flex flex-col items-center mb-10">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-200 dark:text-slate-800 tracking-tighter uppercase select-none opacity-50 dark:opacity-40">
                        SURVIVE EVERY
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-b from-gray-800 to-gray-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tighter uppercase -mt-3 md:-mt-6 relative z-10 drop-shadow-sm">
                        MONTH
                    </h2>
                    <p className="text-sm md:text-base font-bold text-indigo-500 dark:text-indigo-400 tracking-[0.5em] uppercase mt-2 mr-[-0.5em]">
                        Like a Pro
                    </p>
                </motion.div>

                {/* 2. Credits "Crafted with <3 in India by..." */}
                <motion.div variants={item} className="flex flex-col items-center gap-1 mb-8">
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        Crafted with
                        <motion.span
                            animate={{
                                scale: [1, 1.2, 1],
                                color: ['#ef4444', '#ec4899', '#ef4444']
                            }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <Heart size={14} className="fill-current" />
                        </motion.span>
                        in <span className="font-bold text-gray-700 dark:text-white">India</span> by
                    </p>
                    <a
                        href="https://github.com/satyajitmishra-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-px transition-transform active:scale-95 duration-300 hover:scale-105"
                    >
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center gap-2 px-6 py-2 rounded-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 group-hover:border-transparent transition-colors">
                            <span className="font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                Satyajit Mishra
                            </span>
                            <Github size={14} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                        </span>
                    </a>
                </motion.div>

                {/* 3. Copyright with Icon */}
                <motion.div variants={item} className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-default">
                    <Wallet size={12} className="stroke-[2.5]" />
                    <span>© {currentYear} SpendWise</span>
                </motion.div>

            </motion.div>
        </footer>
    );
};

export default Footer;