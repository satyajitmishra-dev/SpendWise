import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Rocket, Construction, Ghost } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if this is likely a "future feature" route rather than a true 404
    // Simple heuristic: if it's a known placeholder like /goals or /community
    // OR if user just clicked a link to something invalid.
    // For now, let's treat everything as "Coming Soon" if it's not a ghost.

    // We can randomize or select based on path
    const isFutureFeature = ['/goals', '/community', '/settings', '/help', '/calendar', '/edit-profile', '/preferences', '/notifications', '/security'].some(path => location.pathname.startsWith(path));

    // Config for the two states
    const config = isFutureFeature ? {
        title: "Coming Soon",
        desc: "We're building something awesome here.",
        icon: <Rocket size={48} className="text-indigo-600 dark:text-indigo-400" />,
        sub: "This feature is currently under construction.",
        bgClass: "bg-indigo-100 dark:bg-slate-800"
    } : {
        title: "Page Not Found",
        desc: "Oops! This money trail leads nowhere.",
        icon: <Ghost size={48} className="text-purple-600 dark:text-purple-400" />,
        sub: "Error 404",
        bgClass: "bg-purple-100 dark:bg-slate-800"
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:bg-indigo-500/10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:bg-purple-500/10"></div>

            <div className="relative z-10 text-center max-w-md w-full">
                {/* Icon Area */}
                <div className="mb-8 relative inline-block">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/50 dark:bg-white/5 rounded-full blur-2xl"></div>
                    <div className="relative">
                        <div className={`${config.bgClass} p-8 rounded-3xl ring-4 ring-white dark:ring-slate-900 shadow-2xl animate-bounce-slow`}>
                            {config.icon}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                    {config.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2 leading-relaxed font-medium">
                    {config.desc}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded-full">
                    {isFutureFeature ? "Status: In Development" : `Wrong Turn at: ${location.pathname}`}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 shadow-md"
                    >
                        <Home size={18} />
                        Back Dashboard
                    </button>
                </div>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-8 text-center w-full text-[10px] text-gray-300 dark:text-slate-700 uppercase tracking-[0.3em] font-black opacity-50">
                SpendWise Student Edition
            </div>
        </div>
    );
};

export default NotFoundPage;
