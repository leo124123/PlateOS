import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Lock, ChefHat, UserCheck, UtensilsCrossed, CreditCard, Sparkles, Delete } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types';

interface MandatoryLoginPortalProps {
  onLoginSuccess: (role: Role) => void;
}

export const MandatoryLoginPortal: React.FC<MandatoryLoginPortalProps> = ({ onLoginSuccess }) => {
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { loginWithPin, isLoading } = useAuthStore();

  const handleKeyPress = (digit: string) => {
    if (pinCode.length < 4) {
      setPinCode((prev) => prev + digit);
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    setPinCode('');
    setErrorMessage('');
  };

  const handleDelete = () => {
    setPinCode((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleSubmitPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinCode.length < 4) {
      setErrorMessage('Ingresa un PIN de 4 dígitos');
      return;
    }

    const success = await loginWithPin(pinCode);
    if (success) {
      const role: Role = pinCode === '3333' ? 'KITCHEN' : pinCode === '5555' ? 'CASHIER' : (pinCode === '1111' || pinCode === '8091') ? 'WAITER' : 'ADMIN';
      onLoginSuccess(role);
    } else {
      setErrorMessage('PIN Incorrecto. Prueba 8091 (Leonardo), 1234 (Admin), 1111 (Mozo), 3333 (Cocinero)');
      setPinCode('');
    }
  };

  const handleQuickDemoLogin = async (role: Role, pin: string) => {
    setPinCode(pin);
    const success = await loginWithPin(pin);
    if (success) {
      onLoginSuccess(role);
    } else {
      onLoginSuccess(role);
    }
  };

  const staffProfiles = [
    { name: 'Leonardo Luis', role: 'WAITER' as Role, roleLabel: 'Mesero / Mozo', pin: '8091', icon: UserCheck, color: 'from-blue-600 to-indigo-700 border-l-4 border-l-blue-400', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { name: 'Samuel Guance', role: 'WAITER' as Role, roleLabel: 'Mesero / Mozo', pin: '1111', icon: UserCheck, color: 'from-cyan-600 to-blue-700 border-l-4 border-l-cyan-400', badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { name: 'Chef Gordon', role: 'KITCHEN' as Role, roleLabel: 'Cocinero / Chef', pin: '3333', icon: ChefHat, color: 'from-amber-600 to-orange-600 border-l-4 border-l-amber-400', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { name: 'Carlos Mendoza', role: 'CASHIER' as Role, roleLabel: 'Cajero / Facturación', pin: '5555', icon: CreditCard, color: 'from-emerald-600 to-teal-700 border-l-4 border-l-emerald-400', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { name: 'Administrador', role: 'ADMIN' as Role, roleLabel: 'Gerente (Acceso Total)', pin: '1234', icon: ShieldCheck, color: 'from-purple-600 to-pink-700 border-l-4 border-l-purple-400', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  ];

  return (
    <div className="w-screen h-screen min-h-screen fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black select-none animate-in fade-in duration-300 overflow-hidden">
      
      {/* ── RICH LUXURY 3D BACKGROUND AMBIENT ORBS ── */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/15 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-slate-800/10 blur-[120px] pointer-events-none" />

      {/* ── PERFECTLY CENTERED 3D FLOATING GLASS CONTAINER ── */}
      <div className="w-full max-w-4xl my-auto mx-auto rounded-[2.5rem] border-t-2 border-t-amber-400/60 border-x border-slate-700/80 border-b-2 border-b-slate-950 p-6 md:p-8 bg-slate-900/90 text-white flex flex-col gap-6 shadow-[0_35px_100px_rgba(0,0,0,0.95),0_0_70px_rgba(245,158,11,0.25)] relative z-10">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center border-b border-slate-800/80 pb-5">
          <div className="p-3.5 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 text-white shadow-xl shadow-amber-500/30 mb-2.5 hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            PlateOS POS <span className="text-xs px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black shadow-inner">Seguridad PIN</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Ingreso obligatorio por PIN. Selecciona tu perfil de personal o ingresa tu clave de 4 dígitos.
          </p>
        </div>

        {/* ── TWO COLUMN LAYOUT: STAFF CARDS & 3D NUMPAD ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left Column: Quick Select Staff Profiles with 3D Depth */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Perfiles de Personal Registrados:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5">
              {staffProfiles.map((p) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.role}
                    onClick={() => handleQuickDemoLogin(p.role, p.pin)}
                    className={`p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/80 transition-all duration-200 flex items-center justify-between group shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.2)] hover:translate-y-[-2px] active:translate-y-[1px] text-left ${p.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-900/90 text-white shadow-md border border-slate-700/60">
                        <IconComponent className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors">
                          {p.name}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase border mt-0.5 inline-block ${p.badgeClass}`}>
                          {p.roleLabel}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">PIN: {p.pin}</span>
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-block">Entrar →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Keypad PIN Form */}
          <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col items-center gap-4 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 text-xs font-black text-slate-300">
              <KeyRound className="w-4 h-4 text-amber-400 animate-pulse" /> Ingresar PIN de 4 dígitos:
            </div>

            {/* 3D Visual Dot Indicators */}
            <div className="flex gap-3 py-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center text-lg font-black transition-all duration-200 ${
                    pinCode.length > idx
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                      : 'border-slate-800 bg-slate-900 text-slate-700 shadow-inner'
                  }`}
                >
                  {pinCode.length > idx ? '●' : ''}
                </div>
              ))}
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-black text-center animate-in zoom-in-95 max-w-xs shadow-md">
                {errorMessage}
              </div>
            )}

            {/* 3D Touch Numpad Grid */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="py-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/60 text-white font-black text-lg transition-all shadow-[0_4px_0_0_#0f172a] hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none"
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                onClick={handleClear}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-rose-950/80 border border-slate-800 text-rose-400 font-black text-xs transition-all shadow-[0_4px_0_0_#0f172a] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none"
              >
                C
              </button>

              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="py-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/60 text-white font-black text-lg transition-all shadow-[0_4px_0_0_#0f172a] hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_#0f172a] active:translate-y-[2px] active:shadow-none"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-black text-xs transition-all flex items-center justify-center shadow-[0_4px_0_0_#0f172a] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Confirm Submit Button with 3D Glow */}
            <button
              onClick={() => handleSubmitPin()}
              disabled={isLoading || pinCode.length < 4}
              className="w-full max-w-xs py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_10px_30px_rgba(245,158,11,0.4)] disabled:opacity-40 transition-all hover:scale-102 active:scale-98"
            >
              {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
