import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../store/slices/expenseSlice';
import { fetchAccounts } from '../store/slices/accountSlice';
import { fetchSubscriptions } from '../store/slices/subscriptionSlice';
import { fetchLoans } from '../store/slices/loanSlice';
import { TrendingDown, TrendingUp, Wallet, CreditCard, ArrowRight, ArrowUpRight, Info } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import HomeSkeleton from '../components/common/HomeSkeleton';

const Home = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const expenses = useSelector((state) => state.expenses.items);
    const accounts = useSelector((state) => state.accounts.items);
    const subscriptions = useSelector((state) => state.subscriptions.items);
    const loans = useSelector((state) => state.loans.items);

    const expensesLoading = useSelector(state => state.expenses.loading);
    const accountsLoading = useSelector(state => state.accounts.loading);
    const authLoading = useSelector(state => state.auth.loading);
    const isLoading = expensesLoading || accountsLoading || authLoading;

    useEffect(() => {
        if (!authLoading) {
            dispatch(fetchExpenses());
            dispatch(fetchAccounts());
            dispatch(fetchSubscriptions());
            dispatch(fetchLoans());
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

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Get openInfo from Layout context (may be null if not provided, handle safely)
    const { openInfo } = useOutletContext() || {};

    if (isLoading) {
        return <HomeSkeleton />;
    }

    return (
        <div className="p-6 sm:p-8 pb-32 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide uppercase">{greeting()},</p>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        {user?.name || 'Guest'} <span className="text-2xl">👋</span>
                    </h1>
                </div>
                {/* Desktop Info Button */}
                <button
                    onClick={openInfo}
                    className="hidden md:flex w-12 h-12 bg-white dark:bg-slate-800 rounded-full items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md hover:shadow-lg hover:scale-105 transition-all border border-indigo-50 dark:border-slate-700"
                    title="Help & Guide"
                >
                    <Info size={24} />
                </button>
            </div>

            {/* NEW: Student-Centric Status Card */}
            {(() => {
                const budgetLimit = user?.budget || 0;
                // If budget is set, "Available" is Budget - Spent. If not, use Total Balance.
                const hasBudget = budgetLimit > 0;
                const available = hasBudget ? (budgetLimit - monthlySpending) : totalBalance;
                const spentPercentage = hasBudget ? (monthlySpending / budgetLimit) * 100 : 0;

                let statusColor = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
                let statusText = "🟢 You're on track";
                let statusEmoji = "😎";

                if (hasBudget) {
                    if (spentPercentage >= 90) {
                        statusColor = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
                        statusText = "🔴 Overspending alert";
                        statusEmoji = "😱";
                    } else if (spentPercentage >= 60) {
                        statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
                        statusText = "🟡 Careful, budget tight";
                        statusEmoji = "😬";
                    }
                } else {
                    statusText = "🔵 Set a budget to track health";
                    statusColor = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
                    statusEmoji = "🤔";
                }

                return (
                    <div className="space-y-6">
                        {/* 1. Today's Status (Safe or Broke) */}
                        <Link to="/budgets" className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/10 group active:scale-[0.98] transition-all duration-500 bg-white dark:bg-slate-900 border border-indigo-50 dark:border-slate-800 block hover:shadow-indigo-500/20 cursor-pointer">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-[2.5rem] -z-10 transition-transform group-hover:scale-110" />

                            <div className="flex flex-col items-center justify-center text-center">
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm tracking-widest uppercase mb-4">Available this month</p>
                                <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                                    <span className="text-3xl md:text-4xl text-gray-400 dark:text-gray-600 align-top mr-1">₹</span>
                                    {available.toLocaleString()}
                                </h2>

                                <div className={`px-6 py-3 rounded-2xl border ${statusColor} font-bold text-sm md:text-base flex items-center gap-2 shadow-sm uppercase tracking-wide`}>
                                    {statusText}
                                </div>
                            </div>
                        </Link>

                        {/* 2. This month's spending direction */}
                        <Link to="/expenses" className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm block hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                        Spending Direction <TrendingUp size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {hasBudget
                                            ? `Spent ₹${monthlySpending.toLocaleString()} of ₹${budgetLimit.toLocaleString()} limit`
                                            : `Total Spent: ₹${monthlySpending.toLocaleString()}`}
                                    </p>
                                </div>
                                {hasBudget && (
                                    <span className={`text-xl font-black ${spentPercentage > 100 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                        {spentPercentage.toFixed(0)}%
                                    </span>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                        </Link>

                        {/* 2.5. Micro Context Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/expenses" className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm block hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95">
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Spent (Month)</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">₹{monthlySpending.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1">
                                    {hasBudget ? `/ ₹${budgetLimit.toLocaleString()} budget` : 'No budget set'}
                                </p>
                            </Link>
                            <Link to="/subscriptions" className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm block hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95">
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Fixed Subs</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">{subscriptions.filter(s => s.status !== 'cancelled').length} <span className="text-sm font-medium text-gray-400">active</span></p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1">
                                    ₹{activeSubscriptionsCost.toLocaleString()} / month
                                </p>
                            </Link>
                        </div>

                        {/* 3. Quick Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/expenses" state={{ openAdd: true }} className="bg-black dark:bg-white text-white dark:text-black p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                                <div className="p-2 bg-white/20 dark:bg-black/10 rounded-full">
                                    <TrendingDown size={24} />
                                </div>
                                <span className="font-bold">View Expenses</span>
                            </Link>
                            <Link to="/accounts" state={{ openAdd: true }} className="bg-indigo-600 text-white p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-xl shadow-indigo-200 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Wallet size={24} />
                                </div>
                                <span className="font-bold">Add Income</span>
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

            {/* Footer - Simplified */}
            <div className="mt-12 text-center">
                <p className="text-[10px] text-gray-300 dark:text-slate-700 uppercase tracking-[0.2em] font-bold">SpendWise Student Edition</p>
            </div>
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
        default: return '🔹';
    }
}

export default Home;
