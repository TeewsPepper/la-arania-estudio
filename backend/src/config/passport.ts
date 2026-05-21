
// backend/src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, { IUserDocument } from "../models/User";
import { findOrCreateUser } from "../controllers/authController";
import { Types } from "mongoose";

// 🔹 Cache simple para deserializeUser
const userCache = new Map<string, Express.UserPayload>();
const CACHE_TTL = 5000; // 5 segundos

// 🔹 Callback URL según entorno
const CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? "https://araniauy.com/auth/google/callback"
    : "http://localhost:4000/auth/google/callback";

// 🔹 Estrategia Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        console.log(`🔐 [Passport] Google OAuth para: ${profile.emails?.[0]?.value}`);
        
        const user: IUserDocument = await findOrCreateUser(profile);

        // 🔹 Creamos payload seguro para Express.Request.user
        const payload = {
          id: user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id),
          email: user.email,
          name: user.name,
          role: user.role as "user" | "admin",
          horasAcumuladas: user.horasAcumuladas || 0,
        };

        console.log(`✅ [Passport] Login exitoso: ${user.email}`);
        done(null, payload);
      } catch (err) {
        console.error('❌ [Passport] Error en GoogleStrategy:', err);
        done(err as Error, undefined);
      }
    }
  )
);

// 🔹 Serializar usuario (guardar solo el id en la sesión)
passport.serializeUser((user: Express.User, done) => {
  console.log('[passport] serializeUser:', user.email || user.id);
  done(null, user.id);
});

// 🔹 Deserializar usuario CON CACHE Y LOGS MEJORADOS
passport.deserializeUser(async (id: string, done) => {
  // ⭐ CACHE CHECK - Evitar DB calls duplicados
  if (userCache.has(id)) {
    const cachedUser = userCache.get(id);
    console.log(`⚡ [Passport] deserializeUser CACHE HIT: ${cachedUser?.email}`);
    return done(null, cachedUser);
  }

  console.log(`🔍 [Passport] deserializeUser DB CALL: ${id}`);
  
  try {
    const user = await User.findById(id);
    
    if (!user) {
      console.log(`❌ [Passport] Usuario no encontrado: ${id}`);
      return done(null, false);
    }

    const payload: Express.UserPayload = {
      id: user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id),
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
      horasAcumuladas: user.horasAcumuladas || 0,
    };

    // ⭐ GUARDAR EN CACHE
    userCache.set(id, payload);
    
    // ⭐ LIMPIAR CACHE después de TTL
    setTimeout(() => {
      userCache.delete(id);
    }, CACHE_TTL);

    console.log(`✅ [Passport] User deserialized: ${user.email}`);
    done(null, payload);
  } catch (err) {
    console.error('❌ [Passport] Error en deserializeUser:', err);
    done(err as Error, undefined);
  }
});

// ⭐ LIMPIAR CACHE periódicamente (opcional)
setInterval(() => {
  const now = Date.now();
  // Podrías agregar timestamp a cada cache entry para limpieza más precisa
  if (userCache.size > 50) {
    userCache.clear();
    console.log('🧹 [Passport] Cache limpiado');
  }
}, 60000); // Cada minuto

export default passport;