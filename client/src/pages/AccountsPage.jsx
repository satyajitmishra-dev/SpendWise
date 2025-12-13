import { useState, useEffect } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts } from '../store/slices/accountSlice';
import AccountCard from '../components/features/AccountCard';
import AddAccountSheet from '../components/features/AddAccountSheet';
import { Plus, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming cn is available

const AccountsPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.accounts);
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAccounts());
    }, [dispatch]);

    const totalBalance = items.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    return (
        <div className="p-6 pb-24 space-y-8">
            {/* Header & Total Balance */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">My Wallets</h1>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Add Wallet"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    {/* Abstract Background */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                    <div className="relative z-10 text-center">
                        <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Net Worth</p>
                        <h2 className="text-4xl font-bold tracking-tight mb-4">
                            ₹ {totalBalance.toLocaleString('en-IN')}
                        </h2>
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300">
                            <ShieldCheck size={12} />
                            <span>Secure & Private</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account List */}
            <div>
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Your Accounts</h3>


                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {items.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">No accounts added</p>
                                <button
                                    onClick={() => setIsAddOpen(true)}
                                    className="mt-2 text-indigo-600 font-bold hover:underline"
                                >
                                    Add your first wallet
                                </button>
                            </div>
                        ) : (
                            items.map((account, index) => (
                                // Simple stagger effect with inline styles or Framer Motion variant
                                <div
                                    key={account._id}
                                    className="animate-in slide-in-from-bottom fade-in duration-500"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <AccountCard account={account} />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <AddAccountSheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
        </div>
    );
};

export default AccountsPage;
