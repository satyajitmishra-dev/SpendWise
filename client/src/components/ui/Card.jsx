import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
        default: "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm",
        glass: "bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl",
        gradient: "bg-gradient-to-b from-indigo-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-indigo-100/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden",
        outline: "border border-gray-200 dark:border-slate-700 bg-transparent",
        interactive: "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95"
    };

    return (
        <div
            ref={ref}
            className={cn("rounded-[2rem] p-6", variants[variant], className)}
            {...props}
        >
            {children}
        </div>
    );
});
Card.displayName = "Card";

export { Card };
