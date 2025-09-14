// backend/src/controllers/authController.ts
import { Profile } from "passport-google-oauth20";
import { Request, Response } from "express";
import User, { IUserDocument } from "../models/User";


export const findOrCreateUser = async (profile: Profile): Promise<IUserDocument> => {
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName || "Usuario";
  const avatar = profile.photos?.[0]?.value;

  if (!email) throw new Error("Email is required");

  // Primero buscar por googleId
  let user = await User.findOne({ googleId: profile.id });
  if (user) return user;

  // Buscar por email
  user = await User.findOne({ email });
  if (user) {
    user.googleId = profile.id;
    user.avatar = avatar;
    await user.save();
    return user;
  }

  // Crear nuevo usuario
  const isAdmin = email === process.env.ADMIN_EMAIL;
  user = await User.create({
    googleId: profile.id,
    name,
    email,
    avatar,
    role: isAdmin ? "admin" : "user",
  });

  return user;
};

export const handleAuthRedirect = (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  // ✅ Type assertion temporal
  const user = req.user as any;
  
  const userData = encodeURIComponent(JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,      // ✅ Ahora no hay error de TypeScript
    role: user.role
  }));

  const target = user.role === "admin" ? "/admin" : "/perfil";
  const redirectUrl = `${process.env.FRONTEND_URL}${target}?authSuccess=true&user=${userData}`;
  
  return res.redirect(redirectUrl);
};
