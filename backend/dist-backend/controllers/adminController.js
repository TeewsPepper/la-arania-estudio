"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationStatus = exports.confirmarPagoHoras = exports.getUsers = exports.getReservations = exports.getStats = void 0;
const Reserva_1 = __importDefault(require("../models/Reserva"));
const User_1 = __importDefault(require("../models/User"));
// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const [totalUsers, totalReservations, pendingReservations, todayReservations,] = await Promise.all([
            User_1.default.countDocuments(),
            Reserva_1.default.countDocuments(),
            Reserva_1.default.countDocuments({ status: "pending" }),
            Reserva_1.default.countDocuments({ fecha: todayStr }),
        ]);
        res.json({
            totalUsers,
            totalReservations,
            pendingReservations,
            todayReservations,
        });
    }
    catch (error) {
        console.error("Error en /admin/stats:", error);
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
};
exports.getStats = getStats;
// GET /api/admin/reservations
const getReservations = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const query = {};
        if (status && status !== "all") {
            query.status = status;
        }
        const reservations = await Reserva_1.default.find(query)
            .populate("userId", "name email horasAcumuladas")
            .sort({ createdAt: -1 });
        const total = await Reserva_1.default.countDocuments(query);
        res.json({
            reservations,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
        });
    }
    catch (error) {
        console.error("Error en /admin/reservations:", error);
        res.status(500).json({ error: "Error al obtener reservas" });
    }
};
exports.getReservations = getReservations;
// GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select("-__v").sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        console.error("Error en /admin/users:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};
exports.getUsers = getUsers;
// PATCH /api/admin/reservations/:id/confirmar-pago-horas
const confirmarPagoHoras = async (req, res) => {
    try {
        const { horasDelta } = req.body;
        let reserva = await Reserva_1.default.findById(req.params.id);
        if (!reserva)
            return res.status(404).json({ error: "Reserva no encontrada" });
        reserva.pagada = true;
        reserva.status = "confirmed";
        await reserva.save();
        const user = await User_1.default.findById(reserva.userId);
        if (user && typeof horasDelta === "number") {
            user.horasAcumuladas = Math.max((user.horasAcumuladas || 0) + horasDelta, 0);
            await user.save();
        }
        const reservaActualizada = await Reserva_1.default.findById(reserva._id).populate("userId", "name email horasAcumuladas");
        res.json({
            reserva: reservaActualizada,
            horasAcumuladas: user?.horasAcumuladas ?? 0,
        });
    }
    catch (error) {
        console.error("Error confirmar-pago-horas:", error);
        res
            .status(500)
            .json({ error: "Error al confirmar pago y actualizar horas" });
    }
};
exports.confirmarPagoHoras = confirmarPagoHoras;
// PATCH /api/admin/reservations/:id/status
const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({ error: "Estado inválido" });
        }
        const reservation = await Reserva_1.default.findByIdAndUpdate(req.params.id, { status, pagada: status === "confirmed" }, { new: true, runValidators: true });
        if (!reservation) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }
        res.json(reservation);
    }
    catch (error) {
        console.error("Error en PATCH /reservations/:id/status:", error);
        res.status(500).json({ error: "Error al actualizar reserva" });
    }
};
exports.updateReservationStatus = updateReservationStatus;
//# sourceMappingURL=adminController.js.map