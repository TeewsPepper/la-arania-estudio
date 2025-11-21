/* 
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
        credentials: "include",
      });
      
      if (!res.ok) {
        setUser(undefined);
        return undefined;
      }
      
      const data = await res.json();
      setUser(data.user); // ⭐ IMPORTANTE: data.user en lugar de data
      return data.user;
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      setUser(undefined);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // ⭐⭐ LOGOUT CORREGIDO - con manejo de sesión
  const logout = async () => {
    try {
      console.log("🔍 Iniciando logout...");
      
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'GET', // ⭐ Usar GET como está configurado
        credentials: 'include',
      });

      if (res.ok) {
        console.log("✅ Logout exitoso en frontend");
        setUser(undefined);
        
        // Redirigir después de limpiar el estado
        window.location.href = '/'; // ⭐ Redirigir a home
      } else {
        console.error('❌ Error en logout:', res.status);
        // Forzar logout localmente aunque falle el servidor
        setUser(undefined);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Forzar logout localmente
      setUser(undefined);
      window.location.href = '/';
    }
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