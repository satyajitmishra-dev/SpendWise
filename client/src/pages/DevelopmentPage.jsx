import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Code, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const DevelopmentPage = () => {
    const navigate = useNavigate();
    const { version } = useSelector((state) => state.app);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-500">
            <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700/50 sticky top-0 z-20 px-4 py-4 md:px-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition"
                >
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">About Development</h1>
            </div>

            <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">

                {/* App Info Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mx-auto flex items-center justify-center mb-6">
                        <Code size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">SpendWise</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Student Edition • v{version}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-600 uppercase tracking-widest">Built with ❤️ & React</p>
                </div>

                {/* Developer Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-2">Developer</h3>

                    <a href="https://github.com/satyajitmishra-dev" target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 hover:border-black dark:hover:border-white transition-colors group">
                        <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                            <Github size={20} />
                        </div>
                        <div className="flex-1">
                            <span className="font-bold text-gray-900 dark:text-white block">Satyajit Mishra</span>
                            <span className="text-xs text-gray-500">View GitHub Profile</span>
                        </div>
                        <ExternalLink size={16} className="text-gray-400" />
                    </a>

                    <a href="mailto:satyajitmishra791@gmail.com" className="block bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 hover:border-indigo-500 transition-colors group">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Mail size={20} />
                        </div>
                        <div className="flex-1">
                            <span className="font-bold text-gray-900 dark:text-white block">Contact Developer</span>
                            <span className="text-xs text-gray-500">Feature requests & inquiries</span>
                        </div>
                        <ExternalLink size={16} className="text-gray-400" />
                    </a>
                </div>

                {/* Tech Stack (Optional/Fun) */}
                <div className="bg-gray-100 dark:bg-slate-800/50 rounded-2xl p-6 text-center">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4 uppercase">Powered By</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['React', 'Node.js', 'MongoDB', 'Tailwind', 'Vite', 'Recharts'].map(tech => (
                            <span key={tech} className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentPage;
