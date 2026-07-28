import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  logger.error(`💥 API Error [${req.method} ${req.url}]: ${message}`, {
    stack: err.stack,
    body: req.body,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
