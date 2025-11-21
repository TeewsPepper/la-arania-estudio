
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth(); // ✅ incluimos loading

   // ⭐ TEMPORAL: Debug de llamadas
  useEffect(() => {
    console.log("🛡️ ProtectedRoute montado - path:", window.location.pathname);
  }, []);

  if (loading) {
    return <p>Cargando usuario...</p>; // o spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/perfil" replace />;
  }

  return <>{children}</>;
}

