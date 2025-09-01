import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./Admin.module.css";

interface Reserva {
  id: string;
  usuario: string;
  fecha: string;
  hora: string;
  pagoConfirmado: boolean;
}

export default function Admin() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    // Simulación de fetch de reservas (después conectamos al backend real)
    const fakeData: Reserva[] = [
      { id: "1", usuario: "Juan Pérez", fecha: "01-09-2025", hora: "10:00", pagoConfirmado: false },
      { id: "2", usuario: "Ana García", fecha: "02-09-2025", hora: "12:00", pagoConfirmado: true },
    ];
    setReservas(fakeData);
  }, []);

  const handleConfirmarPago = (id: string) => {
    setReservas((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, pagoConfirmado: true } : r
      )
    );
    toast.success("✅ Pago confirmado", { className: "toast-center" });
  };

  return (
    <div className={styles.admin}>
      <h1 className={styles.title}>Panel de Administración</h1>

      {reservas.length === 0 ? (
        <p className={styles.empty}>No hay reservas registradas</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado de pago</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.usuario}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora}</td>
                <td>
                  {reserva.pagoConfirmado ? (
                    <span className={styles.confirmado}>Confirmado</span>
                  ) : (
                    <span className={styles.pendiente}>Pendiente</span>
                  )}
                </td>
                <td>
                  {!reserva.pagoConfirmado && (
                    <button
                      onClick={() => handleConfirmarPago(reserva.id)}
                      className={styles.btnConfirmar}
                    >
                      Confirmar pago
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
