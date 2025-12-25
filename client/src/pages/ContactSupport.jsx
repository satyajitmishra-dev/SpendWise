import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, X, Check, Paperclip, AlertCircle, Loader2, ChevronRight, Shield, FileQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../services/api';

const ISSUE_TYPES = [
    { value: 'expense_issue', label: 'Expense Issue' },
    { value: 'account_profile', label: 'Account / Profile' },
    { value: 'data_missing', label: 'Data Missing' },
    { value: 'bug_crash', label: 'Bug / App Crash' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'other', label: 'Other' },
];

const ContactSupport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        type: location.state?.type || '',
        message: '',
        attachment: null
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [ticketId, setTicketId] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error("File size must be less than 2MB");
                return;
            }

            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    attachment: {
                        name: file.name,
                        data: reader.result
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.type || formData.message.length < 10) return;

        setStatus('loading');
        try {
            const res = await api.post('/support', formData);
            setTicketId(res.data.ticketId);
            setStatus('success');
            // Haptic feedback if available (usually handled by browser/OS, mock here)
            if (navigator.vibrate) navigator.vibrate(50);
        } catch (err) {
            console.error(err);
            setStatus('error');
            toast.error(err.response?.data?.msg || "Failed to submit request. Please try again.");
        }
    };

    const isValid = formData.type && formData.message.length >= 10;

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-900 overflow-hidden relative">
                {/* Ambient Background */}
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/20 dark:bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-400/20 dark:bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center border border-white/50 dark:border-slate-700/50 relative z-10"
                >
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Thanks for contacting SpendWise.<br />We'll get back to you within 24 hours.
                    </p>

                    <div className="bg-gray-50 dark:bg-slate-700/50 py-3 px-6 rounded-xl inline-block mb-8 border border-gray-100 dark:border-slate-600">
                        <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Ticket ID</span>
                        <span className="text-lg font-mono font-bold text-gray-800 dark:text-white">{ticketId}</span>
                    </div>

                    <button
                        onClick={() => navigate('/help')}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                    >
                        Back to Help
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-[100vh] h-[100dvh] bg-gray-50 dark:bg-slate-900 transition-colors duration-500 relative flex flex-col overflow-hidden">
            {/* Premium Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none fixed" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none fixed" />

            {/* Header (Stable) */}
            <div className="shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/50 relative z-50 px-4 py-4 md:px-8 flex items-center gap-4 shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition"
                >
                    <ArrowLeft size={22} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Contact Support</h1>
                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Usually replies within 24h
                    </p>
                </div>
            </div>

            {/* Content Scrollable Area (Flex-1) */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 relative z-10 scrollbar-hide py-6">
                <div className="max-w-xl mx-auto space-y-6">

                    {/* Issue Type */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Issue Type <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full appearance-none bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-2xl p-4 pr-10 text-gray-900 dark:text-white font-medium shadow-sm outline-none transition-all ring-0 focus:ring-4 focus:ring-indigo-500/10"
                            >
                                <option value="" disabled>Select issue type</option>
                                {ISSUE_TYPES.map(type => (
                                    <option key={type.value} value={type.label}>{type.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                                <ChevronRight className="rotate-90" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Your Message <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your issue or suggestion..."
                                className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-2xl p-4 min-h-[160px] text-gray-900 dark:text-white shadow-sm outline-none transition-all ring-0 focus:ring-4 focus:ring-indigo-500/10 resize-none text-base"
                            />
                            <div className={`absolute bottom-4 right-4 text-xs font-medium transition-colors ${formData.message.length > 0 && formData.message.length < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                {formData.message.length} / 10 min
                            </div>
                        </div>
                        {formData.message.length > 0 && formData.message.length < 10 && (
                            <p className="text-xs text-red-500 mt-2 ml-1 flex items-center gap-1 animate-fadeIn">
                                <AlertCircle size={12} /> Minimum 10 characters required
                            </p>
                        )}
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Attachment</label>

                        {!formData.attachment ? (
                            <>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all group active:scale-[0.99]"
                                >
                                    <div className="p-3 bg-white dark:bg-slate-800 shadow-sm rounded-full mb-3 group-hover:scale-110 group-hover:text-indigo-500 transition-all">
                                        <Paperclip size={20} />
                                    </div>
                                    <span className="text-sm font-medium">Add a screenshot</span>
                                    <span className="text-xs opacity-60 mt-1">PNG, JPG up to 2MB</span>
                                </button>
                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 ml-1">
                                    You can attach screenshots (optional)
                                </p>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex-shrink-0 overflow-hidden border border-indigo-100 dark:border-indigo-900/50">
                                        {formData.attachment.data.startsWith('data:image') ? (
                                            <img src={formData.attachment.data} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-indigo-500">
                                                <FileQuestion size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{formData.attachment.name}</p>
                                        <p className="text-xs text-indigo-500 font-medium">Ready to upload</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, attachment: null })}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400 hover:text-red-500 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg"
                            className="hidden"
                        />
                    </div>

                    {/* Secure Trust Badge */}
                    <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-600 font-medium tracking-wide">
                        <Shield size={12} className="text-green-500" />
                        <span>Bank-grade encryption driven</span>
                    </div>
                    {/* Bottom Spacer for safe scroll */}
                    <div className="h-4"></div>
                </div>
            </div>

            {/* Stable Bottom Action Bar (Not Fixed, Just Flex Item) */}
            <div className="shrink-0 p-4 pt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 z-50 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="max-w-xl mx-auto w-full">
                    {status === 'error' && (
                        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2 animate-shake">
                            <AlertCircle size={16} />
                            <span>Submission failed. Please check your internet.</span>
                            <button onClick={() => setStatus('idle')} className="ml-auto font-bold underline">Retry</button>
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || status === 'loading'}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all ${isValid && status !== 'loading'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Request'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;
