import { format, differenceInDays } from 'date-fns';
import { Calendar, RefreshCw } from 'lucide-react';

const SubscriptionItem = ({ subscription }) => {
    const daysLeft = differenceInDays(new Date(subscription.renewalDate), new Date());
    const isUrgent = daysLeft <= 3 && daysLeft >= 0;

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isUrgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-600'}`}>
                    {/* Placeholder for now, can be mapped to real icons later */}
                    {subscription.name[0].toUpperCase()}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{subscription.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
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
                <p className="font-bold text-gray-900">₹{subscription.amount}</p>
                <p className="text-xs text-gray-400">{format(new Date(subscription.renewalDate), 'MMM d')}</p>
            </div>
        </div>
    );
};

export default SubscriptionItem;
