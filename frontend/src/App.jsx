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

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import WorkoutPlans from './pages/member/WorkoutPlans';
import DietPlans from './pages/member/DietPlans';
import VideoLibrary from './pages/member/VideoLibrary';
import Payments from './pages/member/Payments';
import GoalSetup from './pages/member/GoalSetup';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/admin/*" element={
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="analytics" element={<RevenueAnalytics />} />
            <Route path="members" element={<MemberManagement />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        } />

        <Route path="/member/*" element={
          <Routes>
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="workouts" element={<WorkoutPlans />} />
            <Route path="diet" element={<DietPlans />} />
            <Route path="videos" element={<VideoLibrary />} />
            <Route path="payments" element={<Payments />} />
            <Route path="goals" element={<GoalSetup />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        } />

        <Route path="/trainer/*" element={
          <Routes>
            <Route path="dashboard" element={<TrainerDashboard />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
