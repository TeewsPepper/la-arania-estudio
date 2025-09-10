
export interface User {
  id: string;
  nombre: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export const userIsAdmin = (user?: User): boolean => user?.role === "admin";

// ----------------------
// Auth Context
// ----------------------
export interface AuthContextType {
  user?: User;
  loading: boolean; // <- agregado
  fetchUser: () => Promise<User | undefined>;
  logout: () => void;
}

// ----------------------
// Reservas
// ----------------------
export interface Reserva {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  servicio: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  status: "pending" | "confirmed" | "cancelled";
  pagada: boolean;
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReservasContextType {
  reservas: Reserva[];
  addReserva: (reserva: Reserva) => void;
  removeReserva: (id: string) => void;
  isDisponible: (fecha: string, horaInicio: string, horaFin: string) => boolean;
  fetchMisReservas: () => Promise<void>;
  fetchReservasAdmin: () => Promise<void>;
  confirmarPago: (id: string, horasDelta?: number) => Promise<void>;
   restarHora: (userId: string) => Promise<number | undefined>;
  updateReserva: (id: string, newData: Partial<Reserva>) => void;
  horasAcumuladas: number;
  
  setHorasAcumuladas: (horas: number) => void;
}

// ----------------------
// Form data
// ----------------------
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// ----------------------
// Misc / UI
// ----------------------
export type ToastPosition = 'top-center' | 'top-right' | 'bottom-right';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type StatusType = 'pending' | 'confirmed' | 'cancelled' | 'completed';
