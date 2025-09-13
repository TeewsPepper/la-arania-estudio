import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando usuario...</p>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
