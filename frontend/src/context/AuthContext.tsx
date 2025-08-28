import { createContext, useState } from "react";
import type { ReactNode } from "react";

export interface Reserva {
  id: number;
  fecha: string;
  horaInicio: string; // formato "HH:mm"
  horaFin: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  reservas: Reserva[];
  login: (user: User) => void;
  logout: () => void;
  addReserva: (reserva: Reserva) => void;
  removeReserva: (id: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => {
    setUser(null);
    setReservas([]);
  };

  const addReserva = (reserva: Reserva) => {
    setReservas((prev) => [...prev, reserva]);
  };

  const removeReserva = (id: number) => {
    setReservas((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        reservas,
        login,
        logout,
        addReserva,
        removeReserva,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
