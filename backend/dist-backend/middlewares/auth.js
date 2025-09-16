"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = exports.authenticateUser = void 0;
const User_1 = __importDefault(require("../models/User"));
// Middleware para usuarios autenticados
const authenticateUser = async (req, res, next) => {
    const authReq = req;
    if (!authReq.user)
        return res.status(401).json({ error: 'No autenticado' });
    next();
};
exports.authenticateUser = authenticateUser;
// Middleware para admin
const authenticateAdmin = async (req, res, next) => {
    const authReq = req;
    if (!authReq.user)
        return res.status(401).json({ error: 'No autenticado' });
    const user = await User_1.default.findById(authReq.user.id);
    if (!user)
        return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.role !== 'admin') {
        return res
            .status(403)
            .json({ error: 'Acceso no autorizado. Se requiere rol de administrador' });
    }
    next();
};
exports.authenticateAdmin = authenticateAdmin;
//# sourceMappingURL=auth.js.map