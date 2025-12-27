import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Zap, Smartphone } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import Footer from '../../components/layout/Footer';

const TrackDailyExpensesPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">
            <SEOHead
                title="How to Track Daily Expenses as a Student"
                description="Learn the best way to track daily expenses without spreadsheets. Simple, fast, and free tracking for college students."
                keywords="how to track daily expenses, student expense tracker, daily spending log, simple expense tracking"
                canonicalUrl="https://spendwise.satyajitmishra.me/track-daily-expenses"
            />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo1.svg" alt="SpendWise" className="w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight">SpendWise</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Log In
                        </button>
                        <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-transform active:scale-95 shadow-lg shadow-indigo-500/20">
                            Start Tracking
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                    The Easiest Way to <span className="text-indigo-600 dark:text-indigo-400">Track Daily Expenses</span> in College
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                    Tracking expenses shouldn't feel like homework. Discover why thousands of students switched from Excel to SpendWise to manage their money.
                </p>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Why Tracking Daily is Critical</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                            Small purchases add up. A ₹200 coffee here, a ₹500 snack there, and suddenly your monthly allowance is gone. By tracking daily, you get real-time visibility into where your money is going.
                        </p>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                <Zap size={20} /> Pro Tip
                            </h3>
                            <p className="text-indigo-800 dark:text-indigo-200">
                                Log your expenses right when you make them. SpendWise opens in milliseconds so you can add an expense while waiting for your receipt.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">How SpendWise Makes It Simple</h2>
                        <ul className="space-y-4">
                            {[
                                "No complicated forms – just Amount and Category.",
                                "Smart categories that learn from your habits.",
                                "Works offline – perfect for campus spots with bad signal.",
                                "Visual charts show you daily spending trends instantly."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1 rounded-full">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-lg text-slate-700 dark:text-slate-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-slate-900 text-white p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Ready to stop guessing?</h2>
                            <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
                                Join other smart students who are mastering their finances today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => navigate('/expenses')} className="px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                                    Track My First Expense
                                </button>
                                <button onClick={() => navigate('/budget')} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-colors">
                                    Create a Budget
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TrackDailyExpensesPage;
