import axios from 'axios';
import Constants from 'expo-constants';

// Auto-detect the dev machine's local IP from Expo's manifest
// This works on physical devices via Expo Go
const getServerHost = (): string => {
  // In development, Expo provides the host URI used to serve the bundle
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0]; // e.g. "192.168.100.150:8081" -> "192.168.100.150"
    return `http://${ip}:3000`;
  }
  // Fallback
  return 'http://192.168.100.150:3000';
};

const SERVER_HOST = getServerHost();

export const API_BASE_URL = `${SERVER_HOST}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
