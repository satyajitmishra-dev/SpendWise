import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { blogPosts } from '../../data/blogPosts';
import SEOHead from '../../components/common/SEOHead';
import Footer from '../../components/layout/Footer';

const BlogIndex = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">
            <SEOHead
                title="Financial Tips & Tricks for Students"
                description="Read our latest articles on saving money, budgeting for college, and managing your personal finances."
                keywords="student finance blog, money saving tips, college budgeting guide, personal finance articles"
                canonicalUrl="https://spendwise.app/blog"
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
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Money</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Practical guides and tips to help you survive university without going broke.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {post.readTime}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                        <User size={14} />
                                        {post.author}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        Read <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogIndex;
