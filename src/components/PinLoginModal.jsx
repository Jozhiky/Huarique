import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lock, Delete, CheckCircle2, User, AlertCircle, X, ShieldCheck, UserCheck } from 'lucide-react';

export default function PinLoginModal({ isOpen, onClose }) {
  const { mozos, mozoActivo, setMozoActivoByPin } = useStore();
  const [selectedMozo, setSelectedMozo] = useState(mozoActivo || mozos[0]);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg('');
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (pinToVerify) => {
    const res = setMozoActivoByPin(pinToVerify);
    if (res.success) {
      setSuccessMsg(`¡Bienvenido(a), ${res.mozo.nombre}!`);
      setTimeout(() => {
        setSuccessMsg('');
        setPin('');
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.message);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-huarique-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg border border-huarique-100 p-6 md:p-8 relative transition-all">
        
        {/* Header close */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-huarique-400 hover:text-huarique-700 p-2 rounded-full hover:bg-huarique-50 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title & Logo Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-huarique-50 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner border border-huarique-200">
            <img src="/logo.png" alt="Huarique" className="w-12 h-12 object-contain" />
          </div>
          <h3 className="text-xl font-extrabold text-huarique-900">Acceso de Personal</h3>
          <p className="text-sm text-huarique-600 font-medium">Ingresa tu PIN de 6 dígitos para continuar</p>
        </div>

        {/* Mozo Selector Badges */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {mozos.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMozo(m);
                setPin('');
                setErrorMsg('');
              }}
              className={`flex items-center space-x-3 p-3 rounded-2xl border text-left transition ${
                selectedMozo?.id === m.id
                  ? 'border-huarique-500 bg-huarique-50 text-huarique-900 font-bold ring-2 ring-huarique-400/30'
                  : 'border-huarique-100 hover:border-huarique-300 text-huarique-700 bg-white'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm ${
                m.rol === 'duena' 
                  ? 'bg-huarique-500 text-white' 
                  : 'bg-huarique-100 text-huarique-800'
              }`}>
                {m.iniciales || m.nombre.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-[10px] font-bold text-huarique-500 uppercase tracking-wider">
                  {m.rol === 'duena' ? 'Administración' : 'Mozo'}
                </p>
                <p className="text-xs font-bold truncate text-huarique-900">{m.nombre}</p>
              </div>
            </button>
          ))}
        </div>

        {/* PIN Display (6 dots) */}
        <div className="flex justify-center items-center space-x-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > idx
                  ? 'bg-huarique-500 border-huarique-500 scale-110 shadow-touch'
                  : 'border-huarique-300 bg-huarique-50'
              }`}
            />
          ))}
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-sage-50 border border-sage-500/30 text-sage-700 text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Numpad grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-14 rounded-2xl bg-huarique-50 hover:bg-huarique-100 active:bg-huarique-200 text-huarique-900 text-xl font-bold border border-huarique-100 shadow-sm transition active:scale-95 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-700 text-xs font-bold transition flex items-center justify-center"
          >
            Limpiar
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-huarique-50 hover:bg-huarique-100 active:bg-huarique-200 text-huarique-900 text-xl font-bold border border-huarique-100 shadow-sm transition active:scale-95 flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-700 transition flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <p className="text-center text-[11px] text-huarique-400 font-medium">
          PINs de prueba: Juan (123456) | María (654321) | Carlos (112233) | Dueña (999999)
        </p>

      </div>
    </div>
  );
}
