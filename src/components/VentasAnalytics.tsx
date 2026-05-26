/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { TrendingUp, Award, DollarSign, ArrowUpRight, Percent, Calendar, RefreshCw, BarChart3, PieChart } from 'lucide-react';
import { VentaRecord, Platillo, Cobro } from '../types';

interface VentasAnalyticsProps {
  ventas: VentaRecord[];
  platillos: Platillo[];
  cobros: Cobro[];
}

export default function VentasAnalytics({ ventas, platillos, cobros }: VentasAnalyticsProps) {
  const [filterPeriod, setFilterPeriod] = useState<'7d' | 'all'>('7d');

  // Basic calculations
  const totalIncomes = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalCost = ventas.reduce((acc, v) => acc + v.costoTotal, 0);
  const totalProfit = totalIncomes - totalCost;
  const averageTicket = ventas.length > 0 ? totalIncomes / ventas.length : 0;
  const overallMargin = totalIncomes > 0 ? (totalProfit / totalIncomes) * 100 : 0;

  // Group sales by Date for the SVG Line/Bar Chart
  const salesByDate: { [key: string]: { total: number; profit: number } } = {};
  
  // Initialize last 5 days to guarantee we show some data points
  const datesToShow = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  datesToShow.forEach(date => {
    salesByDate[date] = { total: 0, profit: 0 };
  });

  ventas.forEach(v => {
    const dateStr = v.fecha;
    if (salesByDate[dateStr] !== undefined) {
      salesByDate[dateStr].total += v.total;
      salesByDate[dateStr].profit += v.ganancia;
    } else {
      // also record other historical dates
      salesByDate[dateStr] = { total: v.total, profit: v.ganancia };
    }
  });

  const sortedDates = Object.keys(salesByDate).sort();
  const maxVal = Math.max(...sortedDates.map(d => salesByDate[d].total), 200);

  // Group by payment method
  const countByMethod: Record<string, number> = {
    'Efectivo': 0,
    'Tarjeta': 0,
    'Transferencia': 0,
    'Pago Digital': 0
  };

  ventas.forEach(v => {
    if (v.metodoPago.includes('Tarjeta')) {
      countByMethod['Tarjeta'] += v.total;
    } else if (v.metodoPago.includes('digital') || v.metodoPago.includes('Digital')) {
      countByMethod['Pago Digital'] += v.total;
    } else if (v.metodoPago.includes('Transferencia')) {
      countByMethod['Transferencia'] += v.total;
    } else {
      countByMethod['Efectivo'] += v.total;
    }
  });

  const totalPaymentsVal = Object.values(countByMethod).reduce((a, b) => a + b, 1);

  // Best selling dish calculations
  const topDishes: { name: string; category: string; count: number; revenue: number }[] = [];
  const dishCountMap: Record<string, { count: number; revenue: number }> = {};

  // For simulation we can look at cobros or active sales to display
  // Let's gather items from cobros or mock items sold
  // We'll calculate based on our static sample sales representation
  platillos.forEach(p => {
    // arbitrary multiplier for aesthetic visuals
    const seedMultiplier = p.id === 'p1' ? 4 : p.id === 'p3' ? 3 : p.id === 'p2' ? 5 : p.id === 'p5' ? 6 : 2;
    dishCountMap[p.id] = { count: seedMultiplier, revenue: seedMultiplier * p.precio };
  });

  const rankedDishes = Object.keys(dishCountMap).map(id => {
    const plate = platillos.find(p => p.id === id);
    return {
      name: plate?.nombre || 'Platillo',
      category: plate?.categoria || 'Entrada',
      count: dishCountMap[id].count,
      revenue: dishCountMap[id].revenue
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-6" id="ventas-analytics">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" /> Rendimiento de Ventas & Analíticas
          </h1>
          <p className="text-slate-500 text-sm mt-1">Inspecciona el margen de ganancia ideal, el ticket de consumo promedio y las preferencias de platos.</p>
        </div>
        
        {/* Toggle period */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterPeriod('7d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition duration-150 ${
              filterPeriod === '7d' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Últimos 5 Días
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition duration-150 ${
              filterPeriod === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todo el Historial
          </button>
        </div>
      </div>

      {/* Main KPI Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ingreso Bruto</span>
          <span className="text-xl font-bold text-slate-900 block mt-1">${totalIncomes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">100% de caja</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Costo Materia Prima</span>
          <span className="text-xl font-bold text-slate-800 block mt-1">${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-indigo-500 font-semibold block mt-1">Costo Ideal Suministros</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ganancia de Operación</span>
          <span className="text-xl font-bold text-emerald-600 block mt-1">${totalProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Retorno de Inversión (ROI)</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Margen de Utilidad</span>
          <span className="text-xl font-bold text-slate-900 block mt-1">{overallMargin.toFixed(1)}%</span>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-1">Fórmula: Ganancia / Bruto</span>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Promedio</span>
          <span className="text-xl font-bold text-slate-950 block mt-1">${averageTicket.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-slate-500 block mt-1">{ventas.length} transacciones</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart (SVG AREA) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> Evolución de Ventas Diarias
              </h2>
              <p className="text-xs text-slate-400">Ingresos totales por fechas en MXN.</p>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">Tendencia General</span>
          </div>

          {/* SVG Visual Bar/Line Area Chart */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="h-[210px] w-full flex items-end gap-3 px-2">
              {sortedDates.map((date, idx) => {
                const dayVal = salesByDate[date]?.total || 0;
                // Calculate height percentage
                const heightPercent = maxVal > 0 ? (dayVal / maxVal) * 100 : 0;
                // Human date label
                const label = date.slice(5); // MM-DD

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip on hovering */}
                    <div className="absolute bottom-full mb-2 bg-slate-900 text-white font-mono text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 text-center z-10 shadow-md">
                      <span className="block font-semibold">{date}</span>
                      <span className="block text-indigo-300">Ventas: ${dayVal.toFixed(2)}</span>
                      <span className="block text-emerald-400">Neto: ${(salesByDate[date]?.profit || 0).toFixed(2)}</span>
                    </div>

                    {/* Bar columns */}
                    <div className="w-full flex justify-center gap-1 items-end h-full">
                      {/* Grey Background bar frame */}
                      <div className="w-4 bg-slate-50 border border-slate-100 hover:border-indigo-300 rounded-t-md h-full flex flex-col justify-end relative overflow-hidden">
                        {/* Fill income */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-indigo-600 rounded-t-sm transition-all duration-500"
                        ></div>
                      </div>
                    </div>

                    {/* Footer axis label */}
                    <span className="text-[10px] text-slate-400 font-semibold mt-2 block">{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend indicators */}
            <div className="flex gap-4 justify-center text-xs mt-4 pt-3 border-t border-slate-50 font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded"></span> Ventas Totales ($)
              </span>
              <span className="text-[10px] text-slate-400">
                Apunta (hover) en las barras para ver desglose detallado.
              </span>
            </div>
          </div>
        </div>

        {/* Payment breakdown Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <PieChart className="w-5 h-5 text-indigo-500" /> Cobrado por Canal
              </h2>
              <p className="text-xs text-slate-400">Preferencia de métodos de pago.</p>
            </div>
          </div>

          {/* Render bar percentages representing parts of Donut in elegant lists */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {Object.keys(countByMethod).map((method, idx) => {
              const amount = countByMethod[method];
              const percent = ((amount / totalPaymentsVal) * 100).toFixed(1);
              const colorClasses = [
                'bg-slate-900',
                'bg-indigo-600',
                'bg-emerald-500',
                'bg-amber-500'
              ];

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorClasses[idx] || 'bg-slate-405'}`}></span>
                      {method}
                    </span>
                    <span className="text-slate-900 font-bold">${amount.toFixed(2)} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full rounded-full ${colorClasses[idx] || 'bg-slate-500'}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Culinary ranking breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Ranking de Demanda de Menú
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Discos y bebidas ordenados por volumen vendido hoy.</p>
          </div>
          <span className="text-xs text-slate-400 italic">Datos simulados en tiempo real</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {rankedDishes.map((dish, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden flex flex-col justify-between">
              <span className="absolute right-2 top-2 font-mono text-xs font-bold text-slate-350 bg-white/60 border border-slate-100 w-6 h-6 rounded-full flex items-center justify-center">
                #{idx + 1}
              </span>
              
              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{dish.category}</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm block truncate max-w-[150px]" title={dish.name}>
                  {dish.name}
                </span>
              </div>

              <div className="flex justify-between items-end mt-4 pt-2 border-t border-slate-205/55">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block font-semibold">Consumidos</span>
                  <span className="text-sm font-bold text-slate-900 block">{dish.count} órdenes</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold font-medium">Recaudado</span>
                  <span className="text-xs font-semibold text-indigo-700 block">${dish.revenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
