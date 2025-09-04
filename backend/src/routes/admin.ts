import express from "express";
import Reserva from "../models/Reserva";
import User from "../models/User";
import { authenticateAdmin } from "../middlewares/auth";

const router = express.Router();

// GET /api/admin/stats - Estadísticas
router.get("/stats", authenticateAdmin, async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const [
      totalUsers,
      totalReservations,
      pendingReservations,
      todayReservations
    ] = await Promise.all([
      User.countDocuments(),
      Reserva.countDocuments(),
      Reserva.countDocuments({ status: "pending" }),
      Reserva.countDocuments({ fecha: todayStr })
    ]);

    res.json({
      totalUsers,
      totalReservations,
      pendingReservations,
      todayReservations
    });
  } catch (error) {
    console.error("Error en /admin/stats:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});


router.get("/reservations", authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const reservations = await Reserva.find(query)
      .populate("userId", "name email")
      .sort({ fecha: -1, horaInicio: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Reserva.countDocuments(query);

    res.json({
      reservations,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error("Error en /admin/reservations:", error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});


router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error en /admin/users:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});


router.patch("/reservations/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

     const updateData: any = { status };
    if (status === "confirmed") updateData.pagada = true;

    const reservation = await Reserva.findByIdAndUpdate(
      req.params.id,
      { status, pagada: status === "confirmed" },
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    
    res.json(reservation);
  } catch (error) {
    console.error("Error en PATCH /reservations/:id/status:", error);
    res.status(500).json({ error: "Error al actualizar reserva" });
  }
});

export default router;