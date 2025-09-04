
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Hook derivado para verificar admin (opcional)
export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  return user?.role === "admin";
};