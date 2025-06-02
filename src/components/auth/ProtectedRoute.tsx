import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../ui/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("user" | "manager")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to={`/${user.role}`} replace />;
  }

  // If all checks pass, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
