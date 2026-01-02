import { format, differenceInDays } from 'date-fns';
import { Calendar, RefreshCw, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteSubscription } from '../../store/slices/subscriptionSlice';
import { useState, useRef, useEffect } from 'react';

const SubscriptionItem = ({ subscription, onEdit }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const renewalDate = new Date(subscription.renewalDate);
    const isValidDate = !isNaN(renewalDate.getTime());
    const daysLeft = isValidDate ? differenceInDays(renewalDate, new Date()) : 0;
    const isUrgent = daysLeft <= 3 && daysLeft >= 0;
    const formattedDate = isValidDate ? format(renewalDate, 'MMM d') : 'Inv. Date';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleDelete = () => {
        dispatch(deleteSubscription(subscription._id));
        setShowMenu(false);
    };

    const handleEdit = () => {
        onEdit(subscription);
        setShowMenu(false);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isUrgent ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse' : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'}`}>
                    {/* Placeholder for now, can be mapped to real icons later */}
                    {subscription.name[0].toUpperCase()}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{subscription.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <RefreshCw size={12} />
                        <span className="capitalize">{subscription.cycle}</span>
                        <span>•</span>
                        <span className={isUrgent ? 'text-red-600 font-bold' : ''}>
                            {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due Today' : `${daysLeft} days left`}
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">₹{subscription.amount}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{formattedDate}</p>
                <div className="mt-2 flex justify-end relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-6 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={handleEdit}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 border-t border-gray-100 dark:border-slate-700"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionItem;
