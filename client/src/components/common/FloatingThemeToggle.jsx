import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../store/slices/themeSliceFixed';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingThemeToggle = () => {
    const dispatch = useDispatch();
    const currentMode = useSelector((state) => state.theme.mode);

    const modes = [
        { id: 'light', icon: Sun, label: 'Light', color: 'from-indigo-400 to-purple-500' },
        { id: 'dark', icon: Moon, label: 'Dark', color: 'from-purple-500 to-pink-600' },
        { id: 'system', icon: Monitor, label: 'System', color: 'from-blue-500 to-indigo-600' },
    ];

    const currentModeData = modes.find((m) => m.id === currentMode) || modes[2];
    const CurrentIcon = currentModeData.icon;

    const cycleTheme = () => {
        const currentIndex = modes.findIndex((m) => m.id === currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        dispatch(setTheme(modes[nextIndex].id));
    };

    return (
        <motion.button
            onClick={cycleTheme}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="fixed top-6 right-6 z-50 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${currentModeData.color} shadow-xl shadow-black/20 dark:shadow-white/10 flex items-center justify-center overflow-hidden`}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/20 dark:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon with animation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMode}
                        initial={{ y: 20, opacity: 0, rotate: -180 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                    >
                        <CurrentIcon size={24} className="text-white drop-shadow-lg" />
                    </motion.div>
                </AnimatePresence>

                {/* Ripple effect on click */}
                <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-white/50 rounded-full"
                />
            </div>

            {/* Tooltip */}
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {currentModeData.label} Mode
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 dark:border-l-white" />
            </motion.div>
        </motion.button>
    );
};

export default FloatingThemeToggle;
