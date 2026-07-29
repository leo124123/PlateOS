import React, { useEffect, useState } from 'react';
import { Info, Clock, User, DollarSign, UtensilsCrossed, X, ChefHat, Timer } from 'lucide-react';
import { TableItem } from '../../../types';

interface TableInfoModalProps {
  table: TableItem;
  onClose: () => void;
}

export const TableInfoModal: React.FC<TableInfoModalProps> = ({ table, onClose }) => {
  const [activeTimerInfo, setActiveTimerInfo] = useState<{ start: number; duration: number } | null>(null);
  const [, setTick] = useState(0);

  // Read synced timer for table's current order from localStorage
  useEffect(() => {
    const updateTimerFromStorage = () => {
      try {
        const raw = localStorage.getItem('plateos_active_timers');
        if (raw) {
          const timers = JSON.parse(raw);
          // Match by orderId if available, or fallback to table active order
          const activeOrder = table.orders && table.orders.length > 0 ? table.orders[0] : null;
          const orderId = activeOrder?.id || table.currentOrderId || table.id;
          
          if (timers[orderId]) {
            setActiveTimerInfo(timers[orderId]);
            return;
          }

          // Fallback check: find any timer matching table ID keys
          const matchedKey = Object.keys(timers).find((k) => k.includes(table.id) || (activeOrder && k.includes(activeOrder.id)));
          if (matchedKey) {
            setActiveTimerInfo(timers[matchedKey]);
            return;
          }
        }
        setActiveTimerInfo(null);
      } catch (e) {}
    };

    updateTimerFromStorage();
    const interval = setInterval(() => {
      updateTimerFromStorage();
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [table]);

  let progressPercent = 0;
  let remainingSeconds = 0;

  if (activeTimerInfo) {
    const elapsedMs = Date.now() - activeTimerInfo.start;
    progressPercent = Math.min(100, Math.round((elapsedMs / activeTimerInfo.duration) * 100));
    remainingSeconds = Math.max(0, Math.round((activeTimerInfo.duration - elapsedMs) / 1000));
  }

  const remMin = Math.floor(remainingSeconds / 60);
  const remSec = remainingSeconds % 60;

  const mockItems = [
    { name: 'Lomo Saltado Gourmet', qty: 2, price: 24.50 },
    { name: 'Ceviche Mixto Tradicional', qty: 1, price: 28.00 },
    { name: 'Pisco Sour Catedral', qty: 3, price: 12.00 },
  ];

  const subtotal = mockItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-700/80 p-6 shadow-2xl bg-slate-900/90 text-white flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Detalle de Mesa #{table.number}</h3>
              <p className="text-xs text-slate-400">Información del estado y comanda activa (Sincronizada)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Summary Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Mozo Asignado
            </span>
            <span className="text-sm font-extrabold text-white">Mozo Mesa #{table.number}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Tiempo Ocupado
            </span>
            <span className="text-sm font-extrabold text-amber-300">35 min</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Consumo Total
            </span>
            <span className="text-sm font-extrabold text-emerald-400">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* ── KITCHEN PREPARATION TIMER & PROGRESS BAR FOR WAITERS ── */}
        {table.status !== 'AVAILABLE' && (
          activeTimerInfo ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col gap-2 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-amber-400 flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-amber-500 animate-bounce" />
                  Cocina: En Preparación ({activeTimerInfo.duration / 60000}m)
                </span>
                <div className="px-3 py-1 rounded-xl bg-slate-900 border border-amber-500/40 shadow-md shadow-amber-500/10 flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tiempo Restante:</span>
                  <span className="text-xs font-black font-mono tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    {remMin}:{remSec < 10 ? `0${remSec}` : remSec}
                  </span>
                </div>
              </div>

              {/* Waiter Synchronized Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-4 p-0.5 border border-slate-800 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[9px] font-black text-slate-950 shadow-md shadow-amber-500/30"
                  style={{ width: `${progressPercent}%` }}
                >
                  {progressPercent}%
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 animate-pulse" /> Esperando que el Cocinero asigne tiempo e inicie...
              </span>
              <p className="text-[10px] text-slate-500 mt-1">El tiempo de cocción sincronizado aparecerá cuando el Chef presione Iniciar.</p>
            </div>
          )
        )}

        {/* Active Items List */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <UtensilsCrossed className="w-4 h-4 text-cyan-400" />
            Ítems en Comanda Activa:
          </span>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2 max-h-44 overflow-y-auto">
            {table.status === 'AVAILABLE' ? (
              <div className="text-center py-6 text-slate-500 text-xs font-bold">
                Mesa disponible — No hay consumo registrado.
              </div>
            ) : (
              mockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-cyan-950 text-cyan-400 font-black flex items-center justify-center text-[11px]">
                      {item.qty}x
                    </span>
                    <span className="font-bold text-slate-200">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-300">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-white transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
