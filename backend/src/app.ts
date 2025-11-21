import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import path from "path";

import authRoutes from "./routes/authRoutes";
import reservasRoutes from "./routes/reservasRoutes";
import adminRoutes from "./routes/admin";
import "./config/passport";

const app = express();

// Validar variables de entorno críticas
const requiredEnvVars = ["MONGO_URI", "SESSION_SECRET", "FRONTEND_URL"];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error("❌ Variables de entorno faltantes:", missingEnvVars);
  process.exit(1);
}


app.set("trust proxy", 1); // necesario en Render para cookies seguras detrás de proxy

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      secure: true,                   // ✅ HTTPS en producción
      httpOnly: true,                 // ✅ Seguridad
      sameSite: "lax",                // ✅ Perfecto para mismo dominio
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    },
  })
);



app.use(passport.initialize());
app.use(passport.session());

// 🔍 🔍 🔍 AQUÍ COLOCA EL MIDDLEWARE DE DIAGNÓSTICO 🔍 🔍 🔍
// ==========================================================

// MIDDLEWARE 1: Contador de requests activos
let activeRequests = 0;

app.use((req, res, next) => {
  activeRequests++;
  const requestId = Math.random().toString(36).substring(7);
  (req as any).requestId = requestId;
  
  console.log(`🚀 [${requestId}] INICIO: ${req.method} ${req.path} | Activos: ${activeRequests}`);
  
  // Timer para medir duración
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    activeRequests--;
    console.log(`✅ [${requestId}] FIN: ${req.method} ${req.path} | Duración: ${duration}ms | Activos: ${activeRequests}`);
  });
  
  next();
});

// MIDDLEWARE 2: Debug de autenticación
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(`🔐 [${(req as any).requestId}] Usuario autenticado:`, {
      email: req.user?.email,
      sessionId: req.sessionID?.substring(0, 8) + '...',
      path: req.path
    });
  } else {
    console.log(`👤 [${(req as any).requestId}] Usuario NO autenticado | Path: ${req.path}`);
  }
  next();
});

// ==========================================================
// FIN DE MIDDLEWARES DE DIAGNÓSTICO
// ==========================================================

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
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Servir frontend en producción
if (process.env.NODE_ENV === "production") {
  // frontendDist apunta a la carpeta dist del frontend
  const frontendDist = path.join(__dirname, "../dist"); // __dirname = dist-backend

  // Servimos archivos estáticos
  app.use(express.static(frontendDist));

  // Cualquier ruta que no sea API devuelve index.html
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", path: req.originalUrl });
});

// Error handler global
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("💥 Error:", err);
    res.status(500).json({
      error:
        process.env.NODE_ENV === "production"
          ? "Error interno del servidor"
          : err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

export default app;
