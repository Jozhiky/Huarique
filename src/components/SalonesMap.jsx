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
        return <Wine className="w-6 h-6 text-huarique-600" />;
      case 'tree':
        return <Trees className="w-6 h-6 text-huarique-600" />;
      case 'building':
      default:
        return <Building2 className="w-6 h-6 text-huarique-600" />;
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
  // PASO 1: SELECCIÓN COMPACTA DE SALONES (0 SCROLL)
  // =========================================================================
  if (!salonSeleccionadoId) {
    return (
      <div className="space-y-4 py-2">
        
        {/* Compact Salon Header */}
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-3xl border border-huarique-100 shadow-soft">
          <div className="flex items-center space-x-3">
            <h2 className="text-base sm:text-xl font-black text-huarique-900 tracking-tight">
              Selecciona Salón
            </h2>
            <span className="text-sm text-huarique-400 font-bold">•</span>
            <span className="text-xs sm:text-sm text-huarique-600 font-extrabold truncate max-w-[180px]">
              Mozo: {mozoActivo?.nombre}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-black text-huarique-800 bg-huarique-50 px-3.5 py-1.5 rounded-2xl border border-huarique-200">
            80 Mesas Totales
          </span>
        </div>

        {/* 3 Salones Cards Grid (Optimized for all Tablets & Phones) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {salones.map((salon) => {
            const salonMesas = mesas.filter(m => m.salonId === salon.id);
            const totalLibres = salonMesas.filter(m => m.estado === 'libre').length;
            const totalOcupadas = salonMesas.filter(m => m.estado === 'ocupada').length;
            const totalPorPagar = salonMesas.filter(m => m.estado === 'por_pagar').length;

            return (
              <div
                key={salon.id}
                onClick={() => setSalonSeleccionadoId(salon.id)}
                className="bg-white rounded-3xl sm:rounded-4xl border border-huarique-100 p-5 sm:p-6 shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group border-2 hover:border-huarique-500 active:scale-[0.98]"
              >
                <div>
                  
                  {/* Icon & Mesas badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-huarique-50 p-2.5 border border-huarique-200 flex items-center justify-center group-hover:bg-huarique-500 group-hover:text-white transition shadow-sm">
                      {getSalonIcon(salon.iconType)}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-huarique-50 text-huarique-800 border border-huarique-100">
                      {salon.totalMesas} Mesas
                    </span>
                  </div>

                  {/* Salon Title */}
                  <h3 className="text-base sm:text-lg font-black text-huarique-900 group-hover:text-huarique-600 transition leading-snug">
                    {salon.nombre}
                  </h3>
                  <p className="text-xs font-bold text-huarique-400 uppercase tracking-wider mt-1">
                    {salon.rito}
                  </p>

                  {/* Status Pills */}
                  <div className="grid grid-cols-3 gap-2 my-3.5 p-2.5 bg-huarique-50/80 rounded-2xl border border-huarique-100 text-center text-xs">
                    <div>
                      <span className="block text-sm sm:text-base font-black text-sage-600">{totalLibres}</span>
                      <span className="text-[10px] sm:text-xs font-extrabold text-huarique-500 uppercase">Libres</span>
                    </div>
                    <div>
                      <span className="block text-sm sm:text-base font-black text-amber-600">{totalOcupadas}</span>
                      <span className="text-[10px] sm:text-xs font-extrabold text-huarique-500 uppercase">Ocupadas</span>
                    </div>
                    <div>
                      <span className="block text-sm sm:text-base font-black text-terracotta-600">{totalPorPagar}</span>
                      <span className="text-[10px] sm:text-xs font-extrabold text-huarique-500 uppercase">Cobrar</span>
                    </div>
                  </div>

                </div>

                {/* Direct Action Button */}
                <button className="w-full py-3.5 px-4 rounded-2xl bg-huarique-500 group-hover:bg-huarique-600 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-touch transition mt-2">
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
  // PASO 2: MAPA DE MESAS - ALTA LEGIBILIDAD & BOTONES GRANDES PARA TABLET
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
  const totalRecaudadoSalon = salonMesas.reduce((sum, m) => sum + (m.totalActual || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Salon Header */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-huarique-100 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setSalonSeleccionadoId(null)}
            className="flex items-center space-x-2 px-4 py-2.5 sm:py-3 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-900 font-black text-xs sm:text-sm transition active:scale-95 border border-huarique-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-huarique-800" />
            <span>Volver a Salones</span>
          </button>

          <div>
            <h2 className="text-base sm:text-xl font-black text-huarique-900 leading-tight">
              {currentSalon.nombre}
            </h2>
            <p className="text-xs font-extrabold text-huarique-500 mt-0.5">
              {currentSalon.rito} • ({currentSalon.totalMesas} mesas)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-huarique-50 px-4 py-2.5 rounded-2xl border border-huarique-200 text-xs sm:text-sm font-bold">
          <span className="text-huarique-500 font-extrabold">Consumo:</span>
          <span className="text-sm sm:text-base font-black text-huarique-900">S/ {totalRecaudadoSalon.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterEstado('todos')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
              filterEstado === 'todos'
                ? 'bg-huarique-900 text-white shadow-sm'
                : 'bg-white text-huarique-600 hover:bg-huarique-100 border border-huarique-200'
            }`}
          >
            Todas ({salonMesas.length})
          </button>
          
          <button
            onClick={() => setFilterEstado('libre')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
              filterEstado === 'libre'
                ? 'bg-sage-500 text-white shadow-sm'
                : 'bg-sage-50 text-sage-800 border border-sage-500/30 hover:bg-sage-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
            <span>Libres ({totalLibres})</span>
          </button>

          <button
            onClick={() => setFilterEstado('ocupada')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
              filterEstado === 'ocupada'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900 border border-amber-500/30 hover:bg-amber-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Ocupadas ({totalOcupadas})</span>
          </button>

          <button
            onClick={() => setFilterEstado('por_pagar')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap ${
              filterEstado === 'por_pagar'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-terracotta-50 text-terracotta-900 border border-terracotta-500/30 hover:bg-terracotta-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500"></span>
            <span>Cobrar ({totalPorPagar})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-huarique-400" />
          <input
            type="text"
            placeholder="Buscar mesa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-huarique-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-huarique-400 text-huarique-900 shadow-sm"
          />
        </div>

      </div>

      {/* Mesas Cards Grid (High Density Tile Layout for Tablets & Mobiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
        {filteredMesas.map((mesa) => {
          const isLibre = mesa.estado === 'libre';
          const isOcupada = mesa.estado === 'ocupada';

          return (
            <div
              key={mesa.id}
              className={`rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-soft text-left ${
                isLibre
                  ? 'bg-white border-sage-200 hover:border-sage-500'
                  : isOcupada
                  ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
                  : 'bg-terracotta-50/70 border-terracotta-300 hover:border-terracotta-500'
              }`}
            >
              
              {/* Tile Top Row: Table Badge & Capacity */}
              <div className="flex items-center justify-between mb-2">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-sm sm:text-lg shadow-sm ${
                  isLibre
                    ? 'bg-sage-100 text-sage-900 border border-sage-300'
                    : isOcupada
                    ? 'bg-amber-500 text-white shadow-touch'
                    : 'bg-terracotta-500 text-white shadow-touch'
                }`}>
                  M{mesa.numero}
                </div>

                <div className="flex items-center space-x-1 text-xs font-black text-huarique-700 bg-huarique-50 px-2.5 py-1 rounded-xl border border-huarique-200">
                  <Users className="w-3.5 h-3.5 text-huarique-400" />
                  <span>{mesa.capacidad}p</span>
                </div>
              </div>

              {/* Tile Middle Info: Status & Price */}
              <div className="my-2 space-y-1 min-h-[44px] flex flex-col justify-center">
                {isLibre ? (
                  <span className="inline-block text-xs uppercase font-black tracking-wider px-2.5 py-1 rounded-xl bg-sage-100 text-sage-800 border border-sage-200 w-fit">
                    LIBRE
                  </span>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className={`uppercase px-2 py-0.5 rounded-lg ${
                        isOcupada ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-terracotta-100 text-terracotta-900 border border-terracotta-300'
                      }`}>
                        {isOcupada ? 'OCUPADA' : 'POR PAGAR'}
                      </span>
                      {mesa.tiempoInicio && (
                        <span className="text-huarique-600 font-extrabold flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-huarique-400" />
                          <span>{getTimeElapsedStr(mesa.tiempoInicio)}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base font-black text-huarique-900 mt-1">
                      S/ {mesa.totalActual.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Tile Bottom Action Buttons */}
              <div className="pt-3 border-t border-huarique-100/80">
                {isLibre ? (
                  <button
                    onClick={() => onSelectMesaForComanda(mesa)}
                    className="w-full py-3 px-3 rounded-2xl font-black text-xs sm:text-sm bg-sage-500 hover:bg-sage-600 active:scale-95 text-white shadow-touch transition flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tomar Pedido</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => onSelectMesaForComanda(mesa)}
                      className="w-full py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm bg-huarique-500 hover:bg-huarique-600 active:scale-95 text-white transition flex items-center justify-center space-x-1.5 shadow-touch"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Ver / Agregar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`¿Desear cobrar y liberar la Mesa ${mesa.numero} (Total: S/ ${mesa.totalActual.toFixed(2)})?`)) {
                          cobrarMesa(mesa.id);
                        }
                      }}
                      className="w-full py-2 px-2 rounded-xl font-extrabold text-xs bg-huarique-100 hover:bg-huarique-200 text-huarique-900 border border-huarique-200 transition flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-sage-600" />
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
