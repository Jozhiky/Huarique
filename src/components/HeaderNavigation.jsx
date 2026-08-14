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
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 py-2.5">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-50 p-2 border border-amber-200/80 flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="Huarique de Catacaos" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight tracking-tight">
                HUARIQUE DE CATACAOS
              </h1>
              <p className="text-xs font-medium text-slate-500 flex items-center space-x-2 mt-0.5">
                <span className="text-amber-700 font-bold uppercase tracking-wider text-[11px]">
                  {isOwner ? 'Administrador' : 'Mozo'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span>80 Mesas</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Soft Soothing Active Blue Pill) */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-touch scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Live Clock Badge */}
            <div className="hidden lg:flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-100/70 px-3.5 py-2 rounded-xl border border-slate-200/60">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{timeStr}</span>
            </div>

            {/* Supabase status badge */}
            <div 
              title={isSupabaseConfigured ? 'Conectado a Supabase DB' : 'Modo Autónomo Local'}
              className={`hidden sm:flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-xl border ${
                isSupabaseConfigured 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase' : 'Local DB'}</span>
            </div>

            {/* Active Mozo Badge */}
            <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pr-3 shadow-xs">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-extrabold text-xs flex items-center justify-center shadow-xs ${
                isOwner ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {mozoActivo?.iniciales || 'MO'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isOwner ? 'Dueña' : 'Mozo'}
                </p>
                <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                  {mozoActivo?.nombre || 'Mozo'}
                </p>
              </div>

              <button
                onClick={logout}
                title="Cambiar Mozo / Bloquear Terminal"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white transition ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile / Tablet Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between border-t border-slate-100 py-2 space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-touch'
                    : 'text-slate-700 bg-slate-100/80 border border-slate-200/60 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
