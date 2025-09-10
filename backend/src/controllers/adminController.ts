// backend/src/controllers/adminController.ts
import { Request, Response } from "express";
import Reserva, { IReservaDocument } from "../models/Reserva";
import { FilterQuery } from "mongoose";
import User from "../models/User";

// GET /api/admin/stats
export const getStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [
      totalUsers,
      totalReservations,
      pendingReservations,
      todayReservations,
    ] = await Promise.all([
      User.countDocuments(),
      Reserva.countDocuments(),
      Reserva.countDocuments({ status: "pending" }),
      Reserva.countDocuments({ fecha: todayStr }),
    ]);

    res.json({
      totalUsers,
      totalReservations,
      pendingReservations,
      todayReservations,
    });
  } catch (error) {
    console.error("Error en /admin/stats:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

// GET /api/admin/reservations
export const getReservations = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query: FilterQuery<IReservaDocument> = {};
    if (status && status !== "all") {
      query.status = status as "pending" | "confirmed" | "cancelled";
    }

    const reservations = await Reserva.find(query)
      .populate("userId", "name email horasAcumuladas")
      .sort({ createdAt: -1 });

    const total = await Reserva.countDocuments(query);

    res.json({
      reservations,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error("Error en /admin/reservations:", error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// GET /api/admin/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error en /admin/users:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// PATCH /api/admin/reservations/:id/confirmar-pago-horas
export const confirmarPagoHoras = async (req: Request, res: Response) => {
  try {
    const { horasDelta } = req.body;

    let reserva = await Reserva.findById(req.params.id);
    if (!reserva)
      return res.status(404).json({ error: "Reserva no encontrada" });

    reserva.pagada = true;
    reserva.status = "confirmed";
    await reserva.save();

    const user = await User.findById(reserva.userId);
    if (user && typeof horasDelta === "number") {
      user.horasAcumuladas = Math.max(
        (user.horasAcumuladas || 0) + horasDelta,
        0
      );
      await user.save();
    }

    const reservaActualizada = await Reserva.findById(reserva._id).populate(
      "userId",
      "name email horasAcumuladas"
    );

    res.json({
      reserva: reservaActualizada,
      horasAcumuladas: user?.horasAcumuladas ?? 0,
    });
  } catch (error) {
    console.error("Error confirmar-pago-horas:", error);
    res
      .status(500)
      .json({ error: "Error al confirmar pago y actualizar horas" });
  }
};

// PATCH /api/admin/reservations/:id/status
export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

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
};
