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

// ⭐⭐ ESTADO GLOBAL - Una sola instancia para toda la app
let globalAuth = {
  user: undefined as User | undefined,
  loading: true,
  promise: null as Promise<User | undefined> | null,
  listeners: new Set<(state: { user?: User; loading: boolean }) => void>(),
  fetchCount: 0
};

// ⭐⭐ Función para notificar a todos los componentes
const notifyListeners = () => {
  globalAuth.listeners.forEach(listener => {
    listener({ user: globalAuth.user, loading: globalAuth.loading });
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ user?: User; loading: boolean }>({
    user: globalAuth.user,
    loading: globalAuth.loading
  });

  const mountedRef = useRef(true);

  // ⭐⭐ SINGLE FETCH - Una sola llamada a /auth/me para toda la aplicación
  const fetchUser = async (): Promise<User | undefined> => {
    globalAuth.fetchCount++;
    console.log(`🔄 fetchUser llamado (${globalAuth.fetchCount} vez)`);

    // Si ya hay una promise en curso, reutilizarla
    if (globalAuth.promise) {
      console.log("⚡ Reutilizando promise existente");
      return globalAuth.promise;
    }

    // Si ya tenemos datos, usarlos
    if (globalAuth.user !== undefined && !globalAuth.loading) {
      console.log("⚡ Usando datos en cache");
      return globalAuth.user;
    }

    globalAuth.loading = true;
    notifyListeners();

    globalAuth.promise = (async () => {
      try {
        console.log("🌐 Haciendo UNA SOLA llamada a /auth/me");
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        console.log("📨 Response status:", res.status);

        if (!res.ok) {
          console.log("❌ Usuario no autenticado");
          globalAuth.user = undefined;
          return undefined;
        }

        const data = await res.json();
        console.log("✅ Datos recibidos:", data.user ? `Usuario: ${data.user.email}` : "No user");

        globalAuth.user = data.user || undefined;
        return globalAuth.user;
      } catch (err) {
        console.error("💥 Error en fetchUser:", err);
        globalAuth.user = undefined;
        return undefined;
      } finally {
        globalAuth.loading = false;
        globalAuth.promise = null;
        notifyListeners();
        
        // Limpiar contador después de 10 segundos
        setTimeout(() => {
          globalAuth.fetchCount = 0;
        }, 10000);
      }
    })();

    return globalAuth.promise;
  };

  const logout = async () => {
    try {
      console.log("🔍 Iniciando logout...");
      
      // Limpiar estado global inmediatamente
      globalAuth.user = undefined;
      globalAuth.promise = null;
      notifyListeners();
      
      await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log("✅ Logout completado, redirigiendo...");
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Error en logout:', error);
      globalAuth.user = undefined;
      notifyListeners();
      window.location.href = '/';
    }
  };

  // ⭐⭐ SUSCRIPCIÓN al estado global
  useEffect(() => {
    mountedRef.current = true;

    const listener = (state: { user?: User; loading: boolean }) => {
      if (mountedRef.current) {
        setAuthState(state);
      }
    };

    // Suscribirse a cambios globales
    globalAuth.listeners.add(listener);

    // ⭐⭐ HACER SOLO UNA LLAMADA INICIAL si es necesario
    if (globalAuth.user === undefined && !globalAuth.promise && globalAuth.fetchCount === 0) {
      fetchUser();
    }

    return () => {
      mountedRef.current = false;
      globalAuth.listeners.delete(listener);
    };
  }, []);

  const value: AuthContextType = {
    user: authState.user,
    loading: authState.loading,
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