import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Search, Plus, Minus, Trash2, Send, MessageSquare, Utensils, AlertCircle, UtensilsCrossed } from 'lucide-react';

export default function TomarComandaModal({ mesa, isOpen, onClose }) {
  const { productos, comandas, crearEnviarComanda, mozoActivo } = useStore();
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchDish, setSearchDish] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [notaGeneral, setNotaGeneral] = useState('');

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
    <div className="fixed inset-0 z-50 bg-huarique-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-4xl shadow-soft-lg border border-huarique-100 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Dish Selector Menu */}
        <div className="flex-1 flex flex-col h-full bg-huarique-50/40 p-5 md:p-8 overflow-hidden border-b md:border-b-0 md:border-r border-huarique-100">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-3xl bg-huarique-500 text-white font-black text-xl flex items-center justify-center shadow-touch">
                M{mesa.numero}
              </div>
              <div>
                <h3 className="text-xl font-black text-huarique-900 leading-tight">
                  Toma de Comanda - Mesa {mesa.numero}
                </h3>
                <p className="text-xs font-bold text-huarique-500 mt-0.5">
                  Mozo a cargo: <span className="text-huarique-900 font-extrabold">{mozoActivo?.nombre}</span>
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
          <div className="space-y-4 mb-5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-huarique-400" />
              <input
                type="text"
                placeholder="Buscar plato o bebida (ej. Ceviche, Chicha, Cabrito)..."
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-huarique-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-huarique-400/40 text-huarique-900 shadow-sm"
              />
            </div>

            <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition ${
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
          <div className="flex-1 overflow-y-auto pr-1.5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-huarique-100 hover:border-huarique-400/60 shadow-sm hover:shadow-soft transition cursor-pointer flex items-center justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">
                  <div className="w-12 h-12 rounded-2xl bg-huarique-50 border border-huarique-100 flex items-center justify-center text-huarique-600 flex-shrink-0">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-huarique-900 truncate group-hover:text-huarique-600 transition">
                      {product.nombre}
                    </h4>
                    <p className="text-[11px] text-huarique-500 line-clamp-1 mt-0.5">
                      {product.descripcion}
                    </p>
                    <p className="text-sm font-black text-huarique-800 mt-1">
                      S/ {product.precio.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-2xl bg-huarique-50 group-hover:bg-huarique-500 group-hover:text-white text-huarique-700 flex items-center justify-center font-black text-xl transition shadow-sm">
                  +
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Order Cart & Comanda Summary */}
        <div className="w-full md:w-96 lg:w-[420px] flex flex-col h-full bg-white p-5 md:p-8 justify-between relative">
          
          <button
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 text-huarique-400 hover:text-huarique-700 p-2 rounded-full hover:bg-huarique-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div>
            <h4 className="text-lg font-black text-huarique-900 mb-1 flex items-center space-x-2.5">
              <Utensils className="w-5 h-5 text-huarique-500" />
              <span>Resumen de Comanda</span>
            </h4>
            <p className="text-xs text-huarique-500 mb-5 font-semibold">
              {cartItems.length} ítems seleccionados
            </p>

            <div className="max-h-[45vh] md:max-h-[50vh] overflow-y-auto pr-1.5 space-y-3.5">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 bg-huarique-50/50 rounded-3xl border border-dashed border-huarique-200 p-6">
                  <AlertCircle className="w-10 h-10 mx-auto text-huarique-300 mb-2.5" />
                  <p className="text-xs font-bold text-huarique-600">
                    No has agregado platos a la comanda
                  </p>
                  <p className="text-[11px] text-huarique-400 mt-0.5">
                    Haz clic en cualquier producto del menú para agregar
                  </p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={`${item.productoId}-${index}`}
                    className="p-4 bg-huarique-50/70 rounded-3xl border border-huarique-100 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-huarique-900 truncate pr-2">{item.nombre}</span>
                      <span className="text-xs font-black text-huarique-900 whitespace-nowrap">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      
                      <div className="flex items-center space-x-2 bg-white rounded-2xl border border-huarique-200 p-1.5">
                        <button
                          onClick={() => handleUpdateQuantity(index, -1)}
                          className="w-7 h-7 rounded-xl bg-huarique-100 hover:bg-huarique-200 text-huarique-800 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-huarique-900 w-5 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(index, 1)}
                          className="w-7 h-7 rounded-xl bg-huarique-100 hover:bg-huarique-200 text-huarique-800 flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-1 ml-3">
                        <MessageSquare className="w-4 h-4 text-huarique-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Obs (sin sal, etc)..."
                          value={item.nota || ''}
                          onChange={(e) => handleUpdateNote(index, e.target.value)}
                          className="w-full text-xs bg-white border border-huarique-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-huarique-400 text-huarique-800"
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="ml-2 text-red-400 hover:text-red-600 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-huarique-100 space-y-3.5">
            
            <div className="flex items-center justify-between text-base font-black text-huarique-900 bg-huarique-50 p-4 rounded-3xl border border-huarique-100">
              <span>TOTAL COMANDA:</span>
              <span className="text-xl text-huarique-800">S/ {cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSendComanda}
              disabled={cartItems.length === 0}
              className={`w-full py-4 px-5 rounded-3xl font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-touch transition ${
                cartItems.length > 0
                  ? 'bg-huarique-500 hover:bg-huarique-600 text-white active:scale-95'
                  : 'bg-huarique-200 text-huarique-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Enviar a Cocina e Imprimir Comanda</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
