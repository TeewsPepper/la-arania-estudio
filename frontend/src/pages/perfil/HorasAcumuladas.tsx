import { useReservas } from "../../hooks/useReservas";
import styles from "./HorasAcumuladas.module.css";

const HorasAcumuladas = () => {
  const { horasAcumuladas } = useReservas();

  const horasFormateadas =
    horasAcumuladas % 1 === 0
      ? horasAcumuladas.toString()
      : horasAcumuladas.toFixed(1);

   const unidad = horasAcumuladas === 1 ? "hora" : "horas";

  return (
    <div className={styles.card}>
      <h3>Horas Acumuladas</h3>
      <p className={styles.valor}>{horasFormateadas} {unidad}</p>
    </div>
  );
};

export default HorasAcumuladas;