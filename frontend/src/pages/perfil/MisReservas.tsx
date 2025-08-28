import { useAuth } from "../../hooks/useAuth";
import styles from "./MisReservas.module.css";

export default function MisReservas() {
  const { reservas, removeReserva } = useAuth();

  return (
    <div className={styles.card}>
      <h3>Mis Reservas</h3>
      <ul className={styles.list}>
        {reservas.map((r) => (
          <li key={r.id} className={styles.item}>
            <span>
              {r.fecha} — {r.horaInicio} a {r.horaFin}
            </span>
            <button
              className={styles.cancel}
              onClick={() => removeReserva(r.id)}
            >
              Cancelar
            </button>
          </li>
        ))}
        {reservas.length === 0 && <li>No tienes reservas.</li>}
      </ul>
    </div>
  );
}
