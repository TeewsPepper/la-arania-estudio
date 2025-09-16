"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/config/passport.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const authController_1 = require("../controllers/authController");
// 🔹 Estrategia Google OAuth
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await (0, authController_1.findOrCreateUser)(profile);
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        done(null, payload);
    }
    catch (err) {
        done(err, undefined);
    }
}));
// 🔹 Serializar usuario (guardar solo el id en la sesión)
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// 🔹 Deserializar usuario (buscar en DB y devolver payload limpio)
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id);
        if (!user)
            return done(null, false);
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            horasAcumuladas: user.horasAcumuladas || 0,
        };
        done(null, payload);
    }
    catch (err) {
        done(err, undefined);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map