import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { remoteConfig } from '../../firebase';
import { getValue } from 'firebase/remote-config';

/**
 * Debug component to display Remote Config status and values
 * Add this temporarily to your DevelopmentPage or any page to see what's happening
 */
const RemoteConfigDebug = () => {
    const { version, featureBanner, loading, error } = useSelector((state) => state.app);
    const [configStatus, setConfigStatus] = useState({});

    useEffect(() => {
        // Get direct values from Firebase to compare
        const checkConfig = () => {
            try {
                const directVersion = getValue(remoteConfig, 'latest_version');
                const directBanner = getValue(remoteConfig, 'show_feature_banner');

                setConfigStatus({
                    initialized: true,
                    fetchTime: new Date(remoteConfig.fetchTimeMillis).toLocaleString(),
                    lastFetchStatus: remoteConfig.lastFetchStatus,
                    versionSource: directVersion.getSource(),
                    versionValue: directVersion.asString(),
                    bannerSource: directBanner.getSource(),
                    bannerValue: directBanner.asBoolean()
                });
            } catch (err) {
                setConfigStatus({ error: err.message });
            }
        };

        checkConfig();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 max-w-md bg-black text-white p-4 rounded-lg shadow-2xl text-xs font-mono z-50 max-h-96 overflow-auto">
            <h3 className="font-bold text-yellow-400 mb-2">🔍 Remote Config Debug</h3>

            <div className="space-y-2">
                <div>
                    <span className="text-gray-400">Redux Loading:</span>
                    <span className={loading ? 'text-yellow-300' : 'text-green-400'}> {loading ? 'YES' : 'NO'}</span>
                </div>

                {error && (
                    <div className="text-red-400">
                        <span className="text-gray-400">Error:</span> {error}
                    </div>
                )}

                <div>
                    <span className="text-gray-400">Version (Redux):</span>
                    <span className="text-green-300"> {version || 'NULL'}</span>
                </div>

                <div>
                    <span className="text-gray-400">Banner Show (Redux):</span>
                    <span className="text-green-300"> {String(featureBanner.show)}</span>
                </div>

                <div>
                    <span className="text-gray-400">Banner Text (Redux):</span>
                    <span className="text-green-300"> {featureBanner.text || 'EMPTY'}</span>
                </div>

                <hr className="border-gray-700 my-2" />

                <div>
                    <span className="text-gray-400">Fetch Status:</span>
                    <span className="text-blue-300"> {configStatus.lastFetchStatus || 'N/A'}</span>
                </div>

                <div>
                    <span className="text-gray-400">Last Fetch:</span>
                    <span className="text-blue-300"> {configStatus.fetchTime || 'Never'}</span>
                </div>

                <div>
                    <span className="text-gray-400">Version Source:</span>
                    <span className={configStatus.versionSource === 'remote' ? 'text-green-400' : 'text-orange-400'}>
                        {' '}{configStatus.versionSource || 'N/A'}
                    </span>
                </div>

                <div>
                    <span className="text-gray-400">Version (Direct):</span>
                    <span className="text-green-300"> {configStatus.versionValue || 'N/A'}</span>
                </div>

                <div>
                    <span className="text-gray-400">Banner Source:</span>
                    <span className={configStatus.bannerSource === 'remote' ? 'text-green-400' : 'text-orange-400'}>
                        {' '}{configStatus.bannerSource || 'N/A'}
                    </span>
                </div>

                {configStatus.error && (
                    <div className="text-red-400">
                        Direct Error: {configStatus.error}
                    </div>
                )}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-700 text-[10px] text-gray-500">
                Sources: 'remote' = from Firebase | 'default' = from defaults | 'static' = hardcoded
            </div>
        </div>
    );
};

export default RemoteConfigDebug;
