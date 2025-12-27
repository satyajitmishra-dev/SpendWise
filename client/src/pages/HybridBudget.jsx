import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import BudgetPage from './BudgetPage';
import BudgetLandingPage from './seo/BudgetLandingPage';
import Layout from '../components/layout/Layout';
import LoadingScreen from '../components/common/LoadingScreen';

const HybridBudget = () => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) return <LoadingScreen />;

    // Authenticated: Show the App (Wrapped in Layout manually)
    if (user) {
        return (
            <Layout>
                <BudgetPage />
            </Layout>
        );
    }

    // Public: Show SEO Landing Page
    return <BudgetLandingPage />;
};

export default HybridBudget;
