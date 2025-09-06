// Admin.tsx
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useReservas } from "../../hooks/useReservas";
import styles from "./Admin.module.css";

export default function Admin() {
  const { reservas, fetchReservasAdmin, updateReserva, setHorasAcumuladas } =
    useReservas();

  useEffect(() => {
    fetchReservasAdmin(); // cargar reservas al montar
  }, []);

  // 🔹 Handler unificado para confirmar pago y ajustar horas
  const handleConfirmarPago = async (id: string, horasDelta: number = 0) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/reservations/${id}/confirmar-pago-horas`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ horasDelta }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar la reserva");

      // 🔹 Recibimos la reserva actualizada y horasAcumuladas exactas del backend
      const { reserva, horasAcumuladas } = await res.json();

      // Actualizamos la reserva localmente con los datos del backend
      updateReserva(id, reserva);

      // Sincronizamos las horas acumuladas tal como devuelve la DB
      setHorasAcumuladas(horasAcumuladas);

      toast.success(
        `✅ Pago confirmado (${horasDelta > 0 ? "+" : ""}${horasDelta}h)`
      );
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error al confirmar el pago");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Panel de Administración</h1>
      <button onClick={fetchReservasAdmin}>Actualizar</button>

      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Servicio</th>
            <th>Status</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r._id}>
              <td>
                {r.userId ? `${r.userId.name} (${r.userId.email})` : "Usuario eliminado"}
              </td>
              <td>{r.fecha}</td>
              <td>{r.horaInicio}</td>
              <td>{r.horaFin}</td>
              <td>{r.servicio}</td>
              <td>{r.pagada ? "Pagada" : "Pendiente"}</td>
              <td>
                {!r.pagada && (
                  <div className={styles.btnGroup}>
                    <button
                      className={styles.btnConfirmar}
                      onClick={() => handleConfirmarPago(r._id, 1)}
                    >
                      Confirmar +1h
                    </button>
                    <button
                      className={styles.btnNeutral}
                      onClick={() => handleConfirmarPago(r._id, 0)}
                    >
                      Confirmar
                    </button>
                    <button
                      className={styles.btnRestar}
                      onClick={() => handleConfirmarPago(r._id, -1)}
                    >
                      Confirmar -1h
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
