import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import { addNetworkListeners } from './utils/networkUtils';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';
import OfflinePage from './components/common/OfflinePage';
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
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import WelcomeScreen from './pages/WelcomeScreen';
import NotFoundPage from './pages/NotFoundPage';



import LoadingScreen from './components/common/LoadingScreen';
import LockScreen from './components/common/LockScreen';
import IdleTimer from './components/common/IdleTimer';
import SecurityPage from './pages/SecurityPage';
import HelpPage from './pages/HelpPage';
import ContactSupport from './pages/ContactSupport';
import FAQPage from './pages/FAQPage';
import DevelopmentPage from './pages/DevelopmentPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  if (!user.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Route for generic Public access but redirects if already logged in (Real Users)
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (!loading && user && user.email) {
    if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}


import PageTitleUpdater from './components/common/PageTitleUpdater';

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Monitor network status
  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine);

    // Setup network listeners
    const cleanup = addNetworkListeners(
      () => setIsOffline(false), // Online callback
      () => setIsOffline(true)   // Offline callback
    );

    return cleanup;
  }, []);

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

  // Show OfflinePage if user is offline
  if (isOffline) {
    return <OfflinePage />;
  }

  return (
    <Router>
      <PageTitleUpdater />
      <IdleTimer />
      <LockScreen />
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
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>

        {/* Help Pages - No Layout/Navbar */}
        <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
        <Route path="/contact-support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><FAQPage /></ProtectedRoute>} />
        <Route path="/development" element={<ProtectedRoute><DevelopmentPage /></ProtectedRoute>} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
