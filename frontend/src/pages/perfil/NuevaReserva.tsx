import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useAuth } from "../../hooks/useAuth";
import type { Reserva } from "../../context/AuthContext";
import { isReservaDisponible } from "../../utils/checkReservaDisponible";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./NuevaReserva.module.css";

export default function NuevaReserva() {
  const { addReserva, reservas } = useAuth();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<string | null>(null);
  const [horaFin, setHoraFin] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 480;

  const handleReserva = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fecha || !horaInicio || !horaFin) {
      toast.error("⚠️ Selecciona fecha, hora de inicio y hora de fin");
      return;
    }

    // Validar que horaFin sea posterior a horaInicio
    const [h1, m1] = horaInicio.split(":").map(Number);
    const [h2, m2] = horaFin.split(":").map(Number);
    if (h2 * 60 + m2 <= h1 * 60 + m1) {
      toast.error("⚠️ La hora de fin debe ser posterior a la de inicio");
      return;
    }

    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const yyyy = fecha.getFullYear();
    const fechaStr = `${dd}-${mm}-${yyyy}`;

    const disponible = isReservaDisponible(
      reservas,
      fechaStr,
      horaInicio,
      horaFin
    );

    if (!disponible) {
      toast.error("⛔ Ese horario se superpone con otra reserva. Elige otro.");
      return;
    }

    const newReserva: Reserva = {
      id: reservas.length > 0 ? reservas[reservas.length - 1].id + 1 : 1,
      fecha: fechaStr,
      horaInicio,
      horaFin,
    };

    addReserva(newReserva);
    toast.success("✅ Reserva creada con éxito!");
    setTimeout(() => navigate("/perfil"), 2500);
  };

  return (
    <section className={styles.section}>
      <h3>Hacer una nueva reserva</h3>
      <form onSubmit={handleReserva} className={styles.form}>
        <label>
          Selecciona un día:
          <DatePicker
            selected={fecha}
            onChange={(date: Date | null) => setFecha(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Selecciona una fecha"
            className={styles.input}
            autoComplete="off"
            shouldCloseOnSelect={true}
            withPortal={!isMobile}
          />
        </label>

        <label>
          Hora de inicio:
          <TimePicker
            onChange={(value) => setHoraInicio(value ?? "")}
            value={horaInicio || ""}
            disableClock
            format="HH:mm"
            className={styles.input}
          />
        </label>

        <label>
          Hora de finalización:
          <TimePicker
            onChange={(value) => setHoraFin(value ?? "")}
            value={horaFin || ""}
            disableClock
            format="HH:mm"
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.btn}>
          Reservar
        </button>
      </form>

      <ToastContainer
        className="toast-center"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </section>
  );
}
