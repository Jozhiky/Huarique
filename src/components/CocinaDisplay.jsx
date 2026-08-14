import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Printer, Clock, CheckCircle2, AlertCircle, Search, Receipt, RefreshCw, ChevronRight } from 'lucide-react';

export default function CocinaDisplay() {
  const { comandas, cambiarEstadoComanda, setTicketImprimir } = useStore();
  const [filterState, setFilterState] = useState('todas');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredComandas = comandas.filter(cmd => {
    const matchesFilter = filterState === 'todas' || cmd.estado === filterState;
    const matchesSearch = searchFilter === '' ||
      cmd.mesaNumero.toString().includes(searchFilter) ||
      cmd.mozoNombre.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cmd.salonNombre.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'pendiente':
        return (
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Pendiente</span>
          </span>
        );
      case 'en_preparacion':
        return (
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-huarique-100 text-huarique-900 border border-huarique-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-huarique-500"></span>
            <span>En Cocina</span>
          </span>
        );
      case 'listo':
        return (
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-sage-100 text-sage-800 border border-sage-300 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
            <span>Listo</span>
          </span>
        );
      case 'cobrado':
      default:
        return (
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-huarique-50 text-huarique-600 border border-huarique-200">
            Cobrado
          </span>
        );
    }
  };

  const getTimeElapsed = (isoStr) => {
    if (!isoStr) return '';
    const mins = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
    if (mins < 1) return 'Recién enviado';
    if (mins < 60) return `Hace ${mins} min`;
    return `Hace ${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header Info */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-4xl border border-huarique-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-huarique-900 leading-tight">
            Historial de Comandas & Reimpresión
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-huarique-500 mt-1">
            Consulta los tickets enviados e reimprime comandas térmicas (80mm) para cocina
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-huarique-50 px-4 py-3 rounded-2xl border border-huarique-100 text-xs font-extrabold text-huarique-800 self-start sm:self-auto">
          <Receipt className="w-4 h-4 text-huarique-500" />
          <span>{comandas.length} Comandas Emitidas</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['todas', 'pendiente', 'en_preparacion', 'listo', 'cobrado'].map((st) => {
            const labels = {
              todas: 'Todas',
              pendiente: 'Pendientes',
              en_preparacion: 'En Cocina',
              listo: 'Listos',
              cobrado: 'Cobradas'
            };
            const isActive = filterState === st;
            return (
              <button
                key={st}
                onClick={() => setFilterState(st)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition active:scale-95 ${
                  isActive
                    ? 'bg-huarique-900 text-white shadow-sm'
                    : 'bg-white text-huarique-600 hover:bg-huarique-100 border border-huarique-200'
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-huarique-400" />
          <input
            type="text"
            placeholder="Buscar por mesa o mozo..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-huarique-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-huarique-400 text-huarique-900 shadow-sm"
          />
        </div>

      </div>

      {/* Comandas Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredComandas.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-4xl border border-dashed border-huarique-200 text-center p-8">
            <AlertCircle className="w-12 h-12 text-huarique-300 mx-auto mb-3" />
            <p className="text-sm font-extrabold text-huarique-700">
              No hay comandas registradas en este estado
            </p>
          </div>
        ) : (
          filteredComandas.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-white rounded-3xl border border-huarique-100 p-5 sm:p-6 shadow-soft hover:shadow-soft-lg transition flex flex-col justify-between"
            >
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-huarique-500 text-white font-black text-lg flex items-center justify-center shadow-touch">
                      M{cmd.mesaNumero}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-huarique-900 leading-tight">
                        Mesa {cmd.mesaNumero}
                      </h4>
                      <p className="text-xs font-semibold text-huarique-500">
                        {cmd.salonNombre}
                      </p>
                    </div>
                  </div>

                  {getStatusBadge(cmd.estado)}
                </div>

                {/* Subinfo */}
                <div className="flex items-center justify-between text-xs text-huarique-500 font-extrabold py-2 border-y border-huarique-100 my-3">
                  <span>Mozo: <strong className="text-huarique-900">{cmd.mozoNombre}</strong></span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-huarique-400" />
                    <span>{getTimeElapsed(cmd.creadoEn)}</span>
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2 my-3 max-h-48 overflow-y-auto pr-1">
                  {cmd.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs py-1">
                      <div>
                        <p className="font-extrabold text-huarique-900">
                          <span className="text-huarique-500 font-black mr-1.5">{item.cantidad}x</span>
                          {item.nombre}
                        </p>
                        {item.nota && (
                          <p className="text-[11px] font-bold text-amber-700 italic bg-amber-50 px-2 py-0.5 rounded-md mt-0.5">
                            Obs: {item.nota}
                          </p>
                        )}
                      </div>
                      <span className="font-black text-huarique-800 whitespace-nowrap ml-2">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="pt-4 border-t border-huarique-100/80 space-y-3">
                <div className="flex items-center justify-between text-sm font-black text-huarique-900">
                  <span>Total Ticket:</span>
                  <span className="text-base text-huarique-800">S/ {cmd.total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTicketImprimir(cmd)}
                    className="py-3 px-3 rounded-2xl bg-huarique-500 hover:bg-huarique-600 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-touch transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir 80mm</span>
                  </button>

                  {cmd.estado === 'pendiente' && (
                    <button
                      onClick={() => cambiarEstadoComanda(cmd.id, 'en_preparacion')}
                      className="py-3 px-3 rounded-2xl bg-huarique-900 hover:bg-black active:scale-95 text-white font-extrabold text-xs flex items-center justify-center space-x-1 transition"
                    >
                      <span>A Cocina</span>
                    </button>
                  )}

                  {cmd.estado === 'en_preparacion' && (
                    <button
                      onClick={() => cambiarEstadoComanda(cmd.id, 'listo')}
                      className="py-3 px-3 rounded-2xl bg-sage-500 hover:bg-sage-600 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center space-x-1 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Marcar Listo</span>
                    </button>
                  )}

                  {(cmd.estado === 'listo' || cmd.estado === 'cobrado') && (
                    <button
                      onClick={() => cambiarEstadoComanda(cmd.id, 'pendiente')}
                      className="py-3 px-3 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-800 font-bold text-xs flex items-center justify-center space-x-1 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reabrir</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
