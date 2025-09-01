import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import adminRoutes from "./routes/adminRoutes";
import "./config/passport";

const app = express();

// DB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error en MongoDB:", err));

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/auth", authRoutes);
app.use("/reservas", reservaRoutes);
app.use("/admin", adminRoutes);

export default app;
