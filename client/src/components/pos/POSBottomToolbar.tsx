import React from 'react';
import { CreditCard, Utensils, RefreshCw, Users, Bell, UserCheck, Info, FileText } from 'lucide-react';
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
    <div className="w-full bg-slate-900/95 border-t border-slate-800 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl backdrop-blur-xl z-20">
      {/* Table Status Summary */}
      <div className="flex items-center gap-3 pr-4 border-r border-slate-800 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
            Mesa Seleccionada
          </span>
          <span className="text-sm font-extrabold text-amber-400">
            {selectedTable ? `Mesa #${selectedTable.number} (${selectedTable.status})` : 'Ninguna Mesa Seleccionada'}
          </span>
        </div>
      </div>

      {/* POS Action Buttons Bar (Estilo ICG / BeatlePOS) */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <button
          onClick={onOpenOrderModal}
          disabled={!selectedTable}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0 border border-slate-700/60 shadow-md"
        >
          <Utensils className="w-4 h-4" />
          Nueva Comanda
        </button>

        <button
          onClick={onOpenPaymentModal}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-lg shadow-emerald-600/30"
        >
          <CreditCard className="w-4 h-4" />
          Cobrar / Facturar
        </button>

        <button
          onClick={() => alert('Función: Mover pedido de mesa activa')}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 shrink-0 border border-slate-700/60"
        >
          <RefreshCw className="w-4 h-4" />
          Cambiar Mesa
        </button>

        <button
          onClick={() => alert('Función: Juntar cuentas de mesa')}
          disabled={!selectedTable}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 shrink-0 border border-slate-700/60"
        >
          <Users className="w-4 h-4" />
          Juntar Cuentas
        </button>

        <button
          onClick={() => alert('🔔 Notificación de marcha enviada a cocina')}
          disabled={!selectedTable || selectedTable.status === 'AVAILABLE'}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 shrink-0 border border-amber-500/40"
        >
          <Bell className="w-4 h-4" />
          Marchar Orden
        </button>

        <button
          onClick={onOpenLoginModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all shrink-0 border border-slate-700/60"
        >
          <UserCheck className="w-4 h-4" />
          Cambiar Vendedor
        </button>

        <button
          onClick={() => alert('Información del sistema POS: Versión 2.0 en línea')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all shrink-0 border border-slate-700/60"
        >
          <Info className="w-4 h-4" />
          Info POS
        </button>
      </div>
    </div>
  );
};
