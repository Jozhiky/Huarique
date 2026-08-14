import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Search, Plus, Minus, Trash2, Send, MessageSquare, Utensils, AlertCircle, UtensilsCrossed, ShoppingBag, ChevronRight } from 'lucide-react';

export default function TomarComandaModal({ mesa, isOpen, onClose }) {
  const { productos, comandas, crearEnviarComanda, mozoActivo } = useStore();
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchDish, setSearchDish] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [notaGeneral, setNotaGeneral] = useState('');
  
  // Tab for mobile/portrait tablet (< 900px): 'menu' | 'carrito'
  const [activeMobileTab, setActiveMobileTab] = useState('menu');

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (mesa && mesa.comandaActualId) {
      const existingCmd = comandas.find(c => c.id === mesa.comandaActualId);
      if (existingCmd && existingCmd.items) {
        setCartItems(existingCmd.items.map(i => ({ ...i })));
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setActiveMobileTab('menu');
  }, [mesa, comandas]);

  if (!isOpen || !mesa) return null;

  const categories = ['Todas', 'Entradas', 'Ceviches', 'Fondos', 'Bebidas', 'Postres'];

  const filteredProducts = productos.filter(p => {
    const matchesCat = activeCategory === 'Todas' || p.categoria === activeCategory;
    const matchesSearch = searchDish === '' || 
      p.nombre.toLowerCase().includes(searchDish.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchDish.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.productoId === product.id && (!item.nota || item.nota === ''));
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].cantidad += 1;
        return updated;
      }
      return [
        ...prev,
        {
          productoId: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: 1,
          nota: '',
        }
      ];
    });
  };

  const handleUpdateQuantity = (index, delta) => {
    setCartItems(prev => {
      const updated = [...prev];
      const newQty = updated[index].cantidad + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].cantidad = newQty;
      return updated;
    });
  };

  const handleUpdateNote = (index, noteText) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].nota = noteText;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  const handleSendComanda = () => {
    if (cartItems.length === 0) return;
    crearEnviarComanda(mesa.id, cartItems, notaGeneral);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
      
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Box Container (Fixed Height 90vh) */}
      <div className="bg-white w-full max-w-6xl h-[90vh] max-h-[90vh] rounded-3xl sm:rounded-4xl shadow-lg border border-slate-200 flex flex-col overflow-hidden relative z-10">
        
        {/* 1. TABLET HEADER BAR */}
        <div className="lg:hidden bg-white px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between shadow-xs flex-shrink-0">
          
          {/* Table Badge & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs flex-shrink-0">
              M{mesa.numero}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Comanda • Mesa {mesa.numero}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Mozo: {mozoActivo?.nombre}
              </p>
            </div>
          </div>

          {/* Navigation Swapper & Close Button */}
          <div className="flex items-center space-x-2">
            
            {/* Tab Swapper */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveMobileTab('menu')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeMobileTab === 'menu' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Menú
              </button>

              <button
                onClick={() => setActiveMobileTab('carrito')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeMobileTab === 'carrito' 
                    ? 'bg-blue-600 text-white shadow-touch' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>Pedido</span>
                {totalItemsCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeMobileTab === 'carrito' ? 'bg-white text-blue-900' : 'bg-white text-blue-700'
                  }`}>
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* High-Contrast Close Button X */}
            <button
              onClick={onClose}
              title="Cerrar ventana"
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition flex items-center justify-center active:scale-95 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* 2. MAIN CONTENT BODY WRAPPER */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT PANEL: Dish Menu Catalog */}
          <div className={`flex-1 flex-col h-full bg-slate-50/50 p-4 sm:p-5 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 ${
            activeMobileTab === 'menu' ? 'flex' : 'hidden lg:flex'
          }`}>
            
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-3.5 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-touch">
                  M{mesa.numero}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    Toma de Comanda - Mesa {mesa.numero}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Mozo a cargo: <span className="text-slate-900 font-bold">{mozoActivo?.nombre}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Categories Bar */}
            <div className="space-y-2.5 mb-3 flex-shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar plato o bebida (ej. Ceviche, Chicha)..."
                  value={searchDish}
                  onChange={(e) => setSearchDish(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 shadow-xs"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Cards Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start items-start">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group active:scale-[0.98] h-auto"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <UtensilsCrossed className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                        {product.nombre}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {product.descripcion}
                      </p>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1">
                        S/ {product.precio.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 flex items-center justify-center font-extrabold text-base transition shadow-xs flex-shrink-0">
                    +
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Bottom Quick Switch Bar */}
            {cartItems.length > 0 && (
              <div className="lg:hidden pt-2.5 flex-shrink-0">
                <button
                  onClick={() => setActiveMobileTab('carrito')}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-touch active:scale-95 transition"
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ver Comanda ({totalItemsCount} ítems)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-extrabold text-sm sm:text-base">S/ {cartTotal.toFixed(2)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Order Cart Summary */}
          <div className={`w-full lg:w-[400px] flex-col h-full bg-white p-4 sm:p-5 justify-between relative flex-shrink-0 overflow-hidden ${
            activeMobileTab === 'carrito' ? 'flex' : 'hidden lg:flex'
          }`}>
            
            {/* Desktop Close Button X */}
            <button
              onClick={onClose}
              title="Cerrar ventana"
              className="hidden lg:flex w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition items-center justify-center absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Info */}
            <div className="flex-shrink-0 mb-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-blue-600" />
                  <span>Resumen de Comanda</span>
                </h4>
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-xl border border-slate-200">
                  Mesa {mesa.numero}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {totalItemsCount} {totalItemsCount === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
              </p>
            </div>

            {/* Middle Scrollable Items Container (INTERNAL SCROLL) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-2.5 my-1">
              {cartItems.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-5 my-auto">
                  <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-600">
                    No has agregado platos a la comanda
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Toca en la pestaña "Menú" para seleccionar platos
                  </p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={`${item.productoId}-${index}`}
                    className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs"
                  >
                    {/* Row 1: Dish Name & Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate pr-2">
                        {item.nombre}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 whitespace-nowrap">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>

                    {/* Row 2: Touch Stepper, Observation Input, Delete Button */}
                    <div className="flex items-center space-x-2 pt-0.5">
                      
                      {/* Touch Stepper */}
                      <div className="flex items-center space-x-1 bg-white rounded-xl border border-slate-200 p-1 flex-shrink-0">
                        <button
                          onClick={() => handleUpdateQuantity(index, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs active:scale-95 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-900 w-5 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(index, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs active:scale-95 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Observation Field */}
                      <div className="flex items-center space-x-1.5 flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Obs (sin ají, bien cocido)..."
                          value={item.nota || ''}
                          onChange={(e) => handleUpdateNote(index, e.target.value)}
                          className="w-full text-xs bg-transparent focus:outline-none text-slate-800 font-medium"
                        />
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex-shrink-0 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                ))
              )}
            </div>

            {/* FIXED BOTTOM ACTIONS BAR */}
            <div className="flex-shrink-0 pt-3 border-t border-slate-200 space-y-2.5 bg-white">
              
              <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-900 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span>TOTAL COMANDA:</span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">S/ {cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSendComanda}
                disabled={cartItems.length === 0}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-touch transition ${
                  cartItems.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Enviar a Cocina e Imprimir</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
