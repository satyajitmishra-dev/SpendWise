import { useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../store/slices/expenseSlice';
import { fetchAccounts } from '../store/slices/accountSlice';
import ExpenseItem from '../components/features/ExpenseItem';
import AddExpenseSheet from '../components/features/AddExpenseSheet';
import { Filter, Plus } from 'lucide-react'; // Added Plus for button if needed, though usually FAB is elsewhere
import { motion, AnimatePresence } from 'framer-motion';

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

    return (
        <div className="p-6 pb-24">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Daily Expenses</h1>
                <div className="flex gap-2">
                    {/* Account Filter */}
                    <div className="relative">
                        <select
                            value={accountFilter}
                            onChange={(e) => setAccountFilter(e.target.value)}
                            className="appearance-none bg-indigo-50 dark:bg-slate-900 pl-3 pr-8 py-2 rounded-lg text-sm font-medium focus:outline-none dark:text-white border border-indigo-100 dark:border-slate-700 min-w-[100px]"
                        >
                            <option value="all">All Wallets</option>
                            {accounts.map(acc => (
                                <option key={acc._id} value={acc._id}>{acc.name}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none bg-gray-100 dark:bg-slate-800 pl-3 pr-8 py-2 rounded-lg text-sm font-medium focus:outline-none dark:text-white"
                        >
                            <option value="all">All Categories</option>
                            <option value="food">Food</option>
                            <option value="travel">Travel</option>
                            <option value="study">Study</option>
                            <option value="fun">Fun</option>
                            <option value="rent">Rent</option>
                            <option value="other">Other</option>
                        </select>
                        <Filter size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>



            {loading ? (
                <div className="space-y-4 mt-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white shadow-sm" />
                    ))}
                </div>
            ) : (
                <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800"
                            >
                                <p className="text-gray-400 dark:text-slate-500 font-medium">No expenses found</p>
                                <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">Try changing filter or add one</p>
                            </motion.div>
                        ) : (
                            filteredItems.map(expense => (
                                <motion.div
                                    key={expense._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <ExpenseItem expense={expense} onEdit={() => handleEdit(expense)} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            <AddExpenseSheet isOpen={isSheetOpen} onClose={handleCloseSheet} expenseToEdit={expenseToEdit} />
        </div>
    );
};

export default ExpensesPage;
