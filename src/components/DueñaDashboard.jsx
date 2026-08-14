import React from 'react';
import { useStore } from '../store/useStore';
import { BarChart3, TrendingUp, Users, Award, Clock, DollarSign, Utensils, LayoutGrid, Sparkles } from 'lucide-react';

export default function DueñaDashboard() {
  const { mozos, comandas, salones, mesas } = useStore();

  // Calculate sales metrics
  const totalRecaudado = comandas.reduce((sum, c) => sum + (c.total || 0), 0);
  const totalComandas = comandas.length;
  const ticketPromedio = totalComandas > 0 ? totalRecaudado / totalComandas : 0;

  // Mozos activity calculation
  const mozoStats = mozos.filter(m => m.rol === 'mozo').map(mozo => {
    const mozoComandas = comandas.filter(c => c.mozoId === mozo.id);
    const totalVendido = mozoComandas.reduce((sum, c) => sum + (c.total || 0), 0);
    const mesasAtendidas = mozoComandas.length;
    
    return {
      ...mozo,
      mesasAtendidas,
      totalVendido,
      ticketPromedio: mesasAtendidas > 0 ? totalVendido / mesasAtendidas : 0,
      comandas: mozoComandas
    };
  });

  // Sort mozos by revenue
  const topMozo = [...mozoStats].sort((a, b) => b.totalVendido - a.totalVendido)[0];

  // Sales by Salon
  const salonStats = salones.map(salon => {
    const salonComandas = comandas.filter(c => c.salonNombre.includes(salon.nombre) || c.salonNombre.includes(salon.id));
    const totalVendido = salonComandas.reduce((sum, c) => sum + (c.total || 0), 0);
    return {
      ...salon,
      comandasCount: salonComandas.length,
      totalVendido
    };
  });

  // Top Dishes
  const dishMap = {};
  comandas.forEach(cmd => {
    cmd.items.forEach(item => {
      if (!dishMap[item.nombre]) {
        dishMap[item.nombre] = { nombre: item.nombre, cantidad: 0, total: 0 };
      }
      dishMap[item.nombre].cantidad += item.cantidad;
      dishMap[item.nombre].total += item.precio * item.cantidad;
    });
  });

  const topDishes = Object.values(dishMap).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-huarique-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-huarique-50 text-2xl border border-huarique-200">👑</span>
            <div>
              <h2 className="text-xl font-extrabold text-huarique-900 leading-tight">
                Panel de Control de la Dueña
              </h2>
              <p className="text-xs font-semibold text-huarique-500">
                Resumen de ventas, rendimiento de mozos y comportamiento de salones
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter Badge */}
        <div className="flex items-center space-x-2 bg-huarique-50 px-4 py-2.5 rounded-2xl border border-huarique-100 text-xs font-bold text-huarique-700">
          <Clock className="w-4 h-4 text-huarique-500" />
          <span>Turno Actual: Hoy ({new Date().toLocaleDateString('es-PE')})</span>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Venta Total */}
        <div className="bg-white p-5 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-huarique-500 uppercase tracking-wider">Ventas Totales</span>
            <span className="p-2 rounded-2xl bg-huarique-50 text-huarique-600">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-huarique-900">
            S/ {totalRecaudado.toFixed(2)}
          </p>
          <p className="text-[11px] font-semibold text-sage-600 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>En {totalComandas} comandas registradas</span>
          </p>
        </div>

        {/* Metric 2: Comandas Atendidas */}
        <div className="bg-white p-5 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-huarique-500 uppercase tracking-wider">Mesas Atendidas</span>
            <span className="p-2 rounded-2xl bg-huarique-50 text-huarique-600">
              <Utensils className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-huarique-900">
            {totalComandas} mesas
          </p>
          <p className="text-[11px] font-semibold text-huarique-500">
            Promedio: S/ {ticketPromedio.toFixed(2)} por mesa
          </p>
        </div>

        {/* Metric 3: Mozo Destacado */}
        <div className="bg-white p-5 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-huarique-500 uppercase tracking-wider">Mozo Top del Día</span>
            <span className="p-2 rounded-2xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xl font-extrabold text-huarique-900 truncate">
            {topMozo ? topMozo.nombre : 'Sin registro'}
          </p>
          <p className="text-[11px] font-semibold text-huarique-600">
            {topMozo ? `S/ ${topMozo.totalVendido.toFixed(2)} (${topMozo.mesasAtendidas} mesas)` : '0.00'}
          </p>
        </div>

        {/* Metric 4: Salón con Más Ventas */}
        <div className="bg-white p-5 rounded-3xl border border-huarique-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-huarique-500 uppercase tracking-wider">Salón Activo</span>
            <span className="p-2 rounded-2xl bg-huarique-50 text-huarique-600">
              <LayoutGrid className="w-5 h-5" />
            </span>
          </div>
          <p className="text-lg font-extrabold text-huarique-900 truncate">
            Salón Principal
          </p>
          <p className="text-[11px] font-semibold text-huarique-500">
            30 Mesas (Mayor flujo)
          </p>
        </div>

      </div>

      {/* Main Section: Mozos Performance Table */}
      <div className="bg-white p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-huarique-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-huarique-500" />
              <span>Rendimiento y Actividad de los Mozos</span>
            </h3>
            <p className="text-xs text-huarique-500 font-medium">
              Detalle de horas de atención, mesas atendidas y monto generado
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-huarique-100 text-huarique-500 font-bold uppercase text-[10px] tracking-wider bg-huarique-50/60">
                <th className="p-3.5 rounded-l-2xl">Mozo</th>
                <th className="p-3.5">Mesas Atendidas</th>
                <th className="p-3.5">Total Vendido</th>
                <th className="p-3.5">Ticket Promedio</th>
                <th className="p-3.5 rounded-r-2xl">Estado / Rendimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-huarique-100/60">
              {mozoStats.map((mozo) => (
                <tr key={mozo.id} className="hover:bg-huarique-50/40 transition">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl p-1.5 bg-huarique-50 rounded-xl border border-huarique-100">{mozo.avatar}</span>
                      <div>
                        <p className="font-extrabold text-huarique-900 text-sm">{mozo.nombre}</p>
                        <p className="text-[11px] text-huarique-500 font-mono">PIN: ******</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-bold text-huarique-800">
                    <span className="px-3 py-1 bg-huarique-50 rounded-xl border border-huarique-100">
                      {mozo.mesasAtendidas} mesas
                    </span>
                  </td>

                  <td className="p-3.5 font-extrabold text-huarique-900 text-sm">
                    S/ {mozo.totalVendido.toFixed(2)}
                  </td>

                  <td className="p-3.5 font-semibold text-huarique-700">
                    S/ {mozo.ticketPromedio.toFixed(2)}
                  </td>

                  <td className="p-3.5">
                    {mozo.mesasAtendidas > 0 ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sage-100 text-sage-800 border border-sage-200">
                        <Sparkles className="w-3.5 h-3.5 text-sage-600" />
                        <span>Activo en atención</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-huarique-100 text-huarique-600">
                        <span>Sin mesas aún</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Grid Bottom: Top Dishes & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Dishes Ranking */}
        <div className="bg-white p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-4">
          <h3 className="text-base font-extrabold text-huarique-900 flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-huarique-500" />
            <span>Platos Más Vendidos</span>
          </h3>

          <div className="space-y-3">
            {topDishes.map((dish, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-huarique-50/60 border border-huarique-100"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-huarique-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-huarique-900">{dish.nombre}</h4>
                    <p className="text-[11px] text-huarique-500 font-semibold">{dish.cantidad} unidades vendidas</p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-huarique-900">
                  S/ {dish.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Comandas History Log */}
        <div className="bg-white p-6 rounded-3xl border border-huarique-100 shadow-soft space-y-4">
          <h3 className="text-base font-extrabold text-huarique-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-huarique-500" />
            <span>Últimos Pedidos Registrados</span>
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {comandas.map((cmd) => (
              <div
                key={cmd.id}
                className="p-3 rounded-2xl border border-huarique-100 bg-white flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-huarique-900">Mesa {cmd.mesaNumero}</span>
                    <span className="text-[10px] text-huarique-500 font-medium">({cmd.salonNombre})</span>
                  </div>
                  <p className="text-[11px] text-huarique-600 mt-0.5">
                    Atendido por: <strong>{cmd.mozoNombre}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-huarique-900 block">S/ {cmd.total.toFixed(2)}</span>
                  <span className="text-[10px] text-huarique-400">
                    {new Date(cmd.creadoEn).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
