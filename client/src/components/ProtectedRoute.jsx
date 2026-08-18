import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, requiredPermission }) {
  const { isAuthenticated, loading, permissions } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="card">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredPermission && !permissions[requiredPermission]) {
    return <Navigate to="/" replace />;
  }

  return children;
}
