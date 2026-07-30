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
  Layers,
  Calendar,
} from 'lucide-react';
import { RestaurantFloor3D } from './components/3d/RestaurantFloor3D';
import { KDSBoard } from './components/kitchen/KDSBoard';
import { OrderModal } from './components/orders/OrderModal';
import { PaymentModal } from './components/payment/PaymentModal';
import { GamificationBoard } from './components/goals/GamificationBoard';
import { CashierBoard } from './components/cashier/CashierBoard';
import { ReservationsView } from './components/reservations/ReservationsView';
import { LoginModal } from './components/auth/LoginModal';
import { MandatoryLoginPortal } from './components/auth/MandatoryLoginPortal';
import { POSBottomToolbar } from './components/pos/POSBottomToolbar';
import { TransferTableModal } from './components/pos/modals/TransferTableModal';
import { SplitBillModal } from './components/pos/modals/SplitBillModal';
import { TableInfoModal } from './components/pos/modals/TableInfoModal';
import { SubtotalPreviewModal } from './components/pos/modals/SubtotalPreviewModal';
import { QRGeneratorModal } from './components/pos/modals/QRGeneratorModal';
import { useRestaurantStore } from './store/useRestaurantStore';
import { useAuthStore } from './store/useAuthStore';
import { useSocket } from './context/SocketContext';
import { TableItem, Role } from './types';
import api from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d' | 'kitchen' | 'payments' | 'goals' | 'reservations'>('3d');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAppLocked, setIsAppLocked] = useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isTableInfoModalOpen, setIsTableInfoModalOpen] = useState(false);
  const [isSubtotalModalOpen, setIsSubtotalModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

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

  const { user, fetchMe, logout } = useAuthStore();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchTables();
    fetchMenu();
    fetchMe();
  }, []);

  const handleLoginSuccess = (role: Role) => {
    setIsAppLocked(false);
    if (role === 'KITCHEN') setActiveTab('kitchen');
    else if (role === 'CASHIER') setActiveTab('payments');
    else setActiveTab('3d');
  };

  const handleLockTerminal = () => {
    logout();
    setIsAppLocked(true);
  };

  const handleSelectTableFrom3D = (table: TableItem) => {
    setSelectedTable(table);
    if (table.status === 'BILL_REQUESTED' || table.status === 'EATING') {
      openPaymentModal(table);
    } else {
      openOrderModal(table);
    }
  };

  // 🔒 STRICT MANDATORY LOGIN GUARD: Render ONLY the login portal when locked!
  if (isAppLocked) {
    return <MandatoryLoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                Plate<span className="text-amber-400">OS</span> <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">POS 3D</span>
              </h1>
              <p className="text-[10px] text-slate-400 -mt-0.5">Terminal Táctil Operativa de Restaurantes</p>
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
            <Layers className="w-4 h-4" /> Plano 3D
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
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> Reservas VIP
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
                onClick={handleLockTerminal}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all shadow-sm"
              >
                <UserCheck className="w-4 h-4" /> 🔒 Cambiar / Bloquear PIN
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAppLocked(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all"
            >
              🔒 Ingresar / PIN
            </button>
          )}
        </div>
      </header>

      {/* Alert Banner Notification: STRICTLY FOR WAITERS AND ADMINS ONLY */}
      {alertNotification && (user?.role === 'WAITER' || user?.role === 'ADMIN') && (
        alertNotification.type === 'CALL_WAITER' || (!alertNotification.orderId && alertNotification.message?.includes('llamando')) ? (
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 px-6 py-3 text-white font-black text-xs flex items-center justify-between shadow-2xl animate-pulse z-40 border-b-2 border-amber-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 text-yellow-300 animate-bounce">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-black tracking-tight text-yellow-300 uppercase">
                  🚨 ¡ATENCIÓN MESERO! MESA #{alertNotification.tableNumber} SOLICITA ATENCIÓN
                </span>
                <span className="text-[11px] opacity-90 font-medium text-slate-100">
                  El cliente en la Mesa #{alertNotification.tableNumber} requiere asistencia o servicio presencial en este momento.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const table = tables.find(
                    (t) => (alertNotification.tableId && t.id === alertNotification.tableId) || t.number === alertNotification.tableNumber
                  );
                  if (table) setSelectedTable(table);
                  if (socket) {
                    socket.emit('waiter:attending_table', {
                      tableId: alertNotification.tableId || table?.id,
                      tableNumber: alertNotification.tableNumber,
                    });
                  }
                  setAlertNotification(null);
                }}
                className="px-4 py-2 bg-slate-950 text-amber-300 hover:bg-slate-900 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl border border-amber-400 hover:scale-105 transition-all"
              >
                🏃 Ir a Atender Mesa #{alertNotification.tableNumber}
              </button>
              <button
                onClick={() => setAlertNotification(null)}
                className="px-3 py-2 bg-black/40 text-white hover:bg-black/60 rounded-xl text-xs font-bold"
              >
                Entendido
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 px-6 py-2.5 text-slate-950 font-black text-xs flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-300 z-30">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 animate-bounce" />
              <span>¡PEDIDO LISTO EN COCINA! Mesa #{alertNotification.tableNumber} — El platillo está listo para llevar al cliente.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  if (!alertNotification) return;
                  try {
                    await api.patch(`/orders/${alertNotification.orderId}/status`, { status: 'SERVED' });
                    setAlertNotification(null);
                    fetchTables();
                  } catch (err) {
                    console.error('Error actualizando pedido a SERVED:', err);
                  }
                }}
                className="px-3 py-1 bg-slate-950 text-emerald-300 rounded-lg text-xs font-black"
              >
                Marcar Entregado
              </button>
              <button
                onClick={() => setAlertNotification(null)}
                className="px-2 py-1 text-slate-900 font-bold text-xs"
              >
                Descartar
              </button>
            </div>
          </div>
        )
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative p-3">
        {activeTab === '3d' && (
          <RestaurantFloor3D tables={tables} onSelectTable={handleSelectTableFrom3D} />
        )}

        {activeTab === 'kitchen' && <KDSBoard />}

        {activeTab === 'payments' && (
          <CashierBoard
            tables={tables}
            onOpenPaymentModal={(table) => { setSelectedTable(table); openPaymentModal(table); }}
            onOpenSubtotalModal={(table) => { setSelectedTable(table); setIsSubtotalModalOpen(true); }}
            onOpenSplitModal={(table) => { setSelectedTable(table); setIsSplitModalOpen(true); }}
          />
        )}

        {activeTab === 'reservations' && <ReservationsView />}

        {activeTab === 'goals' && <GamificationBoard />}
      </main>

      {/* POS Action Toolbar at the bottom */}
      {activeTab === '3d' && (
        <POSBottomToolbar
          onOpenOrderModal={() => selectedTable && openOrderModal(selectedTable)}
          onOpenPaymentModal={() => selectedTable && openPaymentModal(selectedTable)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenTransferModal={() => selectedTable && setIsTransferModalOpen(true)}
          onOpenSplitModal={() => selectedTable && setIsSplitModalOpen(true)}
          onOpenInfoModal={() => selectedTable && setIsTableInfoModalOpen(true)}
          onOpenSubtotalModal={() => selectedTable && setIsSubtotalModalOpen(true)}
          onOpenQRModal={() => setIsQRModalOpen(true)}
        />
      )}

      {/* Modals */}
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

      {isTransferModalOpen && selectedTable && (
        <TransferTableModal
          currentTable={selectedTable}
          tables={tables}
          onClose={() => setIsTransferModalOpen(false)}
        />
      )}

      {isSplitModalOpen && selectedTable && (
        <SplitBillModal
          table={selectedTable}
          onClose={() => setIsSplitModalOpen(false)}
        />
      )}

      {isTableInfoModalOpen && selectedTable && (
        <TableInfoModal
          table={selectedTable}
          onClose={() => setIsTableInfoModalOpen(false)}
        />
      )}

      {isSubtotalModalOpen && selectedTable && (
        <SubtotalPreviewModal
          table={selectedTable}
          onClose={() => setIsSubtotalModalOpen(false)}
        />
      )}

      {isQRModalOpen && (
        <QRGeneratorModal
          tables={tables}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}
    </div>
  );
};
