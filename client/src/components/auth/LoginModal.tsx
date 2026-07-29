import React, { useState } from 'react';
import { KeyRound, Mail, Lock, ShieldCheck, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'PIN' | 'EMAIL'>('PIN');
  const [pinCode, setPinCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { loginWithPin, loginWithEmail, isLoading } = useAuthStore();

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (pinCode.length < 4) {
      setErrorMessage('El PIN debe ser de 4 dígitos');
      return;
    }
    const success = await loginWithPin(pinCode);
    if (success) {
      onClose();
    } else {
      setErrorMessage('PIN incorrecto. Intenta con 1234, 5678 o 9999.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const success = await loginWithEmail(email, password);
    if (success) {
      onClose();
    } else {
      setErrorMessage('Credenciales inválidas.');
    }
  };

  const handlePinKeyPress = (num: string) => {
    if (pinCode.length < 4) {
      setPinCode((prev) => prev + num);
    }
  };

  const handlePinClear = () => {
    setPinCode('');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Ingreso de Personal</h3>
              <p className="text-xs text-slate-400">Selecciona tu método de autenticación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 my-4 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setTab('PIN'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'PIN' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" /> PIN Rápido
          </button>
          <button
            onClick={() => { setTab('EMAIL'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'EMAIL' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" /> Correo / Password
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-center font-bold">
            {errorMessage}
          </div>
        )}

        {tab === 'PIN' ? (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="flex justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                    pinCode.length > idx
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-105'
                      : 'border-slate-800 bg-slate-900 text-slate-600'
                  }`}
                >
                  {pinCode.length > idx ? '●' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinKeyPress(num)}
                  className="py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-extrabold text-lg transition-all active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePinClear}
                className="py-3 rounded-2xl bg-slate-900 border border-slate-800 text-rose-400 font-bold text-xs hover:bg-rose-500/10"
              >
                Borrar
              </button>
              <button
                type="button"
                onClick={() => handlePinKeyPress('0')}
                className="py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-extrabold text-lg transition-all active:scale-95"
              >
                0
              </button>
              <button
                type="submit"
                disabled={isLoading || pinCode.length < 4}
                className="py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 disabled:opacity-40"
              >
                Entrar
              </button>
            </div>
            
            <p className="text-[11px] text-center text-slate-500 pt-2">
              Prueba PINs predeterminados: <b>1234</b> (Admin), <b>5678</b> (Mesero), <b>9999</b> (Cocina)
            </p>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="admin@plateos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
