import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets, deleteBudget } from '../store/slices/budgetSlice';
import { fetchExpenses } from '../store/slices/expenseSlice'; // Ensure expenses are loaded
import AddBudgetSheet from '../components/features/AddBudgetSheet';
import { Skeleton } from '../components/ui/Skeleton';
import { Plus, Trash2, PieChart, TrendingUp, AlertCircle, Edit, Edit2, Edit2Icon, Edit3Icon, EditIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const CATEGORY_COLORS = {
    food: 'bg-orange-500',
    travel: 'bg-blue-500',
    study: 'bg-green-500',
    fun: 'bg-purple-500',
    rent: 'bg-red-500',
    other: 'bg-gray-500'
};

const BudgetPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const budgetState = useSelector((state) => state.budgets);
    const budgets = budgetState?.items || [];
    const budgetsLoading = budgetState?.loading || false;

    const expenseState = useSelector((state) => state.expenses);
    const expenses = expenseState?.items || [];
    const expensesLoading = expenseState?.loading || false;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    useEffect(() => {
        dispatch(fetchBudgets());
        dispatch(fetchExpenses());
    }, [dispatch]);

    // Categorical Stats (for the grid)
    const budgetStats = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        return budgets.map(budget => {
            const spent = expenses
                .filter(exp => {
                    const d = new Date(exp.date);
                    return d.getMonth() === thisMonth &&
                        d.getFullYear() === thisYear &&
                        exp.category === budget.category;
                })
                .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

            const percent = Math.min((spent / budget.amount) * 100, 100);
            return { ...budget, spent, percent };
        });
    }, [budgets, expenses]);

    // Global Stats (for the main card)
    const { totalSpentMonth, globalBudget, globalPercent } = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        // 1. Total Spent this month (ALL categories)
        const totalSpent = expenses
            .filter(exp => {
                const d = new Date(exp.date);
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            })
            .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

        // 2. Global Budget Target
        // Use user.budget (Profile Budget) if set, otherwise fallback to sum of category budgets
        const sumOfCategories = budgets.reduce((sum, b) => sum + b.amount, 0);
        // Prefer user.budget if it is non-zero, else sumOfCategories
        const effectiveBudget = (user?.budget && user.budget > 0) ? user.budget : sumOfCategories;

        const percent = effectiveBudget > 0 ? (totalSpent / effectiveBudget) * 100 : 0;

        return {
            totalSpentMonth: totalSpent,
            globalBudget: effectiveBudget,
            globalPercent: percent
        };
    }, [budgets, expenses, user]);

    const handleDelete = async (id) => {
        if (confirm('Delete this budget?')) {
            try {
                await dispatch(deleteBudget(id)).unwrap();
                toast.success('Budget removed');
            } catch (err) {
                toast.error('Failed to remove budget');
            }
        }
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setIsAddOpen(true);
    };

    const getProgressColor = (percent) => {
        if (percent >= 100) return 'bg-red-500';
        if (percent >= 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="p-6 pb-24 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Monthly Budgets</h1>
                <button
                    onClick={() => { setEditingBudget(null); setIsAddOpen(true); }}
                    className="p-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Insight Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-start mb-4 relative">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <PieChart size={24} />
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        This Month
                    </div>
                </div>
                <div>
                    <p className="text-emerald-100 text-sm font-medium mb-1">Total Budget</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold">₹{totalSpentMonth.toLocaleString()}</h2>
                        <span className="text-emerald-100">/ ₹{globalBudget.toLocaleString()}</span>
                    </div>
                </div>

                {/* Global Progress */}
                <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-xs mb-1 text-emerald-100">
                        <span>Total Usage</span>
                        <span>{Math.round(globalPercent)}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white/90 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(globalPercent, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetsLoading && budgets.length === 0 ? (
                    [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                ) : (
                    budgetStats.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 dark:bg-slate-900 rounded-3xl">
                            <PieChart className="mx-auto text-gray-300 dark:text-slate-600 mb-2" size={32} />
                            <p className="text-gray-400 dark:text-slate-500 font-medium">No budgets set</p>
                            <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">Set limits for Food, Travel, etc.</p>
                        </div>
                    ) : (
                        budgetStats.map(item => (
                            <div key={item._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 relative group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg text-white", CATEGORY_COLORS[item.category] || 'bg-gray-400')}>
                                            {item.category === 'food' && '🍔'}
                                            {item.category === 'travel' && '🚕'}
                                            {item.category === 'study' && '📚'}
                                            {item.category === 'fun' && '🎮'}
                                            {item.category === 'rent' && '🏠'}
                                            {item.category === 'other' && '📦'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-white capitalize">{item.category}</h3>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                ₹{item.amount.toLocaleString()} Limit
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-gray-300 hover:text-indigo-500 transition-colors p-1"
                                        >
                                            <EditIcon size={16} className="rotate-0" /> {/* Reusing TrendingUp as editish icon or use Pencil */}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex justify-between mb-1 items-end">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{item.spent.toLocaleString()}</span>
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-full",
                                            item.percent >= 100 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500 dark:bg-slate-800"
                                        )}>
                                            {Math.round(item.percent)}%
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", getProgressColor(item.percent))}
                                            style={{ width: `${item.percent}%` }}
                                        ></div>
                                    </div>
                                    {item.percent >= 100 && (
                                        <div className="flex items-center gap-1 mt-2 text-xs font-bold text-red-500">
                                            <AlertCircle size={12} />
                                            <span>Over Budget!</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>

            <AddBudgetSheet
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                initialData={editingBudget}
            />
        </div>
    );
};

export default BudgetPage;
