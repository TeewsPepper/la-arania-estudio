
import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import path from "path";
import MongoStore from "connect-mongo";
import { connectDB, closeDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import reservasRoutes from "./routes/reservasRoutes";
import adminRoutes from "./routes/admin";
import "./config/passport";

import dotenv from "dotenv";
dotenv.config();
const app = express();

// Validar variables de entorno críticas
const requiredEnvVars = ["MONGO_URI", "SESSION_SECRET", "FRONTEND_URL"];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error("❌ Variables de entorno faltantes:", missingEnvVars);
  process.exit(1);
}

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL, // ✅ Mantener variable de entorno
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Necesario si estás detrás de un proxy como Render
app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI as string,
    ttl: 24 * 60 * 60,
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS obligatorio en prod
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // ✅ cookies cross-site
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Logging en desarrollo
if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas API
app.use("/auth", authRoutes);
app.use("/reservas", reservasRoutes);
app.use("/admin", adminRoutes);

// Test y health check
app.use("/test", (_req, res) => res.json({ message: "Test route works" }));
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// Servir frontend en producción solo si está integrado en el mismo dominio
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDist));

  app.get(/^\/(?!auth|reservas|admin|test|health).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", path: req.originalUrl });
});

// Error handler global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("💥 Error:", err);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Error interno del servidor" : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

export default app;
