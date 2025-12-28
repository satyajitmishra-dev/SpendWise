import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import { addNetworkListeners } from './utils/networkUtils';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';
import OfflinePage from './components/common/OfflinePage';
import LoadingScreen from './components/common/LoadingScreen';
import LockScreen from './components/common/LockScreen';
import IdleTimer from './components/common/IdleTimer';
import PageTitleUpdater from './components/common/PageTitleUpdater';
import { HelmetProvider } from 'react-helmet-async';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const LoansPage = lazy(() => import('./pages/LoansPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const ContactSupport = lazy(() => import('./pages/ContactSupport'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const DevelopmentPage = lazy(() => import('./pages/DevelopmentPage'));
const FeatureDetailsPage = lazy(() => import('./pages/FeatureDetailsPage'));
const PreferencesPage = lazy(() => import('./pages/PreferencesPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Lazy Hybrid & SEO Pages
const HybridExpenses = lazy(() => import('./pages/HybridExpenses'));
const HybridBudget = lazy(() => import('./pages/HybridBudget'));
const TrackDailyExpensesPage = lazy(() => import('./pages/seo/TrackDailyExpensesPage'));
const StudentBudgetPlannerPage = lazy(() => import('./pages/seo/StudentBudgetPlannerPage'));
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));

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

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Monitor network status
  useEffect(() => {
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
    <HelmetProvider>
      <Router>
        <PageTitleUpdater />
        <IdleTimer />
        <LockScreen />
        <Toaster position="top-center" richColors style={{ zIndex: 99999 }} />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/welcome" element={<PublicOnlyRoute><WelcomeScreen /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            } />

            {/* Hybrid Public/Private Routes */}
            <Route path="/expenses" element={<HybridExpenses />} />
            <Route path="/budgets" element={<HybridBudget />} />

            {/* SEO Landing Pages (Public) */}
            <Route path="/track-daily-expenses" element={<TrackDailyExpensesPage />} />
            <Route path="/student-budget-planner" element={<StudentBudgetPlannerPage />} />

            {/* Blog Routes (Public) */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              {/* Expenses removed from here, handled by HybridExpenses */}
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              {/* Budgets removed from here, handled by HybridBudget */}
              <Route path="loans" element={<LoansPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="preferences" element={<PreferencesPage />} />
              <Route path="security" element={<SecurityPage />} />
            </Route>

            {/* Help Pages - No Layout/Navbar */}
            <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
            <Route path="/contact-support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><FAQPage /></ProtectedRoute>} />
            <Route path="/development" element={<ProtectedRoute><DevelopmentPage /></ProtectedRoute>} />
            <Route path="/about-feature" element={<ProtectedRoute><FeatureDetailsPage /></ProtectedRoute>} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
