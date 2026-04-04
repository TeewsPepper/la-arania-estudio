
import express from "express";
import passport from "../config/passport";
import { handleAuthRedirect } from "../controllers/authController";
import rateLimit from 'express-rate-limit';

const router = express.Router();

// 🔒 RATE LIMITING para callbacks de OAuth
const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos de login por 15 minutos
  message: { error: 'Demasiados intentos de login' },
  handler: (req, res) => {
    console.warn(`🚨 RATE LIMIT OAUTH: ${req.ip} - Demasiados intentos de login`);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=too_many_attempts`);
  }
});

// Ruta de inicio de Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback de Google OAuth - MEJORADO
router.get(
  "/google/callback",
  oauthLimiter, // 🔒 PROTECCIÓN AGREGADA
  (req, res, next) => {
    passport.authenticate("google", { session: true }, (err, user, info) => {
      if (err) {
        console.error('❌ Error en auth Google:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }
      
      if (!user) {
        console.log('❌ Google auth falló - usuario no retornado');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
      }

      req.login(user, (err) => {
        if (err) {
          console.error('❌ Error en req.login:', err);
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_error`);
        }

        console.log("✅ Login exitoso:", user.email);
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      console.log(`✅ Logout exitoso para: ${userEmail}`);
      
      // Redirigir al frontend
      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  });
});

export default router;