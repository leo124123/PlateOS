import React, { useState } from 'react';
import { X, CreditCard, DollarSign, ArrowRight, CheckCircle2, Receipt, Percent } from 'lucide-react';
import { TableItem, PaymentMethod } from '../../types';
import api from '../../services/api';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { useSocket } from '../../context/SocketContext';

interface PaymentModalProps {
  table: TableItem;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ table, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [customTip, setCustomTip] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { fetchTables } = useRestaurantStore();
  const { socket } = useSocket();

  const activeOrder = table.orders && table.orders.length > 0 ? table.orders[0] : null;

  const subtotal = activeOrder ? activeOrder.subtotal : 45.00;
  const tax = activeOrder ? activeOrder.tax : 8.10;
  const baseTotal = subtotal + tax;

  const tipAmount = customTip !== '' ? parseFloat(customTip) || 0 : (baseTotal * tipPercentage) / 100;
  const finalTotal = baseTotal + tipAmount;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      if (activeOrder) {
        await api.post('/payments', {
          orderId: activeOrder.id,
          customerName: activeOrder.customerName || `Cliente Mesa ${table.number}`,
          method: paymentMethod,
          amountPaid: finalTotal,
          tipAmount: tipAmount,
        });

        await api.patch(`/orders/${activeOrder.id}/status`, { status: 'PAID' });
      }

      await api.patch(`/tables/${table.id}/status`, { status: 'CLEANING' });

      if (socket) {
        socket.emit('table:status_update', { tableId: table.id, status: 'CLEANING' });
      }

      await fetchTables();
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (error) {
      console.error('Error procesando pago', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-700 p-6 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Cobro - Mesa {table.number}</h3>
              <p className="text-xs text-slate-400">Procesar cuenta y liberación de mesa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 animate-bounce border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-white">¡Pago Procesado con Éxito!</h4>
            <p className="text-xs text-slate-400 mt-1">La mesa ha sido marcada para limpieza.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Consumo Subtotal:</span>
                <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Impuesto (18%):</span>
                <span className="font-semibold text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Propina ({tipPercentage}%):</span>
                <span className="font-semibold text-emerald-400">+${tipAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-extrabold text-white">
                <span>Total a Cobrar:</span>
                <span className="text-emerald-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-amber-400" /> Selección de Propina
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      setTipPercentage(pct);
                      setCustomTip('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      tipPercentage === pct && customTip === ''
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-2 block">Método de Pago</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5" /> Tarjeta
                </button>
                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <DollarSign className="w-5 h-5" /> Efectivo
                </button>
                <button
                  onClick={() => setPaymentMethod('TRANSFER')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'TRANSFER'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Receipt className="w-5 h-5" /> Transferencia
                </button>
              </div>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Procesando Cobro...</span>
              ) : (
                <>
                  Confirmar Cobro y Enviar Factura <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
