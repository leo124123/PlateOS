import React, { useState } from 'react';
import { X, Plus, Minus, Send, Utensils } from 'lucide-react';
import { TableItem, Category, MenuItem } from '../../types';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useRestaurantStore } from '../../store/useRestaurantStore';

interface OrderModalProps {
  table: TableItem;
  categories: Category[];
  onClose: () => void;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({ table, categories, onClose }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { socket } = useSocket();
  const { fetchTables } = useRestaurantStore();

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1, notes: '' }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.menuItem.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload = {
        tableId: table.id,
        customerName: customerName || `Cliente Mesa ${table.number}`,
        notes: orderNotes,
        items: cart.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          notes: i.notes,
        })),
      };

      const res = await api.post('/orders', payload);
      const createdOrder = res.data.data;

      if (socket) {
        socket.emit('order:new', createdOrder);
      }

      await fetchTables();
      onClose();
    } catch (error) {
      console.error('Error enviando pedido', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-5xl h-[85vh] glass-panel rounded-3xl border border-slate-700 flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Left Side: Categories & Menu Dishes Selection */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Utensils className="text-amber-500" /> Toma de Pedido - Mesa {table.number}
              </h2>
              <p className="text-xs text-slate-400">Selecciona los platillos para enviar comanda a la cocina</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategoryId === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCategory?.items?.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-500/50 transition-all group"
              >
                <div className="flex gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60">
                  <span className="font-extrabold text-amber-400 text-sm">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Order Summary & Cart */}
        <div className="w-full md:w-96 bg-slate-900/95 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Resumen de Comanda</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Nombre del Cliente (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 mb-4 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No hay platillos seleccionados aún
                </div>
              ) : (
                cart.map((i) => (
                  <div
                    key={i.menuItem.id}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-bold text-slate-200">{i.menuItem.name}</div>
                      <div className="text-amber-400 font-semibold">
                        ${(i.menuItem.price * i.quantity).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateQuantity(i.menuItem.id, -1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white px-1.5">{i.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(i.menuItem.id, 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Notas Especiales para Cocina</label>
              <textarea
                rows={2}
                placeholder="Ej. Sin cebolla, término medio..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Impuestos (18%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-1 border-t border-slate-800/80">
              <span>Total:</span>
              <span className="text-amber-400">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full py-3 mt-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span>Enviando a Cocina...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Enviar Comanda a Cocina
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
