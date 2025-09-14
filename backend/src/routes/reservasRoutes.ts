// backend/src/routes/reservasRoutes.ts

import express from "express";
import { authenticateUser, authenticateAdmin } from "../middlewares/auth";
import {
  getReservas,
  createReserva,
  updateReserva,
  deleteReserva,
  marcarPagada
} from "../controllers/reservaController"; // 👈 importamos la lógica

const router = express.Router();

// GET /reservas - Obtener todas las reservas del usuario
router.get("/", authenticateUser, getReservas);

// POST /reservas - Crear nueva reserva
router.post("/", authenticateUser, createReserva);

// PUT /reservas/:id - Actualizar reserva
router.put("/:id", authenticateUser, updateReserva);

// DELETE /reservas/:id - Eliminar reserva
router.delete("/:id", authenticateUser, deleteReserva);

// Endpoint de admin para marcar pagada
router.put("/pagada/:id", authenticateAdmin, marcarPagada);

export default router;
