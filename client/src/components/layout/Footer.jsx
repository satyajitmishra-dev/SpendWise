import { ShieldCheck, Wallet, Heart } from 'lucide-react';
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
        <footer className="w-full mt-10 md:mt-20 pb-20 md:pb-8 relative z-10 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px" }}
                className="flex flex-col items-center justify-center text-center px-6 relative"
            >
                {/* 1. Main Tagline - Big & Bold */}
                <motion.div variants={item} className="flex flex-col items-center mb-8">
                    <motion.h2
                        whileHover={{ scale: 1.05, opacity: 0.8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-4xl md:text-6xl font-black text-gray-200 dark:text-slate-800 tracking-tighter uppercase select-none opacity-50 dark:opacity-40 cursor-default"
                    >
                        SURVIVE EVERY
                    </motion.h2>
                    <motion.h2
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-4xl md:text-6xl font-black bg-gradient-to-b from-gray-800 to-gray-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tighter uppercase -mt-3 md:-mt-6 relative z-10 drop-shadow-sm cursor-default"
                    >
                        MONTH
                    </motion.h2>
                    <motion.p
                        whileHover={{ letterSpacing: "0.6em" }}
                        className="text-sm md:text-base font-bold text-indigo-500 dark:text-indigo-400 tracking-[0.5em] uppercase mt-2 mr-[-0.5em] transition-all duration-300 cursor-default"
                    >
                        Like a Pro
                    </motion.p>
                </motion.div>

                {/* 2. Security Badge */}
                <motion.div variants={item} className="mb-6">
                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: "rgba(16, 185, 129, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 cursor-pointer shadow-sm hover:shadow-emerald-500/10 transition-all"
                    >
                        <ShieldCheck size={14} className="fill-emerald-100 dark:fill-emerald-900/40" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Bank Grade Security</span>
                    </motion.div>
                </motion.div>

                {/* 2.5 Creative Origin Badge */}
                <motion.div variants={item} className="mb-10 group cursor-default">
                    <motion.div
                        whileHover={{ y: -2 }}
                        className="relative inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                    >
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Made with</span>
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        >
                            <Heart size={14} className="fill-red-500 text-red-500 drop-shadow-md" />
                        </motion.div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">in</span>
                        <span className="text-xs font-bold text-yellow-500 dark:text-yellow-400 drop-shadow-sm tracking-wide">
                            Kolkata
                        </span>
                    </motion.div>
                </motion.div>

                {/* 3. Copyright with Icon */}
                <motion.div variants={item} className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-default">
                        <Wallet size={12} className="stroke-[2.5]" />
                        <span>© {currentYear} SpendWise</span>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-gray-300 dark:text-slate-700 font-medium">
                        <span className="hover:text-indigo-500 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                        <span className="hover:text-indigo-500 cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </motion.div>

            </motion.div>
        </footer>
    );
};

export default Footer;