/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClipboardList, Plus, Edit, ChefHat, Play, CheckCircle2, CheckSquare, Trash2, Tag, Utensils, User, ArrowRight, Save, X, PlusCircle, MinusCircle } from 'lucide-react';
import { Comanda, Platillo, Personal, Chef, Cliente, EstadoComanda, ItemComanda } from '../types';

interface ComandasManagerProps {
  comandas: Comanda[];
  platillos: Platillo[];
  personal: Personal[];
  chefs: Chef[];
  clientes: Cliente[];
  onAdd: (comanda: Omit<Comanda, 'id'>) => void;
  onUpdateEstado: (id: string, nuevoEstado: EstadoComanda, chefId?: string) => void;
  onDelete: (id: string) => void;
  onNavigateToCobro: (comanda: Comanda) => void;
  selectedComandaExternal?: Comanda | null;
  clearExternalSelection?: () => void;
  currentUser?: Personal | null;
}

export default function ComandasManager({
  comandas,
  platillos,
  personal,
  chefs,
  clientes,
  onAdd,
  onUpdateEstado,
  onDelete,
  onNavigateToCobro,
  selectedComandaExternal,
  clearExternalSelection,
  currentUser
}: ComandasManagerProps) {
  // Navigation internal tab
  const [activeSubTab, setActiveSubTab] = useState<'activas' | 'crear'>('activas');

  // New Comanda form states
  const [numeroMesa, setNumeroMesa] = useState('Mesa 1');
  const [clienteId, setClienteId] = useState('');
  const [meseroId, setMeseroId] = useState(() => {
    if (currentUser?.rol === 'Mesero') return currentUser.id;
    return personal.find(p => p.rol === 'Mesero')?.id || personal[0]?.id || '';
  });
  const [comentarios, setComentarios] = useState('');

  // Sync meseroId when currentUser changes
  React.useEffect(() => {
    if (currentUser?.rol === 'Mesero') {
      setMeseroId(currentUser.id);
    }
  }, [currentUser]);
  
  // Selected items in the active form
  const [itemsList, setItemsList] = useState<ItemComanda[]>([]);

  // Filtering list in UI
  const [filterEstado, setFilterEstado] = useState<string>('todas');

  const availableMeseros = personal.filter(p => p.rol === 'Mesero' && p.activo);
  const availableChefs = chefs.filter(c => c.activo);

  const handleAddItem = (dish: Platillo) => {
    const existing = itemsList.find(i => i.platilloId === dish.id);
    if (existing) {
      setItemsList(itemsList.map(i => 
        i.platilloId === dish.id 
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      ));
    } else {
      setItemsList([...itemsList, {
        platilloId: dish.id,
        platilloNombre: dish.nombre,
        precioUnitario: dish.precio,
        cantidad: 1,
        notas: ''
      }]);
    }
  };

  const handleRemoveItem = (dishId: string) => {
    const existing = itemsList.find(i => i.platilloId === dishId);
    if (!existing) return;

    if (existing.cantidad <= 1) {
      setItemsList(itemsList.filter(i => i.platilloId !== dishId));
    } else {
      setItemsList(itemsList.map(i => 
        i.platilloId === dishId 
          ? { ...i, cantidad: i.cantidad - 1 }
          : i
      ));
    }
  };

  const handleItemNoteChange = (dishId: string, notas: string) => {
    setItemsList(itemsList.map(i => 
      i.platilloId === dishId ? { ...i, notas } : i
    ));
  };

  const calculateFormTotal = () => {
    return itemsList.reduce((acc, i) => acc + (i.precioUnitario * i.cantidad), 0);
  };

  const handleCreateComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsList.length === 0) {
      alert('Favor de agregar al menos un platillo o bebida a la comanda.');
      return;
    }

    const linkedCliente = clientes.find(c => c.id === clienteId);
    const linkedMesero = personal.find(p => p.id === meseroId);

    onAdd({
      numeroMesa,
      clienteId: clienteId || undefined,
      clienteNombre: linkedCliente?.nombre || 'Público General',
      items: itemsList,
      meseroId: meseroId,
      meseroNombre: linkedMesero?.nombre || 'General',
      estado: 'Pendiente',
      total: calculateFormTotal(),
      comentarios: comentarios.trim() || undefined,
      fechaHora: new Date().toISOString()
    });

    // Reset fields
    setNumeroMesa('Mesa 1');
    setClienteId('');
    setComentarios('');
    setItemsList([]);
    setActiveSubTab('activas');
  };

  // Quick State Transitions triggers
  const handleTransition = (comanda: Comanda, nextState: EstadoComanda, chefId?: string) => {
    onUpdateEstado(comanda.id, nextState, chefId);
  };

  // filter Comandas for active operations panel
  const activeComandasToDisplay = comandas.filter(c => {
    if (c.estado === 'Cobrado' || c.estado === 'Cancelado') return false;
    if (filterEstado !== 'todas') return c.estado === filterEstado;
    return true;
  });

  const mesas = [
    'Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 
    'Mesa 6', 'Mesa 7', 'Mesa 8', 'Mesa 9', 'Mesa 10', 
    'Mesa 11', 'Mesa 12', 'Barra 1', 'Barra 2', 'Barra 3'
  ];

  return (
    <div className="space-y-6" id="comandas-workspace">
      {/* Header operations switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" /> Monitor de Comandas
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sincroniza y despacha pedidos desde la mesa hacia las estufas en tiempo real.</p>
        </div>
        
        {/* Sub Navigation */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl self-stretch md:self-auto">
          <button
            onClick={() => {
              setActiveSubTab('activas');
              if (clearExternalSelection) clearExternalSelection();
            }}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition duration-150 flex items-center justify-center gap-1.5 ${
              activeSubTab === 'activas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Utensils className="w-4.5 h-4.5" /> Activas ({comandas.filter(c => c.estado !== 'Cobrado' && c.estado !== 'Cancelado').length})
          </button>
          {currentUser?.rol !== 'Cocinero' && (
            <button
              onClick={() => setActiveSubTab('crear')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition duration-150 flex items-center justify-center gap-1.5 ${
                activeSubTab === 'crear' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-4.5 h-4.5" /> Nueva Orden (POS)
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'activas' ? (
        <div className="space-y-6">
          {/* Active Comandas Filter tool */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-wrap gap-2">
            <button
              onClick={() => setFilterEstado('todas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterEstado === 'todas' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-650 hover:bg-slate-100'
              }`}
            >
              Ver Todas
            </button>
            <button
              onClick={() => setFilterEstado('Pendiente')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterEstado === 'Pendiente' ? 'bg-slate-200 text-slate-800' : 'bg-slate-50 text-slate-650 hover:bg-slate-100'
              }`}
            >
              Pendientes ({comandas.filter(c => c.estado === 'Pendiente').length})
            </button>
            <button
              onClick={() => setFilterEstado('En Cocina')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterEstado === 'En Cocina' ? 'bg-amber-100 text-amber-800' : 'bg-slate-50 text-slate-655 hover:bg-slate-100'
              }`}
            >
              En Cocina ({comandas.filter(c => c.estado === 'En Cocina').length})
            </button>
            <button
              onClick={() => setFilterEstado('Listo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterEstado === 'Listo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-50 text-slate-655 hover:bg-slate-100'
              }`}
            >
              Listos para Servir ({comandas.filter(c => c.estado === 'Listo').length})
            </button>
            <button
              onClick={() => setFilterEstado('Servido')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterEstado === 'Servido' ? 'bg-blue-105 bg-blue-100 text-blue-800' : 'bg-slate-50 text-slate-655 hover:bg-slate-100'
              }`}
            >
              Servidos a Mesa ({comandas.filter(c => c.estado === 'Servido').length})
            </button>
          </div>

          {/* Grid display of active tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeComandasToDisplay.map((ticket) => {
              const borderMap: Record<EstadoComanda, string> = {
                'Pendiente': 'border-slate-200 ring-2 ring-slate-100',
                'En Cocina': 'border-amber-200 ring-2 ring-amber-100/50',
                'Listo': 'border-emerald-300 ring-4 ring-emerald-500/10',
                'Servido': 'border-blue-200 ring-2 ring-blue-50/50',
                'Cobrado': 'border-slate-100',
                'Cancelado': 'border-red-100'
              };

              const badgeMap: Record<EstadoComanda, string> = {
                'Pendiente': 'bg-slate-150 text-slate-800',
                'En Cocina': 'bg-amber-100 text-amber-800',
                'Listo': 'bg-emerald-100 text-emerald-800 font-bold animate-bounce',
                'Servido': 'bg-blue-100 text-blue-800',
                'Cobrado': 'bg-slate-100 text-slate-550',
                'Cancelado': 'bg-red-100 text-red-850'
              };

              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl border ${borderMap[ticket.estado]} p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-base font-extrabold text-slate-800">{ticket.numeroMesa}</span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {ticket.id}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeMap[ticket.estado]}`}>
                        {ticket.estado}
                      </span>
                    </div>

                    {/* Meta info of waiter / client */}
                    <div className="py-2.5 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-450" />
                        <span>Mesero: <strong className="text-slate-700">{ticket.meseroNombre}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Utensils className="w-3.5 h-3.5 text-slate-450" />
                        <span>Cliente: <strong className="text-slate-700">{ticket.clienteNombre || 'Gral'}</strong></span>
                      </div>
                      {ticket.chefNombre && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                          <span>Chef: <strong className="text-amber-800">{ticket.chefNombre}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Order items listing */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pedido</span>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {ticket.items.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-semibold text-slate-700">
                              <span>{item.cantidad}x {item.platilloNombre}</span>
                              <span>${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                            </div>
                            {item.notas && (
                              <p className="text-[10px] text-slate-500 italic ml-4 bg-amber-50 rounded p-1 border border-amber-100/50 mt-0.5">
                                • {item.notas}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Global observations comments */}
                    {ticket.comentarios && (
                      <div className="mt-3 text-[10px] bg-indigo-50/50 text-indigo-700 rounded-lg p-2 leading-relaxed">
                        <strong>Comentarios:</strong> {ticket.comentarios}
                      </div>
                    )}
                  </div>

                  {/* Footer billing summary & state controls */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Monto Neto:</span>
                      <span className="text-lg font-bold text-slate-900">${ticket.total.toFixed(2)}</span>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex gap-2 justify-end">
                      {ticket.estado === 'Pendiente' && (
                        <div className="flex flex-col gap-2 w-full">
                          <span className="text-[9px] font-bold text-slate-400 text-center uppercase block">Asignar Chef en Cocina</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {availableChefs.length > 0 ? (
                              availableChefs.map(chef => (
                                <button
                                  key={chef.id}
                                  onClick={() => handleTransition(ticket, 'En Cocina', chef.id)}
                                  className="py-1 px-2 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-center transition truncate"
                                >
                                  {chef.nombre.split(' ')[1] || chef.nombre}
                                </button>
                              ))
                            ) : (
                              <button
                                onClick={() => handleTransition(ticket, 'En Cocina')}
                                className="col-span-2 py-1.5 text-[10px] font-bold bg-slate-150 text-slate-800 rounded-lg"
                              >
                                Mandar sin Chef asignado
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {ticket.estado === 'En Cocina' && (
                        <button
                          onClick={() => handleTransition(ticket, 'Listo')}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                        >
                          <CheckCircle2 className="w-4 h-4" /> ¡Marcar como Listo!
                        </button>
                      )}

                      {ticket.estado === 'Listo' && (
                        currentUser?.rol === 'Cocinero' ? (
                          <div className="w-full py-2 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl text-center border border-emerald-250">
                            🍳 ¡Listo! Esperando que el mesero lo entregue
                          </div>
                        ) : (
                          <button
                            onClick={() => handleTransition(ticket, 'Servido')}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                          >
                            <Utensils className="w-4 h-4" /> Servir a Mesa
                          </button>
                        )
                      )}

                      {ticket.estado === 'Servido' && currentUser?.rol !== 'Cocinero' && (
                        <button
                          onClick={() => onNavigateToCobro(ticket)}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                        >
                          <ArrowRight className="w-4 h-4" /> Proceder al Cobro
                        </button>
                      )}
                    </div>

                    {/* Manual Delete Ticket */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>{new Date(ticket.fechaHora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                      {currentUser?.rol !== 'Cocinero' && (
                        <button
                          onClick={() => onDelete(ticket.id)}
                          className="text-slate-400 hover:text-red-500 font-medium"
                        >
                          Cancelar Comanda
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {activeComandasToDisplay.length === 0 && (
              <div className="col-span-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto stroke-1 mb-2" />
                <p className="text-sm">No hay comandas que coincidan con la selección activa.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Order placement panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Menu Catalog selector */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Catálogo para Selección</h2>
              <p className="text-xs text-slate-400 mt-0.5">Selecciona productos para cargarlos a la mesa del cliente.</p>
            </div>

            {/* In-form small category buttons */}
            <div className="flex flex-wrap gap-1 bg-slate-50 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterEstado('todas')} // reuse state or dummy filter
                className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white rounded-lg shadow-2xs"
              >
                Menú Completo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {platillos.filter(p => p.disponible).map(dish => {
                const alreadySelected = itemsList.find(i => i.platilloId === dish.id);
                return (
                  <div
                    key={dish.id}
                    onClick={() => handleAddItem(dish)}
                    className={`p-3.5 bg-slate-50/70 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50/10 transition cursor-pointer flex justify-between items-center ${
                      alreadySelected ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-100'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <span className="font-bold text-slate-800 text-xs sm:text-sm block line-clamp-1">{dish.nombre}</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">{dish.categoria}</span>
                      <span className="text-xs font-bold text-indigo-650 block">${dish.precio.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {alreadySelected && (
                        <div className="flex items-center gap-1.5 mr-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(dish.id);
                            }}
                            className="p-1 text-red-500 hover:bg-slate-200 rounded-full"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                          <span className="font-bold text-slate-900 text-sm">{alreadySelected.cantidad}</span>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItem(dish);
                        }}
                        className="p-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Editor sidebar */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full sticky top-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Boleta de Comanda</h2>
                <p className="text-xs text-slate-400 mt-0.5">Asigna mesa, cliente y mesero.</p>
              </div>
              <button
                type="button"
                onClick={() => setItemsList([])}
                className="text-slate-400 hover:text-red-500 text-xs font-semibold"
              >
                Limpiar todo
              </button>
            </div>

            <form onSubmit={handleCreateComanda} className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4 overflow-y-auto max-h-[380px] pr-1 flex-1 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Select Mesa */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Número de Mesa</label>
                    <select
                      value={numeroMesa}
                      onChange={(e) => setNumeroMesa(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-indigo-500/20 text-xs font-semibold text-slate-700"
                    >
                      {mesas.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Waiter */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Mesero Asignado</label>
                    {currentUser?.rol === 'Mesero' ? (
                      <div className="w-full px-2.5 py-1.5 bg-indigo-50 border border-indigo-150 rounded-xl text-xs font-bold text-indigo-800">
                        {currentUser.nombre} 🧑‍🍳
                      </div>
                    ) : (
                      <select
                        value={meseroId}
                        onChange={(e) => setMeseroId(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-indigo-500/20 text-xs font-semibold text-slate-700"
                      >
                        {availableMeseros.map(m => (
                          <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Asociar Cliente Registrado</label>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-indigo-500/20 text-xs font-semibold text-slate-700"
                  >
                    <option value="">-- Cliente General / Tradicional --</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} {c.frecuente ? '⭐' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Selected Checklist */}
                <div className="space-y-2 border-t border-slate-200/50 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Artículos a Comandar ({itemsList.length})</span>
                  {itemsList.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50/50 border border-dashed border-slate-205 rounded-xl text-slate-400 text-xs">
                      Selecciona alimentos o bebidas de la izquierda.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {itemsList.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between gap-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800">{item.cantidad}x {item.platilloNombre}</span>
                            <span className="font-semibold text-slate-900">${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                          </div>
                          
                          {/* Item specific comment input */}
                          <input
                            type="text"
                            placeholder="Especificación (ej. Sin ajo, término rojo, con hielo...)"
                            value={item.notas || ''}
                            onChange={(e) => handleItemNoteChange(item.platilloId, e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/25"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments box */}
                <div className="space-y-1 border-t border-slate-200/50 pt-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Instrucciones Especiales del Pedido</label>
                  <textarea
                    placeholder="Comentarios o peticiones del cliente directo para cocina o barra..."
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    rows={2}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/20 text-xs text-slate-700 resize-none"
                  />
                </div>
              </div>

              {/* Check total and submit booking */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-sm text-slate-600">Total Estimado:</span>
                  <span className="text-xl text-indigo-700">${calculateFormTotal().toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={itemsList.length === 0}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> Despachar e Imprimir Comanda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
