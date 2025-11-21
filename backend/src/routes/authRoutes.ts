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

// ====================================
//   🔥 FIX: /auth/me seguro
// ====================================
router.get("/me", (req, res) => {
  try {
    // Si no hay user, devolvemos user:null en vez de 401
    // esto evita que el frontend haga reintentos en bucle
    if (!req.user) {
      return res.json({ user: null });
    }

    return res.json({ user: req.user });

  } catch (error) {
    // fallback si alguna librería lanza error
    return res.json({ user: null });
  }
});

// ====================================
//   🔥 FIX REAL: logout seguro
// ====================================
router.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);

      // elimina cookie de sesión
      res.clearCookie("sid", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      // redirigir al frontend
      return res.redirect("https://araniauy.com");
    });

  } catch (e) {
    console.error("Logout error:", e);
    return res.redirect("https://araniauy.com");
  }
});

export default router;
