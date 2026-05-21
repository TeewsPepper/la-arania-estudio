
import express from "express";
import helmet from "helmet";
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
app.use(helmet());

// Validar variables de entorno críticas
const requiredEnvVars = ["MONGO_URI", "SESSION_SECRET", "FRONTEND_URL"];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error("❌ Variables de entorno faltantes:", missingEnvVars);
  process.exit(1);
}

app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ⭐⭐ CONFIGURACIÓN DE SESIONES PRIMERO (CRÍTICO)
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ⭐⭐ BLOQUEO DE BOTS - AGREGADO (URGENTE)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const blockedPaths = ['/.env', '/administrator', '/admin/.env', '/auth.json', '/.git'];
  
  if (blockedPaths.some(path => req.path.includes(path))) {
    console.log(`🚨 BLOQUEO BOT: ${req.ip} - ${req.method} ${req.path}`);
    return res.status(404).json({ error: 'Not found' });
  }
  
  next();
});

// ⭐⭐ RATE LIMITING GLOBAL - AGREGADO
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes' },
  skip: (req: express.Request) => req.path === '/health' || req.path === '/ping'
});
app.use(globalLimiter);

// Rate limiting MÁS ESTRICTO para /auth/me
const authMeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // ⭐ AUMENTADO a 10 (5 era muy estricto)
  message: { error: 'Demasiadas verificaciones de autenticación' },
  skip: (req: express.Request) => req.path !== '/auth/me',
  handler: (req, res) => {
    console.warn(`🚨 RATE LIMIT EXCEDIDO: ${req.ip} para /auth/me - Bloqueando`);
    res.status(429).json({ error: 'Demasiadas verificaciones de autenticación' });
  }
});

// ⭐⭐ APPLICAR RATE LIMITING ANTES DE LAS RUTAS - CORREGIDO
app.use("/auth/me", authMeLimiter);

// 🔍 MIDDLEWARE DE DIAGNÓSTICO SIMPLIFICADO - CORREGIDO
let activeRequests = 0;

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  activeRequests++;
  const requestId = Math.random().toString(36).substring(2, 8);
  (req as any).requestId = requestId;
  
  // Solo loguear rutas importantes para no saturar
  if (req.path.startsWith('/auth') || req.path.startsWith('/admin') || req.path.includes('.env')) {
    console.log(`🚀 [${requestId}] ${req.method} ${req.path} | Activos: ${activeRequests}`);
  }
  
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // ⭐⭐ CORRECCIÓN: Prevenir underflow
    activeRequests = Math.max(0, activeRequests - 1);
    if (req.path.startsWith('/auth') || req.path.startsWith('/admin') || req.path.includes('.env')) {
      console.log(`✅ [${requestId}] ${req.method} ${req.path} | ${duration}ms | Activos: ${activeRequests}`);
    }
  });
  
  next();
});

// 🚀 RUTAS PRINCIPALES
app.use("/auth", authRoutes);
app.use("/reservas", reservasRoutes);
app.use("/admin", adminRoutes);

// Health checks
app.get("/health", (_req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    memory: process.memoryUsage(),
  });
});

app.get("/ping", (_req: express.Request, res: express.Response) => {
  res.status(200).send("OK");
});

// Test route
app.get("/test", (_req: express.Request, res: express.Response) => {
  res.json({ message: "Test route works" });
});

// Servir frontend en producción
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../dist");
  app.use(express.static(frontendDist));
  
  app.get("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Si es una ruta de API, pasar al siguiente middleware (404)
    if (req.path.startsWith('/api/') || 
        req.path.startsWith('/auth/') || 
        req.path.startsWith('/reservas/') || 
        req.path.startsWith('/admin/') ||
        req.path.startsWith('/test') ||
        req.path.startsWith('/health') ||
        req.path.startsWith('/ping')) {
      return next();
    }
    
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Manejo de rutas no encontradas
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ 
    error: "Ruta no encontrada", 
    path: req.originalUrl 
  });
});

// Error handler global
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("💥 Error:", err);
    res.status(500).json({
      error: process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
    });
  }
);

export default app;