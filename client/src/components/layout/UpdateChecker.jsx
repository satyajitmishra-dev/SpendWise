import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchRemoteConfig, getVersionConfig } from '../../services/remoteConfig';
import { ArrowUpCircle } from 'lucide-react';
import packageJson from '../../../package.json';

const UpdateChecker = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        const checkVersion = async () => {
            await fetchRemoteConfig();
            const { latestVersion } = getVersionConfig();

            // Simple string comparison for now (assumes semver format like 3.0.0)
            const currentVersion = packageJson.version;

            if (latestVersion !== currentVersion) {
                // Check if we've already shown the toast for this specific version
                const toastShownKey = `update_toast_shown_${latestVersion}`;
                const hasShownToast = localStorage.getItem(toastShownKey);

                if (!hasShownToast) {
                    toast('New update available!', {
                        description: `Version ${latestVersion} is now live.`,
                        icon: <ArrowUpCircle className="text-indigo-500" />,
                        duration: 10000,
                        action: {
                            label: 'Refresh',
                            onClick: () => window.location.reload()
                        }
                    });
                    localStorage.setItem(toastShownKey, 'true');
                }

                setUpdateAvailable(true);
            }
        };

        // Delay check slightly to not block initial load
        const timer = setTimeout(checkVersion, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!updateAvailable) return null;

    // Optional: Render a non-intrusive floating pill if you want something more than a toast
    return null;
};

export default UpdateChecker;
