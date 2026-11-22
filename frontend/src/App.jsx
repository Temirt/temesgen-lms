import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public & Classroom Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import LearnCoursePage from './pages/LearnCoursePage';
import QuizTakingPage from './pages/QuizTakingPage';

// Admin Views
import AdminDashboard from './dashboards/admin/AdminDashboard';
import AdminUsers from './dashboards/admin/AdminUsers';
import AdminCourses from './dashboards/admin/AdminCourses';
import AdminCategories from './dashboards/admin/AdminCategories';
import AdminEnrollments from './dashboards/admin/AdminEnrollments';
import AdminPayments from './dashboards/admin/AdminPayments';
import AdminReports from './dashboards/admin/AdminReports';
import AdminLogs from './dashboards/admin/AdminLogs';
import AdminSettings from './dashboards/admin/AdminSettings';
import AdminAnnouncements from './dashboards/admin/AdminAnnouncements';
import AdminCertificates from './dashboards/admin/AdminCertificates';

// Instructor Views
import InstructorDashboard from './dashboards/instructor/InstructorDashboard';
import InstructorCourses from './dashboards/instructor/InstructorCourses';
import CourseCreateWizard from './dashboards/instructor/CourseCreateWizard';
import InstructorModules from './dashboards/instructor/InstructorModules';
import InstructorQuizzes from './dashboards/instructor/InstructorQuizzes';
import InstructorAssignments from './dashboards/instructor/InstructorAssignments';
import InstructorSubmissions from './dashboards/instructor/InstructorSubmissions';
import InstructorStudents from './dashboards/instructor/InstructorStudents';
import InstructorAnnouncements from './dashboards/instructor/InstructorAnnouncements';
import InstructorAnalytics from './dashboards/instructor/InstructorAnalytics';
import InstructorProfile from './dashboards/instructor/InstructorProfile';

// Student Views
import StudentDashboard from './dashboards/student/StudentDashboard';
import StudentCourses from './dashboards/student/StudentCourses';
import StudentProgress from './dashboards/student/StudentProgress';
import StudentAssignments from './dashboards/student/StudentAssignments';
import StudentQuizzes from './dashboards/student/StudentQuizzes';
import StudentCertificates from './dashboards/student/StudentCertificates';
import StudentNotifications from './dashboards/student/StudentNotifications';
import StudentProfile from './dashboards/student/StudentProfile';

/**
 * Route protection wrapper based on authentication & user roles.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoadingSpinner text="Checking credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to default dashboard for the current role
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'instructor') return <Navigate to="/instructor" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout (Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slugOrId" element={<CourseDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
      </Route>

      {/* Classroom Learning Player (Full Screen Experience) */}
      <Route
        path="/learn/:courseId"
        element={
          <ProtectedRoute>
            <LearnCoursePage />
          </ProtectedRoute>
        }
      />

      {/* Interactive Quiz Taking Experience */}
      <Route
        path="/quiz/:quizId"
        element={
          <ProtectedRoute>
            <QuizTakingPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/enrollments" element={<AdminEnrollments />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/certificates" element={<AdminCertificates />} />
        <Route path="/admin/quizzes" element={<AdminCourses />} />
        <Route path="/admin/assignments" element={<AdminCourses />} />
      </Route>

      {/* Instructor Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<InstructorCourses />} />
        <Route path="/instructor/create-course" element={<CourseCreateWizard />} />
        <Route path="/instructor/modules" element={<InstructorModules />} />
        <Route path="/instructor/quizzes" element={<InstructorQuizzes />} />
        <Route path="/instructor/assignments" element={<InstructorAssignments />} />
        <Route path="/instructor/submissions" element={<InstructorSubmissions />} />
        <Route path="/instructor/students" element={<InstructorStudents />} />
        <Route path="/instructor/announcements" element={<InstructorAnnouncements />} />
        <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
        <Route path="/instructor/profile" element={<InstructorProfile />} />
      </Route>

      {/* Student Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/progress" element={<StudentProgress />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/quizzes" element={<StudentQuizzes />} />
        <Route path="/student/certificates" element={<StudentCertificates />} />
        <Route path="/student/notifications" element={<StudentNotifications />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>

      {/* Fallback wildcard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
