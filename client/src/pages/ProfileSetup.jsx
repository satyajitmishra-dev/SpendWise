import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../store/slices/authSlice';
import { addAccount } from '../store/slices/accountSlice';
import { addExpense } from '../store/slices/expenseSlice';
import { addBudget } from '../store/slices/budgetSlice'; // IMPORTED
import { setTheme } from '../store/slices/themeSliceFixed';
import api from '../services/api';
import { ChevronRight, User, School, IndianRupee, Wallet, CreditCard, Tag, Sun, Moon, Monitor, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const steps = [
    { id: 1, title: 'Profile', desc: 'Let\'s get to know you' },
    { id: 2, title: 'Preferences', desc: 'Customize your experience' },
    { id: 3, title: 'First Wallet', desc: 'Where do you keep money?' },
    { id: 4, title: 'First Expense', desc: 'Track your first spend' }
];

const getCategoryEmoji = (category) => {
    const map = {
        food: '🍔',
        travel: '🚕',
        rent: '🏠',
        study: '📚',
        fun: '🎮',
        other: '🪙'
    };
    return map[category] || '💸';
};

const ProfileSetup = () => {
    const { user } = useSelector((state) => state.auth);
    const { mode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Step 1 & 2 Data
    const [profileData, setProfileData] = useState({
        name: '',
        college: '',
        status: 'student',
        currency: 'INR',
        budget: '' // Keep for legacy / overall sync
    });

    // Budget Flow State
    const [budgetEnabled, setBudgetEnabled] = useState(false);
    const [budgetType, setBudgetType] = useState('overall'); // 'overall' | 'categorized'
    const [categorizedBudgets, setCategorizedBudgets] = useState({
        food: 2000,
        rent: 0,
        travel: 500,
        study: 0,
        fun: 500,
        other: 0
    });

    // Step 3 Data
    const [accountData, setAccountData] = useState({
        name: 'Cash',
        type: 'cash',
        balance: ''
    });

    // Step 4 Data
    const [expenseData, setExpenseData] = useState({
        amount: '',
        category: 'food',
        note: 'First expense'
    });

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                name: user.name || '',
                college: user.college || '',
                status: user.status || 'student',
                currency: user.currency || 'INR',
                budget: user.budget || ''
            }));
        }
    }, [user]);

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

    const handleNext = async () => {
        if (isLoading) return;

        if (step === 1 && !profileData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        // Budget / Step 2 Validation
        if (step === 2) {
            if (budgetEnabled) {
                if (budgetType === 'overall') {
                    if (!profileData.budget || Number(profileData.budget) <= 0) {
                        toast.error('Please enter a valid monthly budget');
                        return;
                    }
                } else {
                    // Check if at least one category has value
                    const hasValue = Object.values(categorizedBudgets).some(v => Number(v) > 0);
                    if (!hasValue) {
                        toast.error('Please set at least one category budget');
                        return;
                    }
                }
            }
        }

        // Save intermediate progress for profile
        if (step === 2) {
            setIsLoading(true);
            try {
                // 1. Update Profile (Theme, Currency, Name)
                const res = await api.post('/auth/update-profile', {
                    userId: user._id,
                    ...profileData, // This saves 'budget' field to User model (good for overall backup)
                    onboardingComplete: false
                });
                dispatch(updateUser(res.data));

                // 2. Create Budget Docs (The new logic)
                if (budgetEnabled) {
                    if (budgetType === 'overall') {
                        // Create one 'Monthly Budget' doc
                        await dispatch(addBudget({
                            category: 'Monthly Budget',
                            amount: Number(profileData.budget),
                            period: 'monthly'
                        })).unwrap();
                    } else {
                        // Create individual docs
                        const promises = Object.entries(categorizedBudgets)
                            .filter(([_, val]) => Number(val) > 0)
                            .map(([cat, val]) => dispatch(addBudget({
                                category: cat,
                                amount: Number(val),
                                period: 'monthly'
                            })).unwrap());

                        await Promise.all(promises);
                    }
                    toast.success('Budget preferences saved!');
                }

                setStep(prev => prev + 1);
            } catch (error) {
                console.error(error);
                toast.error('Failed to save preferences');
            } finally {
                setIsLoading(false);
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (!accountData.name.trim()) {
            toast.error('Wallet name is required');
            return;
        }
        if (accountData.balance === '' || Number(accountData.balance) < 0) {
            toast.error('Balance cannot be negative');
            return;
        }
        if (Number(accountData.balance) == 0) {
            toast.error('Balance cannot be zero');
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(addAccount({
                ...accountData,
                balance: parseFloat(accountData.balance)
            })).unwrap();
            toast.success('Wallet added!');
            setStep(prev => prev + 1);
        } catch (error) {
            toast.error('Failed to add wallet');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (!expenseData.amount || Number(expenseData.amount) <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(addExpense({
                ...expenseData,
                date: new Date().toISOString(),
                amount: parseFloat(expenseData.amount)
            })).unwrap();
            toast.success('Expense added!');
            await finishOnboarding();
        } catch (error) {
            toast.error('Failed to add expense');
            setIsLoading(false);
        }
    };

    const finishOnboarding = async () => {
        if (!isLoading) setIsLoading(true); // Ensure loading if called directly
        try {
            const res = await api.post('/auth/update-profile', {
                userId: user._id,
                onboardingComplete: true
            });
            dispatch(updateUser(res.data));
            navigate('/');
        } catch (error) {
            console.error(error);
            navigate('/'); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkipStep = () => {
        if (isLoading) return;
        if (step === 4) {
            finishOnboarding();
        } else {
            setStep(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-slate-950 max-w-md mx-auto p-6 overflow-y-auto duration-300">
            {/* Header / Progress */}
            <div className="mt-8 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step {step} of 4</span>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{steps[step - 1].title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{steps[step - 1].desc}</p>
                    </div>
                    <button
                        onClick={handleSkipStep}
                        disabled={isLoading}
                        className="text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg disabled:opacity-50"
                    >
                        Skip
                    </button>
                </div>

                <div className="flex gap-2 mb-8">
                    {steps.map(s => (
                        <div key={s.id} className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-300",
                            s.id <= step ? "bg-indigo-600" : "bg-gray-100 dark:bg-slate-800"
                        )} />
                    ))}
                </div>
            </div>

            {/* Step 1: Profile */}
            {step === 1 && (
                <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What should we call you? *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:text-white"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College / Workplace</label>
                            <div className="relative">
                                <School className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="college"
                                    value={profileData.college}
                                    onChange={handleProfileChange}
                                    placeholder="e.g. IIT Delhi"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Next <ChevronRight size={20} /></>}
                    </button>
                </div>
            )}

            {/* Step 2: Preferences & Budget */}
            {step === 2 && (
                <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right duration-300 pb-6">
                    <div className="space-y-6">
                        {/* Theme & Currency Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Theme</label>
                                <div className="flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1 relative">
                                    {['light', 'dark', 'system'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => dispatch(setTheme(t))}
                                            className={cn(
                                                "flex-1 p-2 rounded-lg flex items-center justify-center transition-all",
                                                mode === t ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-white" : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
                                            )}
                                        >
                                            {t === 'light' && <Sun size={16} />}
                                            {t === 'dark' && <Moon size={16} />}
                                            {t === 'system' && <Monitor size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Currency</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        name="currency"
                                        value={profileData.currency}
                                        onChange={handleProfileChange}
                                        className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white appearance-none"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100 dark:border-slate-800" />

                        {/* Budget Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Monthly Budget</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Set spending limits to save more</p>
                                </div>
                                <button
                                    onClick={() => setBudgetEnabled(!budgetEnabled)}
                                    className={cn(
                                        "w-12 h-7 rounded-full transition-colors relative p-1",
                                        budgetEnabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                                        budgetEnabled ? "translate-x-5" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            {budgetEnabled && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    {/* Strategy Toggle */}
                                    <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                                        <button
                                            onClick={() => setBudgetType('overall')}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                                budgetType === 'overall' ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white" : "text-gray-400"
                                            )}
                                        >
                                            Overall Limit
                                        </button>
                                        <button
                                            onClick={() => setBudgetType('categorized')}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                                budgetType === 'categorized' ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white" : "text-gray-400"
                                            )}
                                        >
                                            Smart Distribution
                                        </button>
                                    </div>

                                    {/* Inputs */}
                                    {budgetType === 'overall' ? (
                                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/10 text-center">
                                            <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Total Monthly Limit</label>
                                            <div className="relative inline-block max-w-[200px]">
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-bold text-indigo-300">₹</span>
                                                <input
                                                    type="number"
                                                    value={profileData.budget} // Reusing profileData.budget for strict overall
                                                    onChange={handleProfileChange}
                                                    name="budget"
                                                    placeholder="5000"
                                                    className="w-full pl-6 pr-2 py-2 bg-transparent border-b-2 border-indigo-200 dark:border-indigo-500/30 text-3xl font-black text-indigo-600 dark:text-indigo-400 text-center focus:outline-none focus:border-indigo-500 placeholder:text-indigo-200"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(categorizedBudgets).map(([cat, val]) => (
                                                <div key={cat} className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-lg p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm">{getCategoryEmoji(cat)}</span>
                                                        <span className="text-xs font-bold capitalize text-gray-500">{cat}</span>
                                                    </div>
                                                    <div className="relative">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                                                        <input
                                                            type="number"
                                                            value={val}
                                                            onChange={(e) => setCategorizedBudgets(prev => ({ ...prev, [cat]: e.target.value }))}
                                                            className="w-full pl-5 py-1 bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-300"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Next <ChevronRight size={20} /></>}
                    </button>
                </div>
            )}

            {/* Step 3: First Wallet */}
            {step === 3 && (
                <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wallet Name</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={accountData.name}
                                    onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                                    placeholder="e.g. Cash, SBI"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Balance</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 font-bold text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={accountData.balance}
                                    onChange={(e) => setAccountData({ ...accountData, balance: e.target.value })}
                                    placeholder="1000"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleAccountSubmit}
                        disabled={isLoading}
                        className="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Create Wallet <ChevronRight size={20} /></>}
                    </button>
                </div>
            )}

            {/* Step 4: First Expense */}
            {step === 4 && (
                <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Spent</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 font-bold text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={expenseData.amount}
                                    onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                                    placeholder="100"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What was it for?</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={expenseData.note}
                                    onChange={(e) => setExpenseData({ ...expenseData, note: e.target.value })}
                                    placeholder="e.g. Coffee"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleExpenseSubmit}
                        disabled={isLoading}
                        className="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Log & Finish <ChevronRight size={20} /></>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileSetup;
