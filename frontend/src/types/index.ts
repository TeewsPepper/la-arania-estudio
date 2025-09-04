

// Interface para Usuarios (compatible con tu AuthContext)
export interface User {
  id: string;
  nombre: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

// Método de extensión para calcular isAdmin (opcional)
export const userIsAdmin = (user?: User): boolean => {
  return user?.role === "admin";
};

// Interface para el Contexto de Reservas (para la app)
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

// Interface específica para el Panel de Administración
export interface ReservaAdmin {
  id: string;
  usuario: string;
  fecha: string;
  hora: string;
  pagoConfirmado: boolean;
  status?: 'pending' | 'confirmed' | 'cancelled';
  endTime?: string;
}

// Interface para ReservasContext (usa Reserva)
export interface ReservasContextType {
  reservas: Reserva[];
  addReserva: (reserva: Reserva) => void;
  removeReserva: (id: string) => void;
  isDisponible: (fecha: string, horaInicio: string, horaFin: string) => boolean;
  horasAcumuladas: number;
  sumarHoras: (horas: number) => void;
  marcarPagada: (id: string) => void;
  updateReserva: (id: string, newData: Partial<Reserva>) => void;
  fetchReservasAdmin: () => Promise<void>;
  fetchMisReservas: () => Promise<void>;
}

// Interface para Reservas completas (para futuro)
export interface ReservaCompleta {
  id: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  pagoConfirmado: boolean;
  clientNotes?: string;
  adminNotes?: string;
  createdAt: string;
}

// Interface para Reservas de usuario
export interface ReservaUsuario {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  service?: string;
  notes?: string;
  userName?: string;
}

// Interface para Estadísticas del Admin
export interface AdminStats {
  totalUsers: number;
  totalReservations: number;
  pendingReservations: number;
  todayReservations: number;
  totalRevenue?: number;
}

// Interface para el Context de Autenticación
export interface AuthContextType {
  user?: User;
  fetchUser: () => Promise<User | undefined>;
  logout: () => void;
}

// Interface para Formulario de Login
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Interface para Formulario de Registro
export interface RegisterFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// Interface para Datos de Horas Acumuladas
export interface HorasData {
  totalHoras: number;
  horasEsteMes: number;
  reservasCompletadas: number;
  promedioPorReserva: number;
}

// Types para props de componentes
export type ToastPosition = 'top-center' | 'top-right' | 'bottom-right';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type StatusType = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Type para Filtros de Reservas
export interface ReservationFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  usuario?: string;
}

// Type para Paginación
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}