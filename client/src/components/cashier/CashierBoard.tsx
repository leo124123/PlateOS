import React, { useState } from 'react';
import { Receipt, CreditCard, DollarSign, Clock, User, Layers, RefreshCw, CheckCircle2, Scissors, Info } from 'lucide-react';
import { TableItem } from '../../types';
import { useRestaurantStore } from '../../store/useRestaurantStore';

interface CashierBoardProps {
  tables: TableItem[];
  onOpenPaymentModal: (table: TableItem) => void;
  onOpenSubtotalModal: (table: TableItem) => void;
  onOpenSplitModal: (table: TableItem) => void;
}

export const CashierBoard: React.FC<CashierBoardProps> = ({
  tables,
  onOpenPaymentModal,
  onOpenSubtotalModal,
  onOpenSplitModal,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'OCCUPIED' | 'CLEANING'>('ALL');
  const { fetchTables } = useRestaurantStore();

  const activeTables = tables.filter((t) => t.status !== 'AVAILABLE');

  const filteredTables = activeTables.filter((t) => {
    if (filter === 'PENDING') return t.status === 'BILL_REQUESTED' || t.status === 'ORDER_PENDING';
    if (filter === 'OCCUPIED') return t.status === 'OCCUPIED' || t.status === 'EATING';
    if (filter === 'CLEANING') return t.status === 'CLEANING';
    return true;
  });

  // Financial Stats
  const pendingTotal = activeTables.reduce((sum, t) => sum + 65.50, 0);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'BILL_REQUESTED':
        return { label: 'Cuenta Pedida', badgeClass: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40' };
      case 'ORDER_PENDING':
        return { label: 'Comanda Enviada', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'EATING':
      case 'OCCUPIED':
        return { label: 'En Consumo', badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'CLEANING':
        return { label: 'En Limpieza', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      default:
        return { label: status, badgeClass: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-950 overflow-y-auto select-none">
      {/* ── HEADER TITLE & STATS CARDS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Receipt className="text-amber-500 w-9 h-9" /> Módulo de Caja y Cobros en Lote
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión centralizada de pre-cuentas, cobro rápido y facturación de mesas
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shrink-0 shadow-lg">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Por Cobrar Total</span>
              <div className="text-lg font-black text-amber-400">${pendingTotal.toFixed(2)}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shrink-0 shadow-lg">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Mesas Activas</span>
              <div className="text-lg font-black text-emerald-400">{activeTables.length} Mesas</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER TABS BAR ── */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          {[
            { id: 'ALL', label: `Todas (${activeTables.length})` },
            { id: 'PENDING', label: 'Pedida / Comanda' },
            { id: 'OCCUPIED', label: 'En Consumo' },
            { id: 'CLEANING', label: 'Limpieza' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchTables()}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      {/* ── CASHIER TABLE CARDS GRID ── */}
      {filteredTables.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center glass-panel rounded-3xl p-12 text-center border border-slate-800">
          <CheckCircle2 className="w-16 h-16 text-emerald-500/40 mb-3" />
          <h3 className="text-xl font-extrabold text-white">¡Caja sin cuentas pendientes!</h3>
          <p className="text-xs text-slate-400 mt-1">No se encontraron mesas activas bajo este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTables.map((t) => {
            const statusInfo = getStatusInfo(t.status);
            const mockSubtotal = 45.00 + (t.number * 4.5);
            const mockTax = mockSubtotal * 0.18;
            const mockTotal = mockSubtotal + mockTax;

            return (
              <div
                key={t.id}
                className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800/90 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xl font-black text-white tracking-tight">Mesa #{t.number}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                          <User className="w-3 h-3 text-amber-400" /> Cap. {t.capacity}p
                        </span>
                        <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" /> 35 min
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-xl font-black uppercase border ${statusInfo.badgeClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Bill Amount Details */}
                  <div className="p-3 my-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-bold text-slate-300">${mockSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Impuestos (18%):</span>
                      <span className="font-bold text-slate-300">${mockTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-amber-400 pt-1.5 border-t border-slate-800">
                      <span>Total Consumo:</span>
                      <span className="text-emerald-400 text-base font-black">${mockTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onOpenPaymentModal(t)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-102"
                  >
                    <CreditCard className="w-4 h-4" /> Procesar Cobro
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenSubtotalModal(t)}
                      className="py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" /> Pre-Cuenta
                    </button>
                    <button
                      onClick={() => onOpenSplitModal(t)}
                      className="py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1"
                    >
                      <Scissors className="w-3.5 h-3.5" /> Dividir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
