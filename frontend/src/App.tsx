import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { verifyToken } from "./store/slices/authSlice";
import { setOnlineStatus } from "./store/slices/uiSlice";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const StudentLogin = lazy(() => import("./pages/auth/StudentLogin"));
const TeacherLogin = lazy(() => import("./pages/auth/TeacherLogin"));
const StudentDashboard = lazy(() => import("./pages/student/Dashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/Dashboard"));
const Lessons = lazy(() => import("./pages/student/Lessons"));
const Games = lazy(() => import("./pages/student/Games"));
const Progress = lazy(() => import("./pages/student/Progress"));
const ClassRoster = lazy(() => import("./pages/teacher/ClassRoster"));
const Analytics = lazy(() => import("./pages/teacher/Analytics"));
const GameLoader = lazy(() => import("./pages/student/GameLoader"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  // Check authentication status on app load
  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, token, isAuthenticated]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return (
    <div
      className="min-h-screen bg-white"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />

          {/* Protected student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute userType="student">
                <Layout userType="student" />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="games" element={<Games />} />
            <Route path="games/:gameId" element={<GameLoader />} />
            <Route path="progress" element={<Progress />} />
          </Route>

          {/* Protected teacher routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute userType="teacher">
                <Layout userType="teacher" />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="classes/:classId/roster" element={<ClassRoster />} />
            <Route path="classes/:classId/analytics" element={<Analytics />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default App;
