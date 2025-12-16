import { useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { cn, formatSmartDate } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, deleteExpense } from '../store/slices/expenseSlice';
import { fetchAccounts } from '../store/slices/accountSlice';
import ExpenseItem from '../components/features/ExpenseItem';
import AddExpenseSheet from '../components/features/AddExpenseSheet';
import { Filter, Plus, Trash2, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ExpensesPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.expenses);
    const { items: accounts } = useSelector((state) => state.accounts);
    const [filter, setFilter] = useState('all');
    const [accountFilter, setAccountFilter] = useState('all');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const handleEdit = (expense) => {
        setExpenseToEdit(expense);
        setIsSheetOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this expense?')) {
            try {
                await dispatch(deleteExpense(id)).unwrap();
                toast.success('Expense deleted');
            } catch (error) {
                toast.error('Failed to delete expense');
            }
        }
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setExpenseToEdit(null);
    };

    useEffect(() => {
        dispatch(fetchExpenses());
        dispatch(fetchAccounts());
    }, [dispatch]);

    const filteredItems = items.filter(item => {
        const matchesCategory = filter === 'all' || item.category === filter;
        const matchesAccount = accountFilter === 'all' || item.accountId === accountFilter;
        return matchesCategory && matchesAccount;
    });

    const getAccountName = (id) => {
        const acc = accounts.find(a => a._id === id);
        return acc ? acc.name : 'Unknown';
    };

    return (
        <div className="p-6 pb-24 md:pb-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-1">Expenses</h1>
                    <p className="text-gray-500 dark:text-slate-400">Track and manage your spending.</p>
                </div>

                <div className="flex flex-row overflow-x-auto pb-2 md:pb-0 gap-3 no-scrollbar mask-gradient-right">
                    {/* Account Filter */}
                    <div className="relative shrink-0">
                        <select
                            value={accountFilter}
                            onChange={(e) => setAccountFilter(e.target.value)}
                            className="appearance-none bg-white dark:bg-slate-900 pl-4 pr-10 py-2.5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-slate-700 shadow-sm min-w-[130px] transition-all hover:border-indigo-300"
                        >
                            <option value="all">All Wallets</option>
                            {accounts.map(acc => (
                                <option key={acc._id} value={acc._id}>{acc.name}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Category Filter */}
                    <div className="relative shrink-0">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none bg-white dark:bg-slate-900 pl-4 pr-10 py-2.5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white border border-gray-200 dark:border-slate-700 shadow-sm min-w-[140px] transition-all hover:border-indigo-300"
                        >
                            <option value="all">Categories</option>
                            <option value="food">Food</option>
                            <option value="travel">Travel</option>
                            <option value="study">Study</option>
                            <option value="fun">Fun</option>
                            <option value="rent">Rent</option>
                            <option value="other">Other</option>
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white shadow-sm" />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
                            <p className="text-gray-400 dark:text-slate-500 font-medium text-lg">No expenses found</p>
                            <p className="text-gray-500 dark:text-slate-600 mt-2">Try adjusting filters or add a new expense.</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View - Cards */}
                            <div className="md:hidden space-y-6">
                                {Object.entries(
                                    filteredItems.reduce((groups, expense) => {
                                        const dateStr = new Date(expense.date).toLocaleDateString();
                                        if (!groups[dateStr]) groups[dateStr] = [];
                                        groups[dateStr].push(expense);
                                        return groups;
                                    }, {})
                                ).sort((a, b) => new Date(b[1][0].date) - new Date(a[1][0].date))
                                    .map(([dateLabel, expenses]) => (
                                        <div key={dateLabel} className="space-y-2">
                                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                                                {formatSmartDate(expenses[0].date)}
                                            </h3>
                                            <div className="space-y-3">
                                                {expenses.map(expense => (
                                                    <ExpenseItem key={expense._id} expense={expense} onEdit={() => handleEdit(expense)} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
                                            <th className="p-3 lg:p-6 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-6 lg:pl-8">Date</th>
                                            <th className="p-3 lg:p-6 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Transaction</th>
                                            <th className="p-3 lg:p-6 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden lg:table-cell">Category</th>
                                            <th className="p-3 lg:p-6 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden xl:table-cell">Wallet</th>
                                            <th className="p-3 lg:p-6 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Amount</th>
                                            <th className="p-3 lg:p-6 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right pr-6 lg:pr-8">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                                        {filteredItems.map((expense) => {
                                            const isIncome = expense.type === 'income';
                                            const CATEGORY_ICONS = {
                                                food: '🍔',
                                                travel: '🚕',
                                                study: '📚',
                                                fun: '🎮',
                                                rent: '🏠',
                                                other: '🔹'
                                            };
                                            return (
                                                <tr key={expense._id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-all duration-200">
                                                    {/* Date */}
                                                    <td className="p-3 lg:p-6 pl-6 lg:pl-8 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                                {new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                            </span>
                                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                                                {new Date(expense.date).getFullYear()}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Note */}
                                                    <td className="p-3 lg:p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-lg shrink-0 ${isIncome ? 'bg-green-100 text-green-600' : 'bg-indigo-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                                                {CATEGORY_ICONS[expense.category] || (isIncome ? '💰' : '🔹')}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white max-w-[120px] lg:max-w-[200px] truncate">
                                                                    {expense.note || expense.category}
                                                                </p>
                                                                {/* Show category text on mobile/tablet if column is hidden */}
                                                                <p className="text-[10px] text-gray-400 lg:hidden uppercase tracking-wide">
                                                                    {expense.category}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Category (Hidden on Tablet, visible on Desktop) */}
                                                    <td className="p-3 lg:p-6 hidden lg:table-cell">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 capitalize border border-gray-200 dark:border-slate-700">
                                                            {expense.category}
                                                        </span>
                                                    </td>

                                                    {/* Wallet (Hidden on smaller Desktop, visible on XL) */}
                                                    <td className="p-3 lg:p-6 text-sm font-medium text-gray-500 dark:text-gray-400 hidden xl:table-cell">
                                                        {getAccountName(expense.accountId)}
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="p-3 lg:p-6 text-right">
                                                        <span className={`inline-flex items-center px-2.5 py-1 lg:px-3 rounded-lg text-sm font-black tracking-tight whitespace-nowrap ${isIncome
                                                                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                            }`}>
                                                            {isIncome ? '+' : '-'} ₹{expense.amount}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="p-3 lg:p-6 text-right pr-6 lg:pr-8">
                                                        <div className="flex items-center justify-end gap-1 lg:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                                                            <button
                                                                onClick={() => handleEdit(expense)}
                                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                                                title="Edit"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(expense._id)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </motion.div>
            )}

            <AddExpenseSheet isOpen={isSheetOpen} onClose={handleCloseSheet} expenseToEdit={expenseToEdit} />
        </div>
    );
};

export default ExpensesPage;
