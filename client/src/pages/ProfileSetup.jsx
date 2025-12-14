import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../store/slices/authSlice';
import { addAccount } from '../store/slices/accountSlice';
import { addExpense } from '../store/slices/expenseSlice';
import { setTheme } from '../store/slices/themeSliceFixed';
import api from '../services/api';
import { ChevronRight, User, School, IndianRupee, Wallet, CreditCard, Tag, Sun, Moon, Monitor, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const steps = [
    { id: 1, title: 'Profile', desc: 'Let\'s get to know you' },
    { id: 2, title: 'Preferences', desc: 'Customize your experience' },
    { id: 3, title: 'First Wallet', desc: 'Where do you keep money?' },
    { id: 4, title: 'First Expense', desc: 'Track your first spend' }
];

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
        budget: ''
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

        if (step === 2 && profileData.budget) {
            if (Number(profileData.budget) < 0) {
                toast.error('Budget cannot be negative');
                return;
            }
            if (Number(profileData.budget) == 0) {
                toast.error('Budget cannot be zero');
                return;
            }
        }

        // Save intermediate progress for profile
        if (step === 2) {
            setIsLoading(true);
            try {
                const res = await api.post('/auth/update-profile', {
                    userId: user._id,
                    ...profileData,
                    onboardingComplete: false // Not done yet
                });
                dispatch(updateUser(res.data));
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

            {/* Step 2: Preferences */}
            {step === 2 && (
                <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">App Theme</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'light', icon: Sun, label: 'Light' },
                                    { id: 'dark', icon: Moon, label: 'Dark' },
                                    { id: 'system', icon: Monitor, label: 'System' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => dispatch(setTheme(t.id))}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                            mode === t.id
                                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                                : "border-transparent bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <t.icon size={20} />
                                        <span className="text-xs font-medium">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <select
                                        name="currency"
                                        value={profileData.currency}
                                        onChange={handleProfileChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none dark:text-white"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Budget</label>
                                <div className="relative">
                                    <Wallet className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        name="budget"
                                        value={profileData.budget}
                                        onChange={handleProfileChange}
                                        placeholder="5000"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:text-white"
                                    />
                                </div>
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
