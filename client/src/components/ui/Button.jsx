import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-2xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
                secondary: "bg-white text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-sm",
                destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
                ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                glass: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20",
                outline: "border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                google: "bg-white text-slate-950 hover:bg-slate-50 shadow-md hover:shadow-lg border border-slate-100"
            },
            size: {
                default: "h-12 px-6 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-14 px-8 text-base",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
);

/*
  Using forwardRef to allow this component to be used as a child of other components
  that might need ref access (though less common in simple apps, it's good practice).
  Also relying on `disabled` prop to both style and functionality.
*/

const Button = React.forwardRef(({ className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, fullWidth }), className)}
            ref={ref}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
});
Button.displayName = "Button";

export { Button, buttonVariants };
