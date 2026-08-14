import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Boxes, ArrowDownLeft, ArrowUpRight, PlusCircle, AlertTriangle, Search, Filter, Calendar, User, PackagePlus, FileText, CheckCircle2 } from 'lucide-react';

export default function InventarioKardex() {
  const { insumos, kardex, registrarMovimientoInsumo, crearNuevoInsumo, mozoActivo } = useStore();
  const [searchInsumo, setSearchInsumo] = useState('');
  const [filterTipo, setFilterTipo] = useState('TODOS');
  
  // Modal states
  const [isMovimientoModalOpen, setIsMovimientoModalOpen] = useState(false);
  const [isNuevoInsumoModalOpen, setIsNuevoInsumoModalOpen] = useState(false);

  // Form states for movement
  const [selectedInsumoId, setSelectedInsumoId] = useState(insumos[0]?.id || '');
  const [tipoMovimiento, setTipoMovimiento] = useState('ENTRADA'); // 'ENTRADA' | 'SALIDA'
  const [cantidadInput, setCantidadInput] = useState('');
  const [motivoInput, setMotivoInput] = useState('');
  const [proveedorInput, setProveedorInput] = useState('');
  const [costoInput, setCostoInput] = useState('');

  // Form states for new insumo
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCategoria, setNuevoCategoria] = useState('Carnes');
  const [nuevoStockInicial, setNuevoStockInicial] = useState('');
  const [nuevoUnidad, setNuevoUnidad] = useState('Kg');
  const [nuevoStockMinimo, setNuevoStockMinimo] = useState('10');
  const [nuevoCostoUnitario, setNuevoCostoUnitario] = useState('');

  // Filter insumos
  const filteredInsumos = insumos.filter(i => 
    i.nombre.toLowerCase().includes(searchInsumo.toLowerCase()) ||
    i.categoria.toLowerCase().includes(searchInsumo.toLowerCase())
  );

  // Filter kardex
  const filteredKardex = kardex.filter(k => {
    if (filterTipo === 'TODOS') return true;
    return k.tipo === filterTipo;
  });

  const handleSaveMovimiento = (e) => {
    e.preventDefault();
    if (!selectedInsumoId || !cantidadInput || parseFloat(cantidadInput) <= 0) return;

    registrarMovimientoInsumo({
      insumoId: selectedInsumoId,
      tipo: tipoMovimiento,
      cantidad: cantidadInput,
      motivo: motivoInput || (tipoMovimiento === 'ENTRADA' ? 'Compra de Insumo' : 'Salida a Cocina'),
      proveedor: proveedorInput,
      costoTotal: costoInput || 0
    });

    // Reset form
    setCantidadInput('');
    setMotivoInput('');
    setProveedorInput('');
    setCostoInput('');
    setIsMovimientoModalOpen(false);
  };

  const handleSaveNuevoInsumo = (e) => {
    e.preventDefault();
    if (!nuevoNombre) return;

    crearNuevoInsumo({
      nombre: nuevoNombre,
      categoria: nuevoCategoria,
      stockInicial: nuevoStockInicial,
      unidad: nuevoUnidad,
      stockMinimo: nuevoStockMinimo,
      costoUnitario: nuevoCostoUnitario
    });

    setNuevoNombre('');
    setNuevoStockInicial('');
    setNuevoCostoUnitario('');
    setIsNuevoInsumoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Action Buttons */}
      <div className="bg-white p-6 rounded-3xl border border-huarique-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-huarique-900 flex items-center space-x-2.5">
            <Boxes className="w-6 h-6 text-huarique-500" />
            <span>Control de Insumos & Kardex (Entradas y Salidas)</span>
          </h2>
          <p className="text-xs font-semibold text-huarique-500">
            Registro de compras (ej. Pollo, Arroz, Carnes), mermas y salidas a cocina
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNuevoInsumoModalOpen(true)}
            className="py-3 px-4 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-800 font-bold text-xs flex items-center space-x-1.5 transition"
          >
            <PackagePlus className="w-4 h-4 text-huarique-600" />
            <span>Nuevo Insumo</span>
          </button>

          <button
            onClick={() => setIsMovimientoModalOpen(true)}
            className="py-3 px-5 rounded-2xl bg-huarique-500 hover:bg-huarique-600 text-white font-bold text-xs flex items-center space-x-2 shadow-touch transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Entrada / Salida</span>
          </button>
        </div>
      </div>

      {/* Stock Items Overview Cards Grid */}
      <div className="space-y-3">
        
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-huarique-900">
            Estado Actual del Inventario ({insumos.length} insumos registrados)
          </h3>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-huarique-400" />
            <input
              type="text"
              placeholder="Buscar insumo (ej. Pollo, Arroz)..."
              value={searchInsumo}
              onChange={(e) => setSearchInsumo(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-huarique-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-huarique-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredInsumos.map((insumo) => {
            const isLowStock = insumo.stockActual <= insumo.stockMinimo;
            return (
              <div
                key={insumo.id}
                className={`bg-white p-4 rounded-3xl border shadow-soft flex flex-col justify-between transition hover:shadow-soft-lg ${
                  isLowStock ? 'border-amber-400/80 bg-amber-50/30' : 'border-huarique-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-huarique-500 bg-huarique-50 px-2 py-0.5 rounded-lg border border-huarique-100">
                      {insumo.categoria}
                    </span>
                    {isLowStock && (
                      <span className="flex items-center space-x-1 text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>STOCK BAJO</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-extrabold text-huarique-900 mb-1">{insumo.nombre}</h4>
                  
                  <div className="flex items-baseline space-x-1 my-2">
                    <span className="text-2xl font-extrabold text-huarique-900">
                      {insumo.stockActual}
                    </span>
                    <span className="text-xs font-bold text-huarique-500">
                      {insumo.unidad}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-huarique-100/60 flex items-center justify-between text-[11px] font-semibold text-huarique-500">
                  <span>Mínimo: {insumo.stockMinimo} {insumo.unidad}</span>
                  <button
                    onClick={() => {
                      setSelectedInsumoId(insumo.id);
                      setIsMovimientoModalOpen(true);
                    }}
                    className="text-huarique-600 hover:text-huarique-900 font-bold underline"
                  >
                    + Ajustar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Kardex Movements Table */}
      <div className="bg-white p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-huarique-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-huarique-500" />
              <span>Historial de Movimientos Kardex</span>
            </h3>
            <p className="text-xs text-huarique-500 font-medium">
              Registro auditado de todas las entradas (compras) y salidas (consumo)
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterTipo('TODOS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTipo === 'TODOS'
                  ? 'bg-huarique-900 text-white'
                  : 'bg-huarique-50 text-huarique-700 border border-huarique-200'
              }`}
            >
              Todos ({kardex.length})
            </button>
            <button
              onClick={() => setFilterTipo('ENTRADA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTipo === 'ENTRADA'
                  ? 'bg-sage-600 text-white'
                  : 'bg-sage-50 text-sage-700 border border-sage-200'
              }`}
            >
              Entradas ({kardex.filter(k => k.tipo === 'ENTRADA').length})
            </button>
            <button
              onClick={() => setFilterTipo('SALIDA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTipo === 'SALIDA'
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200'
              }`}
            >
              Salidas ({kardex.filter(k => k.tipo === 'SALIDA').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-huarique-100 text-huarique-500 font-bold uppercase text-[10px] tracking-wider bg-huarique-50/60">
                <th className="p-3.5 rounded-l-2xl">Fecha & Hora</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">Insumo</th>
                <th className="p-3.5">Cantidad</th>
                <th className="p-3.5">Motivo / Proveedor</th>
                <th className="p-3.5">Costo Total</th>
                <th className="p-3.5 rounded-r-2xl">Registrado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-huarique-100/60">
              {filteredKardex.map((item) => {
                const isEntrada = item.tipo === 'ENTRADA';
                return (
                  <tr key={item.id} className="hover:bg-huarique-50/40 transition">
                    <td className="p-3.5 font-semibold text-huarique-600">
                      {new Date(item.fecha).toLocaleString('es-PE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="p-3.5">
                      {isEntrada ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sage-100 text-sage-800 border border-sage-200">
                          <ArrowDownLeft className="w-3 h-3 text-sage-600" />
                          <span>ENTRADA</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
                          <ArrowUpRight className="w-3 h-3 text-terracotta-600" />
                          <span>SALIDA</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-extrabold text-huarique-900">
                      {item.insumoNombre}
                    </td>

                    <td className="p-3.5 font-extrabold text-huarique-900">
                      {isEntrada ? `+${item.cantidad}` : `-${item.cantidad}`}
                    </td>

                    <td className="p-3.5 text-huarique-700">
                      <p className="font-semibold">{item.motivo}</p>
                      {item.proveedor && item.proveedor !== '-' && (
                        <p className="text-[10px] text-huarique-400">Prov: {item.proveedor}</p>
                      )}
                    </td>

                    <td className="p-3.5 font-bold text-huarique-900">
                      {item.costoTotal > 0 ? `S/ ${item.costoTotal.toFixed(2)}` : '-'}
                    </td>

                    <td className="p-3.5 font-semibold text-huarique-600">
                      {item.usuario}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal: Registrar Entrada / Salida */}
      {isMovimientoModalOpen && (
        <div className="fixed inset-0 z-50 bg-huarique-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg border border-huarique-100 p-6 relative">
            <h3 className="text-lg font-extrabold text-huarique-900 mb-4">
              Registrar Movimiento de Insumo
            </h3>

            <form onSubmit={handleSaveMovimiento} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-huarique-50 rounded-2xl border border-huarique-100">
                <button
                  type="button"
                  onClick={() => setTipoMovimiento('ENTRADA')}
                  className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition ${
                    tipoMovimiento === 'ENTRADA'
                      ? 'bg-sage-500 text-white shadow-sm'
                      : 'text-huarique-600 hover:text-huarique-900'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>ENTRADA (Compra)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoMovimiento('SALIDA')}
                  className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition ${
                    tipoMovimiento === 'SALIDA'
                      ? 'bg-terracotta-500 text-white shadow-sm'
                      : 'text-huarique-600 hover:text-huarique-900'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>SALIDA (Consumo)</span>
                </button>
              </div>

              {/* Insumo Select */}
              <div>
                <label className="block text-xs font-bold text-huarique-700 mb-1">Insumo:</label>
                <select
                  value={selectedInsumoId}
                  onChange={(e) => setSelectedInsumoId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none"
                >
                  {insumos.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nombre} (Stock actual: {i.stockActual} {i.unidad})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-xs font-bold text-huarique-700 mb-1">Cantidad:</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="ej. 50 (para 50 pollos o 50 kg)"
                  value={cantidadInput}
                  onChange={(e) => setCantidadInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                />
              </div>

              {/* Motivo & Proveedor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-huarique-700 mb-1">Motivo:</label>
                  <input
                    type="text"
                    placeholder="ej. Compra semanal"
                    value={motivoInput}
                    onChange={(e) => setMotivoInput(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-huarique-200 text-xs font-medium text-huarique-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-huarique-700 mb-1">Proveedor / Obs:</label>
                  <input
                    type="text"
                    placeholder="ej. Avícola San Lorenzo"
                    value={proveedorInput}
                    onChange={(e) => setProveedorInput(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-huarique-200 text-xs font-medium text-huarique-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Costo Total */}
              <div>
                <label className="block text-xs font-bold text-huarique-700 mb-1">Costo Total S/ (opcional):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ej. 925.00"
                  value={costoInput}
                  onChange={(e) => setCostoInput(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-huarique-200 text-xs font-medium text-huarique-900 focus:outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsMovimientoModalOpen(false)}
                  className="py-3 rounded-2xl bg-huarique-100 text-huarique-700 font-bold text-xs hover:bg-huarique-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-2xl bg-huarique-500 text-white font-bold text-xs hover:bg-huarique-600 shadow-touch transition"
                >
                  Guardar Registro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Insumo */}
      {isNuevoInsumoModalOpen && (
        <div className="fixed inset-0 z-50 bg-huarique-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg border border-huarique-100 p-6 relative">
            <h3 className="text-lg font-extrabold text-huarique-900 mb-4">
              Agregar Nuevo Insumo al Inventario
            </h3>

            <form onSubmit={handleSaveNuevoInsumo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-huarique-700 mb-1">Nombre del Insumo:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Papa Amarilla Tumbay, Chicha Base..."
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-huarique-700 mb-1">Categoría:</label>
                  <select
                    value={nuevoCategoria}
                    onChange={(e) => setNuevoCategoria(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none"
                  >
                    <option value="Carnes">Carnes / Pollo</option>
                    <option value="Pescados">Pescados / Mariscos</option>
                    <option value="Abarrotes">Abarrotes / Granos</option>
                    <option value="Verduras">Verduras / Tubérculos</option>
                    <option value="Bebidas">Bebidas / Licores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-huarique-700 mb-1">Unidad:</label>
                  <select
                    value={nuevoUnidad}
                    onChange={(e) => setNuevoUnidad(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none"
                  >
                    <option value="Kg">Kilogramos (Kg)</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Litros">Litros</option>
                    <option value="Cajas">Cajas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-huarique-700 mb-1">Stock Inicial:</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="ej. 20"
                    value={nuevoStockInicial}
                    onChange={(e) => setNuevoStockInicial(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-huarique-700 mb-1">Stock Mínimo Alerta:</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="ej. 5"
                    value={nuevoStockMinimo}
                    onChange={(e) => setNuevoStockMinimo(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsNuevoInsumoModalOpen(false)}
                  className="py-3 rounded-2xl bg-huarique-100 text-huarique-700 font-bold text-xs hover:bg-huarique-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-2xl bg-huarique-500 text-white font-bold text-xs hover:bg-huarique-600 shadow-touch transition"
                >
                  Crear Insumo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
