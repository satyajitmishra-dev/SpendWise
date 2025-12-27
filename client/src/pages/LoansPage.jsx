import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoans, updateLoan } from '../store/slices/loanSlice';
import { Plus, Filter, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerConfetti } from '../utils/confettiUtils';
import AddLoanSheet from '../components/features/AddLoanSheet';
import { cn } from '../lib/utils';

const LoansPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.loans);
    const [filter, setFilter] = useState('all'); // all, given, taken
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchLoans());
    }, [dispatch]);

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    const handleToggleStatus = (item) => {
        const newStatus = item.status === 'settled' ? 'pending' : 'settled';
        // Optional: Confirm only for settling, or both? Let's just do it directly or quick confirm
        if (newStatus === 'settled' || confirm('Mark as pending again?')) {
            if (newStatus === 'settled') triggerConfetti();
            dispatch(updateLoan({ id: item._id, data: { status: newStatus } }));
        }
    };

    const LoanItem = ({ item }) => (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-opacity",
                    item.type === 'given' ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                    item.status === 'settled' && "opacity-50 grayscale"
                )}>
                    {item.type === 'given' ? '⬆️' : '⬇️'}
                </div>
                <div>
                    <h3 className={cn("font-bold text-gray-800 dark:text-white transition-all", item.status === 'settled' && "line-through text-gray-400 dark:text-gray-500")}>{item.person}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    {item.dueDate && (
                        <p className={cn("text-[10px] font-medium", item.status === 'settled' ? "text-gray-400 line-through" : "text-orange-500")}>
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
            <div className="text-right">
                <p className={cn(
                    "text-lg font-bold transition-all",
                    item.type === 'given' ? "text-red-600" : "text-green-600",
                    item.status === 'settled' && "line-through opacity-50"
                )}>
                    ₹{item.amount}
                </p>
                <button
                    onClick={() => handleToggleStatus(item)}
                    className={cn(
                        "inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full mt-1 transition-all active:scale-95",
                        item.status === 'settled'
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                            : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-100"
                    )}
                >
                    {item.status === 'settled' ? <><CheckCircle size={12} /> Paid</> : <><Clock size={12} /> Pending</>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-6 pb-24">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Loans & Debts</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none bg-gray-100 dark:bg-slate-800 dark:text-white pl-3 pr-8 py-2 rounded-lg text-sm font-medium focus:outline-none"
                        >
                            <option value="all">All</option>
                            <option value="given">Lent</option>
                            <option value="taken">Borrowed</option>
                        </select>
                        <Filter size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {loading && items.length === 0 ? (
                <div className="text-center py-10 text-gray-400">Loading loans...</div>
            ) : (
                <motion.div
                    className="space-y-3"
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
                                <p className="text-gray-400 dark:text-slate-500 font-medium">No active loans</p>
                                <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">Track money you owe or are owed</p>
                            </motion.div>
                        ) : (
                            filteredItems.map(item => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <LoanItem item={item} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            <AddLoanSheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
        </div>
    );
};

export default LoansPage;
