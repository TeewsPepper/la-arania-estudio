// backend/src/routes/admin.ts
import express from "express";
import { authenticateAdmin } from "../middlewares/auth";
import {
  getStats,
  getReservations,
  getUsers,
  confirmarPagoHoras,
  updateReservationStatus,
} from "../controllers/adminController";

const router = express.Router();

// 📊 Estadísticas generales
router.get("/stats", authenticateAdmin, getStats);

// 📅 Reservas (para el panel admin)
router.get("/reservations", authenticateAdmin, getReservations);

// 👥 Usuarios (si en el futuro los listás en el admin)
router.get("/users", authenticateAdmin, getUsers);

// ✅ Confirmar pago + horas (el único endpoint que usa Admin.tsx)
router.patch(
  "/reservations/:id/confirmar-pago-horas",
  authenticateAdmin,
  confirmarPagoHoras
);

// 🔄 Cambiar status de una reserva (opcional: si usás estados custom)
router.patch(
  "/reservations/:id/status",
  authenticateAdmin,
  updateReservationStatus
);

export default router;
