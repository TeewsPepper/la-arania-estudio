// backend/src/models/User.ts
import mongoose, { Document } from "mongoose";

export interface IUser {           // Solo para Mongoose
  googleId?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  avatar?: string;
  horasAcumuladas: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}  // el tipo que devuelve mongoose

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: String,
  avatar: String,
  horasAcumuladas: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IUserDocument>("User", userSchema);
