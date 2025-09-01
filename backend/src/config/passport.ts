import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const nombre = profile.displayName;

        if (!email) {
          return done(new Error("Google no proporcionó un email"), undefined);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({ nombre, email, role: "user" });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err as any, undefined);
      }
    }
  )
);

export default passport;
