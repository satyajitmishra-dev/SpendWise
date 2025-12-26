import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAccount, updateAccount } from '../../store/slices/accountSlice';
import { toast } from 'sonner';
import { X, CreditCard, Wallet, Banknote, Landmark, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { triggerHaptic, HAPTIC_SUCCESS, HAPTIC_ERROR } from '../../lib/haptics';

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

const AddAccountSheet = ({ isOpen, onClose, accountToEdit }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [type, setType] = useState('bank');
    const [balance, setBalance] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (accountToEdit) {
                setName(accountToEdit.name);
                setType(accountToEdit.type);
                setBalance(accountToEdit.balance.toString());
                setColor(accountToEdit.color);
            } else {
                setName('');
                setType('bank');
                setBalance('');
                setColor(COLORS[0]);
            }
        }
    }, [isOpen, accountToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !balance) {
            toast.error('Please enter name and balance');
            triggerHaptic(HAPTIC_ERROR);
            return;
        }

        setSubmitting(true);
        try {
            if (accountToEdit) {
                await dispatch(updateAccount({
                    id: accountToEdit._id,
                    data: { name, type, balance: parseFloat(balance), color }
                })).unwrap();
                toast.success('Account updated successfully!');
            } else {
                await dispatch(addAccount({
                    name,
                    type,
                    balance: parseFloat(balance),
                    color
                })).unwrap();
                toast.success('Account created successfully!');
            }
            triggerHaptic(HAPTIC_SUCCESS);
            onClose();
            setName('');
            setBalance('');
        } catch (err) {
            toast.error('Failed to save account. Please try again.');
            triggerHaptic(HAPTIC_ERROR);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Sheet */}
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t-4 border-indigo-500">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                            {accountToEdit ? 'Edit Account' : 'Add New Account'}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Track where your money lives</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Compact Input Group */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Name</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {(() => {
                                        const Icon = ACCOUNT_TYPES.find(t => t.id === type)?.icon || Wallet;
                                        return <Icon size={18} />;
                                    })()}
                                </span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. HDFC Salary, Pocket Cash"
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-medium text-lg placeholder:text-gray-400/80"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Balance</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-3xl dark:text-white placeholder:text-gray-300"
                                    inputMode="decimal"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Type Grid */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Account Type</label>
                        <div className="grid grid-cols-4 gap-2">
                            {ACCOUNT_TYPES.map(accType => (
                                <button
                                    key={accType.id}
                                    type="button"
                                    onClick={() => setType(accType.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
                                        type === accType.id
                                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-slate-800 scale-[1.02] shadow-sm"
                                            : "border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95"
                                    )}
                                >
                                    <div className={cn("p-2 rounded-full transition-colors", type === accType.id ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-500")}>
                                        <accType.icon size={18} />
                                    </div>
                                    <span className={cn("text-[10px] font-bold uppercase tracking-tight", type === accType.id ? "text-indigo-700 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400")}>{accType.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Color Code</label>
                        <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar px-1">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={cn(
                                        "flex-shrink-0 w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-sm",
                                        color === c ? "scale-110 ring-2 ring-offset-2 ring-indigo-500 shadow-md" : "hover:scale-105 active:scale-95 opacity-80 hover:opacity-100"
                                    )}
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && <Check size={16} className="text-white drop-shadow-md" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <span className="opacity-80">Saving...</span>
                        ) : (
                            <>
                                <span>{accountToEdit ? 'Update Account' : 'Create Account'}</span>
                                {/* <ArrowRight size={20} className="opacity-80" /> */}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAccountSheet;
