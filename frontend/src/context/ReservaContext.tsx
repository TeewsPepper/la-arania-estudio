import { createContext, useState } from "react";
import type { ReactNode } from "react";

export interface Reserva {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  pagada?: boolean;
}

interface ReservasContextType {
  reservas: Reserva[];
  addReserva: (reserva: Reserva) => void;
  removeReserva: (id: number) => void;
  isDisponible: (fecha: string, horaInicio: string, horaFin: string) => boolean;
  horasAcumuladas: number;
  sumarHoras: (horas: number) => void;
  marcarPagada: (id: number) => void; // 🔹 nueva función
}

export const ReservasContext = createContext<ReservasContextType | undefined>(undefined);

export const ReservasProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [horasAcumuladas, setHorasAcumuladas] = useState<number>(0);

  const addReserva = (reserva: Reserva) => setReservas((prev) => [...prev, reserva]);
  const removeReserva = (id: number) => setReservas((prev) => prev.filter((r) => r.id !== id));
  const isDisponible = (fecha: string, horaInicio: string, horaFin: string) =>
    !reservas.some(r =>
      r.fecha === fecha &&
      !(horaFin <= r.horaInicio || horaInicio >= r.horaFin)
    );
  const sumarHoras = (horas: number) => setHorasAcumuladas(prev => prev + horas);

  // 🔹 función para marcar una reserva como pagada
  const marcarPagada = (id: number) => {
    setReservas(prev =>
      prev.map((r: Reserva) => (r.id === id ? { ...r, pagada: true } : r))
    );
  };

  return (
    <ReservasContext.Provider
      value={{ reservas, addReserva, removeReserva, isDisponible, horasAcumuladas, sumarHoras, marcarPagada }}
    >
      {children}
    </ReservasContext.Provider>
  );
};
