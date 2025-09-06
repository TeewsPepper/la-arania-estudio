/* 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useReservas } from "../../hooks/useReservas";
import type { Reserva } from "../../types";
import { isReservaDisponible } from "../../utils/checkReservaDisponible";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./NuevaReserva.module.css";
import "./CustomDatepicker.css";

export default function NuevaReserva() {
  const { addReserva, reservas } = useReservas();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [horaFin, setHoraFin] = useState<Date | null>(null);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 480;

  const handleReserva = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fecha || !horaInicio || !horaFin) {
      toast.error("⚠️ Selecciona fecha, hora de inicio y hora de fin");
      return;
    }

    const horaInicioStr = `${String(horaInicio.getHours()).padStart(2, '0')}:${String(horaInicio.getMinutes()).padStart(2, '0')}`;
    const horaFinStr = `${String(horaFin.getHours()).padStart(2, '0')}:${String(horaFin.getMinutes()).padStart(2, '0')}`;

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

    try {
      // Llamada al backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fechaStr,
          horaInicio: horaInicioStr,
          horaFin: horaFinStr,
          status: 'pending',
          pagada: false
        })
      });

      if (!res.ok) throw new Error("Error al crear reserva");

      const nuevaReserva: Reserva = await res.json(); // contiene _id generado por Mongo
      addReserva(nuevaReserva); // se agrega al contexto

      toast.success("✅ Reserva creada con éxito!");
      setTimeout(() => navigate("/perfil"), 2500);

    } catch (err) {
      console.error(err);
      toast.error("⚠️ No se pudo crear la reserva");
    }
  };

  const getCurrentTimeWithZeroMinutes = (): Date => {
    const now = new Date();
    now.setMinutes(0);
    return now;
  };

  const getCurrentTimePlusOneHour = (): Date => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now;
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

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
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect
            withPortal={isMobile}
            minDate={minDate}
            maxDate={maxDate}
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
            onChange={(date: Date | null) => setHoraInicio(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="h:mm aa"
            placeholderText="Selecciona hora de inicio"
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect
            withPortal={isMobile}
            minTime={getCurrentTimeWithZeroMinutes()}
            maxTime={new Date(new Date().setHours(23, 45, 0))}
          />
        </label>

        <label>
          Hora de finalización:
          <DatePicker
            selected={horaFin}
            onChange={(date: Date | null) => setHoraFin(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="h:mm aa"
            placeholderText="Selecciona hora de fin"
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect
            withPortal={isMobile}
            minTime={horaInicio || getCurrentTimePlusOneHour()}
            maxTime={new Date(new Date().setHours(23, 45, 0))}
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
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import {es} from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

import { useReservas } from "../../hooks/useReservas";
import type { Reserva } from "../../types";
import { isReservaDisponible } from "../../utils/checkReservaDisponible";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./NuevaReserva.module.css";
import "./CustomDatepicker.css";

// Registrar locale español
registerLocale("es", es);

export default function NuevaReserva() {
  const { addReserva, reservas } = useReservas();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [horaFin, setHoraFin] = useState<Date | null>(null);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 480;

  const handleReserva = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fecha || !horaInicio || !horaFin) {
      toast.error("⚠️ Selecciona fecha, hora de inicio y hora de fin");
      return;
    }

    const horaInicioStr = `${String(horaInicio.getHours()).padStart(2, '0')}:${String(horaInicio.getMinutes()).padStart(2, '0')}`;
    const horaFinStr = `${String(horaFin.getHours()).padStart(2, '0')}:${String(horaFin.getMinutes()).padStart(2, '0')}`;

    if (horaFin <= horaInicio) {
      toast.error("⚠️ La hora de fin debe ser posterior a la de inicio");
      return;
    }

    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const yyyy = fecha.getFullYear();
    const fechaStr = `${dd}-${mm}-${yyyy}`;

    const disponible = isReservaDisponible(reservas, fechaStr, horaInicioStr, horaFinStr);

    if (!disponible) {
      toast.error("⛔ Ese horario se superpone con otra reserva. Elige otro.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reservas`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fechaStr,
          horaInicio: horaInicioStr,
          horaFin: horaFinStr,
          status: 'pending',
          pagada: false
        })
      });

      if (!res.ok) throw new Error("Error al crear reserva");

      const nuevaReserva: Reserva = await res.json();
      addReserva(nuevaReserva);

      toast.success("✅ Reserva creada con éxito!");
      setTimeout(() => navigate("/perfil"), 2500);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ No se pudo crear la reserva");
    }
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const minTime = (fechaSelected: Date | null): Date => {
  const now = new Date();
  if (!fechaSelected) return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
  if (fechaSelected.toDateString() === now.toDateString()) return now;
  return new Date(fechaSelected.getFullYear(), fechaSelected.getMonth(), fechaSelected.getDate(), 0, 0);
};

  const maxTime = new Date();
  maxTime.setHours(23, 45, 0, 0);

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
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect
            withPortal={isMobile}
            minDate={minDate}
            maxDate={maxDate}
            isClearable
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={5}
            locale="es"
          />
        </label>

        <label>
          Hora de inicio:
          <DatePicker
            selected={horaInicio}
            onChange={(date: Date | null) => setHoraInicio(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="HH:mm"
            locale="es"
            placeholderText="Selecciona hora de inicio"
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect
            withPortal={isMobile}
            minTime={minTime(fecha)}
            maxTime={maxTime}
          />
        </label>

        <label>
          Hora de finalización:
          <DatePicker
            selected={horaFin}
            onChange={(date: Date | null) => setHoraFin(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="HH:mm"
            locale="es"
            placeholderText="Selecciona hora de fin"
            className="customDatepicker"
            autoComplete="off"
            shouldCloseOnSelect
            withPortal={isMobile}
            minTime={horaInicio || minTime(fecha)}
            maxTime={maxTime}
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
