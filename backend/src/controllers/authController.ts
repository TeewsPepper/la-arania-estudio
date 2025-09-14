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

  // ✅ Redirigir a la raíz y pasar datos por query params
  const userData = encodeURIComponent(JSON.stringify({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  }));

  // Redirigir a la raíz y que React Router maneje el routing
  const redirectUrl = `${process.env.FRONTEND_URL}/?authSuccess=true&user=${userData}`;
  
  return res.redirect(redirectUrl);
};
