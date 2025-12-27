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
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 sticky top-0 z-20 px-4 py-4 md:px-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition"
                >
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Help & Answers</h1>
            </div>

            <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 relative z-10 pb-20">

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-gray-100 dark:border-white/10 focus:border-indigo-500/50 rounded-[1.5rem] shadow-sm text-gray-900 dark:text-white placeholder-gray-400 font-medium outline-none transition-all ring-0 focus:ring-4 focus:ring-indigo-500/10"
                    />
                </div>

                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-500/20"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-start justify-between p-5 text-left font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <span className="pr-4 mt-0.5 text-base leading-snug">{faq.question}</span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 transition-all duration-300 ${openIndex === index ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rotate-180' : 'text-gray-400'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-6 pt-0 text-gray-600 dark:text-slate-400 text-sm leading-relaxed border-t border-transparent">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 dark:text-slate-600 border border-gray-200 dark:border-slate-700/50">
                                <MessageCircle size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No answers found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">We couldn't find anything matching your search. Try different keywords.</p>
                            <button
                                onClick={() => navigate('/contact-support')}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
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
