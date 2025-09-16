"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReserva = exports.marcarPagada = exports.updateReserva = exports.createReserva = exports.getReservas = void 0;
const Reserva_1 = __importDefault(require("../models/Reserva"));
const mongoose_1 = require("mongoose");
// GET /reservas
const getReservas = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "No autenticado" });
        }
        const reservas = await Reserva_1.default.find({ userId: user.id })
            .sort({ fecha: -1, horaInicio: -1 });
        res.json({
            reservas,
            horasAcumuladas: user.horasAcumuladas ?? 0,
        });
    }
    catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ error: "Error al obtener reservas" });
    }
};
exports.getReservas = getReservas;
// POST /reservas
const createReserva = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" });
        }
        const user = req.user; // aquí TS ya sabe que no es undefined
        const { fecha, horaInicio, horaFin } = req.body;
        if (!fecha || !horaInicio || !horaFin) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }
        const nuevaReserva = await Reserva_1.default.create({
            userId: user.id, // 
            fecha,
            horaInicio,
            horaFin,
            status: "pending",
            pagada: false,
        });
        res.status(201).json(nuevaReserva);
    }
    catch (error) {
        console.error("Error al crear reserva:", error);
        res.status(500).json({ error: "Error al crear reserva" });
    }
};
exports.createReserva = createReserva;
// PUT /reservas/:id
const updateReserva = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" });
        }
        const { fecha, horaInicio, horaFin } = req.body;
        const reserva = await Reserva_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { fecha, horaInicio, horaFin }, { new: true, runValidators: true });
        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }
        res.json(reserva);
    }
    catch (error) {
        console.error("Error al actualizar reserva:", error);
        res.status(500).json({ error: "Error al actualizar reserva" });
    }
};
exports.updateReserva = updateReserva;
const marcarPagada = async (req, res) => {
    try {
        const reserva = await Reserva_1.default.findByIdAndUpdate(req.params.id, { pagada: true, status: "confirmed" }, // ajusta según tus estados
        { new: true, runValidators: true }).populate("userId", "username email"); // 👈 clave para evitar undefined
        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }
        res.json(reserva);
    }
    catch (error) {
        console.error("Error al marcar como pagada:", error);
        res.status(500).json({ error: "Error al marcar como pagada" });
    }
};
exports.marcarPagada = marcarPagada;
// DELETE /reservas/:id
const deleteReserva = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" });
        }
        const reserva = await Reserva_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: new mongoose_1.Types.ObjectId(req.user.id),
        });
        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }
        res.json({ message: "Reserva eliminada correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar reserva:", error);
        res.status(500).json({ error: "Error al eliminar reserva" });
    }
};
exports.deleteReserva = deleteReserva;
//# sourceMappingURL=reservaController.js.map