import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Search, Plus, Minus, Trash2, Printer, Send, MessageSquare, Utensils, AlertCircle } from 'lucide-react';

export default function TomarComandaModal({ mesa, isOpen, onClose }) {
  const { productos, comandas, crearEnviarComanda, mozoActivo } = useStore();
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchDish, setSearchDish] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [notaGeneral, setNotaGeneral] = useState('');

  // Load existing comanda items if table is occupied
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
          imagen: product.imagen
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

  const handleSendComanda = () => {
    if (cartItems.length === 0) return;
    crearEnviarComanda(mesa.id, cartItems, notaGeneral);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-huarique-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-3xl shadow-soft-lg border border-huarique-100 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Dish Selector Menu */}
        <div className="flex-1 flex flex-col h-full bg-huarique-50/40 p-4 md:p-6 overflow-hidden border-b md:border-b-0 md:border-r border-huarique-100">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-huarique-500 text-white font-extrabold text-lg flex items-center justify-center shadow-touch">
                M{mesa.numero}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-huarique-900 leading-tight">
                  Toma de Comanda - Mesa {mesa.numero}
                </h3>
                <p className="text-xs font-semibold text-huarique-500">
                  Mozo a cargo: <span className="text-huarique-800 font-bold">{mozoActivo?.nombre}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="md:hidden p-2 text-huarique-400 hover:text-huarique-700 rounded-full hover:bg-huarique-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search & Categories Bar */}
          <div className="space-y-3 mb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-huarique-400" />
              <input
                type="text"
                placeholder="Buscar plato o bebida (ej. Ceviche, Chicha, Cabrito)..."
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-huarique-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-huarique-400/40 text-huarique-900"
              />
            </div>

            {/* Categories scrollable pill selector */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
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
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="bg-white p-3.5 rounded-2xl border border-huarique-100/80 hover:border-huarique-400/50 shadow-sm hover:shadow-soft transition cursor-pointer flex items-center justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                  <span className="text-3xl p-2 bg-huarique-50 rounded-xl flex-shrink-0">
                    {product.imagen}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-huarique-900 truncate group-hover:text-huarique-600 transition">
                      {product.nombre}
                    </h4>
                    <p className="text-[11px] text-huarique-500 line-clamp-1">
                      {product.descripcion}
                    </p>
                    <p className="text-xs font-extrabold text-huarique-800 mt-1">
                      S/ {product.precio.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-huarique-50 group-hover:bg-huarique-500 group-hover:text-white text-huarique-600 flex items-center justify-center font-bold text-lg transition shadow-sm">
                  +
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Order Cart & Comanda Summary */}
        <div className="w-full md:w-96 flex flex-col h-full bg-white p-4 md:p-6 justify-between relative">
          
          {/* Close button for desktop */}
          <button
            onClick={onClose}
            className="hidden md:block absolute top-5 right-5 text-huarique-400 hover:text-huarique-700 p-2 rounded-full hover:bg-huarique-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div>
            <h4 className="text-base font-extrabold text-huarique-900 mb-1 flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-huarique-500" />
              <span>Resumen de Comanda</span>
            </h4>
            <p className="text-xs text-huarique-500 mb-4 font-medium">
              {cartItems.length} ítems seleccionados
            </p>

            {/* Cart Items List */}
            <div className="max-h-[45vh] md:max-h-[50vh] overflow-y-auto pr-1 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-10 bg-huarique-50/50 rounded-2xl border border-dashed border-huarique-200">
                  <AlertCircle className="w-8 h-8 mx-auto text-huarique-300 mb-2" />
                  <p className="text-xs font-semibold text-huarique-500">
                    No has agregado platos a la comanda
                  </p>
                  <p className="text-[11px] text-huarique-400">
                    Haz clic en cualquier producto del menú para agregar
                  </p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={`${item.productoId}-${index}`}
                    className="p-3 bg-huarique-50/70 rounded-2xl border border-huarique-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <span className="text-base">{item.imagen}</span>
                        <span className="text-xs font-bold text-huarique-900 truncate">{item.nombre}</span>
                      </div>
                      <span className="text-xs font-extrabold text-huarique-900 whitespace-nowrap">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity controls and observation note */}
                    <div className="flex items-center justify-between pt-1">
                      
                      {/* Quantity Buttons */}
                      <div className="flex items-center space-x-2 bg-white rounded-xl border border-huarique-200 p-1">
                        <button
                          onClick={() => handleUpdateQuantity(index, -1)}
                          className="w-6 h-6 rounded-lg bg-huarique-100 hover:bg-huarique-200 text-huarique-800 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold text-huarique-900 w-4 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(index, 1)}
                          className="w-6 h-6 rounded-lg bg-huarique-100 hover:bg-huarique-200 text-huarique-800 flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item note input */}
                      <div className="flex items-center space-x-1 flex-1 ml-3">
                        <MessageSquare className="w-3.5 h-3.5 text-huarique-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Obs (ej. sin sal, extra ají)..."
                          value={item.nota || ''}
                          onChange={(e) => handleUpdateNote(index, e.target.value)}
                          className="w-full text-[11px] bg-white border border-huarique-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-huarique-400 text-huarique-800"
                        />
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="ml-2 text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Footer Total & Action Buttons */}
          <div className="pt-4 border-t border-huarique-100 space-y-3">
            
            <div className="flex items-center justify-between text-base font-extrabold text-huarique-900 bg-huarique-50 p-3 rounded-2xl border border-huarique-100">
              <span>TOTAL COMANDA:</span>
              <span className="text-lg text-huarique-800">S/ {cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSendComanda}
              disabled={cartItems.length === 0}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-touch transition ${
                cartItems.length > 0
                  ? 'bg-huarique-500 hover:bg-huarique-600 text-white active:scale-95'
                  : 'bg-huarique-200 text-huarique-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Enviar a Cocina e Imprimir Comanda</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
