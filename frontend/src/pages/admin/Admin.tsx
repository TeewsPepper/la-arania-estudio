
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useReservas } from "../../hooks/useReservas";
import styles from "./Admin.module.css";

export default function Admin() {
  const { reservas, fetchReservasAdmin, marcarPagada,  sumarHoras } = useReservas();

  useEffect(() => {
    fetchReservasAdmin(); // cargar reservas reales al montar
  }, []);

  const handleConfirmarPago = async (id: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/reservations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "confirmed" }),
    });

    if (!res.ok) throw new Error("No se pudo actualizar la reserva");
    await res.json();

    marcarPagada(id); 
    sumarHoras(1);    
    toast.success("✅ Pago confirmado");
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
              <td>{r.userId.name} ({r.userId.email})</td>
              <td>{r.fecha}</td>
              <td>{r.horaInicio}</td>
              <td>{r.horaFin}</td>
              <td>{r.servicio}</td>
              <td>{r.pagada ? "Pagada" : "Pendiente"}</td>
              <td>
                {!r.pagada && (
                  <button
                    className={styles.btnConfirmar}
                    onClick={() => handleConfirmarPago(r._id)}
                  >
                    Confirmar Pago
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
