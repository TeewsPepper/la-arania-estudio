
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
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL as string);
  });
});

export default router;
