import React, { useState } from 'react';
import { RefreshCw, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { TableItem } from '../../../types';

interface TransferTableModalProps {
  currentTable: TableItem;
  tables: TableItem[];
  onClose: () => void;
  onConfirmTransfer: (targetTableId: string) => void;
}

export const TransferTableModal: React.FC<TransferTableModalProps> = ({
  currentTable,
  tables,
  onClose,
  onConfirmTransfer,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Available destination tables (excluding current table)
  const availableTargetTables = tables.filter((t) => t.id !== currentTable.id);

  const handleTransfer = () => {
    if (!selectedTargetId) return;
    setSuccessMsg(true);
    setTimeout(() => {
      onConfirmTransfer(selectedTargetId);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-700/80 p-6 shadow-2xl bg-slate-900/90 text-white flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Cambiar / Mover Mesa</h3>
              <p className="text-xs text-slate-400">Transferir comanda activa a otra mesa disponible</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transfer Visual Pipeline */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Origen</span>
            <div className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-extrabold text-sm">
              Mesa #{currentTable.number}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="w-6 h-6 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-300 uppercase">Transferir</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Destino</span>
            {selectedTargetId ? (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold text-sm">
                Mesa #{tables.find((t) => t.id === selectedTargetId)?.number}
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs">
                Selecciona...
              </div>
            )}
          </div>
        </div>

        {/* Table Selector Grid */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            Selecciona Mesa Destino:
          </label>
          <div className="grid grid-cols-4 gap-2.5 max-h-52 overflow-y-auto pr-1">
            {availableTargetTables.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTargetId(t.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  selectedTargetId === t.id
                    ? 'bg-gradient-to-b from-indigo-600 to-blue-700 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-105 font-black'
                    : t.status === 'AVAILABLE'
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200 font-bold'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                <span className="text-sm font-extrabold">Mesa #{t.number}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-black ${
                  t.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {t.status === 'AVAILABLE' ? 'Libre' : t.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Success Alert Feedback */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ¡Comanda transferida con éxito!
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedTargetId || successMsg}
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/30 disabled:opacity-40 transition-all"
          >
            Confirmar Traslado
          </button>
        </div>
      </div>
    </div>
  );
};
