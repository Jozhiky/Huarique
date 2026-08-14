import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Boxes, ArrowDownRight, ArrowUpRight, Plus, AlertTriangle, Search, History, PackageCheck, X, FileText } from 'lucide-react';

export default function InventarioKardex() {
  const { insumos, kardex, registrarMovimientoInsumo, crearNuevoInsumo } = useStore();
  const [searchInsumo, setSearchInsumo] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  
  // Modals
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showNuevoInsumoModal, setShowNuevoInsumoModal] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);

  // Form State Movimiento
  const [tipoMovimiento, setTipoMovimiento] = useState('ENTRADA');
  const [cantidadMov, setCantidadMov] = useState('');
  const [motivoMov, setMotivoMov] = useState('');
  const [proveedorMov, setProveedorMov] = useState('');
  const [costoTotalMov, setCostoTotalMov] = useState('');

  // Form State Nuevo Insumo
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Carnes');
  const [nuevoStockInicial, setNuevoStockInicial] = useState('');
  const [nuevaUnidad, setNuevaUnidad] = useState('Kg');
  const [nuevoStockMinimo, setNuevoStockMinimo] = useState('');
  const [nuevoCostoUnitario, setNuevoCostoUnitario] = useState('');

  const categorias = ['Todas', 'Carnes', 'Pescados', 'Abarrotes', 'Verduras', 'Bebidas'];

  const filteredInsumos = insumos.filter(i => {
    const matchesCat = selectedCategoria === 'Todas' || i.categoria === selectedCategoria;
    const matchesSearch = searchInsumo === '' || i.nombre.toLowerCase().includes(searchInsumo.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenMovimiento = (insumo) => {
    setSelectedInsumo(insumo);
    setTipoMovimiento('ENTRADA');
    setCantidadMov('');
    setMotivoMov('');
    setProveedorMov('');
    setCostoTotalMov('');
    setShowMovimientoModal(true);
  };

  const handleSaveMovimiento = (e) => {
    e.preventDefault();
    if (!selectedInsumo || !cantidadMov || parseFloat(cantidadMov) <= 0) return;

    registrarMovimientoInsumo({
      insumoId: selectedInsumo.id,
      tipo: tipoMovimiento,
      cantidad: cantidadMov,
      motivo: motivoMov || (tipoMovimiento === 'ENTRADA' ? 'Compra de insumos' : 'Consumo en cocina'),
      proveedor: proveedorMov,
      costoTotal: costoTotalMov,
    });

    setShowMovimientoModal(false);
  };

  const handleSaveNuevoInsumo = (e) => {
    e.preventDefault();
    if (!nuevoNombre) return;

    crearNuevoInsumo({
      nombre: nuevoNombre,
      categoria: nuevaCategoria,
      stockInicial: nuevoStockInicial,
      unidad: nuevaUnidad,
      stockMinimo: nuevoStockMinimo,
      costoUnitario: nuevoCostoUnitario,
    });

    setShowNuevoInsumoModal(false);
    setNuevoNombre('');
    setNuevoStockInicial('');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Executive Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-4xl border border-huarique-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-huarique-900 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
            Módulo de Inventario & Kardex
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-huarique-900 leading-tight mt-2">
            Gestión de Insumos y Almacén
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-huarique-500 mt-0.5">
            Registro de compras (Entradas), mermas/consumos (Salidas) e historial Kardex
          </p>
        </div>

        <button
          onClick={() => setShowNuevoInsumoModal(true)}
          className="py-3.5 px-5 rounded-2xl bg-huarique-500 hover:bg-huarique-600 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-touch transition self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Crear Nuevo Insumo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoria(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition active:scale-95 ${
                selectedCategoria === cat
                  ? 'bg-huarique-900 text-white shadow-sm'
                  : 'bg-white text-huarique-600 hover:bg-huarique-100 border border-huarique-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-huarique-400" />
          <input
            type="text"
            placeholder="Buscar insumo (ej. Pollo, Arroz)..."
            value={searchInsumo}
            onChange={(e) => setSearchInsumo(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-huarique-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-huarique-400 text-huarique-900 shadow-sm"
          />
        </div>

      </div>

      {/* Insumos Stock Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredInsumos.map((insumo) => {
          const isLowStock = insumo.stockActual <= insumo.stockMinimo;
          return (
            <div
              key={insumo.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-soft transition flex flex-col justify-between ${
                isLowStock ? 'border-amber-400/80 bg-amber-50/20' : 'border-huarique-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-huarique-50 text-huarique-700 px-3 py-1 rounded-xl border border-huarique-100">
                    {insumo.categoria}
                  </span>

                  {isLowStock && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Stock Bajo</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-huarique-900 leading-tight">
                  {insumo.nombre}
                </h3>

                <div className="my-4">
                  <span className="text-2xl sm:text-3xl font-black text-huarique-900">
                    {insumo.stockActual}
                  </span>
                  <span className="text-xs font-extrabold text-huarique-500 ml-1.5 uppercase">
                    {insumo.unidad}
                  </span>
                  <p className="text-xs font-semibold text-huarique-500 mt-1">
                    Stock Mínimo: <strong className="text-huarique-800">{insumo.stockMinimo} {insumo.unidad}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-huarique-100/80">
                <button
                  onClick={() => handleOpenMovimiento(insumo)}
                  className="w-full py-3 px-4 rounded-2xl bg-huarique-100 hover:bg-huarique-200 text-huarique-900 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <History className="w-4 h-4 text-huarique-700" />
                  <span>Registrar Movimiento</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Kardex Movements History Table */}
      <div className="bg-white rounded-3xl sm:rounded-4xl border border-huarique-100 p-5 sm:p-6 shadow-soft space-y-4">
        
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-huarique-50 text-huarique-600 border border-huarique-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-huarique-900">
              Historial Kardex de Movimientos
            </h3>
            <p className="text-xs font-semibold text-huarique-500">
              Bitácora detallada de Entradas (Compras) y Salidas (Consumos / Mermas)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-huarique-100 text-xs font-black text-huarique-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Insumo</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4 text-center">Cantidad</th>
                <th className="py-3.5 px-4">Motivo / Proveedor</th>
                <th className="py-3.5 px-4">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-huarique-100/80 text-xs sm:text-sm">
              {kardex.map((k) => (
                <tr key={k.id} className="hover:bg-huarique-50/50 transition">
                  <td className="py-4 px-4 font-extrabold text-huarique-600 whitespace-nowrap">
                    {new Date(k.fecha).toLocaleDateString('es-PE')} {new Date(k.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 px-4 font-black text-huarique-900">
                    {k.insumoNombre}
                  </td>
                  <td className="py-4 px-4 font-black">
                    {k.tipo === 'ENTRADA' ? (
                      <span className="px-3 py-1 bg-sage-100 text-sage-800 rounded-xl border border-sage-300 inline-flex items-center space-x-1">
                        <ArrowDownRight className="w-3.5 h-3.5 text-sage-600" />
                        <span>ENTRADA</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-terracotta-100 text-terracotta-800 rounded-xl border border-terracotta-300 inline-flex items-center space-x-1">
                        <ArrowUpRight className="w-3.5 h-3.5 text-terracotta-600" />
                        <span>SALIDA</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-black text-huarique-900 text-center">
                    {k.cantidad}
                  </td>
                  <td className="py-4 px-4 font-semibold text-huarique-700">
                    <p className="font-bold">{k.motivo}</p>
                    {k.proveedor !== '-' && <p className="text-[11px] text-huarique-400">Prov: {k.proveedor}</p>}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-huarique-600">
                    {k.usuario}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL: Registrar Movimiento (Entrada/Salida) */}
      {showMovimientoModal && selectedInsumo && (
        <div className="fixed inset-0 z-50 bg-huarique-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-4xl p-6 shadow-soft-lg border border-huarique-100 space-y-5 relative">
            <button
              onClick={() => setShowMovimientoModal(false)}
              className="absolute top-5 right-5 text-huarique-400 hover:text-huarique-700 p-1.5 rounded-xl hover:bg-huarique-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <h3 className="text-lg font-black text-huarique-900">
                Registrar Movimiento - {selectedInsumo.nombre}
              </h3>
              <p className="text-xs font-semibold text-huarique-500 mt-0.5">
                Stock Actual: <strong className="text-huarique-900">{selectedInsumo.stockActual} {selectedInsumo.unidad}</strong>
              </p>
            </div>

            <form onSubmit={handleSaveMovimiento} className="space-y-4">
              
              <div>
                <label className="block text-xs font-black text-huarique-700 uppercase mb-1.5">
                  Tipo de Movimiento:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoMovimiento('ENTRADA')}
                    className={`py-3 rounded-2xl font-black text-xs transition ${
                      tipoMovimiento === 'ENTRADA'
                        ? 'bg-sage-500 text-white shadow-sm'
                        : 'bg-huarique-50 text-huarique-700 border border-huarique-200'
                    }`}
                  >
                    ENTRADA (Compra)
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoMovimiento('SALIDA')}
                    className={`py-3 rounded-2xl font-black text-xs transition ${
                      tipoMovimiento === 'SALIDA'
                        ? 'bg-terracotta-500 text-white shadow-sm'
                        : 'bg-huarique-50 text-huarique-700 border border-huarique-200'
                    }`}
                  >
                    SALIDA (Consumo/Merma)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-huarique-700 uppercase mb-1">
                  Cantidad ({selectedInsumo.unidad}):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ej. 10.5"
                  value={cantidadMov}
                  onChange={(e) => setCantidadMov(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-sm font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-huarique-700 uppercase mb-1">
                  Motivo o Detalle:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Compra de Mercado Central Piura..."
                  value={motivoMov}
                  onChange={(e) => setMotivoMov(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-sm font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-huarique-500 hover:bg-huarique-600 active:scale-95 text-white font-black text-sm shadow-touch transition"
                >
                  Guardar Movimiento en Kardex
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Crear Nuevo Insumo */}
      {showNuevoInsumoModal && (
        <div className="fixed inset-0 z-50 bg-huarique-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-4xl p-6 shadow-soft-lg border border-huarique-100 space-y-5 relative">
            <button
              onClick={() => setShowNuevoInsumoModal(false)}
              className="absolute top-5 right-5 text-huarique-400 hover:text-huarique-700 p-1.5 rounded-xl hover:bg-huarique-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <h3 className="text-lg font-black text-huarique-900">
                Crear Nuevo Insumo de Almacén
              </h3>
              <p className="text-xs font-semibold text-huarique-500 mt-0.5">
                Registra un nuevo producto para control de stock
              </p>
            </div>

            <form onSubmit={handleSaveNuevoInsumo} className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-black text-huarique-700 uppercase mb-1">
                  Nombre del Insumo:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pollo Entero Fresco"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-sm font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-huarique-700 uppercase mb-1">
                    Categoría:
                  </label>
                  <select
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                  >
                    {categorias.filter(c => c !== 'Todas').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-huarique-700 uppercase mb-1">
                    Unidad:
                  </label>
                  <select
                    value={nuevaUnidad}
                    onChange={(e) => setNuevaUnidad(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-xs font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Litros">Litros</option>
                    <option value="Cajas">Cajas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-huarique-700 uppercase mb-1">
                    Stock Inicial:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 50"
                    value={nuevoStockInicial}
                    onChange={(e) => setNuevoStockInicial(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-sm font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-huarique-700 uppercase mb-1">
                    Stock Mínimo:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 10"
                    value={nuevoStockMinimo}
                    onChange={(e) => setNuevoStockMinimo(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-huarique-50 border border-huarique-200 text-sm font-bold text-huarique-900 focus:outline-none focus:ring-2 focus:ring-huarique-400"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-huarique-500 hover:bg-huarique-600 active:scale-95 text-white font-black text-sm shadow-touch transition"
                >
                  Registrar Insumo en Sistema
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
