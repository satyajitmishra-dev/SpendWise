import { useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../store/slices/expenseSlice';
import ExpenseItem from '../components/features/ExpenseItem';
import { Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpensesPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.expenses);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.category === filter;
    });

    return (
        <div className="p-6 pb-24">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Daily Expenses</h1>
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none bg-gray-100 dark:bg-slate-800 pl-3 pr-8 py-2 rounded-lg text-sm font-medium focus:outline-none dark:text-white"
                    >
                        <option value="all">All</option>
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
                                    <ExpenseItem expense={expense} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default ExpensesPage;
