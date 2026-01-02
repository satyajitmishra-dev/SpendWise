import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { parseText } from '../../services/smartService';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

const SmartInput = ({ className }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSmartAdd = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        try {
            const { data } = await parseText(input);
            if (data) {
                // Navigate to Expenses page with pre-filled data
                navigate('/expenses', {
                    state: {
                        openAdd: true,
                        initialData: {
                            amount: data.amount,
                            category: data.category?.toLowerCase(),
                            note: data.note,
                            date: data.date,
                            type: data.type || 'expense'
                        }
                    }
                });
                setInput('');
            }
        } catch (error) {
            console.error("Smart Add Error:", error);
            toast.error("Could not understand that. Try 'Lunch 200' or similar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSmartAdd} className={cn("relative w-full group", className)}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                {loading ? (
                    <Loader2 className="text-indigo-500 animate-spin" size={20} />
                ) : (
                    <Sparkles className="text-indigo-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                )}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI: 'Spent 500 on Pizza'..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white placeholder:text-gray-400 font-medium"
                disabled={loading}
            />
            <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-slate-700 disabled:opacity-0 transition-opacity"
            >
                <ArrowRight size={18} strokeWidth={2.5} />
            </button>
        </form>
    );
};

export default SmartInput;
