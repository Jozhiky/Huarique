import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, PlusCircle, Receipt, CheckCircle, Clock, Users, Building2, Wine, Trees, ArrowLeft, ArrowRight } from 'lucide-react';

export default function SalonesMap({ onSelectMesaForComanda }) {
  const { salones, mesas, salonSeleccionadoId, setSalonSeleccionadoId, cobrarMesa, mozoActivo } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  const getSalonIcon = (iconType) => {
    switch (iconType) {
      case 'wine':
        return <Wine className="w-5 h-5 text-huarique-600" />;
      case 'tree':
        return <Trees className="w-5 h-5 text-huarique-600" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5 text-huarique-600" />;
    }
  };

  const getTimeElapsedStr = (isoTime) => {
    if (!isoTime) return '';
    const minutes = Math.floor((Date.now() - new Date(isoTime).getTime()) / 60000);
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours}h ${minutes % 60}m`;
  };

  // =========================================================================
  // PASO 1: SELECCIÓN DE SALONES - DUAL DESIGN PARA PORTRAIT (712px) Y LANDSCAPE
  // =========================================================================
  if (!salonSeleccionadoId) {
    return (
      <div className="space-y-3 py-1">
        
        {/* Compact Salon Header */}
        <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-huarique-100 shadow-soft">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-black text-huarique-900 tracking-tight">
              Selecciona Salón
            </h2>
            <span className="text-xs text-huarique-400 font-bold">•</span>
            <span className="text-xs text-huarique-600 font-extrabold truncate max-w-[140px]">
              Mozo: {mozoActivo?.nombre}
            </span>
          </div>
          <span className="text-[11px] font-black text-huarique-700 bg-huarique-50 px-2.5 py-1 rounded-xl border border-huarique-100">
            80 Mesas
          </span>
        </div>

        {/* 3 Salones Cards (Optimized for Galaxy Tab S4 Portrait 712px & Landscape) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {salones.map((salon) => {
            const salonMesas = mesas.filter(m => m.salonId === salon.id);
            const totalLibres = salonMesas.filter(m => m.estado === 'libre').length;
            const totalOcupadas = salonMesas.filter(m => m.estado === 'ocupada').length;
            const totalPorPagar = salonMesas.filter(m => m.estado === 'por_pagar').length;

            return (
              <div
                key={salon.id}
                onClick={() => setSalonSeleccionadoId(salon.id)}
                className="bg-white rounded-3xl border border-huarique-100 p-4 shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group border-2 hover:border-huarique-500 active:scale-[0.98]"
              >
                {/* Card Main Info */}
                <div>
                  
                  {/* Icon & Mesas badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-huarique-50 p-2 border border-huarique-200 flex items-center justify-center group-hover:bg-huarique-500 group-hover:text-white transition shadow-sm">
                      {getSalonIcon(salon.iconType)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-huarique-50 text-huarique-800 border border-huarique-100">
                      {salon.totalMesas} Mesas
                    </span>
                  </div>

                  {/* Salon Title */}
                  <h3 className="text-sm sm:text-base font-black text-huarique-900 group-hover:text-huarique-600 transition leading-snug">
                    {salon.nombre}
                  </h3>
                  <p className="text-[10px] font-bold text-huarique-400 uppercase tracking-wider mt-0.5">
                    {salon.rito}
                  </p>

                  {/* Status Pills */}
                  <div className="grid grid-cols-3 gap-1.5 my-2.5 p-2 bg-huarique-50/80 rounded-xl border border-huarique-100 text-center text-xs">
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-sage-600">{totalLibres}</span>
                      <span className="text-[9px] font-extrabold text-huarique-500 uppercase">Libres</span>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-amber-600">{totalOcupadas}</span>
                      <span className="text-[9px] font-extrabold text-huarique-500 uppercase">Ocupadas</span>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-terracotta-600">{totalPorPagar}</span>
                      <span className="text-[9px] font-extrabold text-huarique-500 uppercase">Cobrar</span>
                    </div>
                  </div>

                </div>

                {/* Direct Action Button */}
                <button className="w-full py-2.5 px-3 rounded-xl bg-huarique-500 group-hover:bg-huarique-600 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-touch transition mt-1">
                  <span>Ingresar a Mesas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // =========================================================================
  // PASO 2: MAPA DE MESAS DEL SALÓN SELECCIONADO
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
    <div className="space-y-4">
      
      {/* Header Bar with Back Button & Salon Info */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-huarique-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Back Button & Salon Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSalonSeleccionadoId(null)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-huarique-100 hover:bg-huarique-200 text-huarique-900 font-extrabold text-xs transition active:scale-95 border border-huarique-200"
          >
            <ArrowLeft className="w-4 h-4 text-huarique-700" />
            <span>Volver a Salones</span>
          </button>

          <div>
            <h2 className="text-base sm:text-lg font-black text-huarique-900 leading-tight">
              {currentSalon.nombre}
            </h2>
            <p className="text-[11px] font-semibold text-huarique-500">
              {currentSalon.rito} ({currentSalon.totalMesas} mesas)
            </p>
          </div>
        </div>

        {/* Consumo Acumulado */}
        <div className="flex items-center space-x-3 bg-huarique-50 px-3.5 py-2 rounded-2xl border border-huarique-100 text-xs font-bold self-start sm:self-auto">
          <div>
            <span className="text-huarique-500">Consumo:</span>
            <span className="ml-1.5 text-sm font-black text-huarique-900">S/ {totalRecaudadoSalon.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterEstado('todos')}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
              filterEstado === 'todos'
                ? 'bg-huarique-900 text-white shadow-sm'
                : 'bg-white text-huarique-600 hover:bg-huarique-100 border border-huarique-200'
            }`}
          >
            Todas ({salonMesas.length})
          </button>
          
          <button
            onClick={() => setFilterEstado('libre')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
              filterEstado === 'libre'
                ? 'bg-sage-500 text-white shadow-sm'
                : 'bg-sage-50 text-sage-700 border border-sage-500/30 hover:bg-sage-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sage-500"></span>
            <span>Libres ({totalLibres})</span>
          </button>

          <button
            onClick={() => setFilterEstado('ocupada')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
              filterEstado === 'ocupada'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 border border-amber-500/30 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Ocupadas ({totalOcupadas})</span>
          </button>

          <button
            onClick={() => setFilterEstado('por_pagar')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
              filterEstado === 'por_pagar'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-terracotta-50 text-terracotta-700 border border-terracotta-500/30 hover:bg-terracotta-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
            <span>Por Pagar ({totalPorPagar})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-huarique-400" />
          <input
            type="text"
            placeholder="Buscar mesa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-huarique-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-huarique-400 text-huarique-900 shadow-sm"
          />
        </div>

      </div>

      {/* Mesas Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {filteredMesas.map((mesa) => {
          const isLibre = mesa.estado === 'libre';
          const isOcupada = mesa.estado === 'ocupada';

          return (
            <div
              key={mesa.id}
              className={`group relative rounded-3xl p-3.5 transition-all duration-200 border flex flex-col justify-between hover:shadow-soft ${
                isLibre
                  ? 'bg-white border-sage-500/20 hover:border-sage-500/50'
                  : isOcupada
                  ? 'bg-amber-50/50 border-amber-500/40 hover:border-amber-500'
                  : 'bg-terracotta-50/60 border-terracotta-500/40 hover:border-terracotta-500'
              }`}
            >
              
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-sm transition ${
                  isLibre
                    ? 'bg-sage-100 text-sage-700'
                    : isOcupada
                    ? 'bg-amber-500 text-white shadow-touch'
                    : 'bg-terracotta-500 text-white shadow-touch'
                }`}>
                  M{mesa.numero}
                </div>

                <div className="flex items-center space-x-1 text-[10px] font-bold text-huarique-600 bg-huarique-50 px-2 py-1 rounded-lg border border-huarique-100">
                  <Users className="w-3 h-3 text-huarique-400" />
                  <span>{mesa.capacidad} p.</span>
                </div>
              </div>

              <div className="space-y-1 my-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${
                    isLibre
                      ? 'bg-sage-100 text-sage-700'
                      : isOcupada
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-terracotta-100 text-terracotta-800'
                  }`}>
                    {isLibre ? 'Libre' : isOcupada ? 'Ocupada' : 'Por Pagar'}
                  </span>
                  
                  {!isLibre && mesa.tiempoInicio && (
                    <span className="text-[10px] text-huarique-500 font-semibold flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-huarique-400" />
                      <span>{getTimeElapsedStr(mesa.tiempoInicio)}</span>
                    </span>
                  )}
                </div>

                {!isLibre && (
                  <div className="pt-1">
                    <p className="text-[11px] text-huarique-500 font-semibold">Consumo:</p>
                    <p className="text-base font-black text-huarique-900">
                      S/ {mesa.totalActual.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-huarique-100/80 flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectMesaForComanda(mesa)}
                  className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 ${
                    isLibre
                      ? 'bg-sage-500 hover:bg-sage-600 text-white shadow-touch'
                      : 'bg-huarique-500 hover:bg-huarique-600 text-white shadow-touch'
                  }`}
                >
                  {isLibre ? (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Tomar Pedido</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Ver / Agregar</span>
                    </>
                  )}
                </button>

                {!isLibre && (
                  <button
                    onClick={() => {
                      if (confirm(`¿Desear cobrar y liberar la Mesa ${mesa.numero} (Total: S/ ${mesa.totalActual.toFixed(2)})?`)) {
                        cobrarMesa(mesa.id);
                      }
                    }}
                    className="w-full py-1.5 px-2 rounded-xl font-bold text-[10px] bg-huarique-100 hover:bg-huarique-200 text-huarique-800 transition flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="w-3 h-3 text-sage-600" />
                    <span>Cobrar y Liberar</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
