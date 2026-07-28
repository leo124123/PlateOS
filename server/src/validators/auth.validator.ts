import { z } from 'zod';

export const loginEmailSchema = z.object({
  email: z.string().email('Formato de correo electrónico inválido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export const loginPinSchema = z.object({
  pinCode: z.string().min(4, 'El código PIN debe tener al menos 4 dígitos'),
});

export const registerUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Formato de correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  pinCode: z.string().optional(),
  role: z.enum(['ADMIN', 'WAITER', 'KITCHEN', 'CASHIER']).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});
