import { useDispatch } from 'react-redux';
import { deleteExpense } from '../../store/slices/expenseSlice';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
    food: '🍔',
    travel: '🚕',
    study: '📚',
    fun: '🎮',
    rent: '🏠',
    other: '🔹'
};

const ExpenseItem = ({ expense }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        if (window.confirm('Delete this expense?')) {
            try {
                await dispatch(deleteExpense(expense._id)).unwrap();
                toast.success('Expense deleted');
            } catch (error) {
                toast.error('Failed to delete expense');
            }
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-3 group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl">
                    {CATEGORY_ICONS[expense.category] || '🔹'}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{expense.note || expense.category}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {format(new Date(expense.date), 'MMM d, h:mm a')} • {expense.category}
                    </p>
                </div>
            </div>
            <div className="text-right flex items-center gap-3">
                <span className="block font-bold text-lg text-gray-900 dark:text-white">-₹{expense.amount}</span>
                <button
                    onClick={handleDelete}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default ExpenseItem;
