import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useReserva } from "../../hooks/useReserva";
import type { Reserva } from "../../context/ReservaContext";
import { isReservaDisponible } from "../../utils/checkReservaDisponible";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./NuevaReserva.module.css";
import "./CustomDatepicker.css";

export default function NuevaReserva() {
  const { addReserva, reservas } = useReserva();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [horaFin, setHoraFin] = useState<Date | null>(null);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 480;

  const handleReserva = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fecha || !horaInicio || !horaFin) {
      toast.error("⚠️ Selecciona fecha, hora de inicio y hora de fin");
      return;
    }

    // Formatear horas a string "HH:mm"
    const horaInicioStr = `${String(horaInicio.getHours()).padStart(2, '0')}:${String(horaInicio.getMinutes()).padStart(2, '0')}`;
    const horaFinStr = `${String(horaFin.getHours()).padStart(2, '0')}:${String(horaFin.getMinutes()).padStart(2, '0')}`;

    // Validar que horaFin sea posterior a horaInicio
    if (horaFin <= horaInicio) {
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
      horaInicioStr,
      horaFinStr
    );

    if (!disponible) {
      toast.error("⛔ Ese horario se superpone con otra reserva. Elige otro.");
      return;
    }

    const newReserva: Reserva = {
      id: reservas.length > 0 ? reservas[reservas.length - 1].id + 1 : 1,
      fecha: fechaStr,
      horaInicio: horaInicioStr,
      horaFin: horaFinStr,
    };

    addReserva(newReserva);
    toast.success("✅ Reserva creada con éxito!");
    setTimeout(() => navigate("/perfil"), 2500);
  };

  // Función para crear un objeto Date con la hora actual pero minutos en 0
  const getCurrentTimeWithZeroMinutes = () => {
    const now = new Date();
    now.setMinutes(0);
    return now;
  };

  // Función para crear un objeto Date con la hora actual + 1 hora
  const getCurrentTimePlusOneHour = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now;
  };

  return (
    <section className={styles.section}>
      <h3>Hacer una nueva reserva</h3>
      <form onSubmit={handleReserva} className={styles.form}>
        <label>
          Selecciona un día:
          <DatePicker
            selected={fecha}
            onChange={setFecha}
            dateFormat="dd-MM-yyyy"
            placeholderText="Selecciona una fecha"
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect={true}
            withPortal={isMobile}
            minDate={new Date()}
            isClearable
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={5}
          />
        </label>

        <label>
          Hora de inicio:
          <DatePicker
            selected={horaInicio}
            onChange={setHoraInicio}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="h:mm aa"
            placeholderText="Selecciona hora de inicio"
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect={true}
            withPortal={isMobile}
            minTime={getCurrentTimeWithZeroMinutes()}
            maxTime={new Date(new Date().setHours(23, 45, 0))} // 11:45 PM
          />
        </label>

        <label>
          Hora de finalización:
          <DatePicker
            selected={horaFin}
            onChange={setHoraFin}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="h:mm aa"
            placeholderText="Selecciona hora de fin"
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect={true}
            withPortal={isMobile}
            minTime={horaInicio || getCurrentTimePlusOneHour()}
            maxTime={new Date(new Date().setHours(23, 45, 0))} // 11:45 PM
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