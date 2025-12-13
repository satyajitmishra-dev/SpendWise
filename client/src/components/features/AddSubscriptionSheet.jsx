import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubscription } from '../../store/slices/subscriptionSlice';
import { X, Bell, Calendar, Repeat } from 'lucide-react';
import { cn } from '../../lib/utils';

const CYCLES = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
];

const AddSubscriptionSheet = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [cycle, setCycle] = useState('monthly');
    const [renewalDate, setRenewalDate] = useState(new Date().toISOString().split('T')[0]);
    const [icon, setIcon] = useState('📅'); // Simple emoji for now
    const [submitting, setSubmitting] = useState(false);

    // Predefined popular services (could be expanded)
    const POPULAR = [
        { name: 'Netflix', color: '#E50914', icon: '🍿' },
        { name: 'Spotify', color: '#1DB954', icon: '🎵' },
        { name: 'YouTube', color: '#FF0000', icon: '▶️' },
        { name: 'Prime', color: '#00A8E1', icon: '📦' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !amount) {
            toast.error('Please enter service name and cost');
            return;
        }

        setSubmitting(true);
        try {
            await dispatch(addSubscription({
                name,
                amount: parseFloat(amount),
                cycle,
                renewalDate,
                autoRenew: true
            })).unwrap();

            toast.success('Subscription tracked successfully!');
            onClose();
            setName('');
            setAmount('');
        } catch (err) {
            toast.error('Failed to add subscription.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">New Subscription</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Select */}
                <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
                    {POPULAR.map(service => (
                        <button
                            key={service.name}
                            onClick={() => { setName(service.name); setIcon(service.icon); }}
                            className="flex flex-col items-center gap-1 min-w-[70px]"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-gray-50 border border-gray-100 shadow-sm">
                                {service.icon}
                            </div>
                            <span className="text-xs font-medium text-gray-600">{service.name}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">{icon}</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. ChatGPT Plus"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cycle</label>
                            <select
                                value={cycle}
                                onChange={(e) => setCycle(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                            >
                                {CYCLES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Renewal</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={renewalDate}
                                onChange={(e) => setRenewalDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl text-indigo-700 text-sm">
                        <Bell size={18} />
                        <span>We'll remind you 2 days before payment.</span>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        {submitting ? 'Adding...' : 'Track Subscription'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSubscriptionSheet;
