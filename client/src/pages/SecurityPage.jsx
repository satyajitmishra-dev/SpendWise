import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPasscode, disablePasscode } from '../store/slices/authSlice';
import { toast } from 'sonner';
import { Shield, Lock, Unlock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isSetting, setIsSetting] = useState(false);
    const [pinLength, setPinLength] = useState(4);
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleSetPin = async () => {
        if (pin.length !== pinLength) {
            toast.error(`PIN must be ${pinLength} digits`);
            return;
        }
        if (pin !== confirmPin) {
            toast.error('PINs do not match');
            return;
        }

        try {
            await dispatch(setPasscode(pin)).unwrap();
            toast.success('App Lock Enabled. Check your email for confirmation.');
            setIsSetting(false);
            setPin('');
            setConfirmPin('');
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to set PIN');
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

    return (
        <div className="p-6 pb-24">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
                </button>
                <h1 className="text-2xl font-bold dark:text-white">Security</h1>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold dark:text-white">App Lock</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Secure your app with a 4-6 digit PIN. Required on every launch and after 5 mins of inactivity.</p>
                    </div>
                </div>

                {user?.isPasscodeEnabled ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-3">
                            <Lock size={20} />
                            <span className="font-medium">Protection Active</span>
                        </div>
                        <button
                            onClick={handleDisable}
                            className="w-full py-4 text-red-600 font-bold bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Unlock size={20} /> Disable App Lock
                        </button>
                    </div>
                ) : (
                    <div>
                        {!isSetting ? (
                            <button
                                onClick={() => setIsSetting(true)}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors"
                            >
                                Enable App Lock
                            </button>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-top duration-300">

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
                                        onClick={() => setIsSetting(false)}
                                        className="flex-1 py-3 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSetPin}
                                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Save PIN
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityPage;
