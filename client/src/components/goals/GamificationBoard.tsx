import React, { useEffect } from 'react';
import { Trophy, Target, Award, Flame, Calendar, TrendingUp, Zap, Star, ShieldCheck, Sparkles, DollarSign } from 'lucide-react';
import { useRestaurantStore } from '../../store/useRestaurantStore';

export const GamificationBoard: React.FC = () => {
  const { dailyGoal, currentShift, fetchDailyGoal, fetchShift } = useRestaurantStore();

  useEffect(() => {
    fetchDailyGoal();
    fetchShift();
  }, []);

  const targetSales = dailyGoal?.targetSales || 5000;
  const achievedSales = dailyGoal?.achievedSales || 1850;
  const salesProgressPercent = Math.min(100, Math.round((achievedSales / targetSales) * 100));

  const targetOrders = dailyGoal?.targetOrders || 100;
  const achievedOrders = dailyGoal?.achievedOrders || 28;
  const ordersProgressPercent = Math.min(100, Math.round((achievedOrders / targetOrders) * 100));

  const averageTicket = (achievedSales / Math.max(1, achievedOrders)).toFixed(2);

  const mockLeaderboard = [
    { rank: 1, name: 'Samuel Guance', role: 'Mesero Estrella (MVP)', sales: 420.50, orders: 18, avatar: '👑', badge: 'Oro', color: 'from-amber-500 to-yellow-500' },
    { rank: 2, name: 'Carlos Mendoza', role: 'Mesero Senior', sales: 310.00, orders: 14, avatar: '🥈', badge: 'Plata', color: 'from-slate-400 to-slate-200' },
    { rank: 3, name: 'María López', role: 'Cocina & Chef', sales: 250.00, orders: 10, avatar: '🥉', badge: 'Bronce', color: 'from-amber-700 to-amber-900' },
    { rank: 4, name: 'Jorge Rojas', role: 'Mesero Junior', sales: 180.00, orders: 7, avatar: '⭐', badge: 'Top 4', color: 'from-blue-600 to-indigo-600' },
  ];

  const mockAchievements = [
    { icon: Zap, title: 'Vendedor Veloz', desc: 'Atendió 10 comandas en < 15min', status: 'Desbloqueado', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
    { icon: Star, title: 'Ticket Diamante', desc: 'Venta individual mayor a $150', status: 'Desbloqueado', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
    { icon: ShieldCheck, title: 'Servicio 5 Estrellas', desc: '100% comentarios positivos', status: 'En Progreso', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
    { icon: Flame, title: 'Racha de Fuego', desc: '5 mesas cerradas consecutivas', status: 'Desbloqueado', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-950 overflow-y-auto select-none">
      {/* ── HEADER TITLE & EFFICIENCY BANNER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Trophy className="text-amber-400 w-9 h-9" /> Panel de Metas & Gamificación
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Rendimiento en tiempo real del equipo, avance de metas diarias y ranking de colaboradores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-3 shadow-lg">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <span>¡Racha de Eficiencia de Equipo: 94%!</span>
          </div>
        </div>
      </div>

      {/* ── TOP KPI SUMMARY CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ventas Logradas</span>
            <div className="text-xl font-black text-amber-400 mt-0.5">${achievedSales.toFixed(2)}</div>
            <span className="text-[10px] text-slate-400 font-bold">Meta: ${targetSales.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Comandas Completadas</span>
            <div className="text-xl font-black text-white mt-0.5">{achievedOrders} / {targetOrders}</div>
            <span className="text-[10px] text-emerald-400 font-bold">{ordersProgressPercent}% del objetivo</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ticket Promedio</span>
            <div className="text-xl font-black text-cyan-400 mt-0.5">${averageTicket}</div>
            <span className="text-[10px] text-slate-400 font-bold">Por Mesa Atendida</span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Estado del Turno</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5 uppercase">{currentShift?.status || 'ABIERTO'}</div>
            <span className="text-[10px] text-slate-400 font-bold">Inicio: 08:00 AM</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD GRID (2 COLUMNS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* LEFT 2 COLUMNS: GOAL PROGRESS & ACHIEVEMENTS */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Main Sales Goal Progress Card */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Progreso de la Meta Colectiva</h3>
                  <p className="text-xs text-slate-400">Avance de facturación diario hacia el objetivo</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-amber-400 tracking-tight">
                  ${achievedSales.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 font-bold">
                  de ${targetSales.toFixed(2)} ({salesProgressPercent}%)
                </div>
              </div>
            </div>

            {/* Glowing Gradient Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-6 p-1 border border-slate-800 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2 text-[10px] font-black text-slate-950 shadow-md shadow-amber-500/30"
                style={{ width: `${salesProgressPercent}%` }}
              >
                {salesProgressPercent}%
              </div>
            </div>
          </div>

          {/* Achievements & Badges Grid */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2.5 mb-4 tracking-tight">
              <Sparkles className="text-amber-400 w-5 h-5" /> Logros & Recompensas del Turno
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockAchievements.map((ach, idx) => {
                const IconComponent = ach.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3 shadow-md hover:border-amber-500/40 transition-all"
                  >
                    <div className={`p-3 rounded-2xl border ${ach.color} shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-xs text-white truncate">{ach.title}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase ${
                          ach.status === 'Desbloqueado' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {ach.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: STAFF LEADERBOARD */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">Ranking del Personal</h3>
                <p className="text-xs text-slate-400">Tabla de posiciones de meseros y ventas</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockLeaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    item.rank === 1
                      ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.avatar}</span>
                    <div>
                      <h4 className="font-extrabold text-xs text-white">{item.name}</h4>
                      <p className="text-[10px] text-slate-400">{item.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-amber-400">${item.sales.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{item.orders} comandas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-3 shadow-lg">
            <TrendingUp className="w-8 h-8 shrink-0 text-amber-400" />
            <div>
              <span className="font-black block text-white text-xs">¡Incentivo del Turno!</span>
              El primer lugar al cierre de caja recibe el bono de propinas colectivas.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
