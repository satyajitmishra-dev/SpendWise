import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    {
        question: "How do I reset my data?",
        answer: "Go to Profile > Settings > Dangerous Zone. You can choose to reset specific data like expenses or do a full account reset. Note that this action cannot be undone."
    },
    {
        question: "Is my financial data secure?",
        answer: "Yes, SpendWise uses industry-standard encryption to store your data. We do not share your personal financial information with third parties."
    },
    {
        question: "Can I export my expense report?",
        answer: "Currently, this feature is in development. In future updates, you'll be able to export PDF and CSV reports directly from the Reports page."
    },
    {
        question: "How do I change my currency?",
        answer: "You can change your preferred currency in Profile > Settings. This will update the symbol across the entire application."
    },
    {
        question: "What if I forget my passcode?",
        answer: "If you forget your passcode, you'll need to verify your identity via email to reset it. Tap 'Forgot Passcode' on the lock screen."
    }
];

const FAQPage = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-500">
            <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700/50 sticky top-0 z-20 px-4 py-4 md:px-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition"
                >
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Help & Answers</h1>
            </div>

            <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl shadow-sm text-gray-900 dark:text-white placeholder-gray-400 font-medium outline-none transition-all"
                    />
                </div>

                <div className="space-y-3">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <span className="pr-4">{faq.question}</span>
                                    {openIndex === index ? <ChevronUp size={20} className="text-indigo-500 shrink-0" /> : <ChevronDown size={20} className="text-gray-400 shrink-0" />}
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 pt-0 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-slate-700/50">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No answers found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try searching for something else or contact support.</p>
                            <button
                                onClick={() => navigate('/contact-support')}
                                className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                            >
                                Contact Support
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
