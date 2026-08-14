import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { LayoutGrid, BarChart3, Boxes, Clock, Database, LogOut, Receipt } from 'lucide-react';

export default function HeaderNavigation() {
  const { mozoActivo, activeTab, setActiveTab, logout } = useStore();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOwner = mozoActivo?.rol === 'duena';

  const allNavItems = [
    { id: 'salones', label: 'Salones & Mesas', icon: LayoutGrid, requiredRole: 'mozo' },
    { id: 'cocina', label: 'Historial & Reimpresión', icon: Receipt, requiredRole: 'mozo' },
    { id: 'duena', label: 'Panel Dueña', icon: BarChart3, requiredRole: 'duena' },
    { id: 'inventario', label: 'Insumos / Kardex', icon: Boxes, requiredRole: 'duena' },
  ];

  const navItems = allNavItems.filter(item => {
    if (isOwner) return true;
    return item.requiredRole === 'mozo';
  });

  return (
    <header className="bg-white border-b border-huarique-100/90 sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22 py-2.5">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-huarique-50 p-2 border border-huarique-200 shadow-inner flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="Huarique de Catacaos" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black text-huarique-900 leading-tight tracking-tight">
                HUARIQUE DE CATACAOS
              </h1>
              <p className="text-xs font-bold text-huarique-500 flex items-center space-x-2 mt-0.5">
                <span className="text-huarique-700 font-extrabold uppercase tracking-wider text-xs">
                  {isOwner ? 'Vista Administrador' : 'Vista Mozo'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-huarique-400"></span>
                <span className="text-xs font-bold text-huarique-600">80 Mesas</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs (High Contrast Tablet Buttons) */}
          <nav className="hidden md:flex items-center space-x-2 bg-huarique-50/90 p-2 rounded-3xl border border-huarique-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-huarique-900 shadow-sm border border-huarique-200 scale-[1.02]'
                      : 'text-huarique-600 hover:text-huarique-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-huarique-500' : 'text-huarique-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live Clock Badge */}
            <div className="hidden lg:flex items-center space-x-2 text-xs sm:text-sm font-extrabold text-huarique-800 bg-huarique-50 px-3.5 py-2.5 rounded-2xl border border-huarique-100">
              <Clock className="w-4 h-4 text-huarique-500" />
              <span>{timeStr}</span>
            </div>

            {/* Supabase status badge */}
            <div 
              title={isSupabaseConfigured ? 'Conectado a Supabase DB' : 'Modo Autónomo Local'}
              className={`hidden sm:flex items-center space-x-2 text-xs font-extrabold px-3 py-2.5 rounded-2xl border ${
                isSupabaseConfigured 
                  ? 'bg-sage-50 text-sage-800 border-sage-500/30' 
                  : 'bg-huarique-100 text-huarique-800 border-huarique-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{isSupabaseConfigured ? 'Supabase DB' : 'Local DB'}</span>
            </div>

            {/* Active Mozo Pill Button */}
            <div className="flex items-center space-x-2.5 bg-huarique-50 border border-huarique-200 rounded-3xl p-1.5 pr-3 shadow-sm">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center shadow-sm ${
                isOwner ? 'bg-huarique-900 text-white' : 'bg-huarique-500 text-white'
              }`}>
                {mozoActivo?.iniciales || 'MO'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] uppercase font-black text-huarique-500 tracking-wider">
                  {isOwner ? 'Dueña' : 'Mozo'}
                </p>
                <p className="text-xs sm:text-sm font-black text-huarique-900 truncate max-w-[100px]">
                  {mozoActivo?.nombre || 'Mozo'}
                </p>
              </div>

              <button
                onClick={logout}
                title="Cambiar Mozo / Bloquear Terminal"
                className="p-2 text-huarique-400 hover:text-red-600 rounded-2xl hover:bg-white transition ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile / Portrait Tablet Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between border-t border-huarique-100 py-2 space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition ${
                  isActive
                    ? 'bg-huarique-500 text-white shadow-touch'
                    : 'text-huarique-700 bg-huarique-50 border border-huarique-100 hover:bg-huarique-100'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-huarique-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
