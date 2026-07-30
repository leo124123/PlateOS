import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-restaurant-production-2026';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const setupSocketHandlers = (io: SocketIOServer) => {
  // Socket.io Middleware for Connection Authentication
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      // In development mode, allow anonymous sockets with fallback role
      socket.user = { id: 'anonymous', email: 'guest@plateos.com', name: 'Invitado', role: 'WAITER' };
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedSocket['user'];
      socket.user = decoded;
      next();
    } catch (err) {
      logger.warn(`⚠️ Intento de conexión WebSocket rechazada: Token inválido desde ${socket.id}`);
      next(new Error('Autenticación de WebSocket fallida. Token inválido.'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`🔌 Cliente WebSocket autenticado conectado: ${socket.id} (Usuario: ${socket.user?.name || 'Invitado'}, Rol: ${socket.user?.role})`);

    // Join role room (e.g. 'kitchen', 'waiters', 'admins')
    socket.on('join:room', (room: string) => {
      socket.join(room);
      logger.info(`Cliente ${socket.id} (${socket.user?.name}) se unió a la sala: ${room}`);
    });

    // 1. Order created by Waiter -> Notify Kitchen & All
    socket.on('order:new', (orderData: any) => {
      logger.info(`⚡ Nuevo pedido #${orderData.orderNumber} para Mesa ${orderData.table?.number}`);
      io.to('kitchen').emit('kitchen:order_new', orderData);
      io.emit('table:updated', { tableId: orderData.tableId, status: 'ORDER_PENDING' });
    });

    // 2. Kitchen marks order as READY_FOR_DELIVERY -> Notify Waiter & All
    socket.on('order:ready', (payload: { orderId: string; tableNumber: number; tableId?: string; waiterId?: string }) => {
      logger.info(`🔔 ¡PEDIDO LISTO EN COCINA! Mesa #${payload.tableNumber}`);
      io.emit('waiter:order_ready_alert', {
        message: `¡El pedido de la Mesa ${payload.tableNumber} está LISTO para servir!`,
        tableNumber: payload.tableNumber,
        tableId: payload.tableId,
        orderId: payload.orderId,
        waiterId: payload.waiterId,
        timestamp: new Date(),
      });
      io.emit('table:updated', { tableId: payload.tableId });
      io.emit('order:status_changed', { orderId: payload.orderId, status: 'READY_FOR_DELIVERY' });
    });

    // 3. Order served by Waiter -> Notify All
    socket.on('order:served', (payload: { orderId: string; tableId?: string; tableNumber?: number }) => {
      logger.info(`🚚 Pedido #${payload.orderId} entregado por el mesero.`);
      io.emit('table:updated', { tableId: payload.tableId });
      io.emit('order:status_changed', { orderId: payload.orderId, status: 'SERVED' });
    });

    // 3. Status change update
    socket.on('table:change_status', (data: { tableId: string; status: string; currentOrderId?: string }) => {
      io.emit('table:status_changed', data);
    });

    // 4. Customer calling waiter alert animation trigger
    socket.on('customer:call_waiter', (data: { tableNumber: number; tableId: string }) => {
      logger.info(`🕺 Mesa ${data.tableNumber} solicitando atención del mesero.`);
      io.emit('waiter:customer_calling', data);
    });

    socket.on('disconnect', () => {
      logger.info(`❌ Cliente WebSocket desconectado: ${socket.id}`);
    });
  });
};
