
// Simple haptic feedback helper
// Supports vibration patterns (e.g., [100, 50, 100]) or simple duration (e.g., 200)
export const triggerHaptic = (pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

export const HAPTIC_SUCCESS = [10, 50, 10]; // Short double tap
export const HAPTIC_ERROR = [50, 100, 50]; // Longer feedback for error
export const HAPTIC_TAP = 5; // Very subtle tap
