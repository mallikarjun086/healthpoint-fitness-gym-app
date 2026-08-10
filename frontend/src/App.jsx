import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PricingPage from './pages/public/PricingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RevenueAnalytics from './pages/admin/RevenueAnalytics';
import MemberManagement from './pages/admin/MemberManagement';
import SubscriptionsManagement from './pages/admin/SubscriptionsManagement';
import ContentManagement from './pages/admin/ContentManagement';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import WorkoutPlans from './pages/member/WorkoutPlans';
import DietPlans from './pages/member/DietPlans';
import VideoLibrary from './pages/member/VideoLibrary';
import Payments from './pages/member/Payments';
import GoalSetup from './pages/member/GoalSetup';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Admin & Staff Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TRAINER']}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="analytics" element={<RevenueAnalytics />} />
                <Route path="members" element={<MemberManagement />} />
                <Route path="subscriptions" element={<SubscriptionsManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Protected Member Routes */}
          <Route path="/member/*" element={
            <ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}>
              <Routes>
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="workouts" element={<WorkoutPlans />} />
                <Route path="diet" element={<DietPlans />} />
                <Route path="videos" element={<VideoLibrary />} />
                <Route path="payments" element={<Payments />} />
                <Route path="goals" element={<GoalSetup />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Protected Trainer Routes */}
          <Route path="/trainer/*" element={
            <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}>
              <Routes>
                <Route path="dashboard" element={<TrainerDashboard />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
