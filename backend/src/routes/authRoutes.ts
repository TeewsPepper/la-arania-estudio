// src/routes/authRoutes.ts
import { Router } from "express";
import passport from "passport";
import { AuthUser } from "../middlewares/authMiddleware";

const router = Router();

// 👉 Login con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 👉 Callback después del login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login", // redirige al login si falla
    successRedirect: "http://localhost:5173/perfil", // redirige al perfil si OK
  })
);

// 👉 Logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("http://localhost:5173/"); // vuelve al home
  });
});

// 👉 Obtener usuario actual
router.get("/me", (req, res) => {
  const user = req.user as AuthUser | undefined;

  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  res.json(user);
});

export default router;
