import React from 'react';
import {
  CreditCard,
  Utensils,
  RefreshCw,
  Users,
  Bell,
  UserCheck,
  Info,
  DollarSign,
  Scissors,
  Trash2,
  BookOpen
} from 'lucide-react';
import { useRestaurantStore } from '../../store/useRestaurantStore';

interface POSBottomToolbarProps {
  onOpenOrderModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenLoginModal: () => void;
}

export const POSBottomToolbar: React.FC<POSBottomToolbarProps> = ({
  onOpenOrderModal,
  onOpenPaymentModal,
  onOpenLoginModal,
}) => {
  const { selectedTable } = useRestaurantStore();

  return (
    <div className="w-full bg-slate-900 border-t-2 border-slate-700 p-2 px-3 flex items-center justify-between gap-2 shadow-2xl z-20">
      {/* Table Status Summary */}
      <div className="flex items-center gap-3 pr-3 border-r border-slate-700 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
            Mesa Seleccionada
          </span>
          <span className="text-sm font-black text-amber-400">
            {selectedTable ? `Mesa #${selectedTable.number} (${selectedTable.status})` : 'Ninguna'}
          </span>
        </div>
      </div>

      {/* POS Action Buttons Bar (Estilo BeatlePOS / ICG Software) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
        <button
          onClick={onOpenOrderModal}
          disabled={!selectedTable}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-md border border-blue-400"
        >
          <Utensils className="w-4 h-4 text-white" />
          Nueva Comanda
        </button>

        <button
          onClick={onOpenPaymentModal}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex flex-col items-center justify-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-lg border border-emerald-400"
        >
          <CreditCard className="w-4 h-4 text-emerald-200" />
          Cobrar
        </button>

        <button
          onClick={() => alert('Función: Visualizar Subtotal de la Mesa')}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-black uppercase transition-all disabled:opacity-40 shrink-0 border border-teal-400"
        >
          <DollarSign className="w-4 h-4 text-teal-200" />
          Subtotal
        </button>

        <button
          onClick={() => alert('Función: Cambiar / Mover Mesa')}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase transition-all disabled:opacity-40 shrink-0 border border-indigo-400"
        >
          <RefreshCw className="w-4 h-4 text-indigo-200" />
          Cambiar Mesa
        </button>

        <button
          onClick={() => alert('Función: Fraccionar / Split de Cuenta')}
          disabled={!selectedTable}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black uppercase transition-all disabled:opacity-40 shrink-0 border border-purple-400"
        >
          <Scissors className="w-4 h-4 text-purple-200" />
          Fraccionar
        </button>

        <button
          onClick={onOpenLoginModal}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black uppercase transition-all shrink-0 border border-amber-400"
        >
          <UserCheck className="w-4 h-4 text-amber-200" />
          Cambiar Vendedor
        </button>

        <button
          onClick={() => alert('🔔 Notificación de marcha enviada a cocina')}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black uppercase transition-all disabled:opacity-40 shrink-0 border border-rose-400"
        >
          <Bell className="w-4 h-4 text-rose-200" />
          Marchar Orden
        </button>

        <button
          onClick={() => alert('Función: Limpiar selección de mesa')}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-black uppercase transition-all shrink-0 border border-slate-500"
        >
          <Trash2 className="w-4 h-4 text-slate-300" />
          Limpiar
        </button>

        <button
          onClick={() => alert('Información del sistema POS: Versión BeatlePOS 3D')}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-[11px] font-black uppercase transition-all shrink-0 border border-cyan-500"
        >
          <Info className="w-4 h-4 text-cyan-200" />
          Info Mesa
        </button>

        <button
          onClick={onOpenOrderModal}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-black uppercase transition-all shrink-0 border border-amber-500/40"
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          Menú
        </button>
      </div>
    </div>
  );
};
