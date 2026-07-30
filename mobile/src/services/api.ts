import axios from 'axios';
import { Platform } from 'react-native';

// Standard fallback host IP for Expo Go / physical dev devices
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_BASE_URL = `${DEFAULT_HOST}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
