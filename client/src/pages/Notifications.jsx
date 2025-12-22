import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ChevronLeft, Bell, CheckCheck, Info, XCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // If guest, maybe show static data or nothing. For now, just skip fetch.
        const user = JSON.parse(localStorage.getItem('user') || '{}'); // Or get from redux if possible, but local storage is quicker for this snippet
        if (user?.isGuest) {
            setIsLoading(false);
            return;
        }
        fetchNotifications();
    }, []);

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read/all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch (error) {
            console.error(error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/read/${id}`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" size={20} />;
            case 'error': return <XCircle className="text-red-500" size={20} />;
            case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    return (
        <div className="p-4 md:p-6 pb-24 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Notifications</h1>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllRead}
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-full transition-colors"
                    >
                        <CheckCheck size={16} /> Mark all read
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Bell className="text-gray-400" size={32} />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">No notifications yet</p>
                    <p className="text-sm text-gray-500">We'll notify you when something happens.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {notifications.map((notification, index) => (
                            <motion.div
                                key={notification._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`relative p-4 rounded-2xl border transition-all ${notification.isRead
                                    ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 opacity-70'
                                    : 'bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm border-indigo-100 dark:border-indigo-900/30 shadow-sm'
                                    }`}
                                onClick={() => !notification.isRead && markAsRead(notification._id)}
                            >
                                <div className="flex gap-4">
                                    <div className={`mt-1 p-2 rounded-full ${!notification.isRead ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-slate-800'
                                        }`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-semibold text-base ${notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                                                }`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 block shrink-0 mt-1.5"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-3 font-medium">
                                            {new Date(notification.createdAt).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Notifications;
