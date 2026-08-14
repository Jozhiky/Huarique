import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { LayoutGrid, Printer, BarChart3, Boxes, Clock, Database, LogOut, Receipt } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22 sm:h-24 py-3">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-huarique-50 p-2 border border-huarique-200/80 shadow-inner flex items-center justify-center">
              <img src="/logo.png" alt="Huarique de Catacaos" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-huarique-900 leading-tight tracking-tight">
                HUARIQUE DE CATACAOS
              </h1>
              <p className="text-xs font-bold text-huarique-500 flex items-center space-x-2 mt-0.5">
                <span className="text-huarique-700 font-extrabold uppercase tracking-wider text-[11px]">
                  {isOwner ? 'Vista Administrador' : 'Vista Mozo'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-huarique-400"></span>
                <span>3 Salones (80 Mesas)</span>
              </p>
            </div>
          </div>

          {/* Tablet Navigation Tabs (Spacious & Ergonomic) */}
          <nav className="hidden md:flex items-center space-x-2 bg-huarique-50/80 p-2 rounded-3xl border border-huarique-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl font-extrabold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-huarique-900 shadow-sm border border-huarique-200/80 scale-[1.02]'
                      : 'text-huarique-600 hover:text-huarique-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-huarique-500' : 'text-huarique-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: User Badge & Clock */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Live Clock Badge */}
            <div className="hidden lg:flex items-center space-x-2 text-xs font-extrabold text-huarique-700 bg-huarique-50 px-4 py-2.5 rounded-2xl border border-huarique-100">
              <Clock className="w-4 h-4 text-huarique-500" />
              <span>{timeStr}</span>
            </div>

            {/* Supabase status badge */}
            <div 
              title={isSupabaseConfigured ? 'Conectado a Supabase DB' : 'Modo Autónomo Local'}
              className={`hidden sm:flex items-center space-x-2 text-xs font-extrabold px-3.5 py-2.5 rounded-2xl border ${
                isSupabaseConfigured 
                  ? 'bg-sage-50 text-sage-700 border-sage-500/30' 
                  : 'bg-huarique-100/70 text-huarique-700 border-huarique-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{isSupabaseConfigured ? 'Supabase DB' : 'Local DB'}</span>
            </div>

            {/* Active Mozo Pill Button */}
            <div className="flex items-center space-x-3 bg-huarique-50 border border-huarique-200 rounded-3xl p-2 pr-3 shadow-sm">
              <div className={`w-10 h-10 rounded-2xl font-extrabold text-xs flex items-center justify-center shadow-sm ${
                isOwner ? 'bg-huarique-900 text-white' : 'bg-huarique-500 text-white'
              }`}>
                {mozoActivo?.iniciales || 'MO'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-huarique-500 tracking-wider">
                  {isOwner ? 'Dueña' : 'Mozo'}
                </p>
                <p className="text-xs font-extrabold text-huarique-900 truncate max-w-[100px]">
                  {mozoActivo?.nombre || 'Mozo'}
                </p>
              </div>

              <button
                onClick={logout}
                title="Cambiar Mozo / Bloquear Terminal"
                className="p-2 text-huarique-400 hover:text-red-600 rounded-2xl hover:bg-white transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between border-t border-huarique-100 py-2.5 space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl text-xs font-extrabold transition ${
                  isActive
                    ? 'bg-huarique-100 text-huarique-900 border border-huarique-200/80 shadow-sm'
                    : 'text-huarique-600 hover:bg-huarique-50'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-huarique-500' : 'text-huarique-400'}`} />
                <span className="text-[11px] truncate">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
