import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lockApp } from '../../store/slices/authSlice';

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const IdleTimer = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, isAppLocked, user } = useSelector((state) => state.auth);

    // Function to check if we should lock
    const checkInactivity = () => {
        if (!isAuthenticated || isAppLocked || !user?.isPasscodeEnabled) return;

        const lastActive = localStorage.getItem('lastActiveTime');
        const now = Date.now();

        if (lastActive && (now - parseInt(lastActive) > IDLE_TIMEOUT)) {
            dispatch(lockApp());
        }
    };

    // Update activity timestamp
    const updateActivity = () => {
        localStorage.setItem('lastActiveTime', Date.now().toString());
    };

    useEffect(() => {
        if (isAuthenticated && user?.isPasscodeEnabled) {
            // Initial check on mount
            checkInactivity();

            const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];

            // Throttle activity updates to once per second
            let throttleTimer;
            const handleActivity = () => {
                if (!throttleTimer) {
                    updateActivity();
                    throttleTimer = setTimeout(() => {
                        throttleTimer = null;
                    }, 1000);
                }
            };

            // Check every minute if we drifted past timeout while open
            const intervalId = setInterval(checkInactivity, 60000);

            // Check when tab becomes visible (mobile app restore)
            const handleVisibilityChange = () => {
                if (!document.hidden) {
                    checkInactivity();
                }
            };

            events.forEach(event => window.addEventListener(event, handleActivity));
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Set initial time if not set (or we just logged in)
            if (!localStorage.getItem('lastActiveTime')) {
                updateActivity();
            }

            return () => {
                events.forEach(event => window.removeEventListener(event, handleActivity));
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                clearInterval(intervalId);
                if (throttleTimer) clearTimeout(throttleTimer);
            };
        }
    }, [isAuthenticated, isAppLocked, user?.isPasscodeEnabled, dispatch]);

    return null;
};

export default IdleTimer;
