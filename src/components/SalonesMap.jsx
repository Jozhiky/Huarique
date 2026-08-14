import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, PlusCircle, Receipt, CheckCircle, Clock, Users, Building2, Wine, Trees, ArrowRight } from 'lucide-react';

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
    <div className="space-y-6">
      
      {/* Salones Selector Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-huarique-100 shadow-soft">
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {salones.map((salon) => {
            const isSelected = salon.id === salonSeleccionadoId;
            const countOcupadas = mesas.filter(m => m.salonId === salon.id && m.estado !== 'libre').length;
            return (
              <button
                key={salon.id}
                onClick={() => setSalonSeleccionadoId(salon.id)}
                className={`flex items-center space-x-3 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-huarique-500 text-white shadow-touch scale-[1.02]'
                    : 'bg-huarique-50 text-huarique-700 hover:bg-huarique-100 border border-huarique-200/60'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-huarique-100 text-huarique-700'}`}>
                  {getSalonIcon(salon.iconType)}
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-1.5">
                    <span>{salon.nombre}</span>
                    {countOcupadas > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {countOcupadas} activas
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium ${isSelected ? 'text-huarique-100' : 'text-huarique-500'}`}>
                    {salon.rito} ({salon.totalMesas} mesas)
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center space-x-3 bg-huarique-50 px-4 py-2.5 rounded-2xl border border-huarique-100 text-xs font-semibold">
          <div>
            <span className="text-huarique-500">Ventas en Salón:</span>
            <span className="ml-1 text-sm font-extrabold text-huarique-900">S/ {totalRecaudadoSalon.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterEstado('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              filterEstado === 'todos'
                ? 'bg-huarique-900 text-white shadow-sm'
                : 'bg-white text-huarique-600 hover:bg-huarique-100 border border-huarique-200'
            }`}
          >
            Todas ({salonMesas.length})
          </button>
          
          <button
            onClick={() => setFilterEstado('libre')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
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
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-huarique-400" />
          <input
            type="text"
            placeholder="Buscar por número de mesa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-huarique-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-huarique-400/40 text-huarique-900"
          />
        </div>

      </div>

      {/* Mesas Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMesas.map((mesa) => {
          const isLibre = mesa.estado === 'libre';
          const isOcupada = mesa.estado === 'ocupada';

          return (
            <div
              key={mesa.id}
              className={`group relative rounded-3xl p-4 transition-all duration-200 border flex flex-col justify-between hover:shadow-soft-lg ${
                isLibre
                  ? 'bg-white border-sage-500/20 hover:border-sage-500/50'
                  : isOcupada
                  ? 'bg-amber-50/50 border-amber-500/40 hover:border-amber-500'
                  : 'bg-terracotta-50/60 border-terracotta-500/40 hover:border-terracotta-500'
              }`}
            >
              
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-base shadow-sm transition ${
                  isLibre
                    ? 'bg-sage-100 text-sage-700'
                    : isOcupada
                    ? 'bg-amber-500 text-white shadow-touch'
                    : 'bg-terracotta-500 text-white shadow-touch'
                }`}>
                  M{mesa.numero}
                </div>

                <div className="flex items-center space-x-1 text-[11px] font-semibold text-huarique-500 bg-huarique-50 px-2 py-1 rounded-xl border border-huarique-100">
                  <Users className="w-3 h-3 text-huarique-400" />
                  <span>{mesa.capacidad} p.</span>
                </div>
              </div>

              <div className="space-y-1.5 my-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    isLibre
                      ? 'bg-sage-100 text-sage-700'
                      : isOcupada
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-terracotta-100 text-terracotta-800'
                  }`}>
                    {isLibre ? 'Libre' : isOcupada ? 'Ocupada' : 'Por Pagar'}
                  </span>
                  
                  {!isLibre && mesa.tiempoInicio && (
                    <span className="text-[10px] text-huarique-500 font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-huarique-400" />
                      <span>{getTimeElapsedStr(mesa.tiempoInicio)}</span>
                    </span>
                  )}
                </div>

                {!isLibre && (
                  <div className="pt-1">
                    <p className="text-xs text-huarique-500 font-medium">Consumo acumulado:</p>
                    <p className="text-base font-extrabold text-huarique-900">
                      S/ {mesa.totalActual.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-huarique-100/60 flex flex-col gap-1.5">
                <button
                  onClick={() => onSelectMesaForComanda(mesa)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 ${
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
                    className="w-full py-1.5 px-3 rounded-xl font-bold text-[11px] bg-huarique-100 hover:bg-huarique-200 text-huarique-800 transition flex items-center justify-center space-x-1"
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
