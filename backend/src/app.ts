import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import reservasRoutes from "./routes/reservasRoutes";
import adminRoutes from "./routes/admin";
import "./config/passport";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Validar variables de entorno requeridas
const requiredEnvVars = ["MONGO_URI", "SESSION_SECRET"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error("❌ Variables de entorno faltantes:", missingEnvVars);
  process.exit(1);
}

// Conexión a MongoDB con mejores opciones
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB conectado exitosamente"))
  .catch((err: Error) => {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  });

// Middlewares de seguridad y CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parseo de JSON con límite
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configuración de sesión segura
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware de logging para desarrollo
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas principales
app.use("/auth", authRoutes);
app.use("/reservas", reservasRoutes);
app.use("/admin", adminRoutes);
app.use("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

// Ruta de salud para verificar que el servidor funciona
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Manejo de rutas no encontradas
app.all(/.*/, (req, res) => {
  res.status(404).json({ 
    error: "Ruta no encontrada",
    path: req.originalUrl 
  });
});

// Manejo global de errores
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("💥 Error no manejado:", error);
  
  res.status(500).json({
    error: process.env.NODE_ENV === "production" 
      ? "Error interno del servidor" 
      : error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Cerrando servidor gracefulmente...");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Cerrando servidor gracefulmente...");
  await mongoose.connection.close();
  process.exit(0);
});

export default app;