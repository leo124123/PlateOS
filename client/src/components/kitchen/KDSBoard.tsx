import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, CheckCircle2, AlertCircle, Play, Timer, Sparkles } from 'lucide-react';
import { Order } from '../../types';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export const KDSBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prepTimes, setPrepTimes] = useState<Record<string, number>>({});
  const [activeTimers, setActiveTimers] = useState<Record<string, { start: number; duration: number }>>({});
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

  // Live ticker for preparation progress bars
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSetPrepTime = (orderId: string, minutes: number) => {
    setPrepTimes((prev) => ({ ...prev, [orderId]: minutes }));
  };

  const handleStartPrep = (orderId: string) => {
    const durationMin = prepTimes[orderId] || 15;
    setActiveTimers((prev) => ({
      ...prev,
      [orderId]: { start: Date.now(), duration: durationMin * 60 * 1000 },
    }));

    if (socket) {
      socket.emit('kitchen:prep_started', {
        orderId,
        prepTimeMinutes: durationMin,
      });
    }
  };

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
    <div className="w-full h-full flex flex-col p-6 bg-slate-950 overflow-y-auto select-none">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              <ChefHat className="text-amber-500 w-9 h-9" /> Pantalla de Cocina (KDS)
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold">
              👨‍🍳 Exclusivo para Cocineros
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Los cocineros asignan el tiempo estimado de cocción y notifican al mesero al terminar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-2xl text-xs font-black text-emerald-400 border border-emerald-500/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Comandas Pendientes: {orders.length}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold">
          Cargando pedidos de cocina...
        </div>
      ) : orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 glass-panel rounded-3xl p-12 text-center border border-slate-800">
          <ChefHat className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-black text-slate-300">¡Cocina al día!</h3>
          <p className="text-xs text-slate-500 mt-1">No hay comandas pendientes de preparación en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => {
            const elapsedMinutes = Math.floor(
              (new Date().getTime() - new Date(order.createdAt).getTime()) / 60000
            );

            const timerInfo = activeTimers[order.id];
            let progressPercent = 0;
            let remainingSeconds = 0;

            if (timerInfo) {
              const elapsedMs = Date.now() - timerInfo.start;
              progressPercent = Math.min(100, Math.round((elapsedMs / timerInfo.duration) * 100));
              remainingSeconds = Math.max(0, Math.round((timerInfo.duration - elapsedMs) / 1000));
            }

            const remMin = Math.floor(remainingSeconds / 60);
            const remSec = remainingSeconds % 60;

            const selectedTime = prepTimes[order.id] || 15;

            return (
              <div
                key={order.id}
                className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-2xl group"
              >
                <div>
                  {/* Order Card Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                        Mesa #{order.table?.number || '?'}
                      </span>
                      <h3 className="font-black text-lg text-white mt-1">
                        Pedido #{order.orderNumber}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsedMinutes} min</span>
                    </div>
                  </div>

                  {/* Waiter & Customer Metadata */}
                  <div className="text-xs text-slate-400 mt-2.5">
                    <span>Mozo: <b className="text-slate-200">{order.waiter?.name || 'Asignado'}</b></span>
                    {order.customerName && (
                      <div className="text-slate-300 font-bold mt-0.5">
                        Cliente: {order.customerName}
                      </div>
                    )}
                  </div>

                  {order.notes && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-1.5 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>{order.notes}</span>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="mt-3 space-y-2 max-h-44 overflow-y-auto pr-1">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                            {item.quantity}x
                          </span>
                          <span className="font-bold text-white">{item.menuItem?.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── CHEF PREPARATION TIMER CONTROLS ── */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
                  {!timerInfo ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5 text-amber-400" /> Asignar Tiempo Estimado:
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[10, 15, 20, 30].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => handleSetPrepTime(order.id, mins)}
                            className={`py-1.5 rounded-xl text-xs font-black border transition-all ${
                              selectedTime === mins
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleStartPrep(order.id)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" /> Iniciar Cocción ({selectedTime}m)
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-amber-400 flex items-center gap-1">
                          <Timer className="w-4 h-4 animate-spin-slow" /> En Cocción ({timerInfo.duration / 60000}m)
                        </span>
                        <span className="text-white">
                          Restante: {remMin}:{remSec < 10 ? `0${remSec}` : remSec}
                        </span>
                      </div>

                      {/* Loading Progress Bar */}
                      <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1 text-[9px] font-black text-slate-950 shadow-md shadow-amber-500/30"
                          style={{ width: `${progressPercent}%` }}
                        >
                          {progressPercent}%
                        </div>
                      </div>

                      <button
                        onClick={() => handleMarkAsReady(order)}
                        className="w-full mt-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> ✔ Marcar Listo & Notificar Mozo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
