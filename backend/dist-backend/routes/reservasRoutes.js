"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const reservaController_1 = require("../controllers/reservaController"); // 👈 importamos la lógica
const router = express_1.default.Router();
// GET /reservas - Obtener todas las reservas del usuario
router.get("/", auth_1.authenticateUser, reservaController_1.getReservas);
// POST /reservas - Crear nueva reserva
router.post("/", auth_1.authenticateUser, reservaController_1.createReserva);
// PUT /reservas/:id - Actualizar reserva
router.put("/:id", auth_1.authenticateUser, reservaController_1.updateReserva);
// DELETE /reservas/:id - Eliminar reserva
router.delete("/:id", auth_1.authenticateUser, reservaController_1.deleteReserva);
// Endpoint de admin para marcar pagada
router.put("/pagada/:id", auth_1.authenticateAdmin, reservaController_1.marcarPagada);
exports.default = router;
//# sourceMappingURL=reservasRoutes.js.map