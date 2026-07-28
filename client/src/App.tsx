import React, { useEffect, useState } from 'react';
import {
  UtensilsCrossed,
  ChefHat,
  Receipt,
  Trophy,
  UserCheck,
  Bell,
  RefreshCw,
  Wifi,
  WifiOff,
  Layers
} from 'lucide-react';
import { RestaurantFloor3D } from './components/3d/RestaurantFloor3D';
import { KDSBoard } from './components/kitchen/KDSBoard';
import { OrderModal } from './components/orders/OrderModal';
import { PaymentModal } from './components/payment/PaymentModal';
import { GamificationBoard } from './components/goals/GamificationBoard';
import { LoginModal } from './components/auth/LoginModal';
import { useRestaurantStore } from './store/useRestaurantStore';
import { useAuthStore } from './store/useAuthStore';
import { useSocket } from './context/SocketContext';
import { TableItem } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d' | 'kitchen' | 'payments' | 'goals'>('3d');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const {
    tables,
    categories,
    selectedTable,
    isOrderModalOpen,
    isPaymentModalOpen,
    alertNotification,
    fetchTables,
    fetchMenu,
    setSelectedTable,
    openOrderModal,
    openPaymentModal,
    closeOrderModal,
    closePaymentModal,
    setAlertNotification,
  } = useRestaurantStore();

  const { user, fetchMe } = useAuthStore();
  const { isConnected } = useSocket();

  useEffect(() => {
    fetchTables();
    fetchMenu();
    fetchMe();
  }, []);

  const handleSelectTableFrom3D = (table: TableItem) => {
    setSelectedTable(table);
    if (table.status === 'BILL_REQUESTED' || table.status === 'EATING') {
      openPaymentModal(table);
    } else {
      openOrderModal(table);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                Plate<span className="text-amber-400">OS</span> <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">3D</span>
              </h1>
              <p className="text-[10px] text-slate-400 -mt-0.5">Sistema Operativo de Restaurantes</p>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-400 font-bold flex items-center gap-1"><Wifi className="w-3 h-3" /> En Vivo</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-rose-400 font-bold flex items-center gap-1"><WifiOff className="w-3 h-3" /> Desconectado</span>
              </>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === '3d'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Salón 3D
          </button>
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'kitchen'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ChefHat className="w-4 h-4" /> Cocina (KDS)
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" /> Cobros / Caja
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'goals'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" /> Metas
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTables()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refrescar estado"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-extrabold text-white">{user.name}</div>
                <div className="text-[10px] text-amber-400 font-bold uppercase">{user.role}</div>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
              >
                <UserCheck className="w-4 h-4" /> Cambiar PIN
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all"
            >
              Ingresar / PIN
            </button>
          )}
        </div>
      </header>

      {alertNotification && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-slate-950 font-black text-xs flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-300 z-30">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>¡PLATILLO LISTO PARA SERVIR! {alertNotification.message} (Mesa {alertNotification.tableNumber})</span>
          </div>
          <button
            onClick={() => setAlertNotification(null)}
            className="px-3 py-1 bg-slate-950/80 text-white rounded-lg text-[10px] uppercase font-bold hover:bg-slate-950"
          >
            Entendido
          </button>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative p-4">
        {activeTab === '3d' && (
          <RestaurantFloor3D tables={tables} onSelectTable={handleSelectTableFrom3D} />
        )}

        {activeTab === 'kitchen' && <KDSBoard />}

        {activeTab === 'payments' && (
          <div className="w-full h-full p-6 bg-slate-950 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                  <Receipt className="text-emerald-400 w-9 h-9" /> Control de Caja y Cobros
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Selecciona una mesa ocupada para emitir la cuenta y procesar el cobro
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((t) => (
                <div
                  key={t.id}
                  onClick={() => openPaymentModal(t)}
                  className={`glass-panel p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    t.status === 'BILL_REQUESTED'
                      ? 'border-amber-500 bg-amber-500/10 hover:border-amber-400'
                      : t.status === 'EATING' || t.status === 'OCCUPIED'
                      ? 'border-blue-500/40 bg-blue-500/5 hover:border-blue-400'
                      : 'border-slate-800 hover:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-lg font-black text-white">Mesa {t.number}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 font-extrabold uppercase border border-slate-800">
                      {t.status}
                    </span>
                  </div>
                  <div className="py-4 text-xs text-slate-400">
                    Capacidad: <b>{t.capacity} personas</b>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPaymentModal(t);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-extrabold text-xs transition-all border border-emerald-500/30"
                  >
                    Procesar Cobro
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'goals' && <GamificationBoard />}
      </main>

      {isOrderModalOpen && selectedTable && (
        <OrderModal
          table={selectedTable}
          categories={categories}
          onClose={closeOrderModal}
        />
      )}

      {isPaymentModalOpen && selectedTable && (
        <PaymentModal
          table={selectedTable}
          onClose={closePaymentModal}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
