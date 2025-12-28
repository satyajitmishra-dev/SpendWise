import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../store/slices/expenseSlice';
import { fetchAccounts } from '../store/slices/accountSlice';
import { fetchSubscriptions } from '../store/slices/subscriptionSlice';
import { fetchLoans } from '../store/slices/loanSlice';
import { fetchBudgets, updateBudget } from '../store/slices/budgetSlice'; // NEW
import { TrendingDown, TrendingUp, Wallet, CreditCard, ArrowRight, ArrowUpRight, Zap, Snowflake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import HomeSkeleton from '../components/common/HomeSkeleton';
import Footer from '../components/layout/Footer';
import BudgetRenewalDialog from '../components/features/BudgetRenewalDialog';
import AddBudgetSheet from '../components/features/AddBudgetSheet';
import { addDays } from 'date-fns';
import { toast } from 'sonner';

const Home = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const expenses = useSelector((state) => state.expenses.items);
    const accounts = useSelector((state) => state.accounts.items);
    const subscriptions = useSelector((state) => state.subscriptions.items);
    const loans = useSelector((state) => state.loans.items);
    const budgets = useSelector((state) => state.budgets.items); // NEW

    const expensesLoading = useSelector(state => state.expenses.loading);
    const accountsLoading = useSelector(state => state.accounts.loading);
    const authLoading = useSelector(state => state.auth.loading);
    const isLoading = expensesLoading || accountsLoading || authLoading;

    // Remote Config State from Redux
    const { featureBanner } = useSelector((state) => state.app);

    // Budget Renewal State
    const [expiredBudget, setExpiredBudget] = useState(null);
    const [isRenewOpen, setIsRenewOpen] = useState(false);
    const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

    useEffect(() => {
        if (budgets.length > 0) {
            const today = new Date();
            const expired = budgets.find(b => {
                if (!b.endDate) return false;
                const end = new Date(b.endDate);
                return end < today;
            });

            if (expired) {
                const isDismissed = sessionStorage.getItem(`dismissed_budget_${expired._id}`);
                if (!isDismissed) {
                    setExpiredBudget(expired);
                    setIsRenewOpen(true);
                }
            }
        }
    }, [budgets]);

    const handleRenew = async (budget, type) => {
        if (type === 'extend') {
            const today = new Date();
            try {
                await dispatch(updateBudget({
                    id: budget._id,
                    data: {
                        startDate: today.toISOString(),
                        endDate: addDays(today, 30).toISOString(),
                        period: 'custom'
                    }
                })).unwrap();
                toast.success(`Extended ${budget.category} budget for 30 days!`);
                setIsRenewOpen(false);
            } catch (e) {
                toast.error("Failed to extend budget");
            }
        } else {
            // New Limit
            setIsRenewOpen(false);
            setIsAddBudgetOpen(true);
        }
    };

    const handleDismiss = (id) => {
        sessionStorage.setItem(`dismissed_budget_${id}`, 'true');
        setIsRenewOpen(false);
    };

    useEffect(() => {
        if (!authLoading) {
            dispatch(fetchExpenses());
            dispatch(fetchAccounts());
            dispatch(fetchSubscriptions());
            dispatch(fetchLoans());
            dispatch(fetchBudgets()); // NEW
        }
    }, [dispatch, authLoading]);

    // Calculate Totals
    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0);
    }, [accounts]);

    const monthlySpending = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        return expenses
            .filter(exp => {
                const d = new Date(exp.date);
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            })
            .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    }, [expenses]);

    const activeSubscriptionsCost = useMemo(() => {
        return subscriptions.reduce((sum, sub) => sum + (parseFloat(sub.amount) || 0), 0);
    }, [subscriptions]);

    const recentExpenses = useMemo(() => {
        return [...expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4);
    }, [expenses]);

    const totalBudgetLimit = useMemo(() => {
        return budgets.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    }, [budgets]);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };



    // Prevent "Blink" / Skeleton Flash on navigation
    // Only show skeleton if we are loading AND have no data yet.
    // If we have data, we show it while quietly refreshing in the background.
    const hasData = expenses.length > 0 || accounts.length > 0;
    const showSkeleton = isLoading && !hasData;

    return (
        <div className="p-6 sm:p-8 pb-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide uppercase">{greeting()},</p>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        {user?.name || 'Guest'} <span className="text-2xl">👋</span>
                    </h1>
                </div>
                {/* Desktop Info Button */}

            </div>

            {showSkeleton ? (
                <div className="space-y-8 animate-pulse">
                    {/* Status Card Skeleton */}
                    <div className="h-64 w-full bg-gray-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
                    {/* Widgets Skeleton */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-gray-200 dark:bg-slate-800 rounded-[2rem]"></div>
                        <div className="h-32 bg-gray-200 dark:bg-slate-800 rounded-[2rem]"></div>
                    </div>
                    {/* Recent Activity Skeleton */}
                    <div className="space-y-4 pt-4">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-20 w-full bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
                        <div className="h-20 w-full bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
                    </div>
                </div>
            ) : (
                <>
                    {/* NEW: Student-Centric Status Card */}
                    {(() => {
                        const budgetLimit = totalBudgetLimit; // Use the calculated total
                        // If budget is set, "Available" is Budget - Spent. If not, use Total Balance.
                        const hasBudget = budgetLimit > 0;
                        const available = hasBudget ? (budgetLimit - monthlySpending) : totalBalance;
                        const spentPercentage = hasBudget ? (monthlySpending / budgetLimit) * 100 : 0;

                        let badgeVariant = "success";
                        let statusText = "🟢 You're on track";

                        if (hasBudget) {
                            if (spentPercentage >= 90) {
                                badgeVariant = "destructive";
                                statusText = "🔴 Overspending alert";
                            } else if (spentPercentage >= 60) {
                                badgeVariant = "warning";
                                statusText = "🟡 Careful, budget tight";
                            }
                        } else {
                            statusText = "🔵 Track efficiently";
                            badgeVariant = "default";
                        }

                        return (
                            <div className="flex flex-col gap-8">
                                {/* Remote Feature Banner */}
                                {featureBanner.show && (
                                    <Link to={featureBanner.link}>
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, y: -20 }}
                                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                                            className="relative rounded-2xl p-1 mb-6 cursor-pointer overflow-hidden group shadow-xl shadow-sky-200 dark:shadow-none"
                                        >
                                            {/* Ice Background Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-300 opacity-90 dark:opacity-80 backdrop-blur-md"></div>

                                            {/* Frost/Noise Overlay */}
                                            <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>

                                            {/* Snowflake Decorations - Abstract */}
                                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                                            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-cyan-100/40 rounded-full blur-lg"></div>

                                            <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl p-4 flex items-center justify-between border border-white/60 dark:border-white/10 group-hover:bg-white/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white/80 dark:bg-sky-900/50 p-2 rounded-xl text-sky-600 dark:text-sky-200 shadow-sm ring-1 ring-white/50">
                                                        <Snowflake size={20} className="animate-[spin_4s_linear_infinite]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-200 tracking-wider mb-0.5 opacity-80">Winter Special</p>
                                                        <p className="font-bold text-sm text-sky-950 dark:text-white tracking-wide drop-shadow-sm">{featureBanner.text}</p>
                                                    </div>
                                                </div>

                                                <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                                    <ArrowRight size={16} className="text-sky-900 dark:text-white" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                )}
                                {/* Responsive Grid for Main Stats */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* 1. Today's Status (Safe or Broke) */}
                                    <Link to="/budgets" className="h-full block">
                                        <Card variant="default" className="relative p-6 sm:p-8 h-full flex flex-col justify-center overflow-hidden shadow-2xl shadow-indigo-500/10 group active:scale-[0.98] transition-all duration-500 border-indigo-50 dark:border-slate-800 hover:shadow-indigo-500/20 cursor-pointer rounded-[2rem] sm:rounded-[2.5rem]">
                                            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-[2.5rem] -z-10 transition-transform group-hover:scale-110" />

                                            <div className="flex flex-col items-center justify-center text-center">
                                                <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">
                                                    {hasBudget ? 'Available this month' : 'No Budget Set'}
                                                </p>

                                                {hasBudget ? (
                                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 tracking-tight text-gray-900 dark:text-white drop-shadow-sm truncate w-full px-2">
                                                        <span className="text-xl sm:text-2xl lg:text-3xl text-gray-400 dark:text-gray-600 align-top mr-1">₹</span>
                                                        {available.toLocaleString()}
                                                    </h2>
                                                ) : (
                                                    <div className="mb-6 flex flex-col items-center gap-2">
                                                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Set a budget</h2>
                                                        <p className="text-sm text-gray-400">to track efficiently</p>
                                                    </div>
                                                )}

                                                <Badge variant={badgeVariant} className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm md:text-base">
                                                    {statusText}
                                                    {!hasBudget && <ArrowRight size={14} className="ml-1 inline" />}
                                                </Badge>
                                            </div>
                                        </Card>
                                    </Link>

                                    {/* 2. This month's spending direction */}
                                    <Link to="/reports" className="h-full block">
                                        <Card variant="interactive" className="p-6 h-full flex flex-col justify-between rounded-[2rem]">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2 truncate">
                                                        <span className="truncate">Spending Direction</span>
                                                        <TrendingUp size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate mt-1">
                                                        {hasBudget
                                                            ? `Spent ₹${monthlySpending.toLocaleString()} of ₹${budgetLimit.toLocaleString()} limit`
                                                            : `Total Spent: ₹${monthlySpending.toLocaleString()}`}
                                                    </p>
                                                </div>
                                                {hasBudget && (
                                                    <span className={`text-xl font-black flex-shrink-0 self-center ${spentPercentage > 100 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                                        {spentPercentage.toFixed(0)}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mt-auto">
                                                <motion.div
                                                    className={`h-full ${!hasBudget ? 'bg-blue-500' :
                                                        spentPercentage > 90 ? 'bg-red-500' :
                                                            spentPercentage > 60 ? 'bg-yellow-400' : 'bg-green-500'
                                                        }`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>
                                        </Card>
                                    </Link>
                                </div>

                                {/* 2.5. Micro Context Stats */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <Link to="/expenses">
                                        <Card variant="interactive" className="p-5 rounded-[2rem]">
                                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Spent (Month)</p>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">₹{monthlySpending.toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">
                                                {hasBudget ? `/ ₹${budgetLimit.toLocaleString()} budget` : 'No budget set'}
                                            </p>
                                        </Card>
                                    </Link>
                                    <Link to="/subscriptions">
                                        <Card variant="interactive" className="p-5 rounded-[2rem]">
                                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Fixed Subs</p>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">{subscriptions.filter(s => s.status !== 'cancelled').length} <span className="text-sm font-medium text-gray-400">active</span></p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1 truncate">
                                                ₹{activeSubscriptionsCost.toLocaleString()} / month
                                            </p>
                                        </Card>
                                    </Link>
                                </div>

                                {/* 3. Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <Link to="/expenses" state={{ openAdd: true }}>
                                        <Card className="bg-black dark:bg-white text-white dark:text-black p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 border-0">
                                            <div className="p-2 bg-white/20 dark:bg-black/10 rounded-full">
                                                <TrendingDown size={24} />
                                            </div>
                                            <span className="font-bold">View Expenses</span>
                                        </Card>
                                    </Link>
                                    <Link to="/accounts" state={{ openAdd: true }}>
                                        <Card className="bg-indigo-600 text-white p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-xl shadow-indigo-200 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 border-0">
                                            <div className="p-2 bg-white/20 rounded-full">
                                                <Wallet size={24} />
                                            </div>
                                            <span className="font-bold">Add Income</span>
                                        </Card>
                                    </Link>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Details Later (Recent Activity) - Less Prominent */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800/50">
                        <div className="flex justify-between items-end px-1">
                            <h3 className="font-bold text-lg text-gray-500 dark:text-gray-400">Activity Log</h3>
                            <Link to="/expenses" className="text-gray-400 dark:text-slate-500 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3 opacity-90 hover:opacity-100 transition-opacity">
                            {recentExpenses.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-xs text-gray-400 dark:text-slate-600 uppercase tracking-widest">No recent transactions</p>
                                </div>
                            ) : (
                                recentExpenses.map((exp, i) => {
                                    const isIncome = exp.type === 'income';
                                    return (
                                        <Link
                                            to="/expenses"
                                            key={exp._id}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center ${isIncome ? 'bg-green-100/50 text-green-600' : 'bg-white dark:bg-slate-800 text-gray-500'}`}>
                                                    {getCategoryEmoji(exp.category)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">{exp.note || capitalize(exp.category)}</p>
                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{new Date(exp.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <span className={`font-bold text-sm ${isIncome ? 'text-green-600' : 'text-gray-800 dark:text-gray-300'}`}>
                                                {isIncome ? '+' : '-'}₹{exp.amount}
                                            </span>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}


            {/* Budget Renewal Dialogs */}
            <BudgetRenewalDialog
                isOpen={isRenewOpen}
                expiredBudgets={expiredBudget ? [expiredBudget] : []}
                onRenew={handleRenew}
                onDismiss={handleDismiss}
            />
            <AddBudgetSheet
                isOpen={isAddBudgetOpen}
                onClose={() => setIsAddBudgetOpen(false)}
                initialData={expiredBudget}
            />

            {/* Footer */}
            <Footer />
        </div>
    );
};

const DashboardSkeleton = () => (
    <div className="p-6 pb-24 space-y-8 animate-pulse">
        <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="h-64 w-full bg-gray-200 dark:bg-slate-800 rounded-[2rem]"></div>
        <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 dark:bg-slate-800 rounded-[2rem]"></div>
            <div className="h-32 bg-gray-200 dark:bg-slate-800 rounded-[2rem]"></div>
        </div>
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="h-20 w-full bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-20 w-full bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
    </div>
);

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getCategoryEmoji = (cat) => {
    switch (cat) {
        case 'food': return '🍔';
        case 'travel': return '🚕';
        case 'study': return '📚';
        case 'fun': return '🎮';
        case 'rent': return '🏠';
        case 'shopping': return '🛍️';
        case 'entertainment': return '🎬'; // Legacy support
        case 'health': return '💊';
        case 'salary': return '💰';
        case 'gift': return '🎁';
        case 'refund': return '↩️';
        default: return '🪙';
    }
}

export default Home;
