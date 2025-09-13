/* // backend/src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/User";
import { findOrCreateUser } from "../controllers/authController";



// 🔹 Estrategia Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:  "https://studio-backend-04so.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        const user = await findOrCreateUser(profile);

        const payload: Express.UserPayload = {
          id: (user._id as string).toString(), 
          email: user.email,
          role: user.role,
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
  done(null, (user as Express.UserPayload).id);
});

// 🔹 Deserializar usuario (buscar en DB y devolver payload limpio)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    if (!user) return done(null, false);

    const payload: Express.UserPayload = {
  id: (user._id as string).toString(), 
  email: user.email,
  role: user.role,
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
import User from "../models/User";
import { findOrCreateUser } from "../controllers/authController";

// 🔹 Definir callbackURL según entorno
const CALLBACK_URL = process.env.NODE_ENV === "production"
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
        const user = await findOrCreateUser(profile);

        const payload: Express.UserPayload = {
          id: (user._id as string).toString(),
          email: user.email,
          role: user.role,
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
  done(null, (user as Express.UserPayload).id);
});

// 🔹 Deserializar usuario (buscar en DB y devolver payload limpio)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    if (!user) return done(null, false);

    const payload: Express.UserPayload = {
      id: (user._id as string).toString(),
      email: user.email,
      role: user.role,
      horasAcumuladas: user.horasAcumuladas || 0,
    };

    done(null, payload);
  } catch (err) {
    done(err as Error, undefined);
  }
});

export default passport;
