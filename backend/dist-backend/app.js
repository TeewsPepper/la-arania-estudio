"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const reservasRoutes_1 = __importDefault(require("./routes/reservasRoutes"));
const admin_1 = __importDefault(require("./routes/admin"));
require("./config/passport");
const app = (0, express_1.default)();
// Validar variables de entorno críticas
const requiredEnvVars = ["MONGO_URI", "SESSION_SECRET", "FRONTEND_URL"];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
    console.error("❌ Variables de entorno faltantes:", missingEnvVars);
    process.exit(1);
}
// Middlewares
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax"
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Logging en desarrollo
if (process.env.NODE_ENV === "development") {
    app.use((req, _res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}
// Rutas API
app.use("/auth", authRoutes_1.default);
app.use("/reservas", reservasRoutes_1.default);
app.use("/admin", admin_1.default);
// Test y health check
app.use("/test", (_req, res) => res.json({ message: "Test route works" }));
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString(), uptime: process.uptime() });
});
// Servir frontend en producción
if (process.env.NODE_ENV === "production") {
    const frontendDist = path_1.default.join(__dirname, "../frontend/dist");
    app.use(express_1.default.static(frontendDist));
    app.get(/^\/(?!auth|reservas|admin|test|health).*/, (_req, res) => {
        res.sendFile(path_1.default.join(frontendDist, "index.html"));
    });
}
// Manejo de rutas no encontradas
app.all(/.*/, (req, res) => {
    res.status(404).json({ error: "Ruta no encontrada", path: req.originalUrl });
});
// Error handler global
app.use((err, _req, res, _next) => {
    console.error("💥 Error:", err);
    res.status(500).json({
        error: process.env.NODE_ENV === "production" ? "Error interno del servidor" : err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map