import React, { useState } from 'react';
import { Scissors, Users, CheckCircle2, X } from 'lucide-react';
import { TableItem } from '../../../types';

interface SplitBillModalProps {
  table: TableItem;
  onClose: () => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({ table, onClose }) => {
  const [splitCount, setSplitCount] = useState<number>(2);
  const [successMsg, setSuccessMsg] = useState(false);

  // Mock estimated total bill amount
  const totalAmount = 148.50;
  const perPersonAmount = (totalAmount / splitCount).toFixed(2);

  const handleConfirmSplit = () => {
    setSuccessMsg(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-700/80 p-6 shadow-2xl bg-slate-900/90 text-white flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Fraccionar Cuenta</h3>
              <p className="text-xs text-slate-400">Dividir cuenta de Mesa #{table.number} entre comensales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Bill Card */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cuenta Total Mesa #{table.number}</span>
            <div className="text-2xl font-black text-amber-400">${totalAmount.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Por Persona ({splitCount} partes)</span>
            <div className="text-xl font-black text-purple-400">${perPersonAmount}</div>
          </div>
        </div>

        {/* Guest Split Count Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            Número de Personas:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setSplitCount(num)}
                className={`py-3 rounded-2xl font-black text-sm border transition-all flex flex-col items-center gap-0.5 ${
                  splitCount === num
                    ? 'bg-gradient-to-b from-purple-600 to-indigo-700 border-purple-400 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                }`}
              >
                <span>{num}</span>
                <span className="text-[9px] text-purple-200 uppercase">Partes</span>
              </button>
            ))}
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ¡Cuenta fraccionada en {splitCount} cupones!
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmSplit}
            disabled={successMsg}
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30 disabled:opacity-40 transition-all"
          >
            Fraccionar en {splitCount} Cuentas
          </button>
        </div>
      </div>
    </div>
  );
};
