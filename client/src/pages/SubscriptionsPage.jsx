import { useState, useEffect } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptions } from '../store/slices/subscriptionSlice';
import SubscriptionItem from '../components/features/SubscriptionItem';
import AddSubscriptionSheet from '../components/features/AddSubscriptionSheet';
import { Plus, Bell, BarChart3, TrendingUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const SubscriptionsPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { items, loading, error } = useSelector((state) => state.subscriptions);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchSubscriptions());
        if (location.state?.openAdd) {
            setIsAddOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [dispatch, location]);

    const monthlyTotal = items.reduce((sum, sub) => {
        const val = parseFloat(sub.amount) || 0;
        return sum + (sub.cycle === 'monthly' ? val : val / 12);
    }, 0);

    const handleEdit = (subscription) => {
        setEditingSubscription(subscription);
        setIsAddOpen(true);
    };

    const handleClose = () => {
        setIsAddOpen(false);
        setEditingSubscription(null);
    };

    return (
        <div className="p-6 sm:p-8 pb-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        Subscriptions
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide mt-1">Manage your recurring payments</p>
                </div>
                <button
                    onClick={() => { setEditingSubscription(null); setIsAddOpen(true); }}
                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 group"
                >
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm flex items-center justify-between">
                    <span>Error loading subscriptions: {JSON.stringify(error)}</span>
                    <button onClick={() => dispatch(fetchSubscriptions())} className="font-bold hover:underline">Retry</button>
                </div>
            )}

            {/* Insight Card - Premium Redesign */}
            <Card className="relative overflow-hidden border-0 shadow-2xl shadow-indigo-500/10 rounded-[2.5rem] p-8 group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 group-hover:scale-105" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                            <BarChart3 size={24} className="text-white" />
                        </div>
                        <div className="bg-white/20 pl-3 pr-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-2">
                            <TrendingUp size={14} />
                            Monthly Estimate
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-5xl font-black tracking-tight">
                            <span className="text-2xl opacity-60 align-top mr-1">₹</span>
                            {Math.round(monthlyTotal).toLocaleString()}
                        </h2>
                        <p className="text-indigo-100 font-medium opacity-80">Total monthly recurring cost</p>
                    </div>
                </div>
            </Card>

            {/* List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Services</h3>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{items.length} Active</span>
                </div>

                {loading && items.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-24 w-full rounded-3xl bg-gray-100 dark:bg-slate-800" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="text-gray-400 dark:text-slate-600" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No subscriptions yet</h3>
                                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 max-w-xs mx-auto">Add your Netflix, Spotify, or Gym memberships to track them here.</p>
                                <button
                                    onClick={() => { setEditingSubscription(null); setIsAddOpen(true); }}
                                    className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
                                >
                                    Add your first subscription
                                </button>
                            </div>
                        ) : (
                            items.map(sub => (
                                <SubscriptionItem key={sub._id} subscription={sub} onEdit={handleEdit} />
                            ))
                        )}
                    </div>
                )}
            </div>

            <AddSubscriptionSheet isOpen={isAddOpen} onClose={handleClose} editingSubscription={editingSubscription} />
        </div>
    );
};

export default SubscriptionsPage;
