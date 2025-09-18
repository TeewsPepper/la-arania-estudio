/* 
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types";
import { API_URL } from "../config/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true); // ← loading agregado

  // Traer usuario desde backend
  const fetchUser = async (): Promise<User | undefined> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
         headers: {
        'Content-Type': 'application/json',
      }
      });
      if (!res.ok) return undefined;
      const data = await res.json();
      setUser(data);
      return data;
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
    setUser(undefined);
  };

  // Al montar el contexto, intentar obtener usuario
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 */
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types";
import { API_URL } from "../config/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  // Traer usuario desde backend
  const fetchUser = async (): Promise<User | undefined> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include", // ✅ muy importante
      });
      if (!res.ok) return undefined;
      const data = await res.json();
      setUser(data);
      return data;
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // Logout seguro
  const logout = () => {
    // Se usa window.location.href para seguir redirección del backend
    window.location.href = `${API_URL}/auth/logout`;
    setUser(undefined);
  };

  // Al montar el contexto, intentar obtener usuario
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


