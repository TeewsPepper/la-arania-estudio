import styles from "./HorasAcumuladas.module.css";

export default function HorasAcumuladas() {
  const horas = 10; // TODO: traer desde backend

  return (
    <div className={styles.card}>
      <h3>Horas Gratis Acumuladas</h3>
      <p className={styles.horas}>{horas} horas</p>
      
    </div>
  );
}
