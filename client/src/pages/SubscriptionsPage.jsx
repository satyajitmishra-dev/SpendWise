import { useState, useEffect } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptions } from '../store/slices/subscriptionSlice';
import SubscriptionItem from '../components/features/SubscriptionItem';
import AddSubscriptionSheet from '../components/features/AddSubscriptionSheet';
import { Plus, Bell, BarChart3 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SubscriptionsPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { items, loading } = useSelector((state) => state.subscriptions);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchSubscriptions());
        if (location.state?.openAdd) {
            setIsAddOpen(true);
            // Optional: clear state
            window.history.replaceState({}, document.title);
        }
    }, [dispatch, location]);

    const monthlyTotal = items.reduce((sum, sub) => {
        return sum + (sub.cycle === 'monthly' ? sub.amount : sub.amount / 12);
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
        <div className="p-6 pb-24 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Subscriptions</h1>
                <button
                    onClick={() => { setEditingSubscription(null); setIsAddOpen(true); }}
                    className="p-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Insight Card */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <BarChart3 size={24} />
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        Monthly Estimate
                    </div>
                </div>
                <h2 className="text-4xl font-bold mb-1">₹{Math.round(monthlyTotal)}</h2>
                <p className="text-white/70 text-sm">spent on recurring services per month</p>
            </div>

            {/* List */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Active Services</h3>
                    <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">{items.length} Active</span>
                </div>



                {loading && items.length === 0 ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 dark:bg-slate-900 rounded-3xl">
                                <Bell className="mx-auto text-gray-300 dark:text-slate-600 mb-2" size={32} />
                                <p className="text-gray-400 dark:text-slate-500 font-medium">No subscriptions tracked</p>
                                <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">Add Netflix, Gym, etc.</p>
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
