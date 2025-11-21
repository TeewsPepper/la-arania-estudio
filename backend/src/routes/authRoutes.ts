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
  if (!req.user) return res.json({ user: null });
  return res.json({ user:req.user});
});

// Ruta de logout
router.get("/logout", (req, res, next) => {
  
  req.logout((err) => {
    if (err) return next(err);

    // Si no hay req.session (por alguna razón), igual limpiamos la cookie y redirect
    if (!req.session) {
      res.clearCookie("sid");
      return res.redirect(process.env.FRONTEND_URL || "https://araniauy.com");
    }

    req.session.destroy((err) => {
      if (err) {
        // no hacemos fail hard: logueamos y procedemos a limpiar cookie + redirect
        console.error("Error destroying session on logout:", err);
      }

      res.clearCookie("sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return res.redirect(process.env.FRONTEND_URL || "https://araniauy.com");
    });
  });
});

export default router;
