import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';

// Auto-detect the dev machine's local IP from Expo's manifest
const getServerHost = (): string => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3000`;
  }
  return 'http://192.168.100.150:3000';
};

const SERVER_HOST = getServerHost();

console.log('[PlateOS Socket] Server URL:', SERVER_HOST);

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SERVER_HOST, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
