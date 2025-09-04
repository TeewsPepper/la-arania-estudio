import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    
    // Verificar si el usuario es admin
    const user = await User.findById((req.user as any)._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Acceso no autorizado. Se requiere rol de administrador" });
    }
    
    next();
  } catch (error) {
    console.error("Error en middleware authenticateAdmin:", error);
    res.status(500).json({ error: "Error de servidor" });
  }
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Error de servidor" });
  }
};