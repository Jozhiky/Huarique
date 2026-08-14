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
    <header className="bg-white border-b border-huarique-100 sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-huarique-50 p-1.5 border border-huarique-200 shadow-inner flex items-center justify-center">
              <img src="/logo.png" alt="Huarique de Catacaos" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-huarique-900 leading-tight tracking-tight">
                HUARIQUE DE CATACAOS
              </h1>
              <p className="text-xs font-semibold text-huarique-500 flex items-center space-x-2">
                <span>Comandas & Control</span>
                <span className="w-1.5 h-1.5 rounded-full bg-huarique-400"></span>
                <span className="text-huarique-700">
                  {isOwner ? 'Vista Administrador' : 'Vista Mozo'}
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-huarique-50 p-1.5 rounded-2xl border border-huarique-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-huarique-900 shadow-sm border border-huarique-200/60'
                      : 'text-huarique-600 hover:text-huarique-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-huarique-500' : 'text-huarique-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Active Mozo & Clock */}
          <div className="flex items-center space-x-3">
            
            <div className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold text-huarique-600 bg-huarique-50 px-3 py-2 rounded-xl border border-huarique-100">
              <Clock className="w-3.5 h-3.5 text-huarique-400" />
              <span>{timeStr}</span>
            </div>

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

            <div className="flex items-center space-x-2 bg-huarique-50 border border-huarique-200 rounded-2xl p-1.5 pr-2">
              <div className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center shadow-sm ${
                isOwner ? 'bg-huarique-900 text-white' : 'bg-huarique-500 text-white'
              }`}>
                {mozoActivo?.iniciales || 'MO'}
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-huarique-500 tracking-wider">
                  {isOwner ? 'Dueña' : 'Mozo'}
                </p>
                <p className="text-xs font-bold text-huarique-900 truncate max-w-[90px]">
                  {mozoActivo?.nombre || 'Mozo'}
                </p>
              </div>

              <button
                onClick={logout}
                title="Cambiar Mozo / Bloquear Terminal"
                className="p-2 text-huarique-400 hover:text-red-600 rounded-xl hover:bg-white transition ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between border-t border-huarique-100 py-2 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-huarique-100 text-huarique-900 border border-huarique-200/80'
                    : 'text-huarique-600 hover:bg-huarique-50'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-huarique-500' : 'text-huarique-400'}`} />
                <span className="text-[11px] truncate">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
