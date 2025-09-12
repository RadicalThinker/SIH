import React from "react";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import { RootState } from "../../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: "student" | "teacher" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  // userType, // commented out since it's not used in demo mode
}) => {
  // For MVP demo - allow access without authentication
  // Remove this in production
  const isDemoMode = true;

  if (isDemoMode) {
    return <>{children}</>;
  }

  // For now, we'll assume the user is authenticated
  // In a real app, you'd check authentication state from Redux
  const isAuthenticated = true; // This should come from your auth state

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
