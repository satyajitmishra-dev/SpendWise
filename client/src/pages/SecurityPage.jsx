import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPasscode, disablePasscode, resetDataInit, resetDataConfirm } from '../store/slices/authSlice';
import { toast } from 'sonner';
import { Shield, Lock, Unlock, ChevronLeft, RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SecurityPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isSetting, setIsSetting] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [pinLength, setPinLength] = useState(4);
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset Data States
    const [showResetDataSheet, setShowResetDataSheet] = useState(false);
    const [otp, setOtp] = useState('');
    const [resetStep, setResetStep] = useState('confirm'); // confirm -> otp -> success
    const [resendTimer, setResendTimer] = useState(30);

    /* Timer Logic for Reset Data OTP */
    useEffect(() => {
        let interval;
        if (resetStep === 'otp' && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resetStep, resendTimer]);

    const handleResendResetOtp = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            await dispatch(resetDataInit()).unwrap();
            toast.success("Verification code resent");
            setResendTimer(30);
        } catch (err) {
            toast.error("Failed to resend code");
        } finally {
            setLoading(false);
        }
    };

    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
            toast.error("Please login to access security settings");
            navigate('/profile');
        } else {
            setPageLoading(false);
        }
    }, [user, navigate]);

    if (pageLoading) return null; // Prevent flash

    const handleSetPin = async () => {
        if (pin.length !== pinLength) {
            toast.error(`PIN must be ${pinLength} digits`);
            return;
        }
        if (pin !== confirmPin) {
            toast.error('PINs do not match');
            return;
        }


        setLoading(true);
        try {
            await dispatch(setPasscode(pin)).unwrap();
            toast.success(isChanging ? 'Passcode Changed Successfully' : 'App Lock Enabled.');
            setIsSetting(false);
            setIsChanging(false);
            setPin('');
            setConfirmPin('');
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to set PIN');
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        if (window.confirm('Are you sure you want to disable App Lock?')) {
            try {
                await dispatch(disablePasscode()).unwrap();
                toast.success('App Lock Disabled');
            } catch (err) {
                toast.error('Failed to disable');
            }
        }
    };

    // Reset Data Handlers
    const initiateResetData = async () => {
        setLoading(true);
        try {
            await dispatch(resetDataInit()).unwrap();
            setResetStep('otp');
            setResendTimer(30);
        } catch (err) {
            // Error handled by slice toast
        } finally {
            setLoading(false);
        }
    };

    const confirmResetData = async () => {
        if (otp.length !== 6) return toast.error("Enter valid 6-digit OTP");
        setLoading(true);
        try {
            await dispatch(resetDataConfirm(otp)).unwrap();
            toast.success("All data reset successfully. Application will restart.");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            // Handled
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 pb-32 md:pb-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
                </button>
                <h1 className="text-2xl font-bold dark:text-white">Security</h1>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold dark:text-white">App Lock</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Secure your app with a 4-6 digit PIN.</p>
                    </div>
                </div>

                {user?.isPasscodeEnabled && !isChanging ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-3">
                            <Lock size={20} />
                            <span className="font-medium">Protection Active</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => { setIsChanging(true); setPinLength(user.passcodeLength || 4); }}
                                className="py-3 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <RefreshCw size={18} /> Change PIN
                            </button>
                            <button
                                onClick={handleDisable}
                                className="py-3 px-4 bg-red-50 dark:bg-red-900/10 text-red-600 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <Unlock size={18} /> Disable
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {!isSetting && !isChanging ? (
                            <button
                                onClick={() => setIsSetting(true)}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors"
                            >
                                Enable App Lock
                            </button>
                        ) : null}
                    </div>
                )}

                {(isSetting || isChanging) && (
                    <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-300">
                        <h3 className="font-bold dark:text-white">{isChanging ? 'Change PIN' : 'Set New PIN'}</h3>
                        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => { setPinLength(4); setPin(''); setConfirmPin(''); }}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${pinLength === 4 ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                            >
                                4 Digits
                            </button>
                            <button
                                onClick={() => { setPinLength(6); setPin(''); setConfirmPin(''); }}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${pinLength === 6 ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                            >
                                6 Digits
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Create PIN</label>
                            <input
                                type="password"
                                inputMode="numeric"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, pinLength))}
                                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500 dark:text-white text-center text-2xl tracking-widest"
                                placeholder={'•'.repeat(pinLength)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm PIN</label>
                            <input
                                type="password"
                                inputMode="numeric"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, pinLength))}
                                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500 dark:text-white text-center text-2xl tracking-widest"
                                placeholder={'•'.repeat(pinLength)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setIsSetting(false); setIsChanging(false); setPin(''); setConfirmPin(''); }}
                                disabled={loading}
                                className="flex-1 py-3 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSetPin}
                                disabled={loading}
                                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Saving...' : 'Save PIN'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* DANGER ZONE */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-red-100 dark:border-red-900/30">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
                        <AlertTriangle size={32} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold dark:text-white">Danger Zone</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Irreversible actions regarding your data.</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowResetDataSheet(true)}
                    className="w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-600 font-bold rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                >
                    <Trash2 size={20} /> Reset Account Data
                </button>
            </div>

            {/* Reset Data Confirmation Sheet/Modal */}
            <AnimatePresence>
                {showResetDataSheet && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { if (!loading) setShowResetDataSheet(false); }}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-6 z-50 max-w-lg mx-auto border-t border-gray-200 dark:border-slate-800 shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full mx-auto mb-6" />

                            {resetStep === 'confirm' ? (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-600">
                                            <AlertTriangle size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold dark:text-white mb-2">Reset All Data?</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            This will permanently delete ALL your <strong>Expenses, Income, Accounts, Loans, and Subscription</strong> data.
                                            Your profile settings will remain.
                                        </p>
                                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-sm mb-2">
                                            <strong>Tip:</strong> We recommend exporting your data from the <button onClick={() => { setShowResetDataSheet(false); navigate('/reports'); }} className="underline font-bold">Reports Page</button> (Excel/PDF) before resetting.
                                        </div>
                                        <p className="text-red-500 font-bold mt-4 text-sm">This action cannot be undone.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowResetDataSheet(false)}
                                            className="flex-1 py-3.5 text-gray-600 dark:text-gray-400 font-bold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={initiateResetData}
                                            disabled={loading}
                                            className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Sending Code...' : 'Yes, Reset Everything'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold dark:text-white mb-2">Verify It's You</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            We sent a verification code to <strong>{user?.email}</strong>. Enter it below to confirm deletion.
                                        </p>
                                    </div>

                                    <input
                                        className="w-full bg-gray-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 rounded-xl p-4 text-center text-2xl tracking-[0.5em] font-medium focus:outline-none transition-all dark:text-white"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        autoFocus
                                    />

                                    <button
                                        onClick={confirmResetData}
                                        disabled={loading || otp.length < 6}
                                        className="w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Deleting Data...' : 'Confirm Deletion'}
                                    </button>

                                    <div className="flex flex-col gap-3 text-center mt-2">
                                        <button
                                            type="button"
                                            disabled={resendTimer > 0 || loading}
                                            onClick={handleResendResetOtp}
                                            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Verification Code'}
                                        </button>

                                        <button onClick={() => setResetStep('confirm')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                                            Back
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SecurityPage;
