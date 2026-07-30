import React, { useState } from 'react';
import { X, QrCode, Printer, Sparkles, Download, Check } from 'lucide-react';
import { TableItem } from '../../../types';

interface QRGeneratorModalProps {
  tables: TableItem[];
  onClose: () => void;
}

export const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({ tables, onClose }) => {
  const [selectedTable, setSelectedTable] = useState<TableItem>(tables[0] || { id: 'tbl-1', number: 1, name: 'Mesa 1' });
  const [copied, setCopied] = useState(false);

  const qrPayload = `plateos://table/${selectedTable.number}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 p-6 shadow-2xl bg-slate-900/95 text-white flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Generador de Códigos QR por Mesa
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v3 Expo Go
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Imprime o muestra el código QR acrílico para que los clientes se conecten a la mesa.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Table Selector List */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Seleccionar Mesa del Salón:
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {tables.map((tbl) => (
                <button
                  key={tbl.id}
                  onClick={() => setSelectedTable(tbl)}
                  className={`p-3 rounded-2xl border font-black text-xs flex flex-col items-center gap-1 transition-all ${
                    selectedTable.id === tbl.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[10px] opacity-70">MESA</span>
                  <span className="text-base font-extrabold">#{tbl.number}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Display Card Printable Area */}
          <div className="bg-slate-950 rounded-3xl p-6 border border-amber-500/40 flex flex-col items-center text-center shadow-xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

            <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-3">
              Mesa #{selectedTable.number} • Código QR
            </span>

            {/* SVG Visual Simulated QR Code */}
            <div className="p-4 bg-white rounded-2xl border-4 border-amber-500/60 shadow-2xl my-2 flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrPayload)}&color=0f172a&format=svg`}
                alt={`QR Mesa ${selectedTable.number}`}
                className="w-36 h-36 object-contain"
              />
            </div>

            <p className="text-xs font-bold text-slate-300 mt-2">
              PIN de Mesa: <b className="text-amber-400 font-black text-sm">{selectedTable.number}</b>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Escaneable con la App Móvil PlateOS Go o cámara.
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-4 w-full">
              <button
                onClick={handlePrint}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir QR
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
