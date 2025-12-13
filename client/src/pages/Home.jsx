import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../store/slices/expenseSlice';
import { fetchAccounts } from '../store/slices/accountSlice';
import { fetchSubscriptions } from '../store/slices/subscriptionSlice';
import { fetchLoans } from '../store/slices/loanSlice';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Wallet, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';

const Home = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const expenses = useSelector((state) => state.expenses.items);
    const accounts = useSelector((state) => state.accounts.items);
    const subscriptions = useSelector((state) => state.subscriptions.items);
    const loans = useSelector((state) => state.loans.items);

    useEffect(() => {
        dispatch(fetchExpenses());
        dispatch(fetchAccounts());
        dispatch(fetchSubscriptions());
        dispatch(fetchLoans());
    }, [dispatch]);

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

    const expensesLoading = useSelector(state => state.expenses.loading);
    const accountsLoading = useSelector(state => state.accounts.loading);
    const isLoading = expensesLoading || accountsLoading;

    if (isLoading) {
        return (
            <div className="p-6 pb-24 space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-56 w-full rounded-3xl" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 pb-24">
            {/* Header */}
            <div className="mb-8">
                <p className="text-gray-400 text-sm font-medium">{greeting()},</p>
                <h1 className="text-2xl font-bold text-gray-800">{user?.name || 'Guest'} 👋</h1>
            </div>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl shadow-indigo-200 mb-8 relative overflow-hidden"
            >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <p className="text-indigo-200 font-medium mb-1">Total Balance</p>
                    <h2 className="text-4xl font-bold">₹{totalBalance.toLocaleString()}</h2>
                    <div className="mt-6 flex gap-4">
                        <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingDown size={14} className="text-red-300" />
                                <span className="text-xs text-indigo-100">Spent this month</span>
                            </div>
                            <p className="font-bold text-lg">₹{monthlySpending.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard size={14} className="text-yellow-300" />
                                <span className="text-xs text-indigo-100">Fixed Subs</span>
                            </div>
                            <p className="font-bold text-lg">₹{activeSubscriptionsCost.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Link to="/accounts" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-24 hover:shadow-md transition-all active:scale-95">
                    <Wallet className="text-indigo-500" size={24} />
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Accounts</p>
                        <p className="font-bold text-lg">{accounts.length} Active</p>
                    </div>
                </Link>
                <Link to="/loans" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-24 hover:shadow-md transition-all active:scale-95">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">₹</div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Loans</p>
                        <p className="font-bold text-lg">{loans.filter(l => l.status === 'pending').length} Pending</p>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Recent Spending</h3>
                    <Link to="/expenses" className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                        View All <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentExpenses.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm">No expenses yet</p>
                        </div>
                    ) : (
                        recentExpenses.map(exp => (
                            <Link to="/expenses" key={exp._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-98 transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-xl">
                                        {/* Simple mapping for now, ideally reused from specific component */}
                                        {exp.category === 'food' ? '🍔' :
                                            exp.category === 'travel' ? '🚕' :
                                                exp.category === 'shopping' ? '🛍️' : '💰'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{exp.note || capitalize(exp.category)}</p>
                                        <p className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-red-500">-₹{exp.amount}</span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default Home;
