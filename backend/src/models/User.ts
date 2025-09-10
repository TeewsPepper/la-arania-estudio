/* import mongoose, { Document } from "mongoose";

export interface IUser {
  googleId?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  avatar?: string;
  horasAcumuladas: number; // ✅ nuevo campo
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email inválido",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: String,
    avatar: String,
    horasAcumuladas: { type: Number, default: 0 }, // ✅ agregado al schema
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
  }
);

export default mongoose.model<IUserDocument>("User", userSchema);
 */
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
