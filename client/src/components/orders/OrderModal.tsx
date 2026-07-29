import React, { useState } from 'react';
import { X, Plus, Minus, Send, Utensils, Search, Trash2, CheckCircle2 } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { socket } = useSocket();
  const { fetchTables } = useRestaurantStore();

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const filteredItems = activeCategory?.items?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItem.id !== itemId));
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
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (error) {
      console.error('Error enviando pedido', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-5xl h-[88vh] glass-panel rounded-3xl border border-slate-700/80 bg-slate-900/95 flex flex-col md:flex-row overflow-hidden shadow-2xl">
        
        {/* ── LEFT SIDE: CATEGORIES & DISH SELECTION ── */}
        <div className="flex-1 flex flex-col p-5 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                <Utensils className="text-amber-500 w-6 h-6" /> Toma de Pedido — Mesa #{table.number}
              </h2>
              <p className="text-xs text-slate-400">Selecciona los platillos para enviar comanda a la cocina</p>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Category Pills */}
          <div className="flex flex-col gap-2.5 mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar platillo por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategoryId(cat.id); setSearchQuery(''); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide whitespace-nowrap transition-all ${
                    selectedCategoryId === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Dishes Grid (Auto-rows to eliminate vertical stretch) */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 auto-rows-max content-start">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-500/60 transition-all group shadow-md"
              >
                <div className="flex gap-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <Utensils className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-white group-hover:text-amber-400 transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800/60">
                  <span className="font-black text-amber-400 text-sm">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-extrabold text-xs flex items-center gap-1 transition-all border border-amber-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDE: ORDER CART & SUMMARY ── */}
        <div className="w-full md:w-96 bg-slate-950/90 p-5 flex flex-col justify-between border-t md:border-t-0 border-slate-800">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
              <h3 className="font-black text-base text-white tracking-tight">Resumen de Comanda</h3>
              <button
                onClick={onClose}
                className="hidden md:flex p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Name Input */}
            <div className="mb-2">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1 block">
                Nombre del Cliente (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 my-2 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs font-bold flex flex-col items-center gap-2">
                  <Utensils className="w-8 h-8 text-slate-700" />
                  No hay platillos seleccionados aún
                </div>
              ) : (
                cart.map((i) => (
                  <div
                    key={i.menuItem.id}
                    className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex justify-between items-center text-xs shadow-sm"
                  >
                    <div className="flex-1 pr-2 min-w-0">
                      <div className="font-extrabold text-slate-200 truncate">{i.menuItem.name}</div>
                      <div className="text-amber-400 font-black text-xs">
                        ${(i.menuItem.price * i.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950 rounded-xl p-1 border border-slate-800">
                      <button
                        onClick={() => handleUpdateQuantity(i.menuItem.id, -1)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-white px-1 text-xs">{i.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(i.menuItem.id, 1)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(i.menuItem.id)}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950 transition-all ml-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Special Order Notes */}
            <div className="mt-2">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1 block">
                Notas para Cocina
              </label>
              <textarea
                rows={2}
                placeholder="Ej. Sin cebolla, término medio..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Success Notification Feedback */}
          {isSuccess && (
            <div className="my-2 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center justify-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ¡Comanda enviada a cocina!
            </div>
          )}

          {/* Totals & Submit Footer */}
          <div className="pt-3 border-t border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-300">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Impuestos (18%):</span>
              <span className="font-bold text-slate-300">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-1 border-t border-slate-800">
              <span>Total:</span>
              <span className="text-amber-400 font-black">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={cart.length === 0 || isSubmitting || isSuccess}
              className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-40 transition-all"
            >
              {isSubmitting ? (
                <span>Enviando Comanda...</span>
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
