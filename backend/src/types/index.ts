// backend/src/types/index.ts
import { Request } from "express";
import { IReservaDocument } from "../models/Reserva"; // 👈 Reutilizamos el modelo

export type { IReservaDocument }; // exportamos el tipo del modelo

export interface IUser {
  _id?: string;
  googleId?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt?: Date;
}

// Para usar en Express
export interface AuthRequest extends Request {
  user?: {
    id: string;           // Mongo _id convertido a string
    email: string;
    name: string;
    role: 'user' | 'admin';
    horasAcumuladas: number;
  };
}
