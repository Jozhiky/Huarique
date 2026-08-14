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
    <div className="fixed inset-0 z-50 bg-huarique-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
      
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Box Container (Fixed Height 90vh) */}
      <div className="bg-white w-full max-w-6xl h-[90vh] max-h-[90vh] rounded-3xl sm:rounded-4xl shadow-soft-lg border border-huarique-100 flex flex-col overflow-hidden relative z-10">
        
        {/* 1. TABLET HEADER BAR (HIGH READABILITY & BIG TOUCH TARGETS) */}
        <div className="lg:hidden bg-white px-4 sm:px-6 py-3.5 border-b border-huarique-100 flex items-center justify-between shadow-sm flex-shrink-0">
          
          {/* Table Badge & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-huarique-500 text-white font-black text-lg flex items-center justify-center shadow-touch flex-shrink-0">
              M{mesa.numero}
            </div>
            <div>
              <h3 className="text-base font-black text-huarique-900 leading-tight">
                Comanda • Mesa {mesa.numero}
              </h3>
              <p className="text-xs font-extrabold text-huarique-600 mt-0.5">
                Mozo: {mozoActivo?.nombre}
              </p>
            </div>
          </div>

          {/* Navigation Swapper & Big Close Button */}
          <div className="flex items-center space-x-2.5">
            
            {/* Tab Swapper */}
            <div className="flex bg-huarique-100 p-1.5 rounded-2xl border border-huarique-200">
              <button
                onClick={() => setActiveMobileTab('menu')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
                  activeMobileTab === 'menu' 
                    ? 'bg-white text-huarique-900 shadow-sm' 
                    : 'text-huarique-600 hover:text-huarique-900'
                }`}
              >
                Menú
              </button>

              <button
                onClick={() => setActiveMobileTab('carrito')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center space-x-2 ${
                  activeMobileTab === 'carrito' 
                    ? 'bg-huarique-500 text-white shadow-touch' 
                    : 'text-huarique-700 hover:text-huarique-900'
                }`}
              >
                <span>Pedido</span>
                {totalItemsCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    activeMobileTab === 'carrito' ? 'bg-white text-huarique-900' : 'bg-huarique-500 text-white'
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
              className="w-11 h-11 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition flex items-center justify-center active:scale-95 flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>

          </div>

        </div>

        {/* 2. MAIN CONTENT BODY WRAPPER */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT PANEL: Dish Menu Catalog */}
          <div className={`flex-1 flex-col h-full bg-huarique-50/40 p-4 sm:p-6 overflow-hidden border-b lg:border-b-0 lg:border-r border-huarique-100 ${
            activeMobileTab === 'menu' ? 'flex' : 'hidden lg:flex'
          }`}>
            
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-huarique-500 text-white font-black text-xl flex items-center justify-center shadow-touch">
                  M{mesa.numero}
                </div>
                <div>
                  <h3 className="text-lg font-black text-huarique-900 leading-tight">
                    Toma de Comanda - Mesa {mesa.numero}
                  </h3>
                  <p className="text-xs font-bold text-huarique-500">
                    Mozo a cargo: <span className="text-huarique-900 font-extrabold">{mozoActivo?.nombre}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Categories Bar */}
            <div className="space-y-3 mb-3 flex-shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-3.5 text-huarique-400" />
                <input
                  type="text"
                  placeholder="Buscar plato o bebida (ej. Ceviche, Chicha)..."
                  value={searchDish}
                  onChange={(e) => setSearchDish(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-huarique-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-huarique-400 text-huarique-900 shadow-sm"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
                      activeCategory === cat
                        ? 'bg-huarique-500 text-white shadow-sm'
                        : 'bg-white text-huarique-600 hover:bg-huarique-100 border border-huarique-200'
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
                  className="bg-white p-4 rounded-2xl border border-huarique-100 hover:border-huarique-400 shadow-sm hover:shadow-soft transition cursor-pointer flex items-center justify-between group active:scale-[0.98] h-auto"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">
                    <div className="w-11 h-11 rounded-2xl bg-huarique-50 border border-huarique-100 flex items-center justify-center text-huarique-600 flex-shrink-0">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-huarique-900 truncate group-hover:text-huarique-600 transition">
                        {product.nombre}
                      </h4>
                      <p className="text-[11px] text-huarique-500 line-clamp-1 mt-0.5">
                        {product.descripcion}
                      </p>
                      <p className="text-xs sm:text-sm font-black text-huarique-800 mt-1">
                        S/ {product.precio.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-2xl bg-huarique-50 group-hover:bg-huarique-500 group-hover:text-white text-huarique-700 flex items-center justify-center font-black text-xl transition shadow-sm flex-shrink-0">
                    +
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Bottom Quick Switch Bar */}
            {cartItems.length > 0 && (
              <div className="lg:hidden pt-3 flex-shrink-0">
                <button
                  onClick={() => setActiveMobileTab('carrito')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-huarique-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-touch active:scale-95 transition"
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Ver Comanda ({totalItemsCount} ítems)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-base">S/ {cartTotal.toFixed(2)}</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Order Cart Summary (HIGH READABILITY & TABLET-OPTIMIZED TYPOGRAPHY) */}
          <div className={`w-full lg:w-[420px] flex-col h-full bg-white p-4 sm:p-6 justify-between relative flex-shrink-0 overflow-hidden ${
            activeMobileTab === 'carrito' ? 'flex' : 'hidden lg:flex'
          }`}>
            
            {/* Desktop Close Button X */}
            <button
              onClick={onClose}
              title="Cerrar ventana"
              className="hidden lg:flex w-10 h-10 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition items-center justify-center absolute top-5 right-5"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header Info */}
            <div className="flex-shrink-0 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg sm:text-xl font-black text-huarique-900 flex items-center space-x-2">
                  <Utensils className="w-5 h-5 text-huarique-500" />
                  <span>Resumen de Comanda</span>
                </h4>
                <span className="text-xs sm:text-sm font-black bg-huarique-100 text-huarique-900 px-3.5 py-1.5 rounded-2xl border border-huarique-200">
                  Mesa {mesa.numero}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-huarique-600 font-extrabold mt-1">
                {totalItemsCount} {totalItemsCount === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
              </p>
            </div>

            {/* Middle Scrollable Items Container */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-3.5 my-1">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 bg-huarique-50/50 rounded-3xl border border-dashed border-huarique-200 p-6 my-auto">
                  <AlertCircle className="w-10 h-10 mx-auto text-huarique-300 mb-2.5" />
                  <p className="text-xs sm:text-sm font-bold text-huarique-600">
                    No has agregado platos a la comanda
                  </p>
                  <p className="text-xs text-huarique-400 mt-0.5">
                    Toca en la pestaña "Menú" para seleccionar platos
                  </p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={`${item.productoId}-${index}`}
                    className="p-4 bg-huarique-50/80 rounded-3xl border border-huarique-100 space-y-3 shadow-sm"
                  >
                    {/* Row 1: Dish Name & Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black text-huarique-900 truncate pr-2">
                        {item.nombre}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-huarique-900 whitespace-nowrap">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>

                    {/* Row 2: Touch Stepper, Observation Input, Delete Button */}
                    <div className="flex items-center space-x-2 pt-1">
                      
                      {/* Touch Stepper */}
                      <div className="flex items-center space-x-1.5 bg-white rounded-2xl border border-huarique-200 p-1 flex-shrink-0">
                        <button
                          onClick={() => handleUpdateQuantity(index, -1)}
                          className="w-8 h-8 rounded-xl bg-huarique-100 hover:bg-huarique-200 text-huarique-900 flex items-center justify-center font-black text-sm active:scale-95 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-black text-huarique-900 w-5 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(index, 1)}
                          className="w-8 h-8 rounded-xl bg-huarique-100 hover:bg-huarique-200 text-huarique-900 flex items-center justify-center font-black text-sm active:scale-95 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Observation Field */}
                      <div className="flex items-center space-x-1.5 flex-1 min-w-0 bg-white border border-huarique-200 rounded-2xl px-3 py-2">
                        <MessageSquare className="w-4 h-4 text-huarique-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Obs (sin ají, bien cocido)..."
                          value={item.nota || ''}
                          onChange={(e) => handleUpdateNote(index, e.target.value)}
                          className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-huarique-900 font-semibold"
                        />
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-2.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition flex-shrink-0 active:scale-95"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                    </div>

                  </div>
                ))
              )}
            </div>

            {/* FIXED BOTTOM ACTIONS BAR */}
            <div className="flex-shrink-0 pt-4 border-t border-huarique-100 space-y-3 bg-white">
              
              <div className="flex items-center justify-between text-sm sm:text-base font-black text-huarique-900 bg-huarique-50 p-4 rounded-3xl border border-huarique-100">
                <span>TOTAL COMANDA:</span>
                <span className="text-xl sm:text-2xl font-black text-huarique-900">S/ {cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSendComanda}
                disabled={cartItems.length === 0}
                className={`w-full py-4 px-5 rounded-3xl font-black text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-touch transition ${
                  cartItems.length > 0
                    ? 'bg-huarique-500 hover:bg-huarique-600 text-white active:scale-95'
                    : 'bg-huarique-200 text-huarique-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>Enviar a Cocina e Imprimir</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
