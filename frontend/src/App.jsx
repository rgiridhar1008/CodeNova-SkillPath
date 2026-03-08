import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import PageSkeleton from "./components/PageSkeleton";
import RoleGuard from "./components/RoleGuard";
import AuthGuard from "./components/AuthGuard";
import FloatingChatWidget from "./components/FloatingChatWidget";

const HomePage = lazy(() => import("./pages/HomePage"));
const UserDashboardPage = lazy(() => import("./pages/UserDashboardPage"));
const SkillInputPage = lazy(() => import("./pages/SkillInputPage"));
const CareerPathsPage = lazy(() => import("./pages/CareerPathsPage"));
const LearningRoadmapPage = lazy(() => import("./pages/LearningRoadmapPage"));
const ProgressAnalyticsPage = lazy(() => import("./pages/ProgressAnalyticsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const AIMockInterviewPage = lazy(() => import("./pages/AIMockInterviewPage"));
const AptitudePrepPage = lazy(() => import("./pages/AptitudePrepPage"));
const ResumeAnalyzerPage = lazy(() => import("./pages/ResumeAnalyzerPage"));
const AIResumeBuilderPage = lazy(() => import("./pages/AIResumeBuilderPage"));
const ResultsDashboard = lazy(() => import("./pages/ResultsDashboard"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const FeatureDetailPage = lazy(() => import("./pages/FeatureDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <UserDashboardPage />
              </AuthGuard>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/onboarding"
            element={
              <AuthGuard>
                <OnboardingPage />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route
            path="/features/:featureId"
            element={
              <AuthGuard>
                <FeatureDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/skill-analyzer"
            element={
              <AuthGuard>
                <SkillInputPage />
              </AuthGuard>
            }
          />
          <Route
            path="/career-paths"
            element={
              <AuthGuard>
                <CareerPathsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/learning-roadmap"
            element={
              <AuthGuard>
                <LearningRoadmapPage />
              </AuthGuard>
            }
          />
          <Route
            path="/progress-analytics"
            element={
              <AuthGuard>
                <ProgressAnalyticsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/community"
            element={
              <AuthGuard>
                <CommunityPage />
              </AuthGuard>
            }
          />
          <Route path="/mentor" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/mock-interview"
            element={
              <AuthGuard>
                <AIMockInterviewPage />
              </AuthGuard>
            }
          />
          <Route
            path="/aptitude-prep"
            element={
              <AuthGuard>
                <AptitudePrepPage />
              </AuthGuard>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <AuthGuard>
                <ResumeAnalyzerPage />
              </AuthGuard>
            }
          />
          <Route
            path="/resume-builder"
            element={
              <AuthGuard>
                <AIResumeBuilderPage />
              </AuthGuard>
            }
          />
          <Route
            path="/notifications"
            element={
              <AuthGuard>
                <NotificationsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <SettingsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin-analytics"
            element={
              <RoleGuard allow={["admin"]}>
                <AdminAnalyticsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/results"
            element={
              <AuthGuard>
                <ResultsDashboard />
              </AuthGuard>
            }
          />

          {/* Compatibility routes */}
          <Route path="/analyze" element={<Navigate to="/skill-analyzer" replace />} />
          <Route path="/roadmap" element={<Navigate to="/learning-roadmap" replace />} />
          <Route path="/analytics" element={<Navigate to="/progress-analytics" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <FloatingChatWidget />
    </ErrorBoundary>
  );
}
