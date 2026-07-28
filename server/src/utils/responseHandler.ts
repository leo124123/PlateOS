import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any = null,
  message: string = 'Operación exitosa',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = 'Error interno del servidor',
  statusCode: number = 500,
  error: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error || null,
  });
};
