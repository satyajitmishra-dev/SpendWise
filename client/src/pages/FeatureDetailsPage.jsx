import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

const FeatureDetailsPage = () => {
    const navigate = useNavigate();
    const { featureBanner } = useSelector((state) => state.app);
    const { detailTitle, detailDesc, detailImage } = featureBanner;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-blob" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-4000" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 shadow-sm"
                >
                    <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
                </Button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full relative z-10"
            >
                {/* Feature Icon / Image Placeholder */}
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-500/20 flex items-center justify-center relative overflow-hidden group">
                    {detailImage ? (
                        <img src={detailImage} alt="Feature" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
                            <Star size={80} className="text-white drop-shadow-md animate-pulse-slow" />
                        </>
                    )}

                    {/* Floating Badge */}
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        Upcoming Feature
                    </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                        {detailTitle || "Coming Soon"}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
                        {detailDesc || "We're working on something amazing for you. Stay tuned!"}
                    </p>

                    <div className="pt-4">
                        <Button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 h-auto rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Got it, thanks!
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FeatureDetailsPage;
