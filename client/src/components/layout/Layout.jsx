import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, ListMinus, Wallet, Zap, User, Repeat, ArrowRightLeft, MoreHorizontal, PieChart, BarChart, X, Info, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import AddExpenseSheet from '../features/AddExpenseSheet';
import InfoDialog from '../common/InfoDialog';
import InstallPrompt from '../common/InstallPrompt';
import { Toaster } from 'sonner';
import GuestWarning from './GuestWarning';
import ProfileReminder from './ProfileReminder';
import ThemeToggler from './ThemeToggler';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { initAppConfig } from '../../store/slices/appSlice';
import UpdateChecker from './UpdateChecker';
import UpdateModal from '../common/UpdateModal';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';

const Layout = ({ children }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addSheetType, setAddSheetType] = useState('expense');
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isInstallPromptOpen, setIsInstallPromptOpen] = useState(false);

    // FAB Long Press Logic
    const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const longPressTimerRef = useRef(null);
    const isLongPressRef = useRef(false);

    // Scroll Direction Logic Removed as per user request
    // FAB will now remain always visible.

    // FAB Handling - Simplified to ensure Click interacts correctly
    const handleFabClick = () => {
        // If menu is open, close it.
        if (isFabMenuOpen) {
            setIsFabMenuOpen(false);
            return;
        }
        // Otherwise open Expense Sheet directly
        setAddSheetType('expense');
        setIsAddOpen(true);
    };

    // Long Press Handling
    const handleFabStart = () => {
        setIsPressing(true);
        longPressTimerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            setIsFabMenuOpen(true);
            setIsPressing(false);
            if (window.navigator?.vibrate) window.navigator.vibrate(50);
        }, 600); // Increased to 600ms to prevent accidental triggers
    };

    const handleFabEnd = (e) => {
        // Prevent default click if it was a long press
        if (isLongPressRef.current) {
            e.preventDefault();
        }

        clearTimeout(longPressTimerRef.current);
        setIsPressing(false);

        // Note: We DO NOT handle click here anymore. 
        // We let the native onClick fire if isLongPressRef.current is false.

        // Reset check after a small delay to allow onClick to fire/check
        setTimeout(() => {
            isLongPressRef.current = false;
        }, 100);
    };

    const handleFabCancel = () => {
        clearTimeout(longPressTimerRef.current);
        setIsPressing(false);
        isLongPressRef.current = false;
    };

    // Native Click Handler
    const onFabClick = (e) => {
        if (isLongPressRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        handleFabClick();
    }

    // We need to handle both mouse and touch to be safe, but Pointer Events are best.
    // However, sometimes on mobile 'click' fires after pointerup.
    // Let's use onMouseDown/onTouchStart and onMouseUp/onTouchEnd
    // To avoid duplication, we use onPointerDown / onPointerUp which covers both.
    // IMPORTANT: style touch-action: none on button to prevent browser zooming/scrolling interfering.


    const { user } = useSelector((state) => state.auth);
    const { version } = useSelector((state) => state.app);
    const navigate = useNavigate();
    const location = useLocation();

    // Notification State
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        if (!user || user.isGuest) return;
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Failed to fetch unread notifications');
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize Global App Config (Version, Feature Flags)
        dispatch(initAppConfig());

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden text-gray-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-indigo-500/30">
            {/* Global Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none dark:opacity-20"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none dark:opacity-20"></div>

            <GuestWarning />
            <GuestWarning />
            <ProfileReminder />

            {/* Version Check Logic */}
            <UpdateChecker />
            <UpdateModal />

            {/* Desktop Sidebar - Premium Floating Dock Style */}
            <aside className="hidden md:flex flex-col w-72 h-[96vh] my-auto ml-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl z-50 transition-all duration-300 relative">
                <div className="flex items-center gap-3 p-6 pb-8">
                    <NavLink to="/" className="flex items-center justify-center w-16 h-16 shrink-0">
                        <img src="/logo1.svg" alt="SpendWise Logo" className="w-12 h-12 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300 ease-out cursor-pointer" />
                    </NavLink>
                    <div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white block">SpendWise</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Student Edition <span className="text-indigo-500/50 ml-1">v{version}</span></span>
                    </div>
                </div>

                <nav className="space-y-1.5 flex-1 px-4 overflow-y-auto no-scrollbar min-h-0">
                    <SidebarItem to="/" icon={Home} label="Dashboard" />
                    <SidebarItem to="/expenses" icon={ListMinus} label="Expenses" />
                    <SidebarItem to="/accounts" icon={Wallet} label="Accounts & Cards" />
                    <SidebarItem to="/loans" icon={ArrowRightLeft} label="Loans & Debts" />
                    <SidebarItem to="/subscriptions" icon={Repeat} label="Subscriptions" />
                    <SidebarItem to="/budgets" icon={PieChart} label="Budgets" />
                    <SidebarItem to="/reports" icon={BarChart} label="Reports" />
                    <div className="my-2 border-t border-gray-100 dark:border-slate-800/50 mx-4"></div>
                    <SidebarItem
                        icon={Info}
                        label="Help & Guide"
                        onClick={() => setIsInfoOpen(true)}
                    />
                </nav>

                <div className="p-4 mt-auto space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-800 to-transparent w-full"></div>
                    <ThemeToggler showLabel className="w-full px-4 py-3 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl" />
                    <SidebarItem to="/profile" icon={User} label="My Profile" />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full perspective-1000">
                {/* Mobile Top Bar with Profile - Ultra Premium */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-40">
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/80 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900/80 backdrop-blur-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
                    <div className="relative px-5 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <NavLink to="/" className="flex items-center justify-center w-12 h-12 shrink-0">
                                    <img src="/logo1.svg" alt="SpendWise Logo" className="w-10 h-10 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300 ease-out cursor-pointer" />
                                </NavLink>
                                <div>
                                    <span className="font-bold text-base tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">SpendWise</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {user && !user.isGuest && (
                                    <button
                                        onClick={() => navigate('/notifications')}
                                        className="w-10 h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm active:scale-95 transition-all relative"
                                    >
                                        <div className="relative">
                                            <Bell size={20} className="fill-indigo-100 dark:fill-indigo-900/40" />
                                            {/* Notification Dot */}
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-ping"></span>
                                            )}
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                            )}
                                        </div>
                                    </button>
                                )}

                                <button
                                    onClick={() => setIsInfoOpen(true)}
                                    className="w-10 h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm active:scale-95 transition-all"
                                >
                                    <Info size={20} className="fill-indigo-100 dark:fill-indigo-900/40" />
                                </button>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="relative w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center text-sm font-bold bg-clip-padding text-indigo-600 dark:text-indigo-400 ring-2 ring-white/50 dark:ring-slate-900/50 shadow-lg shadow-indigo-500/10 active:scale-95 transition-all hover:shadow-indigo-500/20 overflow-hidden"
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        user?.name?.[0]?.toUpperCase() || 'U'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pb-24 pt-16 md:pt-6 md:pb-6 md:px-8 w-full scroll-smooth flex flex-col" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="max-w-7xl mx-auto w-full flex-grow p-2 md:p-0">
                        {/* Support manual children for Hybrid Routes or Outlet for standard routes */}
                        {children ? (
                            <>{children}</>
                        ) : (
                            <Outlet context={{ openInfo: () => setIsInfoOpen(true) }} />
                        )}
                    </div>
                </div>

                {/* FAB - Premium Long Press Menu */}
                {/* pointer-events-none on container to let clicks pass through to Nav items behind it */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-12 md:right-12 z-50 flex flex-col items-center gap-3 transition-transform duration-300 pointer-events-none">

                    {/* Floating Menu */}
                    <div className={cn(
                        "flex flex-col gap-3 transition-all duration-300 origin-bottom pointer-events-auto",
                        isFabMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8 pointer-events-none"
                    )}>
                        <button
                            onClick={() => { setIsFabMenuOpen(false); navigate('/subscriptions', { state: { openAdd: true } }); }}
                            className="flex items-center gap-3 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/80 dark:text-purple-300 rounded-full shadow-lg font-bold text-sm backdrop-blur-md hover:scale-105 transition-transform"
                        >
                            <Repeat size={18} /> New Subscription
                        </button>
                        <button
                            onClick={() => { setIsFabMenuOpen(false); setAddSheetType('income'); setIsAddOpen(true); }}
                            className="flex items-center gap-3 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/80 dark:text-green-300 rounded-full shadow-lg font-bold text-sm backdrop-blur-md hover:scale-105 transition-transform"
                        >
                            <Wallet size={18} /> New Income
                        </button>
                        <button
                            onClick={() => { setIsFabMenuOpen(false); setAddSheetType('expense'); setIsAddOpen(true); }}
                            className="flex items-center gap-3 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/80 dark:text-red-300 rounded-full shadow-lg font-bold text-sm backdrop-blur-md hover:scale-105 transition-transform"
                        >
                            <ListMinus size={18} /> New Expense
                        </button>
                    </div>

                    <div className="relative group pointer-events-auto">
                        {/* Progress Ring */}
                        <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none z-0" viewBox="0 0 100 100">
                            <circle
                                cx="50" cy="50" r="48"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                                className="opacity-30 dark:opacity-20"
                            />
                            <circle
                                cx="50" cy="50" r="48"
                                fill="none"
                                stroke="url(#fab-gradient)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="301.59" // 2 * pi * 48
                                strokeDashoffset={isPressing ? 0 : 301.59}
                                className={cn(
                                    "transition-all ease-linear",
                                    isPressing ? "duration-[500ms]" : "duration-200"
                                )}
                            />
                            <defs>
                                <linearGradient id="fab-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
                                    <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
                                </linearGradient>
                            </defs>
                        </svg>

                        <button
                            onPointerDown={handleFabStart}
                            onPointerUp={handleFabEnd}
                            onPointerLeave={handleFabCancel}
                            onClick={onFabClick}
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ touchAction: 'none' }}
                            className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 ring-4 ring-white/50 dark:ring-slate-900/50 hover:scale-110"
                        >
                            {/* Pulse Ring when Menu Open */}
                            {isFabMenuOpen && <div className="absolute inset-0 rounded-full border-2 border-white animate-ping"></div>}

                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping group-hover:animate-none opacity-0 group-hover:opacity-100 duration-700"></div>
                            <Zap size={28} fill="currentColor" className={cn("relative z-10 transition-transform duration-300 pointer-events-none", isFabMenuOpen ? "rotate-45" : "")} />
                        </button>
                    </div>
                </div>

                {/* Mobile Bottom Navigation - Simplified 5 Items */}
                <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl shadow-xl flex justify-around items-center z-40 px-4 py-4">
                    <NavItem to="/" icon={<Home size={22} />} label="Home" />
                    <NavItem to="/expenses" icon={<ListMinus size={22} />} label="Expenses" />
                    <div className="w-12"></div> {/* Spacer for FAB */}
                    <NavItem to="/loans" icon={<ArrowRightLeft size={22} />} label="Loans" />
                    <button
                        onClick={() => setIsMoreOpen(true)}
                        className="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-all"
                    >
                        <MoreHorizontal size={22} />
                        <span className="text-[10px] font-medium">More</span>
                    </button>
                </nav>

                {/* More Menu Modal */}
                {isMoreOpen && (
                    <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={() => setIsMoreOpen(false)}>
                        <div
                            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-8 animate-slide-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">More Options</h3>
                                <button
                                    onClick={() => setIsMoreOpen(false)}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <MoreMenuItem
                                    to="/accounts"
                                    icon={<Wallet size={20} />}
                                    label="Accounts & Cards"
                                    onClick={() => setIsMoreOpen(false)}
                                />
                                <MoreMenuItem
                                    to="/subscriptions"
                                    icon={<Repeat size={20} />}
                                    label="Subscriptions"
                                    onClick={() => setIsMoreOpen(false)}
                                />
                                <MoreMenuItem
                                    to="/budgets"
                                    icon={<PieChart size={20} />}
                                    label="Budgets"
                                    onClick={() => setIsMoreOpen(false)}
                                />
                                <MoreMenuItem
                                    to="/reports"
                                    icon={<BarChart size={20} />}
                                    label="Reports"
                                    onClick={() => setIsMoreOpen(false)}
                                />
                                <MoreMenuItem
                                    to="/profile"
                                    icon={<User size={20} />}
                                    label="Profile"
                                    onClick={() => setIsMoreOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            <ErrorBoundary>
                <AddExpenseSheet
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    initialData={{ type: addSheetType }}
                    onExpenseAdded={() => setIsInstallPromptOpen(true)}
                />
            </ErrorBoundary>
            <InfoDialog isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
            <InstallPrompt isOpen={isInstallPromptOpen} onClose={() => setIsInstallPromptOpen(false)} />
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 relative",
            isActive ? "text-indigo-600 dark:text-indigo-400 scale-110" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300",
            isActive && "after:content-[''] after:absolute after:-top-3 after:w-1 after:h-1 after:rounded-full after:bg-indigo-600 dark:after:bg-indigo-400"
        )}
    >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
);

const MoreMenuItem = ({ to, icon, label, onClick }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => {
                navigate(to);
                onClick();
            }}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
        >
            <div className="text-gray-600 dark:text-gray-400">
                {icon}
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{label}</span>
        </button>
    );
};

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium relative overflow-hidden group text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            >
                <Icon size={20} className="transition-transform group-hover:scale-110" />
                <span>{label}</span>
            </button>
        );
    }

    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium relative overflow-hidden group",
                isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-indigo-600 dark:before:bg-indigo-400 before:rounded-r-full before:z-10"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-indigo-600 dark:text-indigo-400")} />
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
};

export default Layout;
