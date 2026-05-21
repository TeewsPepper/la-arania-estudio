
import { createContext, useState, useEffect, useRef, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types";
import { API_URL } from "../config/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⭐⭐ CACHE TOTAL - Una sola llamada por sesión
let globalAuth = {
  user: undefined as User | undefined,
  loading: true,
  initialized: false,
  promise: null as Promise<User | undefined> | null,
  subscribers: new Set<(user: User | undefined, loading: boolean) => void>()
};

const notifyAll = () => {
  globalAuth.subscribers.forEach(callback => {
    callback(globalAuth.user, globalAuth.loading);
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(globalAuth.user);
  const [loading, setLoading] = useState<boolean>(globalAuth.loading);
  const mountedRef = useRef(true);
  const initialRender = useRef(true);

  // ⭐⭐ FETCH USER - Cache extremo
  const fetchUser = async (force = false): Promise<User | undefined> => {
    // ⭐ SI YA ESTÁ INICIALIZADO Y NO ES FORCE, NUNCA LLAMAR
    if (globalAuth.initialized && !force) {
      
      return globalAuth.user;
    }

    // ⭐ REUTILIZAR PROMISE SI EXISTE
    if (globalAuth.promise) {
      return globalAuth.promise;
    }

    
    globalAuth.loading = true;
    globalAuth.initialized = true;
    notifyAll();

    globalAuth.promise = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const userData = data.user || undefined;

        globalAuth.user = userData;
        globalAuth.loading = false;
        notifyAll();

        return userData;
      } catch (error) {
        
        globalAuth.user = undefined;
        globalAuth.loading = false;
        notifyAll();
        return undefined;
      } finally {
        globalAuth.promise = null;
      }
    })();

    return globalAuth.promise;
  };

  const logout = async () => {
    try {
      console.log("🔍 Iniciando logout...");
      
      // Resetear completamente
      globalAuth.user = undefined;
      globalAuth.loading = true;
      globalAuth.initialized = false;
      globalAuth.promise = null;
      notifyAll();
      
      await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      window.location.href = '/';
    } catch (error) {
      console.error('❌ Error en logout:', error);
      globalAuth.user = undefined;
      globalAuth.initialized = false;
      notifyAll();
      window.location.href = '/';
    }
  };

  // ⭐⭐ EFFECT - Una sola ejecución
  useEffect(() => {
    if (!initialRender.current) return;
    initialRender.current = false;

    mountedRef.current = true;

    const handleUpdate = (newUser: User | undefined, newLoading: boolean) => {
      if (mountedRef.current) {
        setUser(newUser);
        setLoading(newLoading);
      }
    };

    globalAuth.subscribers.add(handleUpdate);

    // ⭐⭐ SOLO LLAMAR SI NO ESTÁ INICIALIZADO
    if (!globalAuth.initialized) {
      
      fetchUser();
    } else {
      setUser(globalAuth.user);
      setLoading(globalAuth.loading);
    }

    return () => {
      mountedRef.current = false;
      globalAuth.subscribers.delete(handleUpdate);
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