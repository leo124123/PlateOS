import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import logger from './config/logger.js';
import { setupSocketHandlers } from './sockets/socketHandler.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Attach Socket.io with production CORS options
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
  transports: ['websocket', 'polling'],
});

setupSocketHandlers(io);

server.listen(PORT, () => {
  logger.info(`🚀 Servidor de PlateOS (Backend Producción) iniciado en http://localhost:${PORT}`);
  logger.info(`⚡ Socket.io WebSockets activos para sincronización en tiempo real.`);
});

// Graceful Shutdown handling for production scaling (K8s, Docker, PM2)
const shutdown = (signal: string) => {
  logger.info(`⚠️ Señal ${signal} recibida. Cerrando conexiones del servidor...`);
  server.close(() => {
    logger.info('🛑 Servidor HTTP y WebSockets cerrados correctamente.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
