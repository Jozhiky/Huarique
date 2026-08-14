import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Delete, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginScreen() {
  const { mozos, loginWithPin } = useStore();
  const [selectedMozo, setSelectedMozo] = useState(mozos[0]);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 6 && !isSuccess) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg('');
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (!isSuccess) {
      setPin(prev => prev.slice(0, -1));
      setErrorMsg('');
    }
  };

  const handleClear = () => {
    if (!isSuccess) {
      setPin('');
      setErrorMsg('');
    }
  };

  const verifyPin = (pinToVerify) => {
    const res = loginWithPin(pinToVerify);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMsg(res.message);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-huarique-50 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans select-none">
      
      {/* Background Subtle Spheres */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-huarique-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-huarique-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card - Responsive Mobile & Tablet */}
      <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-4xl shadow-soft-lg border border-huarique-100 p-5 sm:p-8 relative z-10 space-y-4 sm:space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-huarique-50 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center p-2 border border-huarique-200/80 shadow-inner">
            <img src="/logo.png" alt="Huarique de Catacaos" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-huarique-900 tracking-tight">
              HUARIQUE DE CATACAOS
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-huarique-500 uppercase tracking-widest mt-0.5">
              Terminal de Comandas
            </p>
          </div>
        </div>

        {/* User Badges Grid */}
        <div>
          <label className="block text-[11px] font-extrabold text-huarique-600 uppercase tracking-wider text-center mb-2">
            Selecciona tu usuario:
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {mozos.map((m) => {
              const isSelected = selectedMozo?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMozo(m);
                    setPin('');
                    setErrorMsg('');
                  }}
                  className={`flex items-center space-x-2.5 p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-huarique-500 bg-huarique-50 text-huarique-900 font-bold ring-2 ring-huarique-400/30 shadow-sm'
                      : 'border-huarique-100 hover:border-huarique-200 text-huarique-700 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 ${
                    m.rol === 'duena' 
                      ? 'bg-huarique-500 text-white' 
                      : 'bg-huarique-100 text-huarique-800'
                  }`}>
                    {m.iniciales}
                  </div>
                  <div className="truncate min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-bold text-huarique-500 uppercase tracking-wider truncate">
                      {m.rol === 'duena' ? 'Dueña' : 'Mozo'}
                    </p>
                    <p className="text-xs font-extrabold truncate text-huarique-900">{m.nombre}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Dots */}
        <div className="py-1">
          <div className="flex justify-center items-center space-x-3 mb-1.5">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-huarique-500 border-huarique-500 scale-125 shadow-touch'
                    : 'border-huarique-300 bg-huarique-50'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-[11px] text-huarique-500 font-semibold">
            Ingresa tu PIN de 6 dígitos
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 rounded-2xl bg-sage-50 border border-sage-500/30 text-sage-800 text-xs font-bold flex items-center justify-center space-x-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0" />
            <span>¡Ingreso correcto! Abriendo...</span>
          </div>
        )}

        {/* Responsive Numpad */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-12 sm:h-14 rounded-2xl bg-huarique-50 hover:bg-huarique-100 active:bg-huarique-200 text-huarique-900 text-xl font-black border border-huarique-100 shadow-sm transition active:scale-95 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={handleClear}
            className="h-12 sm:h-14 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-700 text-xs font-extrabold uppercase tracking-wider transition active:scale-95 flex items-center justify-center"
          >
            Limpiar
          </button>
          
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 sm:h-14 rounded-2xl bg-huarique-50 hover:bg-huarique-100 active:bg-huarique-200 text-huarique-900 text-xl font-black border border-huarique-100 shadow-sm transition active:scale-95 flex items-center justify-center"
          >
            0
          </button>
          
          <button
            onClick={handleDelete}
            className="h-12 sm:h-14 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-700 transition active:scale-95 flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center text-[10px] sm:text-[11px] text-huarique-400 font-medium pt-1">
          <p className="flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-huarique-500" />
            <span>Terminal Móvil & Tablet (3 Salones - 80 Mesas)</span>
          </p>
        </div>

      </div>

    </div>
  );
}
