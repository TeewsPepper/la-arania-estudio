import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Reserva, ReservasContextType } from "../types";
import { API_URL } from "../config/api"; 

export const ReservasContext = createContext<ReservasContextType | undefined>(undefined);

export const ReservasProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [horasAcumuladas, setHorasAcumuladas] = useState<number>(0);

  // Agregar y eliminar reservas
  const addReserva = (reserva: Reserva) => setReservas(prev => [...prev, reserva]);
  const removeReserva = (_id: string) => setReservas(prev => prev.filter(r => r._id !== _id));

  // Verificar disponibilidad
  const isDisponible = (fecha: string, horaInicio: string, horaFin: string) =>
    !reservas.some(r => r.fecha === fecha && !(horaFin <= r.horaInicio || horaInicio >= r.horaFin));

  // ⚠️ Marcar pagada localmente ya no se usa
  const marcarPagada = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/admin/reservations/${id}/confirmar-pago`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Error al marcar como pagada");
    const reservaActualizada = await res.json();

    // ✅ Actualizar localmente en memoria
    updateReserva(id, reservaActualizada);

    return reservaActualizada;
  } catch (err) {
    console.error(err);
  }
};

  // Actualizar cualquier propiedad de una reserva con lo que venga del backend
  const updateReserva = (id: string, newData: Partial<Reserva>) => {
    setReservas(prev => prev.map(r => (r._id === id ? { ...r, ...newData } : r)));
  };

  // Cargar todas las reservas de administración
  const fetchReservasAdmin = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/reservations`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cargar reservas");
      const data = await res.json();
      setReservas(data.reservations);
    } catch (err) {
      console.error(err);
    }
  };

  // Cargar reservas del usuario y horas acumuladas desde backend
 const fetchMisReservas = async () => {
  try {
    const res = await fetch(`${API_URL}/reservas`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al cargar tus reservas");

    const data = await res.json();

    setReservas(data.reservas);              // ✅ reservas del usuario
    setHorasAcumuladas(data.horasAcumuladas); // ✅ horas acumuladas exactas
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
        fetchMisReservas,
        fetchReservasAdmin,
        marcarPagada, // existe pero vacía
        updateReserva,
        horasAcumuladas,
        setHorasAcumuladas,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
};
