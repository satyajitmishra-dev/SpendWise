import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenseStats } from '../store/slices/expenseSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, TrendingUp, PieChart as PieIcon, Loader2 } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const ReportsPage = () => {
    const dispatch = useDispatch();
    const { stats, statsLoading } = useSelector((state) => state.expenses);

    useEffect(() => {
        dispatch(fetchExpenseStats());
    }, [dispatch]);

    const handleExport = () => {
        if (!stats) return;

        // Convert trend data to CSV
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Month,Amount\n"
            + stats.trend.map(row => `${row.name},${row.amount}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expense_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (statsLoading && !stats) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Reports & Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Insights into your spending habits</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-medium hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <Download size={18} />
                    <span className="hidden sm:inline">Export Data</span>
                </button>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Monthly Trend */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <TrendingUp size={20} />
                        </div>
                        <h2 className="font-bold text-lg dark:text-white">Monthly Trend</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.trend}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="#6366f1"
                                    radius={[8, 8, 8, 8]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                            <PieIcon size={20} />
                        </div>
                        <h2 className="font-bold text-lg dark:text-white">Category Breakdown</h2>
                    </div>
                    <div className="h-[300px] w-full flex justify-center">
                        {stats.category.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.category}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.category.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <p>No data for this month</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.trend.slice(-4).map((item, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.name}</p>
                        <p className="text-lg font-bold dark:text-white">₹{item.amount.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportsPage;
