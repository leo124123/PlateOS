import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { sendError } from '../utils/responseHandler.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
    pinCode?: string | null;
  };
}

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Acceso denegado. No se proporcionó token de autenticación.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-restaurant-production-2026';
    const decoded = jwt.verify(token, secret) as AuthenticatedRequest['user'];
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Token inválido o expirado.', 401);
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Usuario no autenticado.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Acceso no autorizado. Se requiere rol: ${roles.join(', ')}`,
        403
      );
    }
    next();
  };
};
