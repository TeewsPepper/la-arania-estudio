import express from "express";
import passport from "../config/passport";

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
  (req, res) => {
    // Redirigir según el rol
    if ((req.user as any)?.role === "admin") {
      res.redirect(process.env.FRONTEND_URL + "/admin");
    } else {
      res.redirect(process.env.FRONTEND_URL + "/perfil");
    }
  }
);

// Ruta para obtener usuario actual
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(req.user);
});

// Ruta de logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL as string);
  });
});

export default router;