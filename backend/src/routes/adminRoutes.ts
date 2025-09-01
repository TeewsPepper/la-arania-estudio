import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";


const router = Router();

// 👉 Ver todas las reservas (solo admin)
router.get("/reservas", authMiddleware, adminMiddleware, (req, res) => {
  // Aquí iría la lógica real desde la DB
  res.json({
    message: "Reservas de todos los usuarios",
    reservas: [
      { id: 1, fecha: "2025-09-05", hora: "18:00", usuario: "user1@gmail.com" },
      { id: 2, fecha: "2025-09-06", hora: "20:00", usuario: "user2@gmail.com" },
    ],
  });
});

// 👉 Gestionar usuarios (solo admin)
router.get("/usuarios", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Lista de usuarios",
    usuarios: [
      { id: 1, email: "admin@gmail.com", rol: "admin" },
      { id: 2, email: "user1@gmail.com", rol: "user" },
    ],
  });
});

export default router;
