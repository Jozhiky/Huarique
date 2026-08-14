import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, PlusCircle, Receipt, CheckCircle, Clock, Users, Building2, Wine, Trees } from 'lucide-react';

export default function SalonesMap({ onSelectMesaForComanda }) {
  const { salones, mesas, salonSeleccionadoId, setSalonSeleccionadoId, cobrarMesa } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

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

  const getTimeElapsedStr = (isoTime) => {
    if (!isoTime) return '';
    const minutes = Math.floor((Date.now() - new Date(isoTime).getTime()) / 60000);
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours}h ${minutes % 60}m`;
  };

  const getSalonIcon = (iconType) => {
    switch (iconType) {
      case 'wine':
        return <Wine className="w-5 h-5" />;
      case 'tree':
        return <Trees className="w-5 h-5" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Salones Selector Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-5 sm:p-6 rounded-4xl border border-huarique-100 shadow-soft">
        
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {salones.map((salon) => {
            const isSelected = salon.id === salonSeleccionadoId;
            const countOcupadas = mesas.filter(m => m.salonId === salon.id && m.estado !== 'libre').length;
            return (
              <button
                key={salon.id}
                onClick={() => setSalonSeleccionadoId(salon.id)}
                className={`flex items-center space-x-3.5 px-6 py-4 rounded-3xl font-extrabold text-sm whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-huarique-500 text-white shadow-touch scale-[1.02]'
                    : 'bg-huarique-50 text-huarique-700 hover:bg-huarique-100 border border-huarique-200/60'
                }`}
              >
                <div className={`p-2.5 rounded-2xl ${isSelected ? 'bg-white/20 text-white' : 'bg-huarique-100 text-huarique-700'}`}>
                  {getSalonIcon(salon.iconType)}
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{salon.nombre}</span>
                    {countOcupadas > 0 && (
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {countOcupadas} activas
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-huarique-100' : 'text-huarique-500'}`}>
                    {salon.rito} ({salon.totalMesas} mesas)
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center space-x-4 bg-huarique-50 px-5 py-3.5 rounded-3xl border border-huarique-100 text-xs font-bold">
          <div>
            <span className="text-huarique-500">Consumo Acumulado Salón:</span>
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

      {/* Mesas Cards Grid (Breathable Layout) */}
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
              
              {/* Header: Table Number & Capacity */}
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
