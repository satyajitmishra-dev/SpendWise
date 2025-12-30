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
                // DISABLED: Automatic toast notifications removed
                // Users will now click "What's New" button to see updates

                // Keep version check logic but don't show toast
                setUpdateAvailable(true);

                // Note: Toast notification code disabled as per user request
                // Users now see updates via the "What's New" button/modal
            }
        };

        // Small delay to ensure Remote Config has loaded
        const timer = setTimeout(checkVersion, 500);
        return () => clearTimeout(timer);
    }, [latestVersion]);

    return null;
};

export default UpdateChecker;
