import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Printer, Clock, Receipt, CheckCircle, Search, User, FileText } from 'lucide-react';

export default function CocinaDisplay() {
  const { comandas, setTicketImprimir, mozoActivo } = useStore();
  const [searchMesa, setSearchMesa] = useState('');
  const [filterEstado, setFilterEstado] = useState('todas');

  const isOwner = mozoActivo?.rol === 'duena';

  // Filter comandas for current mozo (or all if owner)
  const userComandas = comandas.filter(c => {
    if (isOwner) return true;
    return c.mozoId === mozoActivo?.id;
  });

  const filteredComandas = userComandas.filter(c => {
    const matchesSearch = searchMesa === '' || 
      c.mesaNumero.toString().includes(searchMesa) ||
      c.salonNombre.toLowerCase().includes(searchMesa.toLowerCase());

    const matchesEstado = filterEstado === 'todas' || c.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-huarique-100 shadow-soft">
        <div>
          <h2 className="text-xl font-extrabold text-huarique-900 flex items-center space-x-2.5">
            <Receipt className="w-6 h-6 text-huarique-500" />
            <span>Historial de Comandas & Reimpresión de Tickets</span>
          </h2>
          <p className="text-xs text-huarique-500 font-medium">
            {isOwner ? 'Todas las comandas registradas en el sistema' : `Comandas registradas por ${mozoActivo?.nombre}`}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterEstado('todas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterEstado === 'todas'
                ? 'bg-huarique-900 text-white shadow-sm'
                : 'bg-huarique-50 text-huarique-700 hover:bg-huarique-100 border border-huarique-200'
            }`}
          >
            Todas ({userComandas.length})
          </button>
          
          <button
            onClick={() => setFilterEstado('pendiente')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterEstado === 'pendiente'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Activas ({userComandas.filter(c => c.estado !== 'cobrado').length})
          </button>

          <button
            onClick={() => setFilterEstado('cobrado')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterEstado === 'cobrado'
                ? 'bg-sage-600 text-white shadow-sm'
                : 'bg-sage-50 text-sage-700 border border-sage-200 hover:bg-sage-100'
            }`}
          >
            Cobradas ({userComandas.filter(c => c.estado === 'cobrado').length})
          </button>
        </div>

      </div>

      {/* Comandas Grid Cards */}
      {filteredComandas.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-huarique-100 text-center shadow-soft">
          <Receipt className="w-12 h-12 mx-auto text-huarique-300 mb-3" />
          <h3 className="text-base font-extrabold text-huarique-800">
            No se encontraron comandas
          </h3>
          <p className="text-xs text-huarique-500 mt-1">
            Los pedidos enviados a la impresora de cocina se guardan aquí para su consulta o reimpresión.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComandas.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-white rounded-3xl border border-huarique-100 p-5 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition"
            >
              
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
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      cmd.estado === 'cobrado' ? 'bg-sage-100 text-sage-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cmd.estado === 'cobrado' ? 'Cobrada' : 'En Mesa'}
                    </span>
                    <p className="text-[10px] font-semibold text-huarique-400 mt-1">
                      {new Date(cmd.creadoEn).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-semibold text-huarique-600 bg-huarique-50 p-2 rounded-xl border border-huarique-100 mb-3">
                  <User className="w-3.5 h-3.5 text-huarique-400" />
                  <span>Mozo: <strong className="text-huarique-900">{cmd.mozoNombre}</strong></span>
                </div>

                {/* Items */}
                <div className="space-y-1.5 mb-4 max-h-40 overflow-y-auto pr-1">
                  {cmd.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-huarique-50/50 text-xs"
                    >
                      <div className="truncate pr-2">
                        <span className="font-extrabold text-huarique-900 mr-2">{item.cantidad}x</span>
                        <span className="font-semibold text-huarique-800">{item.nombre}</span>
                        {item.nota && (
                          <span className="block text-[10px] text-terracotta-600 italic">* {item.nota}</span>
                        )}
                      </div>
                      <span className="font-bold text-huarique-900 whitespace-nowrap">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-huarique-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-huarique-900">
                  <span>TOTAL COMANDA:</span>
                  <span className="text-sm text-huarique-800">S/ {cmd.total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setTicketImprimir(cmd)}
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-huarique-500 hover:bg-huarique-600 text-white shadow-touch transition flex items-center justify-center space-x-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Reimprimir Ticket de Cocina (80mm)</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
