import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../store/slices/themeSliceFixed';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';

// Helper component for generic usage
const ThemeToggler = ({ className, showLabel = false }) => {
    const dispatch = useDispatch();
    const currentMode = useSelector((state) => state.theme.mode);

    const modes = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'system', icon: Monitor, label: 'System' },
    ];

    const cycleTheme = () => {
        const currentIndex = modes.findIndex((m) => m.id === currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        dispatch(setTheme(modes[nextIndex].id));
    };

    const CurrentIcon = modes.find((m) => m.id === currentMode)?.icon || Monitor;

    return (
        <button
            onClick={cycleTheme}
            className={cn(
                "flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-slate-800",
                className
            )}
            title={`Current theme: ${currentMode}`}
        >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-100 dark:ring-slate-600">
                <CurrentIcon size={18} />
            </div>
            {showLabel && (
                <div className="text-left">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 block capitalize">
                        {currentMode} Mode
                    </span>
                    <span className="text-xs text-gray-400 block">Tap to switch</span>
                </div>
            )}
        </button>
    );
};

export default ThemeToggler;
