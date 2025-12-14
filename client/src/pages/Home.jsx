import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../store/slices/expenseSlice';
import { fetchAccounts } from '../store/slices/accountSlice';
import { fetchSubscriptions } from '../store/slices/subscriptionSlice';
import { fetchLoans } from '../store/slices/loanSlice';
import { TrendingDown, TrendingUp, Wallet, CreditCard, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
// import { Skeleton } from '../components/ui/Skeleton'; // Assuming this exists or using simple div

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

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="p-6 sm:p-8 pb-32 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide uppercase">{greeting()},</p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    {user?.name || 'Guest'} <span className="text-2xl">👋</span>
                </h1>
            </div>

            {/* Balance Card - Premium Gradient Mesh */}
            <div className="relative overflow-hidden rounded-[2rem] p-8 shadow-2xl shadow-indigo-500/20 group cursor-pointer active:scale-[0.98] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-xy"></div>
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl mix-blend-overlay animate-blob"></div>
                <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl mix-blend-overlay animate-blob animation-delay-2000"></div>

                <div className="relative z-10 text-white">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-indigo-100 font-medium text-sm tracking-wider uppercase opacity-80">Total Balance</p>
                        <div className="p-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                            <Wallet size={16} />
                        </div>
                    </div>
                    <h2 className="text-5xl font-black mb-8 tracking-tight drop-shadow-lg">
                        ₹{totalBalance.toLocaleString()}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingDown size={14} className="text-red-300" />
                                <span className="text-xs text-indigo-100/80 font-medium">Spent (Month)</span>
                            </div>
                            <p className="font-bold text-xl">₹{monthlySpending.toLocaleString()}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard size={14} className="text-yellow-300" />
                                <span className="text-xs text-indigo-100/80 font-medium">Fixed Subs</span>
                            </div>
                            <p className="font-bold text-xl">₹{activeSubscriptionsCost.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/accounts" className="group relative bg-white dark:bg-slate-900/60 p-5 rounded-[2rem] border border-white/20 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-800 transition-all active:scale-95">
                    <div className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors">
                        <ArrowUpRight size={20} />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Wallet size={24} />
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Accounts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{accounts.length}</p>
                </Link>

                <Link to="/loans" className="group relative bg-white dark:bg-slate-900/60 p-5 rounded-[2rem] border border-white/20 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-800 transition-all active:scale-95">
                    <div className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors">
                        <ArrowUpRight size={20} />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-bold">₹</span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Pending Loans</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{loans.filter(l => l.status === 'pending').length}</p>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">Recent Activity</h3>
                    <Link to="/expenses" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-700 flex items-center gap-1 transition-colors">
                        See All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="space-y-3">
                    {/* DEBUG LOG */}


                    {recentExpenses.length === 0 ? (
                        <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
                            <p className="text-gray-400 dark:text-slate-500 font-medium">No expenses recorded yet</p>
                        </div>
                    ) : (
                        recentExpenses.map((exp, i) => (
                            <Link
                                to="/expenses"
                                key={exp._id}
                                className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {getCategoryEmoji(exp.category)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white mb-0.5">{exp.note || capitalize(exp.category)}</p>
                                        <p className="text-xs font-medium text-gray-400 dark:text-slate-500">{new Date(exp.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg text-sm">
                                    -₹{exp.amount}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
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
        default: return '💰';
    }
}

export default Home;
