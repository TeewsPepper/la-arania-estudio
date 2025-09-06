// backend/src/controllers/adminController.ts
import { Request, Response } from "express";
import Reserva from "../models/Reserva";
import User from "../models/User";

// GET /api/admin/stats
export const getStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [totalUsers, totalReservations, pendingReservations, todayReservations] =
      await Promise.all([
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

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const reservations = await Reserva.find(query)
      .populate("userId", "name email horasAcumuladas")
      .sort({ fecha: -1, horaInicio: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

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
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

    reserva.pagada = true;
    reserva.status = "confirmed";
    await reserva.save();

    const user = await User.findById(reserva.userId);
    if (user && horasDelta) {
      user.horasAcumuladas = Math.max((user.horasAcumuladas || 0) + horasDelta, 0);
      await user.save();
    }

    // 🔹 volver a buscar populando userId
    const reservaActualizada = await Reserva.findById(reserva._id)
      .populate("userId", "name email horasAcumuladas");

    res.json({
      reserva: reservaActualizada,
      horasAcumuladas: user?.horasAcumuladas ?? 0,
    });
  } catch (error) {
    console.error("Error confirmar-pago-horas:", error);
    res.status(500).json({ error: "Error al confirmar pago y actualizar horas" });
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

// PATCH /api/admin/reservations/:id/confirmar-pago
export const confirmarPago = async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate("userId", "name email horasAcumuladas"); // 👈 añadimos populate

    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

    reserva.pagada = true;
    reserva.status = "confirmed";
    await reserva.save();

    // Devolvemos la reserva nuevamente poblada
    const reservaActualizada = await Reserva.findById(reserva._id)
      .populate("userId", "name email horasAcumuladas");

    res.json(reservaActualizada);
  } catch (error) {
    console.error("Error en confirmar pago:", error);
    res.status(500).json({ error: "Error al confirmar pago" });
  }
};

// PATCH /api/admin/users/:id/restar-hora
export const restarHora = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    user.horasAcumuladas = Math.max((user.horasAcumuladas || 0) - 1, 0);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Error en restar hora:", error);
    res.status(500).json({ error: "Error al restar hora" });
  }
};
