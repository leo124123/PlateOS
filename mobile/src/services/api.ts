import axios from 'axios';
import Constants from 'expo-constants';

// Get the server host from Expo's hostUri (Metro bundler IP)
// This is the most reliable way since the phone is already talking to this IP
const getServerHost = (): string => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    console.log('[PlateOS API] Detected Metro host IP:', ip);
    return `http://${ip}:3000`;
  }
  // Fallback to hardcoded LAN IP
  console.log('[PlateOS API] Using fallback IP: 192.168.100.150');
  return 'http://192.168.100.150:3000';
};

const SERVER_HOST = getServerHost();

console.log('[PlateOS API] Server URL:', `${SERVER_HOST}/api`);

export const API_BASE_URL = `${SERVER_HOST}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default api;
