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
import { createContext, useState, useEffect, useRef, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types";
import { API_URL } from "../config/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⭐⭐ CACHE SUPER AGRESIVO
let globalAuthCache = {
  user: undefined as User | undefined,
  loading: true,
  lastFetch: 0,
  promise: null as Promise<User | undefined> | null,
  subscribers: new Set<(user: User | undefined, loading: boolean) => void>()
};

const CACHE_DURATION = 10000; // 10 segundos de cache

// Notificar a todos los componentes suscritos
const notifySubscribers = () => {
  globalAuthCache.subscribers.forEach(callback => {
    callback(globalAuthCache.user, globalAuthCache.loading);
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(globalAuthCache.user);
  const [loading, setLoading] = useState<boolean>(globalAuthCache.loading);
  const mountedRef = useRef(true);

  // ⭐⭐ FETCH USER CON CACHE OBLIGATORIO
  const fetchUser = async (force = false): Promise<User | undefined> => {
    const now = Date.now();
    
    // ⭐ USAR CACHE si está fresco y no es force
    if (!force && 
        globalAuthCache.user !== undefined && 
        (now - globalAuthCache.lastFetch < CACHE_DURATION)) {
      console.log("⚡⚡⚡ CACHE HIT - Usando datos cacheados");
      return globalAuthCache.user;
    }

    // ⭐ REUTILIZAR PROMISE si existe
    if (globalAuthCache.promise && !force) {
      console.log("⚡ Reutilizando promise existente");
      return globalAuthCache.promise;
    }

    console.log("🌐 Haciendo llamada REAL a /auth/me");
    globalAuthCache.loading = true;
    globalAuthCache.lastFetch = now;
    notifySubscribers();

    globalAuthCache.promise = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        const data = await response.json();
        const userData = data.user || undefined;

        globalAuthCache.user = userData;
        globalAuthCache.loading = false;
        notifySubscribers();

        console.log("✅ Auth actualizado:", userData ? userData.email : "null");
        return userData;
      } catch (error) {
        console.error("💥 Error en auth:", error);
        globalAuthCache.user = undefined;
        globalAuthCache.loading = false;
        notifySubscribers();
        return undefined;
      } finally {
        // Mantener la promise por 2 segundos para reutilización
        setTimeout(() => {
          globalAuthCache.promise = null;
        }, 2000);
      }
    })();

    return globalAuthCache.promise;
  };

  const logout = async () => {
    try {
      console.log("🔍 Iniciando logout...");
      
      // Limpiar cache inmediatamente
      globalAuthCache.user = undefined;
      globalAuthCache.promise = null;
      globalAuthCache.lastFetch = 0;
      notifySubscribers();
      
      await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log("✅ Logout completado");
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Error en logout:', error);
      globalAuthCache.user = undefined;
      notifySubscribers();
      window.location.href = '/';
    }
  };

  // ⭐⭐ EFFECT - Suscripción al cache global
  useEffect(() => {
    mountedRef.current = true;

    const handleAuthUpdate = (newUser: User | undefined, newLoading: boolean) => {
      if (mountedRef.current) {
        setUser(newUser);
        setLoading(newLoading);
      }
    };

    // Suscribirse a updates
    globalAuthCache.subscribers.add(handleAuthUpdate);

    // ⭐⭐ HACER SOLO UNA LLAMADA INICIAL si el cache está vacío
    const now = Date.now();
    if (globalAuthCache.user === undefined && 
        (now - globalAuthCache.lastFetch > CACHE_DURATION || globalAuthCache.lastFetch === 0)) {
      console.log("🎯 Inicializando auth...");
      fetchUser();
    } else {
      console.log("🎯 Usando cache existente");
      // Ya tenemos datos, solo actualizar el estado local
      setUser(globalAuthCache.user);
      setLoading(globalAuthCache.loading);
    }

    return () => {
      mountedRef.current = false;
      globalAuthCache.subscribers.delete(handleAuthUpdate);
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    fetchUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};