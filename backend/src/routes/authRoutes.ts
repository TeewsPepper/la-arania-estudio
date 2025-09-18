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
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  res.json(req.user);
});

// Ruta de logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    const FRONTEND_URL = process.env.FRONTEND_URL!;
    res.clearCookie("sid", { // coincide con name de session
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: ".araniauy.com"
    });
    res.redirect(FRONTEND_URL);
  });
});

export default router;
