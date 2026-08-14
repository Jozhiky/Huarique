import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { BarChart3, TrendingUp, Users, DollarSign, Award, Calendar, ChevronRight, PieChart } from 'lucide-react';

export default function DueñaDashboard() {
  const { comandas, mozos, productos, mesas } = useStore();
  const [periodo, setPeriodo] = useState('hoy');

  // Metrics Calculations
  const totalVentas = comandas.reduce((sum, c) => sum + (c.total || 0), 0);
  const totalComandas = comandas.length;
  const ticketPromedio = totalComandas > 0 ? totalVentas / totalComandas : 0;
  const mesasOcupadas = mesas.filter(m => m.estado !== 'libre').length;

  // Waiters Ranking
  const mozosPerformance = mozos.filter(m => m.rol === 'mozo').map(mozo => {
    const mozoComandas = comandas.filter(c => c.mozoId === mozo.id);
    const mozoVentas = mozoComandas.reduce((sum, c) => sum + (c.total || 0), 0);
    return {
      ...mozo,
      totalComandas: mozoComandas.length,
      totalVentas: mozoVentas,
    };
  }).sort((a, b) => b.totalVentas - a.totalVentas);

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Executive Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-4xl border border-huarique-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-huarique-900 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
            Administración Dueña
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-huarique-900 leading-tight mt-2">
            Panel de Control Executive - Huarique de Catacaos
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-huarique-500 mt-0.5">
            Resumen de ventas en vivo, rendimiento de mozos y métricas operativas
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-2 bg-huarique-50 p-1.5 rounded-2xl border border-huarique-100 self-start sm:self-auto">
          {['hoy', 'semana', 'mes'].map((p) => {
            const labels = { hoy: 'Hoy', semana: 'Esta Semana', mes: 'Este Mes' };
            const isActive = periodo === p;
            return (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  isActive
                    ? 'bg-huarique-500 text-white shadow-sm'
                    : 'text-huarique-600 hover:text-huarique-900'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Sales Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-huarique-500 uppercase tracking-wider">
              Ventas Totales
            </span>
            <div className="p-2.5 rounded-2xl bg-huarique-50 text-huarique-600 border border-huarique-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-huarique-900">
            S/ {totalVentas.toFixed(2)}
          </p>
          <p className="text-xs font-bold text-sage-600 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.5% vs ayer</span>
          </p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-huarique-500 uppercase tracking-wider">
              Comandas Atendidas
            </span>
            <div className="p-2.5 rounded-2xl bg-huarique-50 text-huarique-600 border border-huarique-100">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-huarique-900">
            {totalComandas}
          </p>
          <p className="text-xs font-bold text-huarique-500">
            Tickets emitidos
          </p>
        </div>

        {/* Average Ticket Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-huarique-500 uppercase tracking-wider">
              Ticket Promedio
            </span>
            <div className="p-2.5 rounded-2xl bg-huarique-50 text-huarique-600 border border-huarique-100">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-huarique-900">
            S/ {ticketPromedio.toFixed(2)}
          </p>
          <p className="text-xs font-bold text-huarique-500">
            Consumo por comanda
          </p>
        </div>

        {/* Active Tables Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-huarique-500 uppercase tracking-wider">
              Ocupación Actual
            </span>
            <div className="p-2.5 rounded-2xl bg-huarique-50 text-huarique-600 border border-huarique-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-huarique-900">
            {mesasOcupadas} / 80
          </p>
          <p className="text-xs font-bold text-amber-700">
            {((mesasOcupadas / 80) * 100).toFixed(0)}% del salón ocupado
          </p>
        </div>

      </div>

      {/* Waiters Performance Table (High Readability Tablet Table) */}
      <div className="bg-white rounded-3xl sm:rounded-4xl border border-huarique-100 p-5 sm:p-6 shadow-soft space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-huarique-50 text-huarique-600 border border-huarique-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-huarique-900">
                Rendimiento de Mozos (Ranking de Ventas)
              </h3>
              <p className="text-xs font-semibold text-huarique-500">
                Comandas atendidas y volumen total en soles
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-huarique-100 text-xs font-black text-huarique-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Posición</th>
                <th className="py-3.5 px-4">Mozo</th>
                <th className="py-3.5 px-4 text-center">Comandas</th>
                <th className="py-3.5 px-4 text-right">Venta Total</th>
                <th className="py-3.5 px-4 text-right">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-huarique-100/80 text-xs sm:text-sm">
              {mozosPerformance.map((mozo, index) => {
                const promedio = mozo.totalComandas > 0 ? mozo.totalVentas / mozo.totalComandas : 0;
                return (
                  <tr key={mozo.id} className="hover:bg-huarique-50/50 transition">
                    <td className="py-4 px-4 font-black text-huarique-900">
                      <span className={`w-8 h-8 rounded-xl inline-flex items-center justify-center font-black text-xs ${
                        index === 0 ? 'bg-amber-500 text-white shadow-touch' : 'bg-huarique-100 text-huarique-800'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-black text-huarique-900">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-huarique-500 text-white font-extrabold text-xs flex items-center justify-center">
                          {mozo.iniciales}
                        </div>
                        <span>{mozo.nombre}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-black text-huarique-900 text-center">
                      <span className="px-3 py-1 bg-huarique-50 text-huarique-800 rounded-xl border border-huarique-100 font-extrabold">
                        {mozo.totalComandas} comandas
                      </span>
                    </td>
                    <td className="py-4 px-4 font-black text-huarique-900 text-right">
                      S/ {mozo.totalVentas.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-huarique-600 text-right">
                      S/ {promedio.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
