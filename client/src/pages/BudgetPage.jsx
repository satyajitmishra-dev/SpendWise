import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets, deleteBudget } from '../store/slices/budgetSlice';
import { fetchExpenses } from '../store/slices/expenseSlice'; // Ensure expenses are loaded
import AddBudgetSheet from '../components/features/AddBudgetSheet';
import { Skeleton } from '../components/ui/Skeleton';
import { Plus, Trash2, PieChart, TrendingUp, AlertCircle, Edit, Edit2, Edit2Icon, Edit3Icon, EditIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const CATEGORY_COLORS = {
    food: 'bg-orange-500',
    travel: 'bg-blue-500',
    study: 'bg-green-500',
    fun: 'bg-purple-500',
    rent: 'bg-red-500',
    other: 'bg-gray-500',
    'monthly budget': 'bg-indigo-600' // NEW
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
        const defaultStart = startOfMonth(now);
        const defaultEnd = endOfMonth(now);

        return budgets.map(budget => {
            // Determine Date Range
            const start = budget.startDate ? startOfDay(new Date(budget.startDate)) : defaultStart;
            const end = budget.endDate ? endOfDay(new Date(budget.endDate)) : defaultEnd;

            // Calculate Spent
            const localSpent = expenses.reduce((sum, exp) => {
                const expDate = new Date(exp.date);
                // Check Date
                const inTime = isWithinInterval(expDate, { start, end });
                if (!inTime) return sum;

                // Check Category
                if (budget.category === 'Monthly Budget') return sum + (parseFloat(exp.amount) || 0); // Overall
                if (exp.category === budget.category) return sum + (parseFloat(exp.amount) || 0);

                return sum;
            }, 0);

            const percent = budget.amount > 0 ? Math.min((localSpent / budget.amount) * 100, 100) : 0;
            return { ...budget, spent: localSpent, percent, startDate: start, endDate: end };
        });
    }, [budgets, expenses]);

    // Global Stats (for the main card)
    const { totalSpentMonth, globalBudget, globalPercent, dateLabel } = useMemo(() => {
        const now = new Date();
        const defaultStart = startOfMonth(now);
        const defaultEnd = endOfMonth(now);

        // Check if we have an "Overall" budget doc
        const overallBudgetDoc = budgets.find(b => b.category === 'Monthly Budget');

        // Determine Global Timeframe
        // If Overall exists, use its dates. Else, use Calendar Month.
        const start = overallBudgetDoc?.startDate ? startOfDay(new Date(overallBudgetDoc.startDate)) : defaultStart;
        const end = overallBudgetDoc?.endDate ? endOfDay(new Date(overallBudgetDoc.endDate)) : defaultEnd;

        // 1. Total Spent (in the determined timeframe)
        const totalSpent = expenses
            .filter(exp => isWithinInterval(new Date(exp.date), { start, end }))
            .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

        // 2. Global Budget Target
        const sumOfCategories = budgets.reduce((sum, b) => sum + b.amount, 0);

        // Prioritize: Overall Doc > Sum of Cats > Legacy User Field
        // Actually, if Overall Doc exists, that IS the global budget.
        // If not, sum of categories is a "virtual" global budget.
        // But if categories have wacky diverse dates, summing them is weird.
        // Simplification: 
        // If "Overall" exists -> Use it.
        // Else -> Sum items (assuming they loosely align to 'now').

        const effectiveBudget = budgets.length > 0 ? sumOfCategories : (user?.budget || 0);
        // Note: sumOfCategories includes the "Overall" doc amount if it exists, effectively making it the dominant factor + any other categories?
        // Wait, if I have "Overall: 10k" AND "Food: 2k", sum is 12k. NOT RIGHT.
        // User sets "Overall" OR "Categories" usually.
        // But if they mix: "Overall Limit 10k" + "Food Limit 2k". The Food limit is a sub-limit.
        // The Global Budget (spending power) should be the "Overall" one if it exists.
        // Logic fix:

        let finalBudget = 0;
        if (overallBudgetDoc) {
            finalBudget = overallBudgetDoc.amount;
        } else if (budgets.length > 0) {
            finalBudget = sumOfCategories;
        } else {
            finalBudget = user?.budget || 0;
        }

        const percent = finalBudget > 0 ? (totalSpent / finalBudget) * 100 : 0;

        // Label
        let label = "This Month";
        if (overallBudgetDoc?.startDate) {
            // If spans multiple months or custom
            label = `${new Date(overallBudgetDoc.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${new Date(overallBudgetDoc.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        }

        return {
            totalSpentMonth: totalSpent,
            globalBudget: finalBudget,
            globalPercent: percent,
            dateLabel: label
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
                        {dateLabel}
                    </div>
                </div>
                <div>
                    <p className="text-emerald-100 text-sm font-medium mb-1">
                        {globalBudget > 0 ? "Total Budget" : "Total Spent"}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold">₹{totalSpentMonth.toLocaleString()}</h2>
                        {globalBudget > 0 ? (
                            <span className="text-emerald-100">/ ₹{globalBudget.toLocaleString()}</span>
                        ) : (
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1"
                            >
                                <Plus size={12} /> Set Limit
                            </button>
                        )}
                    </div>
                </div>

                {/* Global Progress */}
                <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-xs mb-1 text-emerald-100">
                        <span>{globalBudget > 0 ? "Total Usage" : "No Monthly Limit Set"}</span>
                        <span>{globalBudget > 0 ? `${Math.round(globalPercent)}%` : ""}</span>
                    </div>
                    {globalBudget > 0 && (
                        <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white/90 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(globalPercent, 100)}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetsLoading && budgets.length === 0 ? (
                    [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                ) : (
                    budgetStats.length === 0 ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-slate-900/50 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl">
                            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 text-indigo-500">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Budgets Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
                                Set monthly limits for specific categories or an overall budget to track your savings.
                            </p>
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                                Set First Budget
                            </button>
                        </div>
                    ) : (
                        budgetStats.map(item => (
                            <div key={item._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 relative group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg text-white", CATEGORY_COLORS[item.category.toLowerCase()] || 'bg-gray-400')}>
                                            {item.category.toLowerCase() === 'food' && '🍔'}
                                            {item.category.toLowerCase() === 'travel' && '🚕'}
                                            {item.category.toLowerCase() === 'study' && '📚'}
                                            {item.category.toLowerCase() === 'fun' && '🎮'}
                                            {item.category.toLowerCase() === 'rent' && '🏠'}
                                            {item.category.toLowerCase() === 'monthly budget' && '💰'}
                                            {!['food', 'travel', 'study', 'fun', 'rent', 'monthly budget'].includes(item.category.toLowerCase()) && '📦'}
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
                                            <EditIcon size={16} />
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
