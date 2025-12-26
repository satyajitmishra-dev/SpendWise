import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCcw, X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const BudgetRenewalDialog = ({ isOpen, onClose, expiredBudgets, onRenew, onDismiss }) => {
    if (!isOpen || !expiredBudgets || expiredBudgets.length === 0) return null;

    const budget = expiredBudgets[0]; // Handle one at a time for simplicity

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl overflow-hidden border border-white/20"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-b-[50%]" />

                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Calendar size={32} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Budget Expired
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                                Your <span className="font-bold text-indigo-600 dark:text-indigo-400">{budget.category}</span> budget ended on {format(new Date(budget.endDate), 'd MMM')}.
                                <br />Would you like to set a new one?
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => onRenew(budget, 'extend')}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw size={18} />
                                    Extend for 30 Days
                                </button>

                                <button
                                    onClick={() => onRenew(budget, 'new')}
                                    className="w-full py-3.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-2 border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 rounded-xl font-bold active:scale-95 transition-all"
                                >
                                    Set New Limit
                                </button>

                                <button
                                    onClick={() => onDismiss(budget._id)}
                                    className="text-gray-400 text-xs font-medium hover:text-gray-600 dark:hover:text-gray-300 py-2"
                                >
                                    Dismiss this budget
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BudgetRenewalDialog;
