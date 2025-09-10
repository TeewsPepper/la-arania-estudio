import { RequestHandler } from 'express';
import UserModel, { IUserDocument } from '../models/User';
import { AuthRequest } from '../types';

// Middleware para usuarios autenticados
export const authenticateUser: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) return res.status(401).json({ error: 'No autenticado' });
  next();
};

// Middleware para admin
export const authenticateAdmin: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) return res.status(401).json({ error: 'No autenticado' });

  const user: IUserDocument | null = await UserModel.findById(authReq.user.id);

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (user.role !== 'admin') {
    return res
      .status(403)
      .json({ error: 'Acceso no autorizado. Se requiere rol de administrador' });
  }

  next();
};