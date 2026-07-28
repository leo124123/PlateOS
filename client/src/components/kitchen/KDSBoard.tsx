import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order } from '../../types';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export const KDSBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  const fetchKitchenOrders = async () => {
    try {
      const res = await api.get('/orders/kitchen');
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error cargando pedidos de cocina', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();

    if (socket) {
      socket.on('kitchen:order_new', (newOrder: Order) => {
        setOrders((prev) => [...prev, newOrder]);
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(() => {});
        } catch (e) {}
      });
    }

    const interval = setInterval(fetchKitchenOrders, 10000);
    return () => clearInterval(interval);
  }, [socket]);

  const handleMarkAsReady = async (order: Order) => {
    try {
      await api.patch(`/orders/${order.id}/status`, { status: 'READY_FOR_DELIVERY' });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));

      if (socket) {
        socket.emit('order:ready', {
          orderId: order.id,
          tableNumber: order.table?.number || 0,
          waiterId: order.waiterId,
        });
      }
    } catch (error) {
      console.error('Error al actualizar estado', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-950 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <ChefHat className="text-amber-500 w-9 h-9" /> Pantalla de Cocina (KDS)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comandas activas enviadas por los meseros en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl text-xs font-bold text-emerald-400 border border-emerald-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Comandas Activas: {orders.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Cargando pedidos de cocina...
        </div>
      ) : orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 glass-panel rounded-3xl p-12 text-center">
          <ChefHat className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-300">¡Cocina al día!</h3>
          <p className="text-xs text-slate-500 mt-1">No hay comandas pendientes de preparación en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => {
            const elapsedMinutes = Math.floor(
              (new Date().getTime() - new Date(order.createdAt).getTime()) / 60000
            );

            return (
              <div
                key={order.id}
                className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Mesa {order.table?.number || '?'}
                      </span>
                      <h3 className="font-bold text-lg text-white mt-1">
                        Pedido #{order.orderNumber}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsedMinutes} min</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-2">
                    <span>Mesero: <b>{order.waiter?.name || 'Asignado'}</b></span>
                    {order.customerName && (
                      <div className="text-slate-300 font-semibold mt-0.5">
                        Cliente: {order.customerName}
                      </div>
                    )}
                  </div>

                  {order.notes && (
                    <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{order.notes}</span>
                    </div>
                  )}

                  <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                            {item.quantity}
                          </span>
                          <span className="font-bold text-white">{item.menuItem?.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {item.menuItem?.prepTimeMinutes || 15}m prep
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleMarkAsReady(order)}
                  className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Marcar Platillo Listo
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
