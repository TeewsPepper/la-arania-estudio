"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/admin.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
// 📊 Estadísticas generales
router.get("/stats", auth_1.authenticateAdmin, adminController_1.getStats);
// 📅 Reservas (para el panel admin)
router.get("/reservations", auth_1.authenticateAdmin, adminController_1.getReservations);
// 👥 Usuarios (si en el futuro los listás en el admin)
router.get("/users", auth_1.authenticateAdmin, adminController_1.getUsers);
// ✅ Confirmar pago + horas (el único endpoint que usa Admin.tsx)
router.patch("/reservations/:id/confirmar-pago-horas", auth_1.authenticateAdmin, adminController_1.confirmarPagoHoras);
// 🔄 Cambiar status de una reserva (opcional: si usás estados custom)
router.patch("/reservations/:id/status", auth_1.authenticateAdmin, adminController_1.updateReservationStatus);
exports.default = router;
//# sourceMappingURL=admin.js.map