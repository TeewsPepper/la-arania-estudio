"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Ruta de inicio de Google OAuth
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
// Callback de Google OAuth
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/login",
    session: true,
}), authController_1.handleAuthRedirect // ← Redirige según rol usando authController
);
// Ruta para obtener usuario actual
router.get("/me", (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Not authenticated" });
    res.json(req.user);
});
// Ruta de logout
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect(process.env.FRONTEND_URL);
    });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map