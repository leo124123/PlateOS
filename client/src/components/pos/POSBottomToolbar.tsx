import React from 'react';
import {
  CreditCard,
  Utensils,
  RefreshCw,
  UserCheck,
  Info,
  DollarSign,
  Scissors,
  Trash2,
  BookOpen,
  BellRing,
  Sparkles,
  Layers
} from 'lucide-react';
import { useRestaurantStore } from '../../store/useRestaurantStore';

interface POSBottomToolbarProps {
  onOpenOrderModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenLoginModal: () => void;
  onOpenTransferModal: () => void;
  onOpenSplitModal: () => void;
  onOpenInfoModal: () => void;
  onOpenSubtotalModal: () => void;
}

export const POSBottomToolbar: React.FC<POSBottomToolbarProps> = ({
  onOpenOrderModal,
  onOpenPaymentModal,
  onOpenLoginModal,
  onOpenTransferModal,
  onOpenSplitModal,
  onOpenInfoModal,
  onOpenSubtotalModal,
}) => {
  const { selectedTable, setSelectedTable } = useRestaurantStore();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ORDER_PENDING':
        return { label: 'Comanda', color: 'bg-amber-500 text-black' };
      case 'EATING':
      case 'OCCUPIED':
        return { label: 'Ocupada', color: 'bg-red-500 text-white' };
      case 'BILL_REQUESTED':
        return { label: 'Cuenta', color: 'bg-yellow-400 text-black' };
      case 'CLEANING':
        return { label: 'Limpieza', color: 'bg-purple-500 text-white' };
      case 'AVAILABLE':
        return { label: 'Libre', color: 'bg-emerald-500 text-white' };
      default:
        return { label: 'Ninguna', color: 'bg-slate-700 text-slate-300' };
    }
  };

  const badge = getStatusBadge(selectedTable?.status);

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/80 p-2 px-3 flex items-center justify-between gap-3 shadow-2xl z-20 select-none">
      {/* ── 1. SELECTED TABLE STATUS CARD ── */}
      <div className="flex items-center gap-3 pr-3 border-r border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5 p-1.5 px-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-lg">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1">
              Mesa Seleccionada
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-amber-400 tracking-tight">
                {selectedTable ? `Mesa #${selectedTable.number}` : 'Ninguna'}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. POS ACTION BUTTONS BAR (Version 2 Suite) ── */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {/* PRIMARY ACTIONS */}
        <button
          onClick={onOpenOrderModal}
          disabled={!selectedTable}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-lg shadow-blue-600/30 border border-blue-400/40"
        >
          <Utensils className="w-4 h-4 text-white animate-pulse" />
          Nueva Comanda
        </button>

        <button
          onClick={onOpenPaymentModal}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-lg shadow-emerald-600/30 border border-emerald-400/40"
        >
          <CreditCard className="w-4 h-4 text-emerald-200" />
          Cobrar
        </button>

        {/* SECONDARY POS ACTIONS */}
        <button
          onClick={onOpenSubtotalModal}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-950/80 hover:bg-teal-900/80 text-teal-300 text-xs font-black uppercase tracking-wide transition-all hover:scale-105 disabled:opacity-40 shrink-0 border border-teal-500/40 shadow-md"
        >
          <DollarSign className="w-3.5 h-3.5 text-teal-400" />
          Subtotal
        </button>

        <button
          onClick={onOpenTransferModal}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 text-xs font-black uppercase tracking-wide transition-all hover:scale-105 disabled:opacity-40 shrink-0 border border-indigo-500/40 shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          Cambiar Mesa
        </button>

        <button
          onClick={onOpenSplitModal}
          disabled={!selectedTable}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 text-xs font-black uppercase tracking-wide transition-all hover:scale-105 disabled:opacity-40 shrink-0 border border-purple-500/40 shadow-md"
        >
          <Scissors className="w-3.5 h-3.5 text-purple-400" />
          Fraccionar
        </button>

        <button
          onClick={onOpenLoginModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black uppercase tracking-wide transition-all hover:scale-105 shrink-0 border border-amber-400/50 shadow-md"
        >
          <UserCheck className="w-4 h-4 text-amber-200" />
          Cambiar Vendedor
        </button>

        <button
          onClick={() => alert('🔔 ¡Orden marchada a cocina con éxito!')}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 text-xs font-black uppercase tracking-wide transition-all hover:scale-105 disabled:opacity-40 shrink-0 border border-rose-500/40 shadow-md"
        >
          <BellRing className="w-3.5 h-3.5 text-rose-400" />
          Marchar Orden
        </button>

        {/* UTILITY ACTIONS */}
        <button
          onClick={() => setSelectedTable(null)}
          disabled={!selectedTable}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-black uppercase tracking-wide transition-all disabled:opacity-40 shrink-0 border border-slate-700 shadow-md"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          Limpiar
        </button>

        <button
          onClick={onOpenInfoModal}
          disabled={!selectedTable}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 text-xs font-black uppercase tracking-wide transition-all hover:scale-105 disabled:opacity-40 shrink-0 border border-cyan-500/40 shadow-md"
        >
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Info Mesa
        </button>

        <button
          onClick={onOpenOrderModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-black uppercase tracking-wide transition-all shrink-0 border border-amber-500/40 shadow-md"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          Menú
        </button>
      </div>
    </div>
  );
};
