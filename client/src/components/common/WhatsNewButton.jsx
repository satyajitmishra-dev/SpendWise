import { Megaphone, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsNewButton = ({ onClick, variant = 'sidebar' }) => {
    if (variant === 'mobile') {
        return (
            <button
                onClick={onClick}
                className="w-10 h-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-cyan-200/50 dark:border-cyan-500/30 rounded-full flex items-center justify-center shadow-md shadow-cyan-500/10 active:scale-95 transition-all relative group overflow-hidden hover:shadow-cyan-500/20"
                aria-label="What's New"
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/10 group-hover:to-teal-500/10 transition-all duration-300 rounded-full" />

                {/* Icon */}
                <div className="relative z-10">
                    <Megaphone size={18} className="text-cyan-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                    <Snowflake size={10} className="absolute -top-1 -right-1.5 text-cyan-300 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Pulse indicator - "NEW" badge */}
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
            </button>
        );
    }

    // Sidebar variant (desktop)
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium relative overflow-hidden group bg-gradient-to-r from-slate-50 to-cyan-50 dark:from-slate-900/40 dark:to-cyan-900/20 hover:from-slate-100 hover:to-cyan-100 dark:hover:from-slate-800/60 dark:hover:to-cyan-900/40 border border-slate-200 dark:border-cyan-900/30 shadow-sm hover:shadow-md hover:shadow-cyan-500/10 active:scale-[0.98] text-slate-700 dark:text-cyan-100"
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

            {/* Animated accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm group-hover:shadow transition-shadow border border-slate-100 dark:border-slate-700">
                    <Megaphone size={18} className="text-cyan-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                    {/* Pulse indicator */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse" />
                </div>

                <div className="flex flex-col items-start gap-0.5 text-left">
                    <span className="font-bold text-sm leading-none">What's New</span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1">
                        <Snowflake size={8} className="animate-spin-slow" /> Winter Special
                    </span>
                </div>

                {/* Arrow hint */}
                <svg className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
};

export default WhatsNewButton;
