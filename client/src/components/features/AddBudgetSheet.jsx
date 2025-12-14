import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBudget, updateBudget } from '../../store/slices/budgetSlice';
import { X, Calendar, PieChart } from 'lucide-react';
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

const AddBudgetSheet = ({ isOpen, onClose, initialData }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setAmount(initialData.amount.toString());
            setCategory(initialData.category);
        } else if (isOpen) {
            setAmount('');
            setCategory(CATEGORIES[0].id);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) {
            toast.error('Please enter a budget limit');
            return;
        }

        setSubmitting(true);
        try {
            if (initialData) {
                await dispatch(updateBudget({
                    id: initialData._id,
                    data: {
                        amount: parseFloat(amount),
                        category,
                        period: 'monthly'
                    }
                })).unwrap();
                toast.success('Budget updated successfully!');
            } else {
                await dispatch(addBudget({
                    amount: parseFloat(amount),
                    category,
                    period: 'monthly'
                })).unwrap();
                toast.success('Budget set successfully!');
            }

            onClose();
            setAmount('');
            setCategory(CATEGORIES[0].id);
        } catch (err) {
            console.error(err);
            toast.error(initialData ? 'Failed to update budget.' : 'Failed to set budget.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">
                        {initialData ? 'Edit Budget' : 'Set Monthly Budget'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full dark:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Limit</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-4 text-4xl font-bold bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                autoFocus
                            />
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
            </div>
        </div>
    );
};

export default AddBudgetSheet;
