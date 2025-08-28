import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";  // 🔹 usamos el hook

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();  //  accedemos a auth global

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location }} //  recuerda la ruta que intentaba visitar
    />
  );
};
