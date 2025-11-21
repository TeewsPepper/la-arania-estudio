// backend/src/routes/authRoutes.ts

import express from "express";
import passport from "../config/passport";
import { handleAuthRedirect } from "../controllers/authController";

const router = express.Router();

// Ruta de inicio de Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback de Google OAuth
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: true }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect(`${process.env.FRONTEND_URL}/login`);

      // ⚡ aquí nos aseguramos de que la sesión se guarde
      req.login(user, (err) => {
        if (err) return next(err);

        console.log("✅ req.user:", req.user);
        console.log("✅ req.sessionID:", req.sessionID);

        return handleAuthRedirect(req, res);
      });
    })(req, res, next);
  }
);

// Ruta para obtener usuario actual
router.get("/me", (req, res) => {
  // ⭐ CAMBIO CRÍTICO: No usar 401, usar 200 con user: null
  if (!req.isAuthenticated()) {
    return res.status(200).json({ user: null }); // ← 200 en lugar de 401
  }
  
  console.log(`✅ /auth/me - Usuario autenticado: ${req.user.email}`);
  res.json({ user: req.user }); // ← Incluir en objeto {user}
});

// Ruta de logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.clearCookie("sid");
    res.redirect("https://araniauy.com");
  });
});

export default router;
