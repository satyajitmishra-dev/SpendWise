import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowUpCircle } from 'lucide-react';
import packageJson from '../../../package.json';

const UpdateChecker = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);

    const { version: latestVersion } = useSelector(state => state.app);

    useEffect(() => {
        if (!latestVersion) return;

        const checkVersion = () => {
            const currentVersion = packageJson.version;

            // Compare versions
            if (latestVersion !== currentVersion) {
                // Check if we've already shown the toast for this specific version
                const toastShownKey = `update_toast_shown_${latestVersion}`;
                const hasShownToast = localStorage.getItem(toastShownKey);

                if (!hasShownToast) {
                    // Clear any old version keys
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('update_toast_shown_') && key !== toastShownKey) {
                            localStorage.removeItem(key);
                        }
                    });

                    toast.success('New update available!', {
                        description: `Version ${latestVersion} is now live. Click to update.`,
                        icon: <ArrowUpCircle className="text-indigo-500" />,
                        duration: 10000,
                        action: {
                            label: 'Update Now',
                            onClick: () => window.location.reload()
                        }
                    });
                    localStorage.setItem(toastShownKey, 'true');
                }

                setUpdateAvailable(true);
            }
        };

        // Small delay to ensure Remote Config has loaded
        const timer = setTimeout(checkVersion, 500);
        return () => clearTimeout(timer);
    }, [latestVersion]);

    return null;
};

export default UpdateChecker;
