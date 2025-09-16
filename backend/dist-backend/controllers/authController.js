"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuthRedirect = exports.findOrCreateUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const findOrCreateUser = async (profile) => {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || "Usuario";
    const avatar = profile.photos?.[0]?.value;
    if (!email)
        throw new Error("Email is required");
    // Primero buscar por googleId
    let user = await User_1.default.findOne({ googleId: profile.id });
    if (user)
        return user;
    // Buscar por email
    user = await User_1.default.findOne({ email });
    if (user) {
        user.googleId = profile.id;
        user.avatar = avatar;
        await user.save();
        return user;
    }
    // Crear nuevo usuario
    const isAdmin = email === process.env.ADMIN_EMAIL;
    user = await User_1.default.create({
        googleId: profile.id,
        name,
        email,
        avatar,
        role: isAdmin ? "admin" : "user",
    });
    return user;
};
exports.findOrCreateUser = findOrCreateUser;
// Función para redirigir según rol
const handleAuthRedirect = (req, res) => {
    if (!req.user)
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
    const role = req.user.role;
    const target = role === "admin" ? "/admin" : "/perfil";
    return res.redirect(`${process.env.FRONTEND_URL}${target}`);
};
exports.handleAuthRedirect = handleAuthRedirect;
//# sourceMappingURL=authController.js.map