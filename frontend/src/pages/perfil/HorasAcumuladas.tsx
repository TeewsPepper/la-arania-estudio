/* import React, { useState, useEffect } from "react";
import styles from "./HorasAcumuladas.module.css";

interface HorasAcumuladasProps {
  horasIniciales?: number; // ej. horas gratis al registrarse
  horasExtras?: number; // horas acumuladas por promociones o pagos
}

const HorasAcumuladas: React.FC<HorasAcumuladasProps> = ({
  horasIniciales = 0,
  horasExtras = 0,
}) => {
  const [totalHoras, setTotalHoras] = useState(horasIniciales + horasExtras);

  // Si cambian las props (ej: luego de un pago confirmado), actualizamos
  useEffect(() => {
    setTotalHoras(horasIniciales + horasExtras);
  }, [horasIniciales, horasExtras]);

  return (
    <div className={styles.card}>
      <h3>Horas Acumuladas</h3>
      <p className={styles.horas}>{totalHoras} hs</p>
    </div>
  );
};

export default HorasAcumuladas;
 */
// src/components/HorasAcumuladas/HorasAcumuladas.tsx
import React from "react";
import { useReserva } from "../../hooks/useReserva";
import styles from "./HorasAcumuladas.module.css";

const HorasAcumuladas: React.FC = () => {
  const { horasAcumuladas } = useReserva();

  return (
    <div className={styles.card}>
      <h3>Horas Acumuladas</h3>
      <p className={styles.horas}>{horasAcumuladas} hs</p>
    </div>
  );
};

export default HorasAcumuladas;


