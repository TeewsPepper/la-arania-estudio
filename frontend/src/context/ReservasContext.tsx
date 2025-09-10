import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Reserva, ReservasContextType } from "../types";
import { API_URL } from "../config/api";
import { toast } from "react-toastify";

export const ReservasContext = createContext<ReservasContextType | undefined>(
  undefined
);

export const ReservasProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [horasAcumuladas, setHorasAcumuladas] = useState<number>(0);

  // 🔹 Agregar / eliminar reservas localmente
  const addReserva = (reserva: Reserva) => setReservas(prev => [...prev, reserva]);

  const removeReserva = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/reservas/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("No se pudo eliminar la reserva");

    await res.json();
    setReservas(prev => prev.filter(r => r._id !== id));
    toast.success("✅ Reserva cancelada correctamente");
  } catch (err) {
    console.error("Error al cancelar reserva:", err);
    toast.error("⚠️ No se pudo cancelar la reserva");
  }
};

  // 🔹 Verificar disponibilidad
  const isDisponible = (fecha: string, horaInicio: string, horaFin: string) =>
    !reservas.some(r => r.fecha === fecha && !(horaFin <= r.horaInicio || horaInicio >= r.horaFin));

  // 🔹 Actualizar cualquier reserva localmente
  const updateReserva = (id: string, newData: Partial<Reserva>) =>
    setReservas(prev => prev.map(r => (r._id === id ? { ...r, ...newData } : r)));

  // 🔹 Cargar reservas del usuario
  const fetchMisReservas = async () => {
    try {
      const res = await fetch(`${API_URL}/reservas`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar tus reservas");
      const data = await res.json();
      setReservas(data.reservas);
      setHorasAcumuladas(data.horasAcumuladas);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ No se pudieron cargar tus reservas");
    }
  };

  // 🔹 Cargar todas las reservas para admin
  const fetchReservasAdmin = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/reservations`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar reservas");
      const data = await res.json();
      setReservas(data.reservations);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ No se pudieron cargar las reservas de admin");
    }
  };

  // 🔹 Confirmar pago de una reserva con delta de horas
  const confirmarPago = async (id: string, horasDelta: number = 0) => {
    try {
      const res = await fetch(
        `${API_URL}/admin/reservations/${id}/confirmar-pago-horas`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ horasDelta }),
        }
      );
      if (!res.ok) throw new Error("No se pudo confirmar el pago");
      const { reserva, horasAcumuladas: nuevasHoras } = await res.json();
      updateReserva(id, reserva);
      setHorasAcumuladas(nuevasHoras);
      toast.success(`✅ Pago confirmado (${horasDelta > 0 ? "+" : ""}${horasDelta}h)`);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error al confirmar el pago");
    }
  };

  // 🔹 Restar 1 hora a un usuario
  const restarHora = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/restar-hora`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudo restar hora");
      const userActualizado = await res.json();
      toast.success(`✅ Hora restada. Total: ${userActualizado.horasAcumuladas}`);
      return userActualizado.horasAcumuladas;
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error al restar hora");
    }
  };

  return (
    <ReservasContext.Provider
      value={{
        reservas,
        horasAcumuladas,
        setHorasAcumuladas,
        addReserva,
        removeReserva,
        isDisponible,
        updateReserva,
        fetchMisReservas,
        fetchReservasAdmin,
        confirmarPago,
        restarHora,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
};