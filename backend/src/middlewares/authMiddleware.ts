// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  role: "user" | "admin";
}

// Middleware para verificar que el usuario esté autenticado
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "No autenticado" });
  }
  next();
};

// Middleware para verificar que el usuario tenga rol de admin
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as AuthUser | undefined;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "No autorizado" });
  }

  next();
};
