import mongoose from "mongoose";

export interface IReserva {
  userId: mongoose.Types.ObjectId;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  pagada: boolean;
  servicio?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReservaDocument extends IReserva, mongoose.Document {}

const reservaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fecha: {
    type: String,
    required: true
  },
  horaInicio: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido']
  },
  horaFin: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  pagada: {
    type: Boolean,
    default: false
  },
  servicio: String,
  notas: String
}, {
  timestamps: true // Crea createdAt y updatedAt automáticamente
});

export default mongoose.model<IReservaDocument>("Reserva", reservaSchema);