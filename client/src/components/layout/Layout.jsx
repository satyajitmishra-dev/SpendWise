import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, ListMinus, Wallet, Zap, User, Repeat, ArrowRightLeft, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import AddExpenseSheet from '../features/AddExpenseSheet';
import { Toaster } from 'sonner';
import GuestWarning from './GuestWarning';
import ProfileReminder from './ProfileReminder';
import ThemeToggler from './ThemeToggler';

const Layout = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden text-gray-900 dark:text-slate-100 transition-colors duration-300">
            {/* Toaster moved to App.jsx */}
            <GuestWarning />
            <ProfileReminder />

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-6 z-50 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-3 mb-10 pl-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Sparkles size={24} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">SpendWise</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <SidebarItem to="/" icon={Home} label="Dashboard" />
                    <SidebarItem to="/expenses" icon={ListMinus} label="Expenses" />
                    <SidebarItem to="/accounts" icon={Wallet} label="Accounts & Cards" />
                    <SidebarItem to="/loans" icon={ArrowRightLeft} label="Loans & Debts" />
                    <SidebarItem to="/subscriptions" icon={Repeat} label="Subscriptions" />
                </nav>

                <div className="pt-6 border-t border-gray-100 dark:border-slate-800 mt-auto space-y-2">
                    <ThemeToggler showLabel className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl" />
                    <SidebarItem to="/profile" icon={User} label="My Profile" />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-6 md:p-8 w-full">
                    {/* Constraints for large screens */}
                    <div className="max-w-7xl mx-auto w-full h-full">
                        <Outlet />
                    </div>
                </div>

                {/* FAB - Responsive Positioning */}
                <div className="fixed bottom-24 right-5 md:bottom-10 md:right-10 z-50">
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 ring-4 ring-white md:ring-indigo-50 hover:scale-110"
                    >
                        <Zap size={28} fill="currentColor" />
                    </button>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-40 pb-safe">
                    <NavItem to="/" icon={<Home size={22} />} label="Home" />
                    <NavItem to="/expenses" icon={<ListMinus size={22} />} label="Expenses" />
                    <div className="w-8"></div> {/* Spacer for FAB visual balance */}
                    <NavItem to="/loans" icon={<ArrowRightLeft size={22} />} label="Loans" />
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
            "flex flex-col items-center gap-1 transition-colors duration-200 p-2",
            isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
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
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
            isActive
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
        )}
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

export default Layout;
