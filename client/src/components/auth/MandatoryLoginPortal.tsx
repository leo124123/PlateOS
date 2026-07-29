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
  const [selectedStaffRole, setSelectedStaffRole] = useState<Role | null>(null);

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
      // Determine role from pin or default fallback
      const role: Role = pinCode === '3333' ? 'KITCHEN' : pinCode === '5555' ? 'CASHIER' : pinCode === '1111' ? 'WAITER' : 'ADMIN';
      onLoginSuccess(role);
    } else {
      setErrorMessage('PIN Incorrecto. Prueba 1234 (Admin), 1111 (Mozo), 3333 (Cocinero), 5555 (Cajero)');
      setPinCode('');
    }
  };

  const handleQuickDemoLogin = async (role: Role, pin: string) => {
    setPinCode(pin);
    const success = await loginWithPin(pin);
    if (success) {
      onLoginSuccess(role);
    } else {
      // Direct state set for demo mode if backend fails
      onLoginSuccess(role);
    }
  };

  const staffProfiles = [
    { name: 'Samuel Guance', role: 'WAITER' as Role, roleLabel: 'Mesero / Mozo', pin: '1111', icon: UserCheck, color: 'from-blue-600 to-indigo-700', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { name: 'Chef Gordon', role: 'KITCHEN' as Role, roleLabel: 'Cocinero / Chef', pin: '3333', icon: ChefHat, color: 'from-amber-600 to-orange-600', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { name: 'Carlos Mendoza', role: 'CASHIER' as Role, roleLabel: 'Cajero / Facturación', pin: '5555', icon: CreditCard, color: 'from-emerald-600 to-teal-700', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { name: 'Administrador', role: 'ADMIN' as Role, roleLabel: 'Gerente (Acceso Total)', pin: '1234', icon: ShieldCheck, color: 'from-purple-600 to-pink-700', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl select-none animate-in fade-in duration-300">
      <div className="w-full max-w-4xl glass-panel rounded-3xl border border-slate-700/80 p-6 md:p-8 shadow-2xl bg-slate-900/95 text-white flex flex-col gap-6">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center border-b border-slate-800 pb-5">
          <div className="p-3.5 rounded-3xl bg-gradient-to-tr from-amber-500 to-red-600 text-white shadow-xl shadow-amber-500/20 mb-2.5">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            PlateOS POS <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">Seguridad PIN</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Ingreso obligatorio por PIN. Selecciona tu perfil de personal o ingresa tu clave de 4 dígitos.
          </p>
        </div>

        {/* ── TWO COLUMN LAYOUT: STAFF CARDS & NUMPAD ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left Column: Quick Select Staff Profiles */}
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
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/60 transition-all flex items-center justify-between group shadow-md text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-r ${p.color} text-white shadow-md`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white group-hover:text-amber-400 transition-colors">
                          {p.name}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase border mt-0.5 inline-block ${p.badgeClass}`}>
                          {p.roleLabel}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 block">PIN: {p.pin}</span>
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider group-hover:underline">Entrar →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Keypad PIN Form */}
          <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800/90 flex flex-col items-center gap-4 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300">
              <KeyRound className="w-4 h-4 text-amber-400" /> Ingresar PIN de 4 dígitos:
            </div>

            {/* Visual Dot Indicators */}
            <div className="flex gap-3 py-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center text-lg font-black transition-all ${
                    pinCode.length > idx
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-110 shadow-lg shadow-amber-500/20'
                      : 'border-slate-800 bg-slate-900 text-slate-700'
                  }`}
                >
                  {pinCode.length > idx ? '●' : ''}
                </div>
              ))}
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-extrabold text-center animate-in zoom-in-95 max-w-xs">
                {errorMessage}
              </div>
            )}

            {/* Touch Numpad Grid */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-extrabold text-lg transition-all active:scale-95 shadow-sm"
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                onClick={handleClear}
                className="py-3 rounded-2xl bg-slate-900/80 hover:bg-rose-950 border border-slate-800 text-rose-400 font-extrabold text-xs transition-all"
              >
                C
              </button>

              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-extrabold text-lg transition-all active:scale-95 shadow-sm"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 font-extrabold text-xs transition-all flex items-center justify-center"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Confirm Submit Button */}
            <button
              onClick={() => handleSubmitPin()}
              disabled={isLoading || pinCode.length < 4}
              className="w-full max-w-xs py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 disabled:opacity-40 transition-all"
            >
              {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
