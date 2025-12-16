import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteExpense } from '../../store/slices/expenseSlice';
import { format } from 'date-fns';
import { Trash2, Pencil, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
    food: '🍔',
    travel: '🚕',
    study: '📚',
    fun: '🎮',
    rent: '🏠',
    other: '🔹'
};

const ExpenseItem = ({ expense, onEdit, readOnly = false }) => {
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

    const isIncome = expense.type === 'income';
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-3 group hover:shadow-md transition-all active:scale-[0.99]">
            {/* Main Content */}
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                    className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-2xl shadow-sm border border-gray-50 dark:border-slate-700 ${isIncome ? 'bg-green-100 text-green-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                    onClick={onEdit}
                >
                    {CATEGORY_ICONS[expense.category] || (isIncome ? '💰' : '🔹')}
                </div>

                {/* Transaction Info - Clickable */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{expense.note || expense.category}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium truncate">
                        {format(new Date(expense.date), 'dd MMM, h:mm a')} • <span className="capitalize">{expense.category}</span>
                    </p>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-black tracking-tight whitespace-nowrap shadow-sm border cursor-pointer ${isIncome
                            ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                            : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                            }`}
                        onClick={onEdit}
                    >
                        {isIncome ? '+' : '-'} ₹{expense.amount}
                    </span>

                    {/* 3-Dot Menu */}
                    {!readOnly && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowOptions(!showOptions);
                                }}
                                className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none"
                            >
                                <MoreVertical size={18} />
                            </button>
                            {showOptions && (
                                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-20">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit();
                                            setShowOptions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <Pencil size={16} className="mr-3 text-indigo-500" /> Edit
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-slate-700"></div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                            setShowOptions(false);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <Trash2 size={16} className="mr-3" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ExpenseItem;
