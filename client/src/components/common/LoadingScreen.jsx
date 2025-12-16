import { useEffect, useState } from 'react';

const LoadingScreen = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Small delay to prevent flash on super fast loads
        const timer = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Background Glow Effects - Subtle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>

            <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                {/* Logo Container */}
                <div className="relative mb-6">
                    <img
                        src="/logo1.svg"
                        alt="SpendWise"
                        className="w-24 h-24 object-contain drop-shadow-2xl animate-bounce-subtle"
                    />
                    {/* Ring Spinner around logo (Optional, simplified to pulsing glow for premium feel) */}
                </div>

                {/* Brand Name */}
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-white dark:to-slate-400 tracking-tight animate-pulse">
                    SpendWise
                </h1>

                {/* Loading Indicator dots */}
                <div className="flex gap-1 mt-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
