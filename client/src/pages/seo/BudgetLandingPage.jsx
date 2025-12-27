import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import Footer from '../../components/layout/Footer';

const BudgetLandingPage = () => {
    const navigate = useNavigate();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I create a monthly budget?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "With SpendWise, creating a monthly budget is simple. Just set your total monthly limit and we'll help you track your daily spending against it."
                }
            },
            {
                "@type": "Question",
                "name": "What happens if I exceed my budget?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SpendWise sends you a smart alert when you reach 90% of your budget, helping you slow down before you overspend."
                }
            },
            {
                "@type": "Question",
                "name": "Is budgeting hard for beginners?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Not with SpendWise. We removed the complex spreadsheets and jargon. It's just 'Limit' vs 'Spent' - perfect for beginners."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">
            <SEOHead
                title="Monthly Budget Planner for Students"
                description="The simple monthly budget planner for students. Set limits, track spending, and avoid running out of money before the month ends."
                keywords="monthly budget tracker, student budget planner, budget management app, expense control, save money student"
                canonicalUrl="https://spendwise.satyajitmishra.me/budget"
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
                        Take Control
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Create & Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Monthly Budget</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Stop running out of money before the month ends. meaningful limits, track your progress, and reach your savings goals.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-500/30 flex items-center gap-2">
                            Create My Budget <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Why Students Fail at Budgeting</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    Most students try to keep track in their heads or use complicated Excel sheets. The problem? It's easy to forget a coffee here or a subscription there. Result: The "End of Month Broke" syndrome.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Budget vs. Actual Spending</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    SpendWise shows you a live progress bar of your month. You can see exactly how much "Safe to Spend" money you have left today, so you never overspend accidentally.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Smart Alerts</h3>
                                    <p className="text-slate-500 dark:text-slate-400">Get notified when you hit 90% of your limit. No more nasty surprises.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Category Limits</h3>
                                    <p className="text-slate-500 dark:text-slate-400">Set specific limits for Food, Entertainment, or Shopping to stay balanced.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Savings Goals</h3>
                                    <p className="text-slate-500 dark:text-slate-400">See your savings grow month by month as you stick to your plan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-500">Mastering your student budget.</p>
                    </div>

                    <div className="space-y-6">
                        <FaqItem
                            question="How do I create a monthly budget?"
                            answer="With SpendWise, creating a monthly budget is simple. Just set your total monthly limit and we'll help you track your daily spending against it."
                        />
                        <FaqItem
                            question="What happens if I exceed my budget?"
                            answer="SpendWise sends you a smart alert when you reach 90% of your budget, helping you slow down before you overspend."
                        />
                        <FaqItem
                            question="Is budgeting hard for beginners?"
                            answer="Not with SpendWise. We removed the complex spreadsheets and jargon. It's just 'Limit' vs 'Spent' - perfect for beginners."
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

export default BudgetLandingPage;
