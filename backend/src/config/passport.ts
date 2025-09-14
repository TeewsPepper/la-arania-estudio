// backend/src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, { IUserDocument } from "../models/User";
import { findOrCreateUser } from "../controllers/authController";
import { Types } from "mongoose";

// 🔹 Callback URL según entorno
const CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? "https://studio-backend-04so.onrender.com/auth/google/callback"
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
