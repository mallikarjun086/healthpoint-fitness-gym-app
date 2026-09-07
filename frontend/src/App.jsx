import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/layout/PageTransition';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PricingPage from './pages/public/PricingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import HealthHub from './pages/public/HealthHub';
import FreeWorkouts from './pages/public/FreeWorkouts';
import GymLocator from './pages/public/GymLocator';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RevenueAnalytics from './pages/admin/RevenueAnalytics';
import MemberManagement from './pages/admin/MemberManagement';
import SubscriptionsManagement from './pages/admin/SubscriptionsManagement';
import ContentManagement from './pages/admin/ContentManagement';
import StaffManagement from './pages/admin/StaffManagement';
import LeadManagement from './pages/admin/LeadManagement';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import WorkoutPlans from './pages/member/WorkoutPlans';
import DietPlans from './pages/member/DietPlans';
import VideoLibrary from './pages/member/VideoLibrary';
import Payments from './pages/member/Payments';
import GoalSetup from './pages/member/GoalSetup';
import BodyMetrics from './pages/member/BodyMetrics';
import ClassBooking from './pages/member/ClassBooking';
import AttendancePage from './pages/member/AttendancePage';
import NutritionTracker from './pages/member/NutritionTracker';
import MemberChat from './pages/member/Chat';
import ProgressPhotos from './pages/member/ProgressPhotos';
import Leaderboard from './pages/member/Leaderboard';
import AiPlanner from './pages/member/AiPlanner';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import DietPlanBuilder from './pages/trainer/DietPlanBuilder';
import SessionSchedule from './pages/trainer/SessionSchedule';
import TrainerChat from './pages/trainer/Chat';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/health-hub" element={<PageTransition><HealthHub /></PageTransition>} />
        <Route path="/free-workouts" element={<PageTransition><FreeWorkouts /></PageTransition>} />
        <Route path="/find-gym" element={<PageTransition><GymLocator /></PageTransition>} />

        {/* Protected Admin & Staff Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><RevenueAnalytics /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/members" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><MemberManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><StaffManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/leads" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><LeadManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><SubscriptionsManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><ContentManagement /></PageTransition></ProtectedRoute>} />

        {/* Protected Member Routes */}
        <Route path="/member/dashboard" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><MemberDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/member/ai-planner" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><AiPlanner /></PageTransition></ProtectedRoute>} />
        <Route path="/member/workouts" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><WorkoutPlans /></PageTransition></ProtectedRoute>} />
        <Route path="/member/nutrition" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><NutritionTracker /></PageTransition></ProtectedRoute>} />
        <Route path="/member/diet" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><DietPlans /></PageTransition></ProtectedRoute>} />
        <Route path="/member/metrics" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><BodyMetrics /></PageTransition></ProtectedRoute>} />
        <Route path="/member/photos" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><ProgressPhotos /></PageTransition></ProtectedRoute>} />
        <Route path="/member/classes" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><ClassBooking /></PageTransition></ProtectedRoute>} />
        <Route path="/member/attendance" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><AttendancePage /></PageTransition></ProtectedRoute>} />
        <Route path="/member/leaderboard" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><Leaderboard /></PageTransition></ProtectedRoute>} />
        <Route path="/member/chat" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><MemberChat /></PageTransition></ProtectedRoute>} />
        <Route path="/member/videos" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><VideoLibrary /></PageTransition></ProtectedRoute>} />
        <Route path="/member/payments" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><Payments /></PageTransition></ProtectedRoute>} />
        <Route path="/member/goals" element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN', 'TRAINER']}><PageTransition><GoalSetup /></PageTransition></ProtectedRoute>} />

        {/* Protected Trainer Routes */}
        <Route path="/trainer/dashboard" element={<ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><PageTransition><TrainerDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/trainer/diet-builder" element={<ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><PageTransition><DietPlanBuilder /></PageTransition></ProtectedRoute>} />
        <Route path="/trainer/schedule" element={<ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><PageTransition><SessionSchedule /></PageTransition></ProtectedRoute>} />
        <Route path="/trainer/chat" element={<ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}><PageTransition><TrainerChat /></PageTransition></ProtectedRoute>} />

        {/* Fallbacks */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/member/*" element={<Navigate to="/member/dashboard" replace />} />
        <Route path="/trainer/*" element={<Navigate to="/trainer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
