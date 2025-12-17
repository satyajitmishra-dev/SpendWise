import axios from 'axios';
import { toast } from 'sonner';
import { isNetworkError, getErrorMessage } from '../utils/networkUtils';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Attach Token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        // Add retry count to config
        config.retryCount = config.retryCount || 0;
        return config;
    },
    (error) => Promise.reject(error)
);

// Enhanced response interceptor with error handling and retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Don't show toast for 401 as auth slice handles this
            return Promise.reject(error);
        }

        // Check if this is a network error
        if (isNetworkError(error)) {
            // Retry logic for network errors (max 2 retries)
            if (originalRequest.retryCount < 2) {
                originalRequest.retryCount += 1;

                // Wait before retrying (exponential backoff)
                const delay = originalRequest.retryCount * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));

                return api(originalRequest);
            }

            // Max retries reached - show error toast
            // Don't show toast if user is offline (offline page will handle this)
            if (navigator.onLine) {
                const errorMsg = getErrorMessage(error);
                toast.error(errorMsg, {
                    duration: 4000,
                    action: {
                        label: 'Retry',
                        onClick: () => {
                            // Reset retry count and try again
                            originalRequest.retryCount = 0;
                            api(originalRequest);
                        }
                    }
                });
            }

            return Promise.reject(error);
        }

        // Handle other HTTP errors with toast
        if (error.response) {
            const status = error.response.status;

            // Don't show toast for certain status codes that components handle themselves
            const silentStatuses = [401]; // Add more if needed

            if (!silentStatuses.includes(status)) {
                const errorMsg = getErrorMessage(error);
                toast.error(errorMsg, { duration: 4000 });
            }
        } else {
            // Generic error
            let msg = 'An unexpected error occurred';
            if (error.response && typeof error.response.data === 'string' && error.response.data.includes('<html')) {
                msg = `Server Error (${error.response.status})`;
            }
            toast.error(msg, { duration: 4000 });
        }

        return Promise.reject(error);
    }
);

export default api;

