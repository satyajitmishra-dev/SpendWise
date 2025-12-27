import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { blogPosts } from '../../data/blogPosts';
import SEOHead from '../../components/common/SEOHead';
import Footer from '../../components/layout/Footer';
import NotFoundPage from '../NotFoundPage';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return <NotFoundPage />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">
            <SEOHead
                title={post.title}
                description={post.excerpt}
                keywords={`${post.category}, student finance, SpendWise blog`}
                canonicalUrl={`https://spendwise.app/blog/${post.slug}`}
            />

            {/* Navbar Stub */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo1.svg" alt="SpendWise" className="w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight">SpendWise</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/blog')} className="text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                            <ArrowLeft size={16} /> Back to Blog
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                <div className="mb-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                        {post.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-8">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span className="font-medium text-slate-900 dark:text-slate-200">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            {post.readTime}
                        </div>
                    </div>
                </div>

                <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-lg">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>

                <article className="prose prose-lg dark:prose-invert prose-indigo mx-auto">
                    {/* Render HTML content safely since it's from our own static file */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                    <h3 className="font-bold text-xl mb-4">Share this article</h3>
                    <div className="flex justify-center gap-4">
                        <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPost;
