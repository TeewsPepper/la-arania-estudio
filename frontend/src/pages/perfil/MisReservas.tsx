/* import { useEffect } from "react";
import { useReservas } from "../../hooks/useReservas";
import { useAuth } from "../../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./MisReservas.module.css";
import type { Reserva } from "../../types";

export default function MisReservas() {
  const { reservas, removeReserva, marcarPagada, fetchMisReservas } = useReservas();
  const { user } = useAuth();

  // ✅ Llamar fetch al montar
  useEffect(() => {
    fetchMisReservas();
  }, []);

  const handlePago = (reservaId: string) => {
    if (user?.role !== "admin") return;

    const reserva = reservas.find((r) => r._id === reservaId);
    if (reserva && !reserva.pagada) {
      marcarPagada(reservaId);
      
      toast.success(`✅ Pago confirmado para reserva ${reservaId}`);
    } else {
      toast.info("⚠️ Esta reserva ya estaba marcada como pagada");
    }
  };

  const formatFecha = (fecha: string) => {
  const [dd, mm, yyyy] = fecha.split("-");
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd)); // Mes base 0
  return date.toLocaleDateString("es-ES", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

  const misReservas = reservas;

  return (
    <div className={styles.card}>
      <h3>Mis Reservas</h3>

      {misReservas.length === 0 ? (
        <p className={styles.empty}>No tienes reservas.</p>
      ) : (
        <ul className={styles.list}>
          {misReservas.map((r: Reserva) => (
            <li
              key={r._id}
              className={`${styles.item} ${r.pagada ? styles.pagada : ""}`}
            >
              <div className={styles.info}>
                <span className={styles.fecha}>{formatFecha(r.fecha)}</span>
                <span className={styles.hora}>
                  {r.horaInicio} - {r.horaFin}
                </span>
                {r.pagada ? (
                  <span className={styles.estadoPagada}>
                    ✅ Pago confirmado
                  </span>
                ) : (
                  <span className={styles.estadoPendiente}>
                    ⏳ Pendiente de pago
                  </span>
                )}
              </div>

              <div className={styles.actions}>
                {!r.pagada && (
                  <button
                    className={styles.cancel}
                    onClick={() => removeReserva(r._id)}
                  >
                    Cancelar
                  </button>
                )}

                {user?.role === "admin" && !r.pagada && (
                  <button
                    className={styles.btnPago}
                    onClick={() => handlePago(r._id)}
                  >
                    Confirmar Pago
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer
        className="toast-center"
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
}
 */
import { useEffect } from "react";
import { useReservas } from "../../hooks/useReservas";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./MisReservas.module.css";
import type { Reserva } from "../../types";

export default function MisReservas() {
  const { reservas, removeReserva, fetchMisReservas } = useReservas();

  // Llamar fetch al montar
  useEffect(() => {
    fetchMisReservas();
  }, []);

  const formatFecha = (fecha: string) => {
    const [dd, mm, yyyy] = fecha.split("-");
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd)); // Mes base 0
    return date.toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.card}>
      <h3>Mis Reservas</h3>

      {reservas.length === 0 ? (
        <p className={styles.empty}>No tienes reservas.</p>
      ) : (
        <ul className={styles.list}>
          {reservas.map((r: Reserva) => (
            <li
              key={r._id}
              className={`${styles.item} ${r.pagada ? styles.pagada : ""}`}
            >
              <div className={styles.info}>
                <span className={styles.fecha}>{formatFecha(r.fecha)}</span>
                <span className={styles.hora}>
                  {r.horaInicio} - {r.horaFin}
                </span>
                {r.pagada ? (
                  <span className={styles.estadoPagada}>✅ Pago confirmado</span>
                ) : (
                  <span className={styles.estadoPendiente}>⏳ Pendiente de pago</span>
                )}
              </div>

              <div className={styles.actions}>
                {!r.pagada && (
                  <button
                    className={styles.cancel}
                    onClick={() => removeReserva(r._id)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer
        className="toast-center"
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
}
