import { useReserva } from "../../hooks/useReserva";
import { useAuth } from "../../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./MisReservas.module.css";

export default function MisReservas() {
  const { reservas, removeReserva, sumarHoras, marcarPagada } = useReserva();
  const { user } = useAuth();

  const handlePago = (reservaId: number) => {
    if (!user?.isAdmin) return;

    const reserva = reservas.find((r) => r.id === reservaId);
    if (reserva && !reserva.pagada) {
      marcarPagada(reservaId);
      sumarHoras(1); // suma 1 hora al total
      toast.success(`✅ Pago confirmado para reserva ${reservaId}`);
    } else {
      toast.info("⚠️ Esta reserva ya estaba marcada como pagada");
    }
  };

  return (
    <div className={styles.card}>
      <h3>Mis Reservas</h3>
      <ul className={styles.list}>
        {reservas.map((r: any) => (
          <li key={r.id} className={styles.item}>
            <span>
              {r.fecha} — {r.horaInicio} a {r.horaFin}{" "}
              {r.pagada ? "(Pago confirmado)" : ""}
            </span>
            <div>
              <button
                className={styles.cancel}
                onClick={() => removeReserva(r.id)}
              >
                Cancelar
              </button>

              {user?.isAdmin && !r.pagada && (
                <button
                  className={styles.btnPago}
                  onClick={() => handlePago(r.id)}
                >
                  Confirmar Pago
                </button>
              )}
            </div>
          </li>
        ))}
        {reservas.length === 0 && <li>No tienes reservas.</li>}
      </ul>

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
