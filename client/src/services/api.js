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

const shownErrors = new Set();

const showErrorToast = (message) => {
    if (shownErrors.has(message)) return;

    shownErrors.add(message);
    toast.error(message, {
        duration: 4000,
        onDismiss: () => shownErrors.delete(message),
        onAutoClose: () => shownErrors.delete(message),
    });
    // Fallback cleanup
    setTimeout(() => shownErrors.delete(message), 4500);
};

// Enhanced response interceptor with error handling and retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Try to refresh the token
                    const res = await axios.post('/api/auth/refresh', { refreshToken });

                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);
                        // Update refresh token if rotated
                        if (res.data.refreshToken) {
                            localStorage.setItem('refreshToken', res.data.refreshToken);
                        }

                        // Retry original request with new token
                        originalRequest.headers['x-auth-token'] = res.data.token;
                        return api(originalRequest);
                    }
                } catch (refreshErr) {
                    // Refresh failed - clean up and logout
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    // Optional: You might want to redirect to login page here
                    // window.location.href = '/login'; 
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            }
            // For 401, we generally rely on state/redirect, but if it fails to refresh, maybe show?
            // "Session expired"
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
                showErrorToast(errorMsg);
            }

            return Promise.reject(error);
        }

        // Handle other HTTP errors with toast
        if (error.response) {
            const status = error.response.status;

            // Don't show toast for certain status codes that components handle themselves
            const silentStatuses = [401, 400]; // Add more if needed

            if (!silentStatuses.includes(status)) {
                const errorMsg = getErrorMessage(error);
                showErrorToast(errorMsg);
            }
        } else {
            // Generic error
            let msg = 'An unexpected error occurred';
            if (error.response && typeof error.response.data === 'string' && error.response.data.includes('<html')) {
                msg = `Server Error (${error.response.status})`;
            }
            showErrorToast(msg);
        }

        return Promise.reject(error);
    }
);

export default api;

