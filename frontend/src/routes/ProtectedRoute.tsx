/* 
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean; // opcional
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    // No autenticado → redirige a login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    // Usuario no es admin → redirige a perfil
    return <Navigate to="/perfil" replace />;
  }

  // Usuario autorizado
  return <>{children}</>;
} */
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth(); // ✅ incluimos loading

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

