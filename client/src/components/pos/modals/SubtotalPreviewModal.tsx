import React from 'react';
import { DollarSign, Printer, CheckCircle2, X } from 'lucide-react';
import { TableItem } from '../../../types';

interface SubtotalPreviewModalProps {
  table: TableItem;
  onClose: () => void;
}

export const SubtotalPreviewModal: React.FC<SubtotalPreviewModalProps> = ({ table, onClose }) => {
  const [printed, setPrinted] = React.useState(false);

  const mockItems = [
    { name: 'Lomo Saltado Gourmet', qty: 2, price: 24.50 },
    { name: 'Ceviche Mixto Tradicional', qty: 1, price: 28.00 },
    { name: 'Pisco Sour Catedral', qty: 3, price: 12.00 },
  ];

  const subtotal = mockItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePrint = () => {
    setPrinted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-700/80 p-6 shadow-2xl bg-slate-900/90 text-white flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Pre-Cuenta / Subtotal</h3>
              <p className="text-xs text-slate-400">Resumen parcial para Mesa #{table.number}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pre-Receipt Printable Slip Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs flex flex-col gap-2 shadow-inner">
          <div className="text-center font-bold border-b border-dashed border-slate-800 pb-2 text-amber-400">
            *** PRE-CUENTA MESA #{table.number} ***
          </div>

          <div className="flex flex-col gap-1 py-1">
            {mockItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span>{item.qty}x {item.name}</span>
                <span className="font-bold text-white">${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-800 pt-2 flex flex-col gap-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>SUBTOTAL:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>IGV / TAX (18%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-emerald-400 pt-1 border-t border-slate-800">
              <span>TOTAL A PAGAR:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {printed && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ¡Pre-cuenta enviada a impresora térmica!
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            disabled={printed}
            className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/30 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir Pre-Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};
