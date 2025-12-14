import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:bg-indigo-500/10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:bg-purple-500/10"></div>

            <div className="relative z-10 text-center max-w-md w-full">
                {/* 404 Illustration Area */}
                <div className="mb-8 relative inline-block">
                    <div className="text-[10rem] font-black text-gray-200 dark:text-slate-800 leading-none select-none animate-pulse">
                        404
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-indigo-100 dark:bg-slate-800 p-6 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-xl animate-bounce">
                            <Ghost size={48} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                    Oops! It seems like this money trail leads nowhere. <br /> Let's get you back on track.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                    >
                        <Home size={18} />
                        Back Home
                    </button>
                </div>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-8 text-center w-full text-xs text-gray-400 dark:text-slate-600 uppercase tracking-widest font-mono">
                Error Code: 404_NOT_FOUND
            </div>
        </div>
    );
};

export default NotFoundPage;
