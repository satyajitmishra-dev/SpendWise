import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, icon: Icon, error, ...props }, ref) => {
    return (
        <div className="space-y-1 w-full">
            <div className="relative group/input">
                {Icon && (
                    <Icon
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                            error ? "text-red-400" : "text-slate-500 group-focus-within/input:text-indigo-400"
                        )}
                        size={18}
                    />
                )}
                <input
                    className={cn(
                        "w-full h-14 bg-slate-950/50 border rounded-2xl focus:ring-1 outline-none transition-all text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        Icon ? "pl-12 pr-4" : "px-4",
                        error
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50 text-red-500 placeholder:text-red-400/50"
                            : "border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/50 text-white placeholder:text-slate-600",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
        </div>
    );
});
Input.displayName = "Input";

export { Input };
