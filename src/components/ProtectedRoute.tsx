import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="container" style={{ padding: "2rem 0" }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }

  return children;
}
