import React from 'react';
import { Info, Clock, User, DollarSign, UtensilsCrossed, X } from 'lucide-react';
import { TableItem } from '../../../types';

interface TableInfoModalProps {
  table: TableItem;
  onClose: () => void;
}

export const TableInfoModal: React.FC<TableInfoModalProps> = ({ table, onClose }) => {
  // Mock table active order items
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
              <p className="text-xs text-slate-400">Información del estado y comanda activa</p>
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
            <span className="text-sm font-extrabold text-white">Carlos (Mesero 1)</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Tiempo Ocupado
            </span>
            <span className="text-sm font-extrabold text-amber-300">42 min</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Consumo Total
            </span>
            <span className="text-sm font-extrabold text-emerald-400">${total.toFixed(2)}</span>
          </div>
        </div>

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
