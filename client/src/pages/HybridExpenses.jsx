import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ExpensesPage from './ExpensesPage';
import ExpensesLandingPage from './seo/ExpensesLandingPage';
import Layout from '../components/layout/Layout';
import LoadingScreen from '../components/common/LoadingScreen';

const HybridExpenses = () => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) return <LoadingScreen />;

    // Authenticated: Show the App (Wrapped in Layout manualy)
    if (user) {
        return (
            <Layout>
                <ExpensesPage />
            </Layout>
        );
    }

    // Public: Show SEO Landing Page
    return <ExpensesLandingPage />;
};

export default HybridExpenses;
