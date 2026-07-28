import React, { useEffect } from 'react';
import { Trophy, Target, Award, Flame, Calendar, TrendingUp } from 'lucide-react';
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

  const mockLeaderboard = [
    { rank: 1, name: 'Samuel Guance', role: 'Mesero Estrella', sales: '$420.50', orders: 18, avatar: '👑' },
    { rank: 2, name: 'Carlos Mendoza', role: 'Mesero Senior', sales: '$310.00', orders: 14, avatar: '🥈' },
    { rank: 3, name: 'María López', role: 'Cocina & Chef', sales: '$250.00', orders: 10, avatar: '🥉' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-slate-950 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Trophy className="text-amber-400 w-9 h-9" /> Panel de Metas & Gamificación
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Rendimiento del equipo, meta diaria del restaurante y ranking de meseros
          </p>
        </div>
        <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl text-xs font-bold text-amber-400 border border-amber-500/30">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>¡Racha de Eficiencia: 94%!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Meta de Ventas del Día</h3>
                  <p className="text-xs text-slate-400">Objetivo colectivo para todo el turno</p>
                </div>
              </div>
              <span className="text-2xl font-black text-amber-400">
                ${achievedSales.toFixed(2)} / ${targetSales.toFixed(2)}
              </span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-5 p-1 border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2 text-[10px] font-black text-slate-950"
                style={{ width: `${salesProgressPercent}%` }}
              >
                {salesProgressPercent}%
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Comandas Objetivos</span>
                <div className="text-xl font-bold text-white mt-1">
                  {achievedOrders} / {targetOrders} <span className="text-xs text-emerald-400 font-normal">({ordersProgressPercent}%)</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Ticket Promedio por Mesa</span>
                <div className="text-xl font-bold text-amber-400 mt-1">
                  ${(achievedSales / Math.max(1, achievedOrders)).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Calendar className="text-blue-400 w-5 h-5" /> Estado del Turno Actual
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400">Estado Turno</span>
                <div className="text-base font-extrabold text-emerald-400 mt-1 uppercase">
                  {currentShift?.status || 'ABIERTO'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400">Inicio de Turno</span>
                <div className="text-base font-extrabold text-white mt-1">
                  {currentShift?.startTime ? new Date(currentShift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:00 AM'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400">Ventas Mi Turno</span>
                <div className="text-base font-extrabold text-amber-400 mt-1">
                  ${currentShift?.totalSales || 380.00}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ranking del Personal</h3>
                <p className="text-xs text-slate-400">Top meseros y colaboradores de la jornada</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockLeaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    item.rank === 1
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.avatar}</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-sm text-amber-400">{item.sales}</div>
                    <div className="text-[10px] text-slate-400">{item.orders} comandas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 shrink-0 text-amber-400" />
            <div>
              <span className="font-bold block text-white">¡Premio del Día!</span>
              Alcanza el primer lugar para ganar el bono de propinas destacadas.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
