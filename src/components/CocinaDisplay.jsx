import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UtensilsCrossed, Clock, Printer, CheckCircle, Flame, AlertTriangle, ArrowRight, User } from 'lucide-react';

export default function CocinaDisplay() {
  const { comandas, cambiarEstadoComanda, setTicketImprimir } = useStore();
  const [filterState, setFilterState] = useState('todas');

  // Filter active kitchen comandas (exclude cobrado)
  const activeComandas = comandas.filter(c => c.estado !== 'cobrado');

  const filteredComandas = activeComandas.filter(c => {
    if (filterState === 'todas') return true;
    return c.estado === filterState;
  });

  const getTimeElapsedStr = (isoTime) => {
    if (!isoTime) return '0 min';
    const minutes = Math.floor((Date.now() - new Date(isoTime).getTime()) / 60000);
    if (minutes < 1) return '¡Recién ingresada!';
    return `${minutes} min`;
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'pendiente':
        return (
          <span className="flex items-center space-x-1 bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-extrabold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>PENDIENTE</span>
          </span>
        );
      case 'en_preparacion':
        return (
          <span className="flex items-center space-x-1 bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-extrabold">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>EN PREPARACIÓN</span>
          </span>
        );
      case 'listo':
        return (
          <span className="flex items-center space-x-1 bg-sage-100 text-sage-800 text-xs px-3 py-1 rounded-full font-extrabold">
            <CheckCircle className="w-3.5 h-3.5 text-sage-600" />
            <span>LISTO PARA SERVIR</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-huarique-100 shadow-soft">
        <div>
          <h2 className="text-xl font-extrabold text-huarique-900 flex items-center space-x-2.5">
            <UtensilsCrossed className="w-6 h-6 text-huarique-500" />
            <span>Pantalla de Cocina & Impresión</span>
          </h2>
          <p className="text-xs text-huarique-500 font-medium">
            Monitor de comandas enviadas por los mozos en tiempo real
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterState('todas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterState === 'todas'
                ? 'bg-huarique-900 text-white shadow-sm'
                : 'bg-huarique-50 text-huarique-700 hover:bg-huarique-100 border border-huarique-200'
            }`}
          >
            Todas ({activeComandas.length})
          </button>
          
          <button
            onClick={() => setFilterState('pendiente')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterState === 'pendiente'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            Pendientes ({activeComandas.filter(c => c.estado === 'pendiente').length})
          </button>

          <button
            onClick={() => setFilterState('en_preparacion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterState === 'en_preparacion'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            En Cocción ({activeComandas.filter(c => c.estado === 'en_preparacion').length})
          </button>

          <button
            onClick={() => setFilterState('listo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterState === 'listo'
                ? 'bg-sage-600 text-white shadow-sm'
                : 'bg-sage-50 text-sage-700 border border-sage-200 hover:bg-sage-100'
            }`}
          >
            Listos ({activeComandas.filter(c => c.estado === 'listo').length})
          </button>
        </div>

      </div>

      {/* Comandas Grid Cards */}
      {filteredComandas.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-huarique-100 text-center shadow-soft">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-huarique-300 mb-3" />
          <h3 className="text-base font-extrabold text-huarique-800">
            No hay comandas activas en esta categoría
          </h3>
          <p className="text-xs text-huarique-500 mt-1">
            Los pedidos enviados desde las mesas de los 3 salones aparecerán aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComandas.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-white rounded-3xl border border-huarique-100 p-5 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition"
            >
              
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-huarique-100 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-huarique-500 text-white font-extrabold text-xl flex items-center justify-center shadow-touch">
                      M{cmd.mesaNumero}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-huarique-900 leading-tight">
                        Mesa {cmd.mesaNumero}
                      </h4>
                      <p className="text-xs font-semibold text-huarique-500">
                        {cmd.salonNombre}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {getStatusBadge(cmd.estado)}
                    <p className="text-[11px] font-semibold text-huarique-400 mt-1 flex items-center justify-end space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeElapsedStr(cmd.creadoEn)}</span>
                    </p>
                  </div>
                </div>

                {/* Waiter badge */}
                <div className="flex items-center space-x-2 text-xs font-semibold text-huarique-600 bg-huarique-50 p-2 rounded-xl border border-huarique-100 mb-4">
                  <User className="w-3.5 h-3.5 text-huarique-400" />
                  <span>Mozo: <strong className="text-huarique-900">{cmd.mozoNombre}</strong></span>
                </div>

                {/* Dish Items List */}
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                  {cmd.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-2 rounded-xl bg-huarique-50/60 text-xs border border-huarique-100/50"
                    >
                      <div className="pr-2">
                        <span className="font-extrabold text-huarique-900 mr-2">
                          {item.cantidad}x
                        </span>
                        <span className="font-bold text-huarique-800">
                          {item.nombre}
                        </span>
                        {item.nota && (
                          <p className="text-[11px] font-semibold text-terracotta-600 italic mt-0.5">
                            * Obs: {item.nota}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-huarique-500 whitespace-nowrap">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {cmd.notaGeneral && (
                  <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
                    💬 Nota general: {cmd.notaGeneral}
                  </div>
                )}
              </div>

              {/* Card Action Buttons */}
              <div className="pt-4 border-t border-huarique-100 space-y-2">
                
                <div className="flex items-center justify-between text-xs font-extrabold text-huarique-900 mb-2">
                  <span>TOTAL:</span>
                  <span className="text-sm text-huarique-800">S/ {cmd.total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTicketImprimir(cmd)}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-huarique-100 hover:bg-huarique-200 text-huarique-800 transition flex items-center justify-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-huarique-600" />
                    <span>Imprimir</span>
                  </button>

                  {cmd.estado === 'pendiente' && (
                    <button
                      onClick={() => cambiarEstadoComanda(cmd.id, 'en_preparacion')}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white transition shadow-touch flex items-center justify-center space-x-1.5"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Cocinar</span>
                    </button>
                  )}

                  {cmd.estado === 'en_preparacion' && (
                    <button
                      onClick={() => cambiarEstadoComanda(cmd.id, 'listo')}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-sage-500 hover:bg-sage-600 text-white transition shadow-touch flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Listo</span>
                    </button>
                  )}

                  {cmd.estado === 'listo' && (
                    <div className="py-2.5 px-3 rounded-xl font-bold text-xs bg-sage-100 text-sage-800 text-center flex items-center justify-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5 text-sage-600" />
                      <span>Listo p/ Servir</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
