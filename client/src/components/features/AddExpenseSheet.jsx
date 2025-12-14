import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addExpense, updateExpense } from '../../store/slices/expenseSlice';
import { fetchAccounts, updateAccountBalance } from '../../store/slices/accountSlice'; // Import actions
// Force HMR update
import { X, Calendar, Tag, FileText, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const CATEGORIES = [
    { id: 'food', label: 'Food 🍔', color: 'bg-orange-100 text-orange-600' },
    { id: 'travel', label: 'Travel 🚕', color: 'bg-blue-100 text-blue-600' },
    { id: 'study', label: 'Study 📚', color: 'bg-green-100 text-green-600' },
    { id: 'fun', label: 'Fun 🎮', color: 'bg-purple-100 text-purple-600' },
    { id: 'rent', label: 'Rent 🏠', color: 'bg-red-100 text-red-600' },
    { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-600' },
];

const AddExpenseSheet = ({ isOpen, onClose, expenseToEdit, initialAccountId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { items: accounts } = useSelector(state => state.accounts);

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmNegative, setConfirmNegative] = useState(false);

    // Reset confirmation when inputs change
    useEffect(() => {
        setConfirmNegative(false);
    }, [amount, selectedAccount]);

    // Populate or Reset Form
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchAccounts());
            if (expenseToEdit) {
                setAmount(expenseToEdit.amount.toString());
                setCategory(expenseToEdit.category);
                setNote(expenseToEdit.note || '');
                setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
                setSelectedAccount(expenseToEdit.accountId || '');
            } else {
                // Reset to defaults for Add mode
                setAmount('');
                setCategory(CATEGORIES[0].id);
                setNote('');
                setDate(new Date().toISOString().split('T')[0]);
                setSelectedAccount(initialAccountId || '');
            }
        }
    }, [isOpen, expenseToEdit, initialAccountId, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) {
            toast.error('Please enter an amount');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        // Check for negative balance
        if (selectedAccount) {
            const account = accounts.find(a => a._id === selectedAccount);
            if (account) {
                const currentBalance = parseFloat(account.balance) || 0;
                const newBalance = currentBalance - parsedAmount;
                if (newBalance < 0 && !confirmNegative) {
                    setConfirmNegative(true);
                    toast.warning(`Low Balance in ${account.name}!`, {
                        description: `Current: ₹${currentBalance}. New: -₹${Math.abs(newBalance).toFixed(2)}. Press Save again to confirm.`,
                        duration: 5000,
                    });
                    return;
                }
            }
        }

        setSubmitting(true);
        try {
            if (expenseToEdit) {
                // Update Logic
                await dispatch(updateExpense({
                    id: expenseToEdit._id,
                    data: { amount: parsedAmount, category, note, date, accountId: selectedAccount || null }
                })).unwrap();
                toast.success('Expense updated!');
            } else {
                // Add Logic
                await dispatch(addExpense({
                    amount: parsedAmount,
                    category,
                    note,
                    date,
                    accountId: selectedAccount || null
                })).unwrap();

                // Deduct from account (Only on Add)
                if (selectedAccount) {
                    dispatch(updateAccountBalance({ accountId: selectedAccount, amount: -parsedAmount }));
                }

                // Check guest
                const isGuest = !isAuthenticated || (user && !user.email);
                if (isGuest) {
                    toast.warning('Expense saved locally', {
                        description: 'Log in to sync and keep your data safe.',
                        action: { label: 'Login', onClick: () => navigate('/login') },
                        duration: 5000,
                    });
                } else {
                    toast.success('Expense added successfully!');
                }
            }
            onClose();
            // Reset form
            setAmount('');
            setNote('');
            setSelectedAccount('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add expense. Try again.');
        } finally {
            setSubmitting(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Sheet */}
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full dark:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input */}
                    <div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="100"
                                className="w-full pl-10 pr-4 py-4 text-4xl font-bold bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Account Selection (Deducted From) */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Deducted From</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {accounts.length > 0 ? (
                                accounts.map(acc => (
                                    <button
                                        key={acc._id}
                                        type="button"
                                        onClick={() => setSelectedAccount(acc._id)}
                                        className={cn(
                                            "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                                            selectedAccount === acc._id
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                                : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                                        )}
                                    >
                                        {acc.name}
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No accounts found.</p>
                            )}
                        </div>
                    </div>

                    {/* Category Grid */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Category</label>
                        <div className="grid grid-cols-3 gap-3">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "p-3 rounded-xl text-sm font-medium transition-all border-2",
                                        category === cat.id
                                            ? `border-indigo-600 ${cat.color} ring-2 ring-indigo-100 dark:ring-indigo-900`
                                            : "border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300"
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g. Coffee, Lunch"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={cn(
                            "w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all",
                            confirmNegative ? "bg-orange-500 hover:bg-orange-600" : "bg-indigo-600 hover:bg-indigo-700"
                        )}
                    >
                        {submitting ? 'Saving...' : (confirmNegative ? 'Confirm Negative Balance' : (expenseToEdit ? 'Update Expense' : 'Save Expense'))}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseSheet;
