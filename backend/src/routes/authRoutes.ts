/* // backend/src/routes/authRoutes.ts

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
    res.clearCookie("sid");
    res.redirect("https://araniauy.com");
  });
});

export default router;
 */
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

      req.login(user, (err) => {
        if (err) return next(err);

        console.log("✅ Login exitoso:", req.user);
        return handleAuthRedirect(req, res);
      });
    })(req, res, next);
  }
);

// Ruta para obtener usuario actual - CORREGIDA
router.get("/me", (req, res) => {
  console.log("🔍 /auth/me llamado - usuario:", req.user ? req.user.email : "no autenticado");
  
  if (!req.isAuthenticated()) {
    return res.status(200).json({ user: null }); // ⭐ SIEMPRE 200 con {user: null}
  }
  
  res.json({ user: req.user }); // ⭐ {user: {...}}
});

// ⭐⭐ LOGOUT MEJORADO
router.get("/logout", (req, res, next) => {
  const userEmail = req.user?.email;
  console.log(`🔍 Logout solicitado para: ${userEmail}`);
  
  if (!req.user) {
    console.log("⚠️  Logout llamado sin usuario autenticado");
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }

  req.logout((err) => {
    if (err) {
      console.error('❌ Error en logout:', err);
      return next(err);
    }
    
    // Destruir sesión completamente
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('❌ Error destruyendo sesión:', destroyErr);
      }
      
      // Limpiar cookie
      res.clearCookie("sid", {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      
      console.log(`✅ Logout exitoso para: ${userEmail}`);
      
      // Redirigir al frontend
      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  });
});

export default router;