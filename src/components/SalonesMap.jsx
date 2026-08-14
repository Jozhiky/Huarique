import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, PlusCircle, Receipt, CheckCircle, Clock, Users, Building2, Wine, Trees, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function SalonesMap({ onSelectMesaForComanda }) {
  const { salones, mesas, salonSeleccionadoId, setSalonSeleccionadoId, cobrarMesa } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  const getSalonIcon = (iconType) => {
    switch (iconType) {
      case 'wine':
        return <Wine className="w-8 h-8 text-huarique-600" />;
      case 'tree':
        return <Trees className="w-8 h-8 text-huarique-600" />;
      case 'building':
      default:
        return <Building2 className="w-8 h-8 text-huarique-600" />;
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
  // PASO 1: VISTA DE SELECCIÓN DE LOS 3 SALONES
  // =========================================================================
  if (!salonSeleccionadoId) {
    return (
      <div className="space-y-8 py-4">
        
        {/* Banner Header */}
        <div className="bg-white p-6 sm:p-8 rounded-4xl border border-huarique-100 shadow-soft text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-huarique-50 text-huarique-800 text-xs font-black rounded-full uppercase tracking-wider border border-huarique-200">
              Paso 1 de 2
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-huarique-900 leading-tight mt-2">
              Selecciona el Salón a Atender
            </h2>
            <p className="text-sm font-semibold text-huarique-500 mt-1">
              Elige entre los 3 salones del restaurante para ver el mapa de mesas en tiempo real
            </p>
          </div>

          <div className="bg-huarique-50 px-5 py-3.5 rounded-3xl border border-huarique-100 text-xs font-bold text-huarique-700 whitespace-nowrap">
            Capacidad Total: <span className="text-base font-black text-huarique-900">80 Mesas</span>
          </div>
        </div>

        {/* 3 Salones Big Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salones.map((salon) => {
            const salonMesas = mesas.filter(m => m.salonId === salon.id);
            const totalLibres = salonMesas.filter(m => m.estado === 'libre').length;
            const totalOcupadas = salonMesas.filter(m => m.estado === 'ocupada').length;
            const totalPorPagar = salonMesas.filter(m => m.estado === 'por_pagar').length;
            const totalConsumo = salonMesas.reduce((sum, m) => sum + (m.totalActual || 0), 0);

            return (
              <div
                key={salon.id}
                onClick={() => setSalonSeleccionadoId(salon.id)}
                className="bg-white rounded-4xl border border-huarique-100/90 p-6 sm:p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group border-2 hover:border-huarique-400/80 active:scale-[0.98]"
              >
                <div>
                  
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-3xl bg-huarique-50 p-3.5 border border-huarique-200/80 flex items-center justify-center group-hover:bg-huarique-500 group-hover:text-white transition shadow-sm">
                      {getSalonIcon(salon.iconType)}
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-huarique-50 text-huarique-800 border border-huarique-100">
                      {salon.totalMesas} Mesas
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-huarique-900 group-hover:text-huarique-600 transition">
                    {salon.nombre}
                  </h3>
                  <p className="text-xs text-huarique-500 font-semibold mt-1 line-clamp-2">
                    {salon.descripcion}
                  </p>
                  <p className="text-[11px] text-huarique-400 font-bold uppercase tracking-wider mt-2">
                    {salon.rito}
                  </p>

                  {/* Status Metrics */}
                  <div className="grid grid-cols-3 gap-2 my-6 p-3 bg-huarique-50/70 rounded-2xl border border-huarique-100 text-center text-xs">
                    <div>
                      <span className="block text-base font-black text-sage-600">{totalLibres}</span>
                      <span className="text-[10px] font-bold text-huarique-500">Libres</span>
                    </div>
                    <div>
                      <span className="block text-base font-black text-amber-600">{totalOcupadas}</span>
                      <span className="text-[10px] font-bold text-huarique-500">Ocupadas</span>
                    </div>
                    <div>
                      <span className="block text-base font-black text-terracotta-600">{totalPorPagar}</span>
                      <span className="text-[10px] font-bold text-huarique-500">Por Pagar</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Button */}
                <div className="pt-4 border-t border-huarique-100/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-huarique-400 block">Acumulado Salón:</span>
                    <span className="text-sm font-black text-huarique-900">S/ {totalConsumo.toFixed(2)}</span>
                  </div>

                  <button className="py-3 px-5 rounded-2xl bg-huarique-500 group-hover:bg-huarique-600 text-white font-extrabold text-xs flex items-center space-x-2 shadow-touch transition">
                    <span>Ingresar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // =========================================================================
  // PASO 2: VISTA DE MESAS DEL SALÓN SELECCIONADO
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
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header Bar with Back Button & Salon Info */}
      <div className="bg-white p-5 sm:p-6 rounded-4xl border border-huarique-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Back Button & Salon Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSalonSeleccionadoId(null)}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-900 font-extrabold text-xs transition active:scale-95 border border-huarique-200"
          >
            <ArrowLeft className="w-4 h-4 text-huarique-700" />
            <span>Volver a Salones</span>
          </button>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-huarique-900 leading-tight flex items-center space-x-2">
              <span>{currentSalon.nombre}</span>
            </h2>
            <p className="text-xs font-semibold text-huarique-500">
              {currentSalon.rito} ({currentSalon.totalMesas} mesas totales)
            </p>
          </div>
        </div>

        {/* Consumo Acumulado */}
        <div className="flex items-center space-x-4 bg-huarique-50 px-5 py-3 rounded-3xl border border-huarique-100 text-xs font-bold">
          <div>
            <span className="text-huarique-500">Consumo Acumulado:</span>
            <span className="ml-2 text-base font-black text-huarique-900">S/ {totalRecaudadoSalon.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterEstado('todos')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
              filterEstado === 'todos'
                ? 'bg-huarique-900 text-white shadow-sm'
                : 'bg-white text-huarique-600 hover:bg-huarique-100 border border-huarique-200'
            }`}
          >
            Todas ({salonMesas.length})
          </button>
          
          <button
            onClick={() => setFilterEstado('libre')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
              filterEstado === 'libre'
                ? 'bg-sage-500 text-white shadow-sm'
                : 'bg-sage-50 text-sage-700 border border-sage-500/30 hover:bg-sage-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
            <span>Libres ({totalLibres})</span>
          </button>

          <button
            onClick={() => setFilterEstado('ocupada')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
              filterEstado === 'ocupada'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 border border-amber-500/30 hover:bg-amber-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Ocupadas ({totalOcupadas})</span>
          </button>

          <button
            onClick={() => setFilterEstado('por_pagar')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
              filterEstado === 'por_pagar'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-terracotta-50 text-terracotta-700 border border-terracotta-500/30 hover:bg-terracotta-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500"></span>
            <span>Por Pagar ({totalPorPagar})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-huarique-400" />
          <input
            type="text"
            placeholder="Buscar por número de mesa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-huarique-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-huarique-400/40 text-huarique-900 shadow-sm"
          />
        </div>

      </div>

      {/* Mesas Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
        {filteredMesas.map((mesa) => {
          const isLibre = mesa.estado === 'libre';
          const isOcupada = mesa.estado === 'ocupada';

          return (
            <div
              key={mesa.id}
              className={`group relative rounded-4xl p-5 sm:p-6 transition-all duration-200 border flex flex-col justify-between hover:shadow-soft-lg ${
                isLibre
                  ? 'bg-white border-sage-500/20 hover:border-sage-500/50'
                  : isOcupada
                  ? 'bg-amber-50/50 border-amber-500/40 hover:border-amber-500'
                  : 'bg-terracotta-50/60 border-terracotta-500/40 hover:border-terracotta-500'
              }`}
            >
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition ${
                  isLibre
                    ? 'bg-sage-100 text-sage-700'
                    : isOcupada
                    ? 'bg-amber-500 text-white shadow-touch'
                    : 'bg-terracotta-500 text-white shadow-touch'
                }`}>
                  M{mesa.numero}
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-huarique-600 bg-huarique-50 px-2.5 py-1.5 rounded-xl border border-huarique-100">
                  <Users className="w-3.5 h-3.5 text-huarique-400" />
                  <span>{mesa.capacidad} p.</span>
                </div>
              </div>

              {/* Status Info */}
              <div className="space-y-2 my-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full ${
                    isLibre
                      ? 'bg-sage-100 text-sage-700'
                      : isOcupada
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-terracotta-100 text-terracotta-800'
                  }`}>
                    {isLibre ? 'Libre' : isOcupada ? 'Ocupada' : 'Por Pagar'}
                  </span>
                  
                  {!isLibre && mesa.tiempoInicio && (
                    <span className="text-[11px] text-huarique-500 font-semibold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-huarique-400" />
                      <span>{getTimeElapsedStr(mesa.tiempoInicio)}</span>
                    </span>
                  )}
                </div>

                {!isLibre && (
                  <div className="pt-2">
                    <p className="text-xs text-huarique-500 font-semibold">Consumo:</p>
                    <p className="text-lg font-black text-huarique-900">
                      S/ {mesa.totalActual.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-huarique-100/80 flex flex-col gap-2">
                <button
                  onClick={() => onSelectMesaForComanda(mesa)}
                  className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95 ${
                    isLibre
                      ? 'bg-sage-500 hover:bg-sage-600 text-white shadow-touch'
                      : 'bg-huarique-500 hover:bg-huarique-600 text-white shadow-touch'
                  }`}
                >
                  {isLibre ? (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Tomar Pedido</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4" />
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
                    className="w-full py-2 px-3 rounded-2xl font-bold text-xs bg-huarique-100 hover:bg-huarique-200 text-huarique-800 transition flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-sage-600" />
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
