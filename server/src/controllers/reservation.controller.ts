import { Request, Response } from 'express';
import { ReservationService } from '../services/reservation.service.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { asyncWrap } from '../utils/asyncWrap.js';

export const createReservation = asyncWrap(async (req: Request, res: Response) => {
  const result = await ReservationService.createReservation(req.body);
  return sendSuccess(res, result, 'Reserva registrada exitosamente', 201);
});

export const getReservations = asyncWrap(async (_req: Request, res: Response) => {
  const list = await ReservationService.getReservations();
  return sendSuccess(res, list, 'Lista de reservas obtenida');
});

export const updateReservationStatus = asyncWrap(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminMessage } = req.body;
  const result = await ReservationService.updateReservationStatus(id, status, adminMessage);
  return sendSuccess(res, result, 'Estado de reserva actualizado');
});
