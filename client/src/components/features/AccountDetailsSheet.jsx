import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { X, ArrowDownCircle, ArrowUpCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import ExpenseItem from './ExpenseItem';
import AddExpenseSheet from './AddExpenseSheet';
import { fetchExpenses } from '../../store/slices/expenseSlice';

const AccountDetailsSheet = ({ isOpen, onClose, account }) => {
    const dispatch = useDispatch();
    const { items: expenses, loading } = useSelector(state => state.expenses);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const handleAdd = () => {
        setExpenseToEdit(null);
        setIsAddOpen(true);
    };

    const handleEdit = (expense) => {
        setExpenseToEdit(expense);
        setIsAddOpen(true);
    };

    // Fetch expenses when sheet opens
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchExpenses());
        }
    }, [isOpen, dispatch]);

    if (!isOpen || !account) return null;

    // Filter expenses for this account
    const accountExpenses = expenses.filter(exp => exp.accountId === account._id);

    // Sort by date desc
    const sortedExpenses = accountExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-0 h-[85vh] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden">

                {/* Header (Account Card Style) */}
                <div
                    className="p-6 text-white relative overflow-hidden shrink-0"
                    style={{ backgroundColor: account.color || '#6366f1' }}
                >
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-24 h-24 rounded-full bg-black opacity-10 blur-xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider">{account.type} Account</h2>
                                <h1 className="text-2xl font-bold">{account.name}</h1>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleAdd} className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors text-white" title="Add Transaction">
                                    <Plus size={20} />
                                </button>
                                <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold tracking-tight">₹ {account.balance.toLocaleString('en-IN')}</h3>
                        <p className="text-white/60 text-xs mt-2">Available Balance</p>
                    </div>
                </div>

                {/* Statement Body */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        Statement History
                        <span className="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {accountExpenses.length}
                        </span>
                    </h3>

                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-16 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                            <div className="h-16 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                            <div className="h-16 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                        </div>
                    ) : sortedExpenses.length > 0 ? (
                        <div className="space-y-3">
                            {sortedExpenses.map(expense => (
                                <ExpenseItem
                                    key={expense._id}
                                    expense={expense}
                                    onEdit={() => handleEdit(expense)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <ArrowDownCircle size={48} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-gray-500">No transactions yet</p>
                        </div>
                    )}
                </div>
            </div>

            <AddExpenseSheet
                isOpen={isAddOpen}
                onClose={() => { setIsAddOpen(false); setExpenseToEdit(null); }}
                expenseToEdit={expenseToEdit}
                initialAccountId={account._id}
            />
        </div>
    );
};

export default AccountDetailsSheet;
