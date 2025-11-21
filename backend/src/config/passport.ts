/* // backend/src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, { IUserDocument } from "../models/User";
import { findOrCreateUser } from "../controllers/authController";
import { Types } from "mongoose";

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
        const user: IUserDocument = await findOrCreateUser(profile);

        // 🔹 Creamos payload seguro para Express.Request.user
        const payload = {
          id: user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id),
          email: user.email,
          name: user.name,
          role: user.role as "user" | "admin",
          horasAcumuladas: user.horasAcumuladas || 0,
        };

        done(null, payload);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);

// 🔹 Serializar usuario (guardar solo el id en la sesión)
passport.serializeUser((user: Express.User, done) => {
  console.log('[passport] serializeUser:', user);
  done(null, user.id);
});

// 🔹 Deserializar usuario (buscar en DB y devolver payload limpio)
passport.deserializeUser(async (id: string, done) => {
  console.log('[passport] deserializeUser id:', id);
  try {
    const user = await User.findById(id);
    console.log('[passport] deserialized user from DB:', !!user);
    if (!user) return done(null, false);

    const payload: Express.UserPayload = {
      id: user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id),
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
      horasAcumuladas: user.horasAcumuladas || 0,
    };

    done(null, payload);
  } catch (err) {
    done(err as Error, undefined);
  }
});

export default passport;
 */
// backend/src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, { IUserDocument } from "../models/User";
import { findOrCreateUser } from "../controllers/authController";
import { Types } from "mongoose";

// 🔹 Cache para deserializeUser (evita consultas duplicadas)
const deserializeCache = new Map();
const CACHE_TTL = 10000; // 10 segundos

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
        console.log('🔐 Google Strategy - Profile:', profile.emails?.[0]?.value);
        
        const user: IUserDocument = await findOrCreateUser(profile);

        // 🔹 Creamos payload seguro para Express.Request.user
        const payload = {
          id: user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id),
          email: user.email,
          name: user.name,
          role: user.role as "user" | "admin",
          horasAcumuladas: user.horasAcumuladas || 0,
        };

        console.log('✅ Google Strategy - User authenticated:', payload.email);
        done(null, payload);
      } catch (err) {
        console.error('❌ Google Strategy - Error:', err);
        done(err as Error, undefined);
      }
    }
  )
);

// 🔹 Serializar usuario (guardar solo el id en la sesión)
passport.serializeUser((user: any, done) => {
  console.log('🔐 serializeUser - ID:', user.id, 'Email:', user.email);
  done(null, user.id);
});

// 🔹 Deserializar usuario OPTIMIZADO
passport.deserializeUser(async (id: string, done) => {
  console.log('🔐 deserializeUser llamado - ID:', id);
  
  const startTime = Date.now();
  
  try {
    // ⭐ CACHE: Evita consultas duplicadas en requests simultáneos
    if (deserializeCache.has(id)) {
      console.log('⚡ deserializeUser - Usuario desde CACHE');
      return done(null, deserializeCache.get(id));
    }

    const user = await User.findById(id);
    
    if (!user) {
      console.log('❌ deserializeUser - Usuario no encontrado');
      return done(null, false);
    }

    const payload = {
      id: user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id),
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
      horasAcumuladas: user.horasAcumuladas || 0,
    };

    // ⭐ Guardar en cache temporalmente
    deserializeCache.set(id, payload);
    setTimeout(() => deserializeCache.delete(id), CACHE_TTL);

    const duration = Date.now() - startTime;
    console.log(`✅ deserializeUser COMPLETADO - ${user.email} en ${duration}ms`);

    done(null, payload);
  } catch (err) {
    console.error('💥 deserializeUser - ERROR:', err);
    done(err as Error, undefined);
  }
});

export default passport;