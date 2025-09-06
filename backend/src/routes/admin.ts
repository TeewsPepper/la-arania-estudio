// backend/src/routes/admin.ts
import express from "express";
import { authenticateAdmin } from "../middlewares/auth";
import { marcarPagada } from "../controllers/reservaController";
import {
  getStats,
  getReservations,
  getUsers,
  confirmarPagoHoras,
  updateReservationStatus,
  confirmarPago,
  restarHora,
} from "../controllers/adminController";

const router = express.Router();

router.get("/stats", authenticateAdmin, getStats);
router.get("/reservations", authenticateAdmin, getReservations);
router.get("/users", authenticateAdmin, getUsers);
router.put("/reservas/:id/pagar", authenticateAdmin, marcarPagada);
router.patch("/reservations/:id/confirmar-pago-horas", authenticateAdmin, confirmarPagoHoras);
router.patch("/reservations/:id/status", authenticateAdmin, updateReservationStatus);
router.patch("/reservations/:id/confirmar-pago", authenticateAdmin, confirmarPago);
router.patch("/users/:id/restar-hora", authenticateAdmin, restarHora);

export default router;
