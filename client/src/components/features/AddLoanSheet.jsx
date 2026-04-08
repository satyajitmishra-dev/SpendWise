import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addLoan, updateLoan } from '../../store/slices/loanSlice';
import { X, Calendar, User, FileText, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const LOAN_TYPES = [
    { id: 'given', label: 'I Lent', icon: ArrowUpCircle, color: 'text-red-600 bg-red-100', border: 'border-red-200' },
    { id: 'taken', label: 'I Borrowed', icon: ArrowDownCircle, color: 'text-green-600 bg-green-100', border: 'border-green-200' },
];

const AddLoanSheet = ({ isOpen, onClose, initialData = null }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [person, setPerson] = useState(initialData?.person || '');
    const [type, setType] = useState(initialData?.type || 'given');
    const [note, setNote] = useState(initialData?.note || '');
    const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
    const [submitting, setSubmitting] = useState(false);

    // Update state when initialData changes
    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount || '');
            setPerson(initialData.person || '');
            setType(initialData.type || 'given');
            setNote(initialData.note || '');
            setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
        } else {
            setAmount('');
            setPerson('');
            setType('given');
            setNote('');
            setDueDate('');
        }
    }, [initialData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !person) {
            toast.error('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        try {
            const dataToSubmit = {
                amount: parseFloat(amount),
                person,
                type,
                note,
                dueDate: dueDate || null
            };

            if (initialData) {
                await dispatch(updateLoan({
                    id: initialData._id,
                    data: dataToSubmit
                })).unwrap();
                toast.success('Loan record updated!');
            } else {
                await dispatch(addLoan(dataToSubmit)).unwrap();
                toast.success('Loan record saved!');
                // Only reset the form if it is a new addition since edit clears it anyway
                setAmount('');
                setPerson('');
                setNote('');
                setDueDate('');
                setType('given');
            }
            onClose();
        } catch (err) {
            toast.error(initialData ? 'Failed to update loan. Please try again.' : 'Failed to save loan. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Sheet */}
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">{initialData ? 'Edit Loan Record' : 'Add Loan Record'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input */}
                    <div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="500"
                                className="w-full pl-10 pr-4 py-4 text-4xl font-bold bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Loan Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        {LOAN_TYPES.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setType(t.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                                    type === t.id
                                        ? `${t.border} ${t.color} ring-1 ring-offset-2 dark:ring-offset-slate-900`
                                        : "border-transparent bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                                )}
                            >
                                <t.icon size={24} />
                                <span className="font-bold">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={person}
                                onChange={(e) => setPerson(e.target.value)}
                                placeholder={type === 'given' ? "Lent to whom?" : "Borrowed from whom?"}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g. Emergency, Books"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        {submitting ? 'Saving...' : (initialData ? 'Update Record' : 'Save Record')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLoanSheet;
