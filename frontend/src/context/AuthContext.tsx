import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";



export interface User {
  id: string;
  nombre: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user?: User;
  fetchUser: () => Promise<User | undefined>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();

  // ✅ Traer usuario desde backend
  const fetchUser = async (): Promise<User | undefined> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) return undefined;
      const data = await res.json();
      setUser(data);
      return data;
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      return undefined;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook para usar contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};