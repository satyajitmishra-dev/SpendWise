import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense } from '../../store/slices/expenseSlice';
import { X, Calendar, Tag, FileText } from 'lucide-react';
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

const AddExpenseSheet = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) {
            toast.error('Please enter an amount');
            return;
        }

        setSubmitting(true);
        try {
            await dispatch(addExpense({
                amount: parseFloat(amount),
                category,
                note,
                date
            })).unwrap();

            toast.success('Expense added successfully!');
            onClose();
            // Reset form
            setAmount('');
            setNote('');
        } catch (error) {
            toast.error('Failed to add expense. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Sheet */}
            <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Add Expense</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
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
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-4 text-4xl font-bold bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={cn(
                                    "p-3 rounded-xl text-sm font-medium transition-all border-2",
                                    category === cat.id
                                        ? `border-indigo-600 ${cat.color} ring-2 ring-indigo-100`
                                        : "border-transparent bg-gray-50 hover:bg-gray-100 text-gray-600"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Note (optional)"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        {submitting ? 'Saving...' : 'Save Expense'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseSheet;
