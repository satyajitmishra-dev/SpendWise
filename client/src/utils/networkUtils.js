/**
 * Network Utilities
 * Functions for detecting and handling network-related errors
 */

/**
 * Check if an error is network-related
 * @param {Error} error - The error object to check
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
    // No response means network error (no internet, DNS failure, timeout)
    if (!error.response) {
        return true;
    }

    // Check for specific network error codes
    const networkErrorCodes = [
        'ECONNABORTED', // Connection aborted
        'ETIMEDOUT',    // Connection timeout
        'ENOTFOUND',    // DNS lookup failed
        'ENETUNREACH',  // Network unreachable
        'ERR_NETWORK',  // Generic network error
    ];

    return networkErrorCodes.includes(error.code);
};

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
    // Network errors
    if (isNetworkError(error)) {
        if (!navigator.onLine) {
            return 'No internet connection. Please check your network and try again.';
        }
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            return 'Connection timed out. Retrying...';
        }
        return 'Unable to connect. Check your internet connection.';
    }

    // HTTP error responses
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.msg || error.response.data?.message;

        switch (status) {
            case 400:
                return message || 'Invalid request. Please check your input.';
            case 401:
                return 'Session expired. Please log in again.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return 'We couldn\'t find the data you requested.';
            case 409:
                return message || 'A conflict occurred. Please try again.';
            case 429:
                return 'We\'re getting too many requests. Please wait a moment.';
            case 500:
                return 'Our server is acting up. We\'re working to fix it! (500)';
            case 503:
                return 'Service temporarily unavailable. We\'ll be back soon.';
            default:
                return message || 'An error occurred. Please try again.';
        }
    }

    // Generic error
    return error.message || 'An unexpected error occurred.';
};

/**
 * Check if browser is currently online
 * @returns {boolean} - True if online
 */
export const isOnline = () => {
    return navigator.onLine;
};

/**
 * Add event listeners for online/offline events
 * @param {Function} onOnline - Callback when comes online
 * @param {Function} onOffline - Callback when goes offline
 * @returns {Function} - Cleanup function to remove listeners
 */
export const addNetworkListeners = (onOnline, onOffline) => {
    const handleOnline = () => {
        if (onOnline) onOnline();
    };

    const handleOffline = () => {
        if (onOffline) onOffline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
};
