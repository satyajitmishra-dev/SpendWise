import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = 'SpendWise - Student Expense Tracker';

        switch (true) {
            case path === '/':
                title = 'Dashboard - SpendWise';
                break;
            case path === '/expenses':
                title = 'Expenses - SpendWise';
                break;
            case path === '/accounts':
                title = 'Accounts & Cards - SpendWise';
                break;
            case path === '/subscriptions':
                title = 'Subscriptions - SpendWise';
                break;
            case path === '/budgets':
                title = 'Budgets - SpendWise';
                break;
            case path === '/loans':
                title = 'Loans & Debts - SpendWise';
                break;
            case path === '/reports':
                title = 'Reports - SpendWise';
                break;
            case path === '/profile':
                title = 'My Profile - SpendWise';
                break;
            case path === '/login':
                title = 'Login - SpendWise';
                break;
            case path === '/signup':
                title = 'Sign Up - SpendWise';
                break;
            case path === '/welcome':
                title = 'Welcome - SpendWise';
                break;
            case path === '/onboarding':
                title = 'Setup Profile - SpendWise';
                break;
            default:
                title = 'SpendWise - Student Expense Tracker';
        }

        document.title = title;
    }, [location]);

    return null;
};

export default PageTitleUpdater;
