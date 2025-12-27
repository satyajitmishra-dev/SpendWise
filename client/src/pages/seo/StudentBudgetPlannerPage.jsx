import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Coffee, GraduationCap } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import Footer from '../../components/layout/Footer';

const StudentBudgetPlannerPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">
            <SEOHead
                title="Best Student Budget Planner App (Free)"
                description="A budget planner designed for university life. Track textbooks, food, and fun without the stress. Free for students."
                keywords="student budget planner, college budget app, university finance tracker, free budget app for students"
                canonicalUrl="https://spendwise.app/student-budget-planner"
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
                            Start Planning
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-6">
                    <GraduationCap size={16} /> Student Edition
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                    The <span className="text-purple-600 dark:text-purple-400">Student Budget Planner</span> That Actually Works
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                    University life is expensive. Textbooks, rent, late-night food... it adds up fast. SpendWise helps you plan for it all without the stress.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-6">
                            <Coffee size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Daily Life</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Set a flexible limit for food and coffee. We'll warn you if you're spending too fast, so you don't starve during finals week.
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Semester Costs</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Planning for big expenses like books or semester fees? Use our "Savings Goals" to set money aside every month.
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold mb-6">Beyond Just Tracking</h2>
                        <div className="prose dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-400">
                            <p className="mb-4">
                                Most "planners" are just glorified calculators. SpendWise is different. We act as your financial co-pilot.
                            </p>
                            <p className="mb-4">
                                When you set up a student budget, we automatically calculate a "Safe Daily Spend" limit. If you spend less today, you have more for the weekend. It's that simple.
                            </p>
                        </div>
                    </section>

                    <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10 rounded-3xl text-center shadow-xl">
                        <h2 className="text-3xl font-bold mb-4">Start Your Semester Right</h2>
                        <p className="text-indigo-100 mb-8 max-w-lg mx-auto text-lg">
                            Ditch the stress. Get the app that helps you graduate with savings, not just a degree.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={() => navigate('/budget')} className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold hover:bg-purple-50 transition-colors shadow-lg">
                                Create My Student Budget
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StudentBudgetPlannerPage;
