import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { useRestaurantStore } from '../store/useRestaurantStore';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();
  const { fetchTables, setAlertNotification } = useRestaurantStore();

  useEffect(() => {
    const newSocket = io('/', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      if (user?.role) {
        if (user.role === 'WAITER') newSocket.emit('join:room', 'waiters');
        if (user.role === 'KITCHEN') newSocket.emit('join:room', 'kitchen');
        if (user.role === 'ADMIN') newSocket.emit('join:room', 'admins');
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('table:updated', () => {
      fetchTables();
    });

    newSocket.on('table:status_changed', () => {
      fetchTables();
    });

    newSocket.on('waiter:order_ready_alert', (data) => {
      fetchTables();
      // Only notify Waiters or Admins (Chef/Kitchen does NOT receive this alert)
      if (user?.role === 'WAITER' || user?.role === 'ADMIN') {
        setAlertNotification({
          ...data,
          type: 'ORDER_READY',
        });
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(() => {});
        } catch (e) {}
      }
    });

    newSocket.on('waiter:customer_calling', (data: { tableNumber: number; tableId: string }) => {
      fetchTables();
      if (user?.role === 'WAITER' || user?.role === 'ADMIN') {
        setAlertNotification({
          orderId: '',
          tableId: data.tableId,
          tableNumber: data.tableNumber,
          message: `🔔 ¡Mesa #${data.tableNumber} está llamando al mesero!`,
          type: 'CALL_WAITER',
        });
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(() => {});
        } catch (e) {}
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
