import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/layout/PageTransition';
import { RouteLoadingSkeleton } from './components/ui/StateSkeleton';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy-loaded Public Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const FeaturesPage = lazy(() => import('./pages/public/FeaturesPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const HealthHub = lazy(() => import('./pages/public/HealthHub'));
const FreeWorkouts = lazy(() => import('./pages/public/FreeWorkouts'));
const GymLocator = lazy(() => import('./pages/public/GymLocator'));

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const RevenueAnalytics = lazy(() => import('./pages/admin/RevenueAnalytics'));
const MemberManagement = lazy(() => import('./pages/admin/MemberManagement'));
const SubscriptionsManagement = lazy(() => import('./pages/admin/SubscriptionsManagement'));
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement'));
const StaffManagement = lazy(() => import('./pages/admin/StaffManagement'));
const LeadManagement = lazy(() => import('./pages/admin/LeadManagement'));

// Lazy-loaded Member Pages
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard'));
const WorkoutPlans = lazy(() => import('./pages/member/WorkoutPlans'));
const DietPlans = lazy(() => import('./pages/member/DietPlans'));
const VideoLibrary = lazy(() => import('./pages/member/VideoLibrary'));
const Payments = lazy(() => import('./pages/member/Payments'));
const GoalSetup = lazy(() => import('./pages/member/GoalSetup'));
const BodyMetrics = lazy(() => import('./pages/member/BodyMetrics'));
const ClassBooking = lazy(() => import('./pages/member/ClassBooking'));
const AttendancePage = lazy(() => import('./pages/member/AttendancePage'));
const NutritionTracker = lazy(() => import('./pages/member/NutritionTracker'));
const MemberChat = lazy(() => import('./pages/member/Chat'));
const ProgressPhotos = lazy(() => import('./pages/member/ProgressPhotos'));
const Leaderboard = lazy(() => import('./pages/member/Leaderboard'));
const AiPlanner = lazy(() => import('./pages/member/AiPlanner'));

// Lazy-loaded Trainer Pages
const TrainerDashboard = lazy(() => import('./pages/trainer/TrainerDashboard'));
const DietPlanBuilder = lazy(() => import('./pages/trainer/DietPlanBuilder'));
const SessionSchedule = lazy(() => import('./pages/trainer/SessionSchedule'));
const TrainerChat = lazy(() => import('./pages/trainer/Chat'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteLoadingSkeleton />}>
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
          <Route path="/admin/members" element={<ProtectedRoute allowedRoles={['ADMIN', 'TRAINER']}><PageTransition><MemberManagement /></PageTransition></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><StaffManagement /></PageTransition></ProtectedRoute>} />
          <Route path="/admin/leads" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><LeadManagement /></PageTransition></ProtectedRoute>} />
          <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><SubscriptionsManagement /></PageTransition></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute allowedRoles={['ADMIN', 'TRAINER']}><PageTransition><ContentManagement /></PageTransition></ProtectedRoute>} />

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
    </Suspense>
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
