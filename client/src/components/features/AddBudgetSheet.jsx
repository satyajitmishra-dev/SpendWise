import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBudget, updateBudget } from '../../store/slices/budgetSlice';
import { X, Calendar, PieChart, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth, addDays, format, isWithinInterval } from 'date-fns';

const CATEGORIES = [
    { id: 'food', label: 'Food 🍔', color: 'bg-orange-100 text-orange-600' },
    { id: 'travel', label: 'Travel 🚕', color: 'bg-blue-100 text-blue-600' },
    { id: 'study', label: 'Study 📚', color: 'bg-green-100 text-green-600' },
    { id: 'fun', label: 'Fun 🎮', color: 'bg-purple-100 text-purple-600' },
    { id: 'rent', label: 'Rent 🏠', color: 'bg-red-100 text-red-600' },
    { id: 'Monthly Budget', label: 'Overall 💰', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-600' },
];

const AddBudgetSheet = ({ isOpen, onClose, initialData }) => {
    const dispatch = useDispatch();
    const budgets = useSelector(state => state.budgets.items);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // Confirmation State

    // Date State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setShowConfirm(false); // Reset on open
            if (initialData) {
                setAmount(initialData.amount.toString());
                setCategory(initialData.category);
                setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : format(startOfMonth(new Date()), 'yyyy-MM-dd'));
                setEndDate(initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : format(endOfMonth(new Date()), 'yyyy-MM-dd'));
            } else {
                setAmount('');
                setCategory(CATEGORIES[0].id);
                // Default to This Month
                setStartDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
                setEndDate(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
            }
        }
    }, [isOpen, initialData]);

    const handleSmartSelect = (type) => {
        const today = new Date();
        if (type === 'month') {
            setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
            setEndDate(format(endOfMonth(today), 'yyyy-MM-dd'));
        } else if (type === '30days') {
            setStartDate(format(today, 'yyyy-MM-dd'));
            setEndDate(format(addDays(today, 30), 'yyyy-MM-dd'));
        }
    };

    const proceedSubmit = async () => {
        setSubmitting(true);
        try {
            const budgetData = {
                amount: parseFloat(amount),
                category,
                period: 'custom',
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            };

            if (initialData) {
                await dispatch(updateBudget({
                    id: initialData._id,
                    data: budgetData
                })).unwrap();
                toast.success('Budget updated successfully!');
            } else {
                await dispatch(addBudget(budgetData)).unwrap();
                toast.success('Budget set successfully!');
            }

            onClose();
            setAmount('');
            setCategory(CATEGORIES[0].id);
            setShowConfirm(false);
        } catch (err) {
            console.error(err);
            toast.error(initialData ? 'Failed to update budget.' : 'Failed to set budget.');
        } finally {
            setSubmitting(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) {
            toast.error('Please enter a budget limit');
            return;
        }

        // Logic: If user is adding a NEW category budget, AND an Overall budget exists for this period?
        // Simplification: Check if ANY valid Overall budget exists.
        // If user is adding "Monthly Budget" (Overall), no warning needed (unless replacing, but that's handled by update vs add).

        const isOverall = category === 'Monthly Budget';

        if (!isOverall && !initialData) {
            const overallBudget = budgets.find(b => b.category === 'Monthly Budget');

            // Optionally check date overlap too?
            // Let's keep it simple: if Overall exists, warn.
            if (overallBudget) {
                setShowConfirm(true);
                return;
            }
        }

        await proceedSubmit();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                {showConfirm ? (
                    <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Overall Budget Exists</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                            You already have a Monthly Limit set. This <strong>{CATEGORIES.find(c => c.id === category)?.label}</strong> budget will help you track specifically, but your total spending limit is typically controlled by your Overall Budget.
                            <br /><br />
                            Do you still want to add this?
                        </p>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white font-bold rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={proceedSubmit}
                                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none"
                            >
                                Add Anyway
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">
                                {initialData ? 'Edit Budget' : 'Set Budget Limit'}
                            </h2>
                            <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Limit</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="5000"
                                        className="w-full pl-10 pr-4 py-4 text-4xl font-bold bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Date Logic */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                                <div className="flex gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSmartSelect('month')}
                                        className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400 rounded-lg text-xs font-bold border border-indigo-200 dark:border-slate-700 hover:bg-indigo-100 transition-colors"
                                    >
                                        This Month
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSmartSelect('30days')}
                                        className="flex-1 py-2 px-3 bg-emerald-50 text-emerald-700 dark:bg-slate-800 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-slate-700 hover:bg-emerald-100 transition-colors"
                                    >
                                        Next 30 Days
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm font-bold dark:text-white border-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <span className="text-gray-400">to</span>
                                    <div className="relative flex-1">
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm font-bold dark:text-white border-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
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

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                                {submitting ? 'Saving...' : (initialData ? 'Update Budget' : 'Set Budget')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddBudgetSheet;
