import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ====================
// Importa tus routers reales
// ====================
import reservaRouter from "./routes/reservasRoutes";
import authRouter from "./routes/authRoutes";
// Agrega todos los routers que uses en tu app

// ====================
// Registra rutas como en tu app principal
// ====================
app.use("/api/reservas", reservaRouter);
app.use("/auth", authRouter);
// ...agrega todos los app.use() que tengas

// ====================
// LOG DE RUTAS
// ====================
app._router?.stack.forEach((layer: any) => {
  if (layer.route) {
    console.log("Ruta registrada:", layer.route.path, Object.keys(layer.route.methods));
  } else if (layer.name === "router" || (layer.handle && layer.handle.name === "router")) {
    console.log("Middleware router con regexp:", layer.regexp);
  }
});

// ====================
// Inicia servidor mínimo para debug
// ====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor de debug escuchando en puerto ${PORT}`);
});
