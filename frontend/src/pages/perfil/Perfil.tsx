import { useAuth } from "../../hooks/useAuth";
import HorasAcumuladas from "./HorasAcumuladas";
import MisReservas from "./MisReservas";
import { Link } from "react-router-dom";
import styles from "./Perfil.module.css";

export default function Perfil() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Perfil de {user?.name || "Usuario"}</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </header>

      <section className={styles.section}>
        <HorasAcumuladas />
      </section>

      <section className={styles.section}>
        <Link to="/perfil/nueva-reserva">
          <button className={styles.btn}>Nueva Reserva</button>
        </Link>
      </section>

      <section className={styles.section}>
        <MisReservas />
      </section>
    </div>
  );
}
