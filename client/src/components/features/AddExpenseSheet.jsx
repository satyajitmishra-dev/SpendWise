import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addExpense, updateExpense } from '../../store/slices/expenseSlice';
import { fetchAccounts, updateAccountBalance } from '../../store/slices/accountSlice'; // Import actions
// Force HMR update
import { X, Calendar, Tag, FileText, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import CustomCalendar from '../ui/CustomCalendar';
import { format } from 'date-fns';

const CATEGORIES = [
    { id: 'food', label: 'Food 🍔', color: 'bg-orange-100 text-orange-600' },
    { id: 'travel', label: 'Travel 🚕', color: 'bg-blue-100 text-blue-600' },
    { id: 'study', label: 'Study 📚', color: 'bg-green-100 text-green-600' },
    { id: 'fun', label: 'Fun 🎮', color: 'bg-purple-100 text-purple-600' },
    { id: 'rent', label: 'Rent 🏠', color: 'bg-red-100 text-red-600' },
    { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-600' },
];

const INCOME_CATEGORIES = [
    { id: 'salary', label: 'Salary 💰', color: 'bg-green-100 text-green-600' },
    { id: 'gift', label: 'Gift 🎁', color: 'bg-pink-100 text-pink-600' },
    { id: 'refund', label: 'Refund ↩️', color: 'bg-blue-100 text-blue-600' },
    { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-600' },
];

const AddExpenseSheet = ({ isOpen, onClose, expenseToEdit, initialAccountId, onExpenseAdded }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { items: accounts } = useSelector(state => state.accounts);

    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense'); // 'expense' or 'income'
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmNegative, setConfirmNegative] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

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
                setType(expenseToEdit.type || 'expense');
                setCategory(expenseToEdit.category);
                setNote(expenseToEdit.note || '');
                setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
                setSelectedAccount(expenseToEdit.accountId || '');
            } else {
                // Reset to defaults for Add mode
                setAmount('');
                setType('expense');
                setCategory(CATEGORIES[0].id);
                setNote('');
                setDate(new Date().toISOString().split('T')[0]);
                setSelectedAccount(initialAccountId || '');
            }
        }
    }, [isOpen, expenseToEdit, initialAccountId, dispatch]);

    // Switch categories when type changes
    useEffect(() => {
        if (type === 'expense') {
            if (!CATEGORIES.find(c => c.id === category)) setCategory(CATEGORIES[0].id);
        } else {
            if (!INCOME_CATEGORIES.find(c => c.id === category)) setCategory(INCOME_CATEGORIES[0].id);
        }
    }, [type]);

    const currentCategories = type === 'expense' ? CATEGORIES : INCOME_CATEGORIES;

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

        // Check for negative balance (Only for Expense)
        if (type === 'expense' && selectedAccount) {
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
                    data: { amount: parsedAmount, category, note, date, accountId: selectedAccount || null, type }
                })).unwrap();
                toast.success('Transaction updated!');
            } else {
                // Add Logic
                await dispatch(addExpense({
                    amount: parsedAmount,
                    category,
                    note,
                    date,
                    accountId: selectedAccount || null,
                    type
                })).unwrap();

                // Update balance (Only on Add)
                if (selectedAccount) {
                    dispatch(updateAccountBalance({
                        accountId: selectedAccount,
                        amount: type === 'income' ? parsedAmount : -parsedAmount
                    }));
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
            <div className={`relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto border-t-4 ${type === 'income' ? 'border-green-500' : 'border-indigo-500'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">{expenseToEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Type Toggle */}
                    <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'income' ? 'bg-white dark:bg-slate-700 shadow text-green-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            Income
                        </button>
                    </div>
                    {/* Amount Input */}
                    <div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="100"
                                className={`w-full pl-10 pr-4 py-4 text-4xl font-bold bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 outline-none dark:text-white ${type === 'income' ? 'focus:ring-green-500 text-green-600' : 'focus:ring-indigo-500 text-gray-900'}`}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Account Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{type === 'income' ? 'Deposited To' : 'Deducted From'}</label>
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
                                                ? (type === 'income' ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-200" : "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200")
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
                            {currentCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "p-3 rounded-xl text-sm font-medium transition-all border-2",
                                        category === cat.id
                                            ? `border-${type === 'income' ? 'green' : 'indigo'}-600 ${cat.color} ring-2 ring-${type === 'income' ? 'green' : 'indigo'}-100 dark:ring-${type === 'income' ? 'green' : 'indigo'}-900`
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
                                placeholder={type === 'income' ? "e.g. Salary, Freelance" : "e.g. Coffee, Lunch"}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-1 dark:text-white ${type === 'income' ? 'focus:ring-green-500' : 'focus:ring-indigo-500'}`}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                            <button
                                type="button"
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={`w-full pl-10 pr-4 py-3 text-left bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-1 dark:text-white ${type === 'income' ? 'focus:ring-green-500' : 'focus:ring-indigo-500'} ${showCalendar ? 'ring-2 ring-indigo-100 dark:ring-indigo-900' : ''}`}
                            >
                                {date ? format(new Date(date), 'dd MMMM yyyy') : 'Select Date'}
                            </button>
                            {/* Calendar Popup */}
                            {showCalendar && (
                                <div className="absolute bottom-full mb-2 left-0 z-50 animate-in zoom-in-95 duration-200">
                                    <div className="relative">
                                        <CustomCalendar
                                            value={date}
                                            onChange={(newDate) => {
                                                setDate(newDate.toISOString().split('T')[0]);
                                                setShowCalendar(false);
                                            }}
                                            maxDate={new Date().toISOString().split('T')[0]}
                                        />
                                        {/* Arrow */}
                                        <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white dark:bg-slate-900 border-b border-r border-gray-100 dark:border-slate-800 transform rotate-45"></div>
                                    </div>
                                    {/* Backdrop for outside click */}
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowCalendar(false)}></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={cn(
                            "w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all",
                            confirmNegative ? "bg-orange-500 hover:bg-orange-600" : (type === 'income' ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700")
                        )}
                    >
                        {submitting ? 'Saving...' : (confirmNegative ? 'Confirm Negative Balance' : (expenseToEdit ? 'Update Transaction' : 'Save Transaction'))}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseSheet;
