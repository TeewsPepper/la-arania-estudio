import { useEffect } from "react";
import { useReservas } from "../../hooks/useReservas";
import styles from "./Admin.module.css";

export default function Admin() {
  const { reservas, fetchReservasAdmin, confirmarPago } = useReservas();

  useEffect(() => {
    fetchReservasAdmin();
  }, []);

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
            <th>Status</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r._id}>
              <td>{r.userId ? `${r.userId.name} (${r.userId.email})` : "Usuario eliminado"}</td>
              <td>{r.fecha}</td>
              <td>{r.horaInicio}</td>
              <td>{r.horaFin}</td>
              
              <td>{r.pagada ? "Pagada" : "Pendiente"}</td>
              <td>
                {!r.pagada && (
                  <div className={styles.btnGroup}>
                    <button className={styles.btnConfirmar} onClick={() => confirmarPago(r._id, 1)}>Confirmar +1h</button>
                    <button className={styles.btnNeutral} onClick={() => confirmarPago(r._id, 0)}>Confirmar</button>
                    <button className={styles.btnRestar} onClick={() => confirmarPago(r._id, -1)}>Confirmar -1h</button>
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
