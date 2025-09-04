
import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Reserva, ReservasContextType } from "../types"; // ← Importar interfaces correctas

export const ReservasContext = createContext<ReservasContextType | undefined>(undefined);

export const ReservasProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [horasAcumuladas, setHorasAcumuladas] = useState<number>(0);

  const addReserva = (reserva: Reserva) => setReservas((prev) => [...prev, reserva]);
  
  const removeReserva = (_id: string) => setReservas((prev) => prev.filter((r) => r._id !== _id));
  
  const isDisponible = (fecha: string, horaInicio: string, horaFin: string) =>
    !reservas.some(r =>
      r.fecha === fecha &&
      !(horaFin <= r.horaInicio || horaInicio >= r.horaFin)
    );
  
  const sumarHoras = (horas: number) => setHorasAcumuladas(prev => prev + horas);

  const marcarPagada = (_id: string) => {
    setReservas(prev =>
      prev.map((r) => (r._id === _id ? { ...r, pagada: true } : r))
    );
  };

    // 🔹 Nueva función: actualizar cualquier propiedad de una reserva
  const updateReserva = (id: string, newData: Partial<Reserva>) => {
    setReservas(prev =>
      prev.map(r => (r._id === id ? { ...r, ...newData } : r))
    );
  };

   // ✅ Nueva función para cargar reservas desde backend
  const fetchReservasAdmin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/reservations`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cargar reservas");
      const data = await res.json();
      setReservas(data.reservations);
    } catch (err) {
      console.error(err);
    }
  };

const fetchMisReservas = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al cargar tus reservas");
    const data = await res.json();
    setReservas(data);

    // 🔹 Recalcular horas acumuladas según reservas pagadas
    const totalHoras = data.reduce((acc: number, r: Reserva) => acc + (r.pagada ? 1 : 0), 0);
    setHorasAcumuladas(totalHoras);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <ReservasContext.Provider
      value={{
        reservas,
        addReserva,
        removeReserva,
        isDisponible,
        horasAcumuladas,
        sumarHoras,
        marcarPagada,
        updateReserva,
        fetchReservasAdmin,
        fetchMisReservas,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
};