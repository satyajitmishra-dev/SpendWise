import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoansPage from './pages/LoansPage';
import AccountsPage from './pages/AccountsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import BudgetPage from './pages/BudgetPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfileSetup from './pages/ProfileSetup';
import WelcomeScreen from './pages/WelcomeScreen';
import NotFoundPage from './pages/NotFoundPage';
// const Expenses = () => <div className="p-4">Expenses</div>;
// const Accounts = () => <div className="p-4">Accounts</div>;


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div className="flex h-screen items-center justify-center bg-indigo-600 text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // If user exists but hasn't completed onboarding, force them there
  // Unless they are already there
  if (!user.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Route for generic Public access but redirects if already logged in (Real Users)
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  // If user is logged in AND has an email (Real User), redirect to home
  if (!loading && user && user.email) {
    if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/" replace />;
  }

  // Guests (no email) or non-logged-in users can access Public routes
  return children;
}


import PageTitleUpdater from './components/common/PageTitleUpdater';

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newSystemTheme);
      };

      // Initial check
      handleChange(mediaQuery);

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    root.classList.add(themeMode);
  }, [themeMode]);

  return (
    <Router>
      <PageTitleUpdater />
      <Toaster position="top-center" richColors style={{ zIndex: 99999 }} />
      <Routes>
        <Route path="/welcome" element={<PublicOnlyRoute><WelcomeScreen /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        } />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="budgets" element={<BudgetPage />} />
          <Route path="loans" element={<LoansPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
