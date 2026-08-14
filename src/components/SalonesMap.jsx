import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, PlusCircle, Receipt, CheckCircle, Clock, Users, Building2, Wine, Trees, ArrowLeft, ArrowRight, Plus } from 'lucide-react';

export default function SalonesMap({ onSelectMesaForComanda }) {
  const { salones, mesas, salonSeleccionadoId, setSalonSeleccionadoId, cobrarMesa, mozoActivo } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  const getSalonIcon = (iconType) => {
    switch (iconType) {
      case 'wine':
        return <Wine className="w-5 h-5 text-blue-600" />;
      case 'tree':
        return <Trees className="w-5 h-5 text-blue-600" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTimeElapsedStr = (isoTime) => {
    if (!isoTime) return '';
    const minutes = Math.floor((Date.now() - new Date(isoTime).getTime()) / 60000);
    if (minutes < 1) return 'Recién';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  // =========================================================================
  // PASO 1: SELECCIÓN DE SALONES - VISTA DE 2 COLUMNAS SOOTHING & CERO FATIGA
  // =========================================================================
  if (!salonSeleccionadoId) {
    return (
      <div className="space-y-4 py-2">
        
        {/* Compact Salon Header */}
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Selecciona Salón
            </h2>
            <span className="text-sm text-slate-300 font-bold">•</span>
            <span className="text-xs sm:text-sm text-slate-600 font-semibold truncate max-w-[180px]">
              Mozo: {mozoActivo?.nombre}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
            80 Mesas Totales
          </span>
        </div>

        {/* 3 Salones Cards Grid (2 Columns on Tablets for maximum width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {salones.map((salon, index) => {
            const salonMesas = mesas.filter(m => m.salonId === salon.id);
            const totalLibres = salonMesas.filter(m => m.estado === 'libre').length;
            const totalOcupadas = salonMesas.filter(m => m.estado === 'ocupada').length;
            const totalPorPagar = salonMesas.filter(m => m.estado === 'por_pagar').length;

            return (
              <div
                key={salon.id}
                onClick={() => setSalonSeleccionadoId(salon.id)}
                className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:border-blue-500 active:scale-[0.99] ${
                  index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  
                  {/* Icon & Mesas badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 p-2.5 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition shadow-xs">
                      {getSalonIcon(salon.iconType)}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {salon.totalMesas} Mesas
                    </span>
                  </div>

                  {/* Salon Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {salon.nombre}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                    {salon.rito}
                  </p>

                  {/* Status Pills */}
                  <div className="flex items-center justify-between gap-2 my-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <div className="flex-1">
                      <span className="block text-base sm:text-lg font-extrabold text-emerald-600">{totalLibres}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Libres</span>
                    </div>
                    <div className="w-px h-7 bg-slate-200"></div>
                    <div className="flex-1">
                      <span className="block text-base sm:text-lg font-extrabold text-amber-600">{totalOcupadas}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Ocupadas</span>
                    </div>
                    <div className="w-px h-7 bg-slate-200"></div>
                    <div className="flex-1">
                      <span className="block text-base sm:text-lg font-extrabold text-rose-600">{totalPorPagar}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Cobrar</span>
                    </div>
                  </div>

                </div>

                {/* Direct Action Button */}
                <button className="w-full py-3 px-4 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-touch transition mt-2">
                  <span>Ingresar a Mesas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // =========================================================================
  // PASO 2: MAPA DE MESAS - DENSIDAD ERGONÓMICA Y CERO CANSANCIO VISUAL
  // =========================================================================
  const currentSalon = salones.find(s => s.id === salonSeleccionadoId) || salones[0];
  const salonMesas = mesas.filter(m => m.salonId === currentSalon.id);

  const filteredMesas = salonMesas.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.numero.toString().includes(searchQuery) ||
      (m.mozoId && m.mozoId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesEstado = filterEstado === 'todos' || m.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const totalLibres = salonMesas.filter(m => m.estado === 'libre').length;
  const totalOcupadas = salonMesas.filter(m => m.estado === 'ocupada').length;
  const totalPorPagar = salonMesas.filter(m => m.estado === 'por_pagar').length;

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* Top Salon Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setSalonSeleccionadoId(null)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition active:scale-95 border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Volver a Salones</span>
          </button>

          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
              {currentSalon.nombre}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {currentSalon.rito} • ({currentSalon.totalMesas} mesas)
            </p>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
          {salonMesas.length} Mesas
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterEstado('todos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              filterEstado === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todas ({salonMesas.length})
          </button>
          
          <button
            onClick={() => setFilterEstado('libre')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              filterEstado === 'libre'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Libres ({totalLibres})</span>
          </button>

          <button
            onClick={() => setFilterEstado('ocupada')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              filterEstado === 'ocupada'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Ocupadas ({totalOcupadas})</span>
          </button>

          <button
            onClick={() => setFilterEstado('por_pagar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              filterEstado === 'por_pagar'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Cobrar ({totalPorPagar})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar mesa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 shadow-xs"
          />
        </div>

      </div>

      {/* Mesas Cards Grid (High Density Clean Tile Layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredMesas.map((mesa) => {
          const isLibre = mesa.estado === 'libre';
          const isOcupada = mesa.estado === 'ocupada';

          return (
            <div
              key={mesa.id}
              className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between hover:shadow-md text-left ${
                isLibre
                  ? 'bg-white border-slate-200 hover:border-emerald-500'
                  : isOcupada
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
                  : 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
              }`}
            >
              
              {/* Tile Top Row: Table Badge & Capacity */}
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-base shadow-xs ${
                  isLibre
                    ? 'bg-slate-100 text-slate-800 border border-slate-200'
                    : isOcupada
                    ? 'bg-amber-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}>
                  M{mesa.numero}
                </div>

                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mesa.capacidad}p</span>
                </div>
              </div>

              {/* Tile Middle Info: Status & Price */}
              <div className="my-1.5 space-y-1 min-h-[40px] flex flex-col justify-center">
                {isLibre ? (
                  <span className="inline-block text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                    LIBRE
                  </span>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={`uppercase px-2 py-0.5 rounded-md ${
                        isOcupada ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isOcupada ? 'OCUPADA' : 'POR PAGAR'}
                      </span>
                      {mesa.tiempoInicio && (
                        <span className="text-slate-500 font-semibold flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{getTimeElapsedStr(mesa.tiempoInicio)}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      S/ {mesa.totalActual.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Tile Bottom Action Buttons */}
              <div className="pt-2.5 border-t border-slate-100">
                {isLibre ? (
                  <button
                    onClick={() => onSelectMesaForComanda(mesa)}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tomar Pedido</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => onSelectMesaForComanda(mesa)}
                      className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Ver / Agregar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`¿Desear cobrar y liberar la Mesa ${mesa.numero} (Total: S/ ${mesa.totalActual.toFixed(2)})?`)) {
                          cobrarMesa(mesa.id);
                        }
                      }}
                      className="w-full py-1.5 px-2 rounded-lg font-semibold text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Cobrar</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
