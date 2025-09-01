import { Schema, model, Document, Types } from "mongoose";

export interface IReserva extends Document {
  usuario: Types.ObjectId;
  fecha: string; // formato "dd-MM-yyyy"
  horaInicio: string; // "HH:mm"
  horaFin: string;   // "HH:mm"
  pagada: boolean;
}

const reservaSchema = new Schema<IReserva>(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fecha: { type: String, required: true },
    horaInicio: { type: String, required: true },
    horaFin: { type: String, required: true },
    pagada: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Reserva = model<IReserva>("Reserva", reservaSchema);
