import type { IReservaDocument } from "../models/Reserva"; // 👈 ajusta el tipo según tu modelo

export function isReservaDisponible(
  reservas: IReservaDocument[],
  fecha: string,
  horaInicio: string,
  horaFin: string
): boolean {
  return !reservas.some((reserva) => {
    if (reserva.fecha !== fecha) return false;

    // Convertir a minutos para comparar
    const [h1, m1] = reserva.horaInicio.split(":").map(Number);
    const [h2, m2] = reserva.horaFin.split(":").map(Number);
    const [nh1, nm1] = horaInicio.split(":").map(Number);
    const [nh2, nm2] = horaFin.split(":").map(Number);

    const start = h1 * 60 + m1;
    const end = h2 * 60 + m2;
    const newStart = nh1 * 60 + nm1;
    const newEnd = nh2 * 60 + nm2;

    return newStart < end && newEnd > start; // solapamiento
  });
}
