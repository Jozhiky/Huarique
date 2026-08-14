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
    <header className="bg-white border-b border-huarique-100/80 sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 py-2">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-huarique-50 p-1.5 border border-huarique-200/80 shadow-inner flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="Huarique de Catacaos" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-black text-huarique-900 leading-tight tracking-tight">
                HUARIQUE DE CATACAOS
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-huarique-500 flex items-center space-x-1.5 mt-0.5">
                <span className="text-huarique-700 font-extrabold uppercase tracking-wider text-[10px]">
                  {isOwner ? 'Vista Administrador' : 'Vista Mozo'}
                </span>
                <span className="w-1 h-1 rounded-full bg-huarique-400"></span>
                <span>80 Mesas</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-huarique-50/80 p-1.5 rounded-2xl border border-huarique-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-huarique-900 shadow-sm border border-huarique-200/80'
                      : 'text-huarique-600 hover:text-huarique-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-huarique-500' : 'text-huarique-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live Clock Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs font-extrabold text-huarique-700 bg-huarique-50 px-3 py-2 rounded-xl border border-huarique-100">
              <Clock className="w-3.5 h-3.5 text-huarique-500" />
              <span>{timeStr}</span>
            </div>

            {/* Supabase status badge */}
            <div 
              title={isSupabaseConfigured ? 'Conectado a Supabase DB' : 'Modo Autónomo Local'}
              className={`hidden sm:flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border ${
                isSupabaseConfigured 
                  ? 'bg-sage-50 text-sage-700 border-sage-500/30' 
                  : 'bg-huarique-100/70 text-huarique-700 border-huarique-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase DB' : 'Local DB'}</span>
            </div>

            {/* Active Mozo Pill Button */}
            <div className="flex items-center space-x-2 bg-huarique-50 border border-huarique-200 rounded-2xl p-1 pr-2 shadow-sm">
              <div className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shadow-sm ${
                isOwner ? 'bg-huarique-900 text-white' : 'bg-huarique-500 text-white'
              }`}>
                {mozoActivo?.iniciales || 'MO'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[9px] uppercase font-bold text-huarique-500 tracking-wider">
                  {isOwner ? 'Dueña' : 'Mozo'}
                </p>
                <p className="text-xs font-extrabold text-huarique-900 truncate max-w-[80px]">
                  {mozoActivo?.nombre || 'Mozo'}
                </p>
              </div>

              <button
                onClick={logout}
                title="Cambiar Mozo / Bloquear Terminal"
                className="p-1.5 text-huarique-400 hover:text-red-600 rounded-xl hover:bg-white transition ml-0.5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between border-t border-huarique-100 py-1.5 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-extrabold transition ${
                  isActive
                    ? 'bg-huarique-100 text-huarique-900 border border-huarique-200/80 shadow-sm'
                    : 'text-huarique-600 hover:bg-huarique-50'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-huarique-500' : 'text-huarique-400'}`} />
                <span className="text-[10px] truncate">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
