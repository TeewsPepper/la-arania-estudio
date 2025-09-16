import mongoose, { Document } from "mongoose";

export interface IUserInput {
  googleId?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "user" | "admin";
  phone?: string;
  horasAcumuladas?: number;
}

export interface IUser {
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

export interface IUserDocument extends IUser, Document {}

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
