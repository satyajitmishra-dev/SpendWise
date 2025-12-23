const HomeSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Greeting Skeleton */}
            <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded"></div>
            </div>

            {/* Available this month Card Skeleton */}
            <div className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="h-3 w-40 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-16 w-56 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-10 w-64 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
                </div>
            </div>

            {/* Spending Direction Card Skeleton */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-2 flex-1">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-6 w-12 bg-gray-200 dark:bg-slate-800 rounded"></div>
                </div>
                {/* Progress Bar Skeleton */}
                <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded-full"></div>
            </div>

            {/* Micro Context Stats Grid Skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-8 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-2 w-28 bg-gray-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-8 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-2 w-28 bg-gray-200 dark:bg-slate-800 rounded"></div>
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-200 dark:bg-slate-800 p-5 rounded-[2rem] h-32"></div>
                <div className="bg-gray-200 dark:bg-slate-800 p-5 rounded-[2rem] h-32"></div>
            </div>

            {/* Activity Log Skeleton */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800/50">
                <div className="flex justify-between items-end px-1">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div>
                </div>

                {/* Activity Items Skeleton */}
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-800"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                                    <div className="h-3 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div>
                                </div>
                            </div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeSkeleton;
