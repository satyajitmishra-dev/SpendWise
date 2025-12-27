import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, PieChart, Smartphone } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import Footer from '../../components/layout/Footer';

const ExpensesLandingPage = () => {
    const navigate = useNavigate();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How can I track daily expenses?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can track daily expenses easily using SpendWise. Simply log in, click 'Add Expense', enter the amount and category, and you're done. It takes less than 5 seconds."
                }
            },
            {
                "@type": "Question",
                "name": "Is SpendWise free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, SpendWise is completely free for students and personal use to track expenses and manage budgets."
                }
            },
            {
                "@type": "Question",
                "name": "Is this expense tracker good for students?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. SpendWise is designed specifically for students with features like simple categorization, monthly budget limits, and visual reports."
                }
            },
            {
                "@type": "Question",
                "name": "Is my expense data safe?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, your data is securely stored and protected. We use industry-standard encryption to ensure your financial privacy."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">
            <SEOHead
                title="Track Daily Expenses"
                description="The easiest way for students to track daily expenses and stick to a monthly budget. Simple, fast, and free expense tracker app."
                keywords="daily expense tracker, track expenses, expense tracker for students, personal finance app, student budget"
                canonicalUrl="https://spendwise.satyajitmishra.me/expenses"
            />

            {/* Inject JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>

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
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100 dark:border-indigo-500/20">
                        For Students & Beginners
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Daily Expenses</span> Easily
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Stop wondering where your money went. SpendWise helps you track every rupee, stick to your budget, and save more—without the spreadsheet headache.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-500/30 flex items-center gap-2">
                            Start Tracking Now <ArrowRight size={20} />
                        </button>
                        <button onClick={() => navigate('/login')} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                                <Smartphone size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Log in Seconds</h3>
                            <p className="text-slate-500 dark:text-slate-400">Add expenses on the go. Our simple interface means you'll actually stick to it.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <PieChart size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Visual Insights</h3>
                            <p className="text-slate-500 dark:text-slate-400">See exactly where your money goes with beautiful, easy-to-read charts.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Student Friendly</h3>
                            <p className="text-slate-500 dark:text-slate-400">Built for student life. Track rent, food, study materials, and fun separately.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-500">Everything you need to know about tracking daily expenses.</p>
                    </div>

                    <div className="space-y-6">
                        <FaqItem
                            question="How can I track daily expenses?"
                            answer="You can track daily expenses easily using SpendWise. Simply log in, click 'Add Expense', enter the amount and category, and you're done. It takes less than 5 seconds."
                        />
                        <FaqItem
                            question="Is SpendWise free?"
                            answer="Yes, SpendWise is completely free for students and personal use to track expenses and manage budgets."
                        />
                        <FaqItem
                            question="Is this expense tracker good for students?"
                            answer="Absolutely. SpendWise is designed specifically for students with features like simple categorization, monthly budget limits, and visual reports."
                        />
                        <FaqItem
                            question="Is my expense data safe?"
                            answer="Yes, your data is securely stored and protected. We use industry-standard encryption to ensure your financial privacy."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FaqItem = ({ question, answer }) => (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-2">{question}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{answer}</p>
    </div>
);

export default ExpensesLandingPage;
