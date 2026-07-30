import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const loginWithEmail = asyncWrap(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.loginWithEmail(email, password);
  return sendSuccess(res, result, 'Inicio de sesión exitoso');
});

export const loginWithPin = asyncWrap(async (req: Request, res: Response) => {
  const { pinCode } = req.body;
  const result = await AuthService.loginWithPin(pinCode);
  return sendSuccess(res, result, 'Acceso por PIN exitoso');
});

export const getMe = asyncWrap(async (req: any, res: Response) => {
  return sendSuccess(res, req.user || null, 'Perfil de usuario obtenido');
});

export const getWaiters = asyncWrap(async (_req: Request, res: Response) => {
  const waiters = await AuthService.getWaiters();
  return sendSuccess(res, waiters, 'Lista de meseros obtenida');
});
