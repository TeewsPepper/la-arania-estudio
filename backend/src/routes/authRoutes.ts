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
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  handleAuthRedirect // ← Redirige según rol usando authController
);

// Ruta para obtener usuario actual
router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  res.json(req.user);
});

// Ruta de logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    // Redirige a frontend según entorno
    const FRONTEND_URL = process.env.FRONTEND_URL!;
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.redirect(FRONTEND_URL);
  });
});

export default router;
