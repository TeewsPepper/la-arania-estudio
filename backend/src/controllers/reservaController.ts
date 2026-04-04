import {  Response } from "express";
import { AuthRequest } from "../types"; // 👈 Importamos el tipo
import Reserva from "../models/Reserva";
import { isReservaDisponible } from "../utils/isReservaDisponible";
import { enviarNotificacionReserva } from "../services/emailService";
import { Types } from "mongoose";

// GET /reservas
export const getReservas = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const reservas = await Reserva.find({ userId: user.id })
      .sort({ fecha: -1, horaInicio: -1 });

    res.json({
      reservas,
      horasAcumuladas: user.horasAcumuladas ?? 0,
    });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// POST /reservas
export const createReserva = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const { fecha, horaInicio, horaFin } = req.body;

    if (!fecha || !horaInicio || !horaFin) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // 🔍 Buscar TODAS las reservas de ese día
    const reservasDelDia = await Reserva.find({ fecha });

    // 🕒 Verificar disponibilidad con tu helper
    const disponible = isReservaDisponible(
      reservasDelDia,
      fecha,
      horaInicio,
      horaFin
    );

    if (!disponible) {
      return res.status(400).json({ error: "Horario no disponible" });
    }

    // ✅ Crear la reserva si está disponible
    const nuevaReserva = await Reserva.create({
      userId: req.user.id,
      fecha,
      horaInicio,
      horaFin,
      status: "pending",
      pagada: false,
    });

    // 🔔 Enviar notificación al admin (en segundo plano, SIN AWAIT)
    
    enviarNotificacionReserva(nuevaReserva, req.user).catch(err => {
      console.error("❌ Error al enviar notificación (no bloqueante):", err);
    });

    // Responder inmediatamente al frontend
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({ error: "Error al crear reserva" });
  }
};

// PUT /reservas/:id
export const updateReserva = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const { fecha, horaInicio, horaFin } = req.body;

    const reserva = await Reserva.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      { fecha, horaInicio, horaFin },
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
export const marcarPagada = async (req: AuthRequest, res: Response) => {
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
export const deleteReserva = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const reserva = await Reserva.findOneAndDelete({
      _id: req.params.id,
      userId: new Types.ObjectId(req.user.id), 
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
