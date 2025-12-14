import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, ListMinus, Wallet, Zap, User, Repeat, ArrowRightLeft, Sparkles, LogOut, PieChart, BarChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import AddExpenseSheet from '../features/AddExpenseSheet';
import { Toaster } from 'sonner';
import GuestWarning from './GuestWarning';
import ProfileReminder from './ProfileReminder';
import ThemeToggler from './ThemeToggler';

const Layout = () => {
    // HMR Force Update 1
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden text-gray-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-indigo-500/30">
            {/* Global Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none dark:opacity-20"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none dark:opacity-20"></div>

            <GuestWarning />
            <ProfileReminder />

            {/* Desktop Sidebar - Premium Floating Dock Style */}
            <aside className="hidden md:flex flex-col w-72 h-[96vh] my-auto ml-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl z-50 transition-all duration-300 relative">
                <div className="flex items-center gap-3 p-6 pb-8">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                        <Sparkles size={24} className="text-yellow-200 fill-yellow-200/50" />
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white block">SpendWise</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Student Edition</span>
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
                </nav>

                <div className="p-4 mt-auto space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-800 to-transparent w-full"></div>
                    <ThemeToggler showLabel className="w-full px-4 py-3 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl" />
                    <SidebarItem to="/profile" icon={User} label="My Profile" />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full perspective-1000">
                <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-6 md:p-6 w-full scroll-smooth">
                    {/* Constraints for large screens */}
                    <div className="max-w-7xl mx-auto w-full h-full p-2 md:p-4">
                        <Outlet />
                    </div>
                </div>

                {/* FAB - Premium Hover Effect */}
                <div className="fixed bottom-24 right-5 md:bottom-12 md:right-12 z-50">
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 ring-4 ring-white/50 dark:ring-slate-900/50 hover:scale-110"
                    >
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping group-hover:animate-none opacity-0 group-hover:opacity-100 duration-700"></div>
                        <Zap size={28} fill="currentColor" className="relative z-10" />
                    </button>
                </div>

                {/* Mobile Bottom Navigation - Glassmorphism */}
                <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl shadow-xl flex justify-between items-center z-40 px-6 py-4">
                    <NavItem to="/" icon={<Home size={22} />} label="Home" />
                    <NavItem to="/expenses" icon={<ListMinus size={22} />} label="Expenses" />
                    <NavItem to="/budgets" icon={<PieChart size={22} />} label="Budgets" />
                    <div className="w-8"></div> {/* Spacer for FAB visual balance */}
                    <NavItem to="/loans" icon={<ArrowRightLeft size={22} />} label="Loans" />
                    <NavItem to="/reports" icon={<BarChart size={22} />} label="Reports" />
                    <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
                </nav>
            </main>

            {/* Modals */}
            <AddExpenseSheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
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

const SidebarItem = ({ to, icon: Icon, label }) => (
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

export default Layout;
