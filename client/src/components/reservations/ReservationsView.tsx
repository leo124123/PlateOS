import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Bell,
  Check,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export interface Reservation {
  id: string;
  tableNumber: number;
  customerName?: string;
  guests: number;
  date: string;
  time: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  adminMessage?: string | null;
  createdAt: string;
}

export const ReservationsView: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED'>('ALL');

  // Response Modal State
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [responseAction, setResponseAction] = useState<'CONFIRMED' | 'REJECTED'>('CONFIRMED');
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  const { socket } = useSocket();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservations');
      if (res.data?.data) {
        setReservations(res.data.data);
      }
    } catch (e) {
      console.error('Error cargando reservas VIP', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();

    if (socket) {
      const handleNewReservation = (newRes: Reservation) => {
        setReservations((prev) => [newRes, ...prev]);
        setToastAlert(`¡NUEVA RESERVA VIP! Mesa #${newRes.tableNumber} - ${newRes.guests} personas a las ${newRes.time} hs.`);
        setTimeout(() => setToastAlert(null), 5000);
      };

      socket.on('reservation:new', handleNewReservation);
      return () => {
        socket.off('reservation:new', handleNewReservation);
      };
    }
  }, [socket]);

  const handleOpenResponseModal = (res: Reservation, action: 'CONFIRMED' | 'REJECTED') => {
    setSelectedRes(res);
    setResponseAction(action);
    setResponseMessage(
      action === 'CONFIRMED'
        ? `¡Reserva confirmada en Mesa #${res.tableNumber}! Te esperamos a las ${res.time} hs.`
        : `Lamentablemente no disponemos de espacio a las ${res.time} hs. ¿Deseas reagendar?`
    );
  };

  const handleSendResponse = async () => {
    if (!selectedRes) return;
    setIsSubmitting(true);

    try {
      // 1. Update API
      await api.patch(`/reservations/${selectedRes.id}/status`, {
        status: responseAction,
        adminMessage: responseMessage,
      });

      // 2. Emit WebSocket event to mobile app
      if (socket) {
        socket.emit('reservation:respond', {
          reservationId: selectedRes.id,
          tableNumber: selectedRes.tableNumber,
          status: responseAction,
          adminMessage: responseMessage,
        });
      }

      // 3. Update local state
      setReservations((prev) =>
        prev.map((r) =>
          r.id === selectedRes.id
            ? { ...r, status: responseAction, adminMessage: responseMessage }
            : r
        )
      );

      setSelectedRes(null);
    } catch (e) {
      console.error('Error respondiendo a la reserva', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const pendingCount = reservations.filter((r) => r.status === 'PENDING').length;
  const confirmedCount = reservations.filter((r) => r.status === 'CONFIRMED').length;
  const totalGuests = reservations
    .filter((r) => r.status === 'CONFIRMED')
    .reduce((acc, r) => acc + r.guests, 0);

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto flex flex-col gap-6">
      {/* Toast Alert Banner */}
      {toastAlert && (
        <div className="fixed top-20 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center gap-3 border border-amber-400 animate-bounce">
          <Bell className="w-5 h-5 animate-spin" />
          <span className="font-extrabold text-sm">{toastAlert}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase">
                MÓDULO DE GESTIÓN VIP
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Reservas VIP en Tiempo Real
            </h2>
            <p className="text-xs text-slate-400">
              Gestión centralizada de reservas solicitadas desde la aplicación móvil.
            </p>
          </div>
        </div>

        <button
          onClick={fetchReservations}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all border border-slate-700 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Reservas Pendientes
            </p>
            <p className="text-3xl font-black text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Confirmadas Hoy
            </p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{confirmedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Comensales Esperados
            </p>
            <p className="text-3xl font-black text-blue-400 mt-1">{totalGuests} Pers.</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              filter === f
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f === 'ALL' && 'Todas las Reservas'}
            {f === 'PENDING' && `Pendientes (${pendingCount})`}
            {f === 'CONFIRMED' && 'Confirmadas'}
            {f === 'REJECTED' && 'Rechazadas'}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-slate-900/50 rounded-3xl p-12 text-center border border-slate-800/80 flex flex-col items-center justify-center">
          <Calendar className="w-12 h-12 text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-300">No hay reservas en este estado</h3>
          <p className="text-xs text-slate-500 mt-1">
            Las nuevas reservas realizadas desde la app de los clientes aparecerán automáticamente aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReservations.map((res) => {
            const isPending = res.status === 'PENDING';
            const isConfirmed = res.status === 'CONFIRMED';

            return (
              <div
                key={res.id}
                className={`bg-slate-900 p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                  isPending
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : isConfirmed
                    ? 'border-emerald-500/30'
                    : 'border-rose-500/30 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center">
                        #{res.tableNumber}
                      </span>
                      <span className="font-extrabold text-white text-base">
                        Mesa #{res.tableNumber} • {res.customerName || 'Cliente VIP'}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider border ${
                        isPending
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                          : isConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {isPending && 'Pendiente'}
                      {isConfirmed && 'Confirmada'}
                      {res.status === 'REJECTED' && 'Rechazada'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 mb-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold">{res.guests} Pers.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold">{res.time} HS</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold">{res.date}</span>
                    </div>
                  </div>

                  {res.notes && (
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 mb-3">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Solicitud Especial:
                      </p>
                      <p className="text-xs text-slate-300 italic mt-0.5">"{res.notes}"</p>
                    </div>
                  )}

                  {res.adminMessage && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Respuesta enviada al cliente:
                      </p>
                      <p className="text-xs text-slate-200 mt-1">"{res.adminMessage}"</p>
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                {isPending && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenResponseModal(res, 'CONFIRMED')}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <Check className="w-4 h-4" /> Aceptar y Confirmar
                    </button>
                    <button
                      onClick={() => handleOpenResponseModal(res, 'REJECTED')}
                      className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <X className="w-4 h-4" /> Rechazar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Response Modal */}
      {selectedRes && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-amber-500/30 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base">
                  {responseAction === 'CONFIRMED'
                    ? 'Confirmar Reserva VIP'
                    : 'Rechazar / Modificar Reserva'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <p className="font-bold text-amber-400">Reserva para Mesa #{selectedRes.tableNumber}</p>
              <p className="text-slate-300 mt-0.5">
                {selectedRes.customerName || 'Cliente VIP'} • {selectedRes.guests} personas a las {selectedRes.time} hs
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Mensaje personalizado que recibirá el cliente en su teléfono:
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Escribe un mensaje de confirmación o indicación para el cliente..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedRes(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendResponse}
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-xl text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  responseAction === 'CONFIRMED'
                    ? 'bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-rose-500 hover:bg-rose-400 text-white'
                }`}
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Enviar Respuesta al Teléfono
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
