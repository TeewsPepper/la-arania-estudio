import express from "express";
import Reserva from "../models/Reserva";
import { authenticateUser } from "../middlewares/auth";

const router = express.Router();

// GET /reservas - Obtener todas las reservas del usuario
router.get("/", authenticateUser, async (req, res) => {
  try {
    const reservas = await Reserva.find({ userId: (req.user as any)._id })
      .sort({ fecha: -1, horaInicio: -1 });
    
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

// POST /reservas - Crear nueva reserva
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { fecha, horaInicio, horaFin, servicio, notas } = req.body;
    
    // Validaciones básicas
    if (!fecha || !horaInicio || !horaFin) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const nuevaReserva = await Reserva.create({
      userId: (req.user as any)._id,
      fecha,
      horaInicio,
      horaFin,
      servicio,
      notas,
      status: "pending",
      pagada: false
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({ error: "Error al crear reserva" });
  }
});

// PUT /reservas/:id - Actualizar reserva
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { fecha, horaInicio, horaFin, servicio, notas } = req.body;
    
    const reserva = await Reserva.findOneAndUpdate(
      { _id: req.params.id, userId: (req.user as any)._id },
      { fecha, horaInicio, horaFin, servicio, notas },
      { new: true, runValidators: true }
    );

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(reserva);
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    res.status(500).json({ error: "Error al actualizar reserva" });
  }
});

// DELETE /reservas/:id - Eliminar reserva
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const reserva = await Reserva.findOneAndDelete({
      _id: req.params.id,
      userId: (req.user as any)._id
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    res.status(500).json({ error: "Error al eliminar reserva" });
  }
});



export default router;