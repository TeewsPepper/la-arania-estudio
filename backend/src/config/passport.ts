// backend/src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUserDocument } from "../models/User"; // ← Importar el tipo
import dotenv from "dotenv";

dotenv.config();

// backend/src/config/passport.ts
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(
          "Google profile received:",
          JSON.stringify(profile, null, 2)
        );

        if (!User) {
          return done(new Error("User model is not defined"), undefined);
        }

        const email = profile.emails?.[0]?.value;
        const name =
          profile.displayName ||
          `${profile.name?.givenName || ""} ${
            profile.name?.familyName || ""
          }`.trim() ||
          "Usuario";

        if (!email) {
          return done(
            new Error("Email is required from Google profile"),
            undefined
          );
        }

        // ✅ PRIMERO buscar por googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log("User found by googleId:", user);
          return done(null, user);
        }

        // ✅ SINO buscar por email
        user = await User.findOne({ email });

        if (user) {
          console.log("User found by email:", user);

          // ✅ ACTUALIZACIÓN SEGURA - Usar findOneAndUpdate
          const updatedUser = (await User.findOneAndUpdate(
            { _id: user._id },
            {
              $set: {
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          )) as IUserDocument;

          // ✅ Verificar que updatedUser no sea null
          if (!updatedUser) {
            return done(new Error("Failed to update user"), undefined);
          }

          console.log("User updated:", updatedUser);
          return done(null, updatedUser);
        }

        // ✅ FINALMENTE crear nuevo usuario si no existe
        user = await User.create({
          googleId: profile.id,
          name: name,
          email: email,
          avatar: profile.photos?.[0]?.value,
          role: "user",
        });

        console.log("New user created:", user);
        return done(null, user);
      } catch (error) {
        console.error("Error in GoogleStrategy:", error);
        return done(error as Error, undefined);
      }
    }
  )
);

// Serializar usuario
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserializar usuario
passport.deserializeUser(async (id: string, done) => {
  try {
    if (!User) {
      return done(new Error("User model is not defined"), null);
    }

    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
