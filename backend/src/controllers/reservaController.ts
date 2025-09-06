import { Request, Response } from "express";
import Reserva from "../models/Reserva";

// GET /reservas
export const getReservas = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const reservas = await Reserva.find({ userId: user._id })
      .sort({ fecha: -1, horaInicio: -1 });

    res.json({
      reservas,
      horasAcumuladas: user.horasAcumuladas || 0, // 🔹 aseguramos que exista
    });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// POST /reservas
export const createReserva = async (req: Request, res: Response) => {
  try {
    const { fecha, horaInicio, horaFin, servicio, notas } = req.body;

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
};

// PUT /reservas/:id
export const updateReserva = async (req: Request, res: Response) => {
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
};
export const marcarPagada = async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      { pagada: true, status: "confirmed" }, // ajusta según tus estados
      { new: true, runValidators: true }
    ).populate("userId", "username email"); // 👈 clave para evitar undefined

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(reserva);
  } catch (error) {
    console.error("Error al marcar como pagada:", error);
    res.status(500).json({ error: "Error al marcar como pagada" });
  }
};

// DELETE /reservas/:id
export const deleteReserva = async (req: Request, res: Response) => {
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
};
