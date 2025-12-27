import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addExpense, updateExpense } from '../../store/slices/expenseSlice';
import { fetchAccounts, updateAccountBalance, addAccount } from '../../store/slices/accountSlice';
import {
    X, Calendar, FileText, ArrowRight, Calculator, Check, Plus,
    Utensils, Car, GraduationCap, Gamepad2, Home, Lightbulb, // Expense Icons
    Banknote, Gift, RefreshCcw, Gem, Wallet, ChevronRight, PenLine, // Income Icons & Helpers
    TrendingDown, TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import CustomCalendar from '../ui/CustomCalendar';
import { format, isToday } from 'date-fns';
import { triggerHaptic, HAPTIC_SUCCESS, HAPTIC_ERROR, HAPTIC_TAP } from '../../lib/haptics';

const CATEGORIES = [
    { id: 'food', label: 'Food', icon: Utensils, color: 'text-orange-500' },
    { id: 'travel', label: 'Travel', icon: Car, color: 'text-blue-500' },
    { id: 'study', label: 'Study', icon: GraduationCap, color: 'text-emerald-500' },
    { id: 'fun', label: 'Fun', icon: Gamepad2, color: 'text-purple-500' },
    { id: 'rent', label: 'Rent', icon: Home, color: 'text-red-500' },
    { id: 'other', label: 'Other', icon: Lightbulb, color: 'text-yellow-500' },
];

const INCOME_CATEGORIES = [
    { id: 'salary', label: 'Salary', icon: Banknote, color: 'text-green-500' },
    { id: 'gift', label: 'Gift', icon: Gift, color: 'text-pink-500' },
    { id: 'refund', label: 'Refund', icon: RefreshCcw, color: 'text-blue-400' },
    { id: 'other', label: 'Other', icon: Gem, color: 'text-indigo-400' },
];

const AddExpenseSheet = ({ isOpen, onClose, expenseToEdit, initialData, initialAccountId, onExpenseAdded }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { items: accounts } = useSelector(state => state.accounts);

    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [note, setNote] = useState('');

    const getLocalDate = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [date, setDate] = useState(getLocalDate());
    const [selectedAccount, setSelectedAccount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmNegative, setConfirmNegative] = useState(false);
    const [confirmNoAccount, setConfirmNoAccount] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setConfirmNegative(false);
        setConfirmNoAccount(false);
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
            } else if (initialData) {
                setAmount(initialData.amount ? initialData.amount.toString() : '');
                setType(initialData.type || 'expense');
                setCategory(initialData.category || (initialData.type === 'income' ? INCOME_CATEGORIES[0].id : CATEGORIES[0].id));
                setNote(initialData.note || '');
                setDate(getLocalDate());
                setSelectedAccount(initialData.accountId || '');
            } else {
                setAmount('');
                setType('expense');
                setCategory(CATEGORIES[0].id);
                setNote('');
                setDate(getLocalDate());
                setSelectedAccount(initialAccountId || '');
            }
        }
    }, [isOpen, expenseToEdit, initialData, initialAccountId, dispatch]);

    useEffect(() => {
        if (type === 'expense') {
            if (!CATEGORIES.find(c => c.id === category)) setCategory(CATEGORIES[0].id);
        } else {
            if (!INCOME_CATEGORIES.find(c => c.id === category)) setCategory(INCOME_CATEGORIES[0].id);
        }
    }, [type]);

    const currentCategories = type === 'expense' ? CATEGORIES : INCOME_CATEGORIES;

    // Helper to format date display
    const getDisplayDate = (dateStr) => {
        if (!dateStr) return 'Select Date';
        const d = new Date(dateStr);
        if (isToday(d)) return `Today · ${format(d, 'd MMM')}`;
        return format(d, 'd MMM yyyy');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) {
            toast.error('Please enter an amount');
            return;
        }

        let parsedAmount = 0;
        try {
            if (/[\+\-\*\/]/.test(amount.toString())) {
                // eslint-disable-next-line no-new-func
                parsedAmount = new Function('return ' + amount)();
            } else {
                parsedAmount = parseFloat(amount);
            }
        } catch (err) {
            toast.error('Invalid amount format');
            return;
        }

        parsedAmount = Math.round(parsedAmount * 100) / 100;

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        if (!selectedAccount && !confirmNoAccount) {
            setConfirmNoAccount(true);
            toast.warning("No Wallet Selected", {
                description: "Press Save again to create a 'Other' wallet automatically.",
                action: {
                    label: 'Create Now',
                    onClick: async () => {
                        // Manual trigger if they click the button
                        try {
                            // CHECK FOR EXISTING "OTHER"
                            const existing = accounts.find(a => a.name === 'Other');
                            if (existing) {
                                setSelectedAccount(existing._id);
                                toast.success("Selected existing 'Other' wallet!");
                            } else {
                                const newAcc = await dispatch(addAccount({ name: 'Other', type: 'other', balance: 0 })).unwrap();
                                setSelectedAccount(newAcc._id);
                                toast.success("Created 'Other' wallet!");
                            }
                        } catch (e) {
                            toast.error("Failed to select wallet");
                        }
                    }
                },
                duration: 5000,
            });
            return;
        }

        // Logic to Auto-Create Account if confirmed
        let finalAccountId = selectedAccount;
        if (!finalAccountId && confirmNoAccount) {
            // START AUTO-CREATION
            try {
                // Check if "Other" already exists
                const existing = accounts.find(a => a.name === 'Other');

                if (existing) {
                    finalAccountId = existing._id;
                    toast.success("Saved to existing 'Other' wallet!");
                } else {
                    // Create "Other" wallet
                    const newAcc = await dispatch(addAccount({ name: 'Other', type: 'other', balance: 0 })).unwrap();
                    finalAccountId = newAcc._id;
                    toast.success("Created 'Other' wallet & saved expense!");
                }
            } catch (e) {
                console.error(e);
                toast.error("Failed to auto-create wallet. Please try adding one manually.");
                return;
            }
        }

        if (type === 'expense' && finalAccountId) {
            const account = accounts.find(a => a._id === finalAccountId);
            // If it's a new account, it might not be in 'accounts' list yet if selector hasn't refreshed?
            // But we just created it. Redux should update. 
            // However, we can proceed without strict balance check for the NEW account (it has 0 balance).
            // Logic below checks balance. New account 0 balance - expense negative?

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
                await dispatch(updateExpense({
                    id: expenseToEdit._id,
                    data: { amount: parsedAmount, category, note, date, accountId: finalAccountId, type }
                })).unwrap();

                if (expenseToEdit.accountId) {
                    const oldAmt = parseFloat(expenseToEdit.amount);
                    const oldImpact = expenseToEdit.type === 'income' ? -oldAmt : oldAmt;
                    dispatch(updateAccountBalance({ accountId: expenseToEdit.accountId, amount: oldImpact }));
                }

                if (finalAccountId) {
                    const newImpact = type === 'income' ? parsedAmount : -parsedAmount;
                    dispatch(updateAccountBalance({ accountId: finalAccountId, amount: newImpact }));
                }

                toast.success('Transaction updated!');
            } else {
                const now = new Date();
                let finalDate = new Date(date);
                const [y, m, d] = date.split('-').map(Number);
                finalDate = new Date(y, m - 1, d);

                const todayStr = getLocalDate();
                if (date === todayStr) {
                    finalDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                }

                await dispatch(addExpense({
                    amount: parsedAmount,
                    category,
                    note,
                    date: finalDate.toISOString(),
                    accountId: finalAccountId,
                    type
                })).unwrap();

                if (finalAccountId) {
                    dispatch(updateAccountBalance({
                        accountId: finalAccountId,
                        amount: type === 'income' ? parsedAmount : -parsedAmount
                    }));
                }

                // Removed the "Money not safe" toast since we forced account creation
                toast.success('Expense added successfully!');
            }
            triggerHaptic(HAPTIC_SUCCESS);
            onClose();
            setAmount('');
            setNote('');
            setSelectedAccount('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add expense. Try again.');
            triggerHaptic(HAPTIC_ERROR);
        } finally {
            setSubmitting(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    // Derived state for button text
    const getButtonText = () => {
        if (confirmNegative) return 'Confirm Negative Balance';
        if (confirmNoAccount) return 'Confirm without Account';
        if (submitting) return 'Saving...';

        const action = expenseToEdit ? 'Update' : 'Save';
        const typeLabel = type === 'income' ? 'Income' : 'Expense';
        const amtLabel = amount ? `₹${amount}` : '';

        return `${action} ${amtLabel} ${typeLabel}`;
    };

    const isFormValid = amount && parseFloat(amount) > 0 && selectedAccount;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Sheet */}
            <div className={`relative bg-white dark:bg-slate-900 w-full max-w-[28rem] rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[96vh] overflow-y-auto no-scrollbar border-t-[6px] ${type === 'income' ? 'border-green-500' : 'border-indigo-500'} transition-all`}>

                {/* Header & Toggle Row */}
                {/* Header Row: Title & Close */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold dark:text-white tracking-tight">
                        {expenseToEdit ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95">
                        <X size={22} />
                    </button>
                </div>

                {/* Toggle Row */}
                <div className="mb-5">
                    <div className="flex p-1.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-xl relative w-full">
                        <div
                            className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] bg-white dark:bg-slate-700 rounded-lg shadow-sm transition-transform duration-300 ease-spring ${type === 'income' ? 'translate-x-full' : 'translate-x-0'}`}
                        />
                        <button
                            type="button"
                            onClick={() => { setType('expense'); triggerHaptic(HAPTIC_TAP); }}
                            className={`flex-1 relative z-10 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${type === 'expense' ? 'text-indigo-600 dark:text-white scale-100' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}
                        >
                            <TrendingDown size={16} strokeWidth={2.5} />
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => { setType('income'); triggerHaptic(HAPTIC_TAP); }}
                            className={`flex-1 relative z-10 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${type === 'income' ? 'text-green-600 dark:text-white scale-100' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}
                        >
                            <TrendingUp size={16} strokeWidth={2.5} />
                            Income
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* HERO Amount Input */}
                    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
                        <div className="flex flex-col items-center justify-center py-2">
                            <div className="relative w-full max-w-[200px]">
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold transition-colors ${amount ? (type === 'income' ? 'text-green-600' : 'text-slate-800 dark:text-white') : 'text-gray-300'}`}>₹</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={amount}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^[0-9+\-*/().\s]*$/.test(val)) setAmount(val);
                                    }}
                                    placeholder="0"
                                    className={`w-full pl-8 pr-4 py-2 text-5xl font-black bg-transparent border-none focus:ring-0 outline-none text-center tracking-tight transition-colors ${type === 'income' ? 'text-green-600 placeholder:text-green-100/50' : 'text-slate-800 dark:text-white placeholder:text-gray-200'}`}
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs font-medium text-gray-400 animate-in fade-in slide-in-from-top-1">Enter amount spent</p>
                        </div>

                        {amount && /[\+\-\*\/]/.test(amount) && (
                            <div className="absolute right-0 top-0 flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full animate-in fade-in">
                                <Calculator size={12} className="text-gray-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    = {(() => {
                                        try {
                                            // eslint-disable-next-line no-new-func
                                            const res = new Function('return ' + amount)();
                                            return isNaN(res) ? '...' : Math.round(res * 100) / 100;
                                        } catch { return '...'; }
                                    })()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Account Scroller - Enhanced Affordance */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2 mx-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{type === 'income' ? 'Deposited To' : 'Deducted From'}</label>
                            {!selectedAccount && <span className="text-[10px] text-indigo-500 font-medium animate-pulse">Select account &rarr;</span>}
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar snap-x">
                            {accounts.length > 0 ? (
                                <>
                                    {accounts.map(acc => (
                                        <button
                                            key={acc._id}
                                            type="button"
                                            onClick={() => { setSelectedAccount(acc._id); triggerHaptic(HAPTIC_TAP); }}
                                            className={cn(
                                                "snap-start flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-bold transition-all border-2 flex flex-col items-start gap-1 min-w-[7rem] group active:scale-95",
                                                selectedAccount === acc._id
                                                    ? (type === 'income' ? "bg-green-50 border-green-500 text-green-700 shadow-sm" : "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm")
                                                    : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-indigo-200"
                                            )}
                                        >
                                            <div className="flex w-full justify-between items-center">
                                                <Wallet size={16} className={cn("opacity-70", selectedAccount === acc._id ? "opacity-100" : "")} />
                                                {selectedAccount === acc._id && <Check size={14} strokeWidth={3} className="animate-in zoom-in" />}
                                            </div>
                                            <span className="truncate max-w-[90px]">{acc.name}</span>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => { onClose(); navigate('/accounts', { state: { openAdd: true } }); }}
                                        className="snap-start flex-shrink-0 flex items-center justify-center w-12 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { onClose(); navigate('/accounts', { state: { openAdd: true } }); }}
                                    className="flex w-full items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                >
                                    <span>Add Account</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Grid - Enhanced Selection */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Category</label>
                        <div className="grid grid-cols-3 gap-3">
                            {currentCategories.map(cat => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => { setCategory(cat.id); triggerHaptic(HAPTIC_TAP); }}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border-2 active:scale-95 group",
                                            isSelected
                                                ? `border-${type === 'income' ? 'green' : 'indigo'}-500 bg-${type === 'income' ? 'green' : 'indigo'}-50 dark:bg-slate-800 shadow-sm scale-[1.02]`
                                                : "border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400"
                                        )}
                                    >
                                        <Icon
                                            size={24}
                                            weight="fill"
                                            className={cn(
                                                "transition-colors",
                                                isSelected ? cat.color : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                            )}
                                        />
                                        <span className={cn("text-[10px] font-bold uppercase tracking-tight", isSelected ? `text-${type === 'income' ? 'green' : 'indigo'}-700` : "")}>
                                            {cat.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Split Row: Note & Date */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                <PenLine size={16} />
                            </span>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a short note (optional)"
                                className={`w-full pl-10 pr-3 py-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 dark:text-white font-medium text-xs placeholder:text-gray-400 transition-all ${type === 'income' ? 'focus:ring-green-500' : 'focus:ring-indigo-500'}`}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Calendar size={16} />
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={`w-full pl-10 pr-3 py-3.5 text-left bg-gray-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 dark:text-white font-bold text-xs truncate transition-all ${type === 'income' ? 'focus:ring-green-500' : 'focus:ring-indigo-500'} ${showCalendar ? 'ring-2 ring-indigo-200 dark:ring-indigo-900' : ''}`}
                            >
                                {getDisplayDate(date)}
                            </button>

                            {/* Calendar Popup */}
                            {showCalendar && (
                                <div className="absolute bottom-full mb-3 right-0 z-50 animate-in zoom-in-95 duration-200 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-200">
                                    <div className="relative bg-white dark:bg-slate-900">
                                        <CustomCalendar
                                            value={date}
                                            onChange={(newDate) => {
                                                setDate(newDate.toISOString().split('T')[0]);
                                                setShowCalendar(false);
                                            }}
                                            maxDate={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowCalendar(false)}></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !amount || parseFloat(amount) <= 0}
                        className={cn(
                            "w-full text-white py-5 rounded-2xl font-bold text-xl shadow-xl dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed",
                            confirmNegative ? "bg-orange-500 hover:bg-orange-600" : (type === 'income' ? "bg-green-600 hover:bg-green-700 shadow-green-200/50" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200/50")
                        )}
                    >
                        {submitting ? (
                            <span className="opacity-90">Saving...</span>
                        ) : (
                            <>
                                <span>{getButtonText()}</span>
                                {!confirmNegative && !confirmNoAccount && <ArrowRight size={20} className="opacity-80" />}
                            </>
                        )}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default AddExpenseSheet;
