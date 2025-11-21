/* import express from "express";
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
 */
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import rateLimit from 'express-rate-limit';
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

// 🛡️ RATE LIMITING - COLOCAR ANTES DE SESIONES PARA PROTEGER
// ==========================================================
const authMeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo 10 requests por minuto por IP para /auth/me
  message: { error: 'Demasiadas verificaciones de autenticación' },
  skip: (req: express.Request) => req.path !== '/auth/me'
});

const generalAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // máximo 50 requests por ventana
  message: { error: 'Demasiadas requests de autenticación' },
  skip: (req: express.Request) => !req.path.startsWith('/auth/')
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { error: 'Demasiadas requests' }
});
// ==========================================================

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      ttl: 24 * 60 * 60, // ⭐ REDUCIDO: 1 día en lugar de 7 (mejor para free tier)
      autoRemove: 'interval',
      autoRemoveInterval: 60, // ⭐ Limpiar cada 60 minutos
      touchAfter: 3600, // ⭐ Reducir writes a la BD (1 hora)
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // ⭐ Mejorado: solo secure en producción
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
      path: "/",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🔍 🔍 🔍 MIDDLEWARE DE DIAGNÓSTICO 🔍 🔍 🔍
// ==========================================================
let activeRequests = 0;
let consecutiveAuthMeRequests = 0;
let lastAuthMeLog = Date.now();

app.use((req: express.Request, res: express.Response, next) => {
  activeRequests++;
  const requestId = Math.random().toString(36).substring(2, 8);
  (req as any).requestId = requestId;
  
  // Detectar ráfagas de /auth/me
  if (req.path === '/auth/me') {
    consecutiveAuthMeRequests++;
    const now = Date.now();
    if (now - lastAuthMeLog > 5000) { // Log cada 5 segundos si hay ráfagas
      if (consecutiveAuthMeRequests > 3) {
        console.warn(`⚠️ [${requestId}] RÁFAGA /auth/me: ${consecutiveAuthMeRequests} requests consecutivos`);
      }
      consecutiveAuthMeRequests = 0;
      lastAuthMeLog = now;
    }
  } else {
    consecutiveAuthMeRequests = 0;
  }
  
  console.log(`🚀 [${requestId}] INICIO: ${req.method} ${req.path} | Activos: ${activeRequests}`);
  
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    activeRequests--;
    console.log(`✅ [${requestId}] FIN: ${req.method} ${req.path} | ${duration}ms | Activos: ${activeRequests}`);
  });
  
  next();
});

// Middleware de autenticación con logging mejorado
app.use((req: express.Request, res: express.Response, next) => {
  if (req.isAuthenticated()) {
    console.log(`🔐 [${(req as any).requestId}] Usuario: ${(req as any).user?.email} | Session: ${req.sessionID?.substring(0, 8)}...`);
  } else if (req.path === '/auth/me') {
    console.log(`👁️ [${(req as any).requestId}] Verificando auth...`);
  }
  next();
});
// ==========================================================

// Logging en desarrollo
if (process.env.NODE_ENV === "development") {
  app.use((req: express.Request, _res: express.Response, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// 🎯 HEALTH CHECKS OPTIMIZADOS PARA RENDER FREE TIER
// ==========================================================
app.get("/health", (_req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB"
  });
});

// Endpoint SUPER liviano para uptime monitors
app.get("/ping", (_req: express.Request, res: express.Response) => {
  res.status(200).send("OK");
});

// Endpoint de diagnóstico (solo desarrollo)
if (process.env.NODE_ENV === "development") {
  app.get("/debug", (req: express.Request, res: express.Response) => {
    res.json({
      session: {
        id: req.sessionID,
        authenticated: req.isAuthenticated(),
        user: (req as any).user
      },
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  });
}
// ==========================================================

// 🚀 RUTAS API CON RATE LIMITING APLICADO
// ==========================================================
app.use("/auth/me", authMeLimiter); // ⭐ Rate limiting específico para /auth/me
app.use("/auth", generalAuthLimiter); // ⭐ Rate limiting general para auth
app.use("/api", apiLimiter); // ⭐ Rate limiting para APIs

app.use("/auth", authRoutes);
app.use("/reservas", reservasRoutes);
app.use("/admin", adminRoutes);

// Test route
app.use("/test", (_req: express.Request, res: express.Response) => res.json({ message: "Test route works" }));

// Servir frontend en producción
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../dist");
  
  // Servir archivos estáticos
  app.use(express.static(frontendDist));
  
  // Catch-all handler debe ir ANTES de manejo de 404
  app.get("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Si es una ruta de API, pasar al siguiente middleware (404)
    if (req.path.startsWith('/api/') || 
        req.path.startsWith('/auth/') || 
        req.path.startsWith('/reservas/') || 
        req.path.startsWith('/admin/')) {
      return next();
    }
    
    // Para cualquier otra ruta, servir el frontend
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Manejo de rutas no encontradas
app.use((req: express.Request, res: express.Response) => {
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/auth/') || 
      req.path.startsWith('/reservas/') || 
      req.path.startsWith('/admin/')) {
    return res.status(404).json({ 
      error: "Ruta API no encontrada", 
      path: req.originalUrl 
    });
  }
  
  // Para rutas no-API, podrías redirigir al frontend o mostrar 404
  res.status(404).send("Página no encontrada");
});

// Error handler global
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("💥 Error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      user: (req as any).user?.email || 'anon'
    });
    
    res.status(500).json({
      error: process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
      ...(process.env.NODE_ENV === "development" && { 
        stack: err.stack,
        path: req.path 
      }),
    });
  }
);

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;