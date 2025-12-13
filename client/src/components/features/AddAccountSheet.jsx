import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAccount } from '../../store/slices/accountSlice';
import { X, CreditCard, Wallet, Banknote, Landmark } from 'lucide-react';
import { cn } from '../../lib/utils';

const ACCOUNT_TYPES = [
    { id: 'bank', label: 'Bank', icon: Landmark, color: 'text-indigo-600 bg-indigo-100' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'text-blue-600 bg-blue-100' },
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-green-600 bg-green-100' },
    { id: 'other', label: 'Other', icon: CreditCard, color: 'text-gray-600 bg-gray-100' },
];

const COLORS = [
    '#6366f1', // Indigo
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#6b7280', // Gray
];

const AddAccountSheet = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [type, setType] = useState('bank');
    const [balance, setBalance] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !balance) {
            toast.error('Please enter name and balance');
            return;
        }

        setSubmitting(true);
        try {
            await dispatch(addAccount({
                name,
                type,
                balance: parseFloat(balance),
                color
            })).unwrap();

            toast.success('Wallet added successfully!');
            onClose();
            setName('');
            setBalance('');
        } catch (err) {
            toast.error('Failed to add wallet. Please try again.');
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
                    <h2 className="text-xl font-bold">Add Account</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. SBI Savings, Paytm"
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {ACCOUNT_TYPES.map(accType => (
                            <button
                                key={accType.id}
                                type="button"
                                onClick={() => setType(accType.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-all border-2",
                                    type === accType.id
                                        ? "border-indigo-600 ring-1 ring-indigo-50 bg-gray-50"
                                        : "border-transparent bg-gray-50 hover:bg-gray-100"
                                )}
                            >
                                <div className={cn("p-2 rounded-full", accType.color)}>
                                    <accType.icon size={20} />
                                </div>
                                <span className="text-xs font-medium">{accType.label}</span>
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Color</label>
                        <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={cn(
                                        "w-8 h-8 rounded-full transition-transform",
                                        color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-300" : "hover:scale-110"
                                    )}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        {submitting ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAccountSheet;
