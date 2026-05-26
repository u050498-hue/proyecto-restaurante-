/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, CookingPot, Utensils, ClipboardList, TrendingUp, CreditCard, DollarSign, Award } from 'lucide-react';
import { Personal, Chef, Cliente, Platillo, Comanda, Cobro } from '../types';

interface DashboardOverviewProps {
  personal: Personal[];
  chefs: Chef[];
  clientes: Cliente[];
  platillos: Platillo[];
  comandas: Comanda[];
  cobros: Cobro[];
  onNavigate: (tab: string) => void;
  onSelectComanda: (comanda: Comanda) => void;
}

export default function DashboardOverview({
  personal,
  chefs,
  clientes,
  platillos,
  comandas,
  cobros,
  onNavigate,
  onSelectComanda
}: DashboardOverviewProps) {
  // Calculations
  const activeComandas = comandas.filter(c => c.estado !== 'Cobrado' && c.estado !== 'Cancelado');
  const finishedToday = comandas.filter(c => c.estado === 'Cobrado');
  const activeChefsCount = chefs.filter(c => c.activo).length;
  const activeStaffCount = personal.filter(p => p.activo).length;
  
  // Total Sales today (simulating date or using all cobros for demo)
  const totalSalesVal = cobros.reduce((acc, c) => acc + c.total, 0);
  const totalDiscounts = cobros.reduce((acc, c) => acc + (c.subtotal * (c.descuento / 100)), 0);

  // Top selling dishes calculation
  const dishSalesMap: { [key: string]: { name: string; count: number; category: string } } = {};
  comandas.forEach(c => {
    if (c.estado === 'Cobrado') {
      c.items.forEach(item => {
        if (!dishSalesMap[item.platilloId]) {
          const plat = platillos.find(p => p.id === item.platilloId);
          dishSalesMap[item.platilloId] = {
            name: item.platilloNombre,
            count: 0,
            category: plat?.categoria || 'Chef'
          };
        }
        dishSalesMap[item.platilloId].count += item.cantidad;
      });
    }
  });

  const topDishes = Object.values(dishSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Active orders overview breakdown
  const statusCounts = {
    Pendiente: activeComandas.filter(c => c.estado === 'Pendiente').length,
    'En Cocina': activeComandas.filter(c => c.estado === 'En Cocina').length,
    Listo: activeComandas.filter(c => c.estado === 'Listo').length,
    Servido: activeComandas.filter(c => c.estado === 'Servido').length,
  };

  return (
    <div className="space-y-6" id="dashboard-overview">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Control General</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión operativa en tiempo real para tu restaurante gourmet.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('comandas')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm flex items-center gap-2"
            id="dashboard-new-order-btn"
          >
            <ClipboardList className="w-4 h-4" /> Nueva Comanda
          </button>
          <button
            onClick={() => onNavigate('cobros')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm flex items-center gap-2"
            id="dashboard-billing-btn"
          >
            <CreditCard className="w-4 h-4" /> Cobros Express
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-100 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Ventas Totales</span>
            <span className="text-2xl font-bold text-slate-900">${totalSalesVal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs text-emerald-600 block">+{cobros.length} Transacciones</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-100 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Comandas Activas</span>
            <span className="text-2xl font-bold text-slate-900">{activeComandas.length}</span>
            <span className="text-xs text-blue-600 block">{statusCounts['En Cocina']} en preparación</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-amber-100 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Chefs en Cocina</span>
            <span className="text-2xl font-bold text-slate-900">{activeChefsCount} / {chefs.length}</span>
            <span className="text-xs text-amber-600 block">Estaciones ocupadas</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <CookingPot className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-purple-100 transition duration-200">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Clientes Frecuentes</span>
            <span className="text-2xl font-bold text-slate-900">{clientes.filter(c => c.frecuente).length}</span>
            <span className="text-xs text-purple-600 block">Miembros leales</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active orders list */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Seguimiento de Comandas Activas</h2>
              <p className="text-xs text-slate-400 mt-0.5">Pendientes de despacho y cobro inmediato.</p>
            </div>
            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
              <span className="text-[11px] px-2 py-1 bg-white shadow-xs text-slate-700 rounded-md font-semibold text-center">
                Activas: {activeComandas.length}
              </span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 gap-3 flex flex-col pr-1 scrollbar-thin">
            {activeComandas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <Utensils className="w-10 h-10 text-slate-300 stroke-1" />
                <p className="text-sm">No hay comandas activas en este momento.</p>
                <button
                  onClick={() => onNavigate('comandas')}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Abrir mesa / Crear comandas &rarr;
                </button>
              </div>
            ) : (
              activeComandas.map((comanda) => {
                const badgeColorMap: Record<string, string> = {
                  'Pendiente': 'bg-slate-100 text-slate-700 border-slate-200',
                  'En Cocina': 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
                  'Listo': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'Servido': 'bg-blue-50 text-blue-700 border-blue-200',
                };
                return (
                  <div
                    key={comanda.id}
                    onClick={() => {
                      onNavigate('comandas');
                      onSelectComanda(comanda);
                    }}
                    className="group flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition duration-150 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{comanda.numeroMesa}</span>
                        <span className="text-xs text-slate-400">• ID: {comanda.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColorMap[comanda.estado] || 'bg-slate-50 text-slate-600'}`}>
                          {comanda.estado}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Cliente: <span className="text-slate-700">{comanda.clienteNombre || 'General'}</span> | Mesero: <span className="text-slate-700">{comanda.meseroNombre}</span>
                      </div>
                      <div className="text-xs text-slate-600 truncate max-w-md">
                        {comanda.items.map(item => `${item.cantidad}x ${item.platilloNombre}`).join(', ')}
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col items-end justify-between w-full md:w-auto mt-3 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/50">
                      <span className="text-sm font-bold text-slate-900">${comanda.total.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400">{new Date(comanda.fechaHora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[10px] text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition duration-150">Ver comanda &rarr;</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right side stats & operations helper */}
        <div className="space-y-6">
          {/* Top Selling Items Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[280px]">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Platillos Populares
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Los favoritos de los comensales hoy.</p>
            
            <div className="mt-4 flex-1 flex flex-col gap-3 justify-center">
              {topDishes.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Aún no se han cobrado comandas hoy para rankear favoritos.
                </div>
              ) : (
                topDishes.map((dish, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs w-5 h-5 rounded-full flex items-center justify-center ${
                        idx === 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-800 block text-xs md:text-sm truncate max-w-[150px]">{dish.name}</span>
                        <span className="text-[10px] text-slate-400 block">{dish.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {dish.count} servidos
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick status bar */}
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
              <Utensils className="w-40 h-40 stroke-1" />
            </div>
            <h3 className="font-bold text-base">Atención al Personal</h3>
            <p className="text-slate-300 text-xs mt-1">Garantiza el estándar de servicio monitoreando la carga de los chefs en tiempo real.</p>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Total Colaboradores:</span>
                <span className="font-bold">{personal.length} activos/registrados</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Chefs en turno:</span>
                <span className="font-bold">{chefs.filter(c => c.activo).length} listos</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Clientes Habituales:</span>
                <span className="font-bold text-emerald-400">{clientes.length} registrados</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('personal')}
              className="mt-4 w-full py-2 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20 transition duration-150 flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" /> Gestionar Sindicato/Personal &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
