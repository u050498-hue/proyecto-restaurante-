/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Tag, Percent, Clock, AlertCircle, X } from 'lucide-react';
import { Platillo, CategoriaPlatillo } from '../types';

interface PlatillosListProps {
  platillos: Platillo[];
  onAdd: (plate: Omit<Platillo, 'id'>) => void;
  onEdit: (plate: Platillo) => void;
  onDelete: (id: string) => void;
}

export default function PlatillosList({ platillos, onAdd, onEdit, onDelete }: PlatillosListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlate, setEditingPlate] = useState<Platillo | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(120);
  const [costo, setCosto] = useState(40);
  const [categoria, setCategoria] = useState<CategoriaPlatillo>('Platos Fuertes');
  const [disponible, setDisponible] = useState(true);
  const [tiempoPreparacionMs, setTiempoPreparacionMs] = useState(15);

  const openAddModal = () => {
    setEditingPlate(null);
    setNombre('');
    setDescripcion('');
    setPrecio(120);
    setCosto(40);
    setCategoria('Platos Fuertes');
    setDisponible(true);
    setTiempoPreparacionMs(15);
    setIsModalOpen(true);
  };

  const openEditModal = (plate: Platillo) => {
    setEditingPlate(plate);
    setNombre(plate.nombre);
    setDescripcion(plate.descripcion);
    setPrecio(plate.precio);
    setCosto(plate.costo);
    setCategoria(plate.categoria);
    setDisponible(plate.disponible);
    setTiempoPreparacionMs(plate.tiempoPreparacionMs);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim()) return;

    if (editingPlate) {
      onEdit({
        id: editingPlate.id,
        nombre,
        descripcion,
        precio: Number(precio),
        costo: Number(costo),
        categoria,
        disponible,
        tiempoPreparacionMs: Number(tiempoPreparacionMs)
      });
    } else {
      onAdd({
        nombre,
        descripcion,
        precio: Number(precio),
        costo: Number(costo),
        categoria,
        disponible,
        tiempoPreparacionMs: Number(tiempoPreparacionMs)
      });
    }
    setIsModalOpen(false);
  };

  // Categories list helper
  const categorias: CategoriaPlatillo[] = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas', 'Especialidades'];

  const filteredPlatillos = platillos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || p.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="menu-platillos-management">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-indigo-600" /> Catálogo de Platillos y Bebidas
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sube, edita y gestiona la disponibilidad del menú, el tiempo de preparación y los índices de margen de ganancia.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm flex items-center gap-2 self-stretch md:self-auto justify-center"
          id="add-platillo-btn"
        >
          <Plus className="w-4 h-4" /> Agregar Platillo / Bebida
        </button>
      </div>

      {/* Tools & filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre del platillo o ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"
          />
        </div>
        
        {/* Category select */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        >
          <option value="todos">Todas las Categorías</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlatillos.map((plate) => {
          // Calculate utility percentage
          const unitProfit = plate.precio - plate.costo;
          const profitMargin = ((unitProfit / plate.precio) * 100).toFixed(0);

          return (
            <div
              key={plate.id}
              className={`bg-white rounded-2xl border ${
                plate.disponible ? 'border-slate-100' : 'border-slate-200 bg-slate-50/75'
              } shadow-xs overflow-hidden hover:shadow-md transition duration-200 flex flex-col h-full`}
            >
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                      {plate.categoria}
                    </span>
                    
                    {!plate.disponible && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                        Agotado
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{plate.nombre}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed min-h-[50px]">{plate.descripcion}</p>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Prep: <strong>{plate.tiempoPreparacionMs} min</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-slate-400" />
                    <span>Margen: <strong className="text-emerald-600">{profitMargin}%</strong></span>
                  </div>
                </div>

                {/* Price tags */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Precio de Carta</span>
                    <span className="text-lg font-bold text-slate-900">${plate.precio.toFixed(2)}</span>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Costo Materia</span>
                    <span className="text-xs font-semibold text-slate-600">${plate.costo.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action feet */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">ID: {plate.id}</span>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(plate)}
                    className="p-1 px-2 hover:bg-white border hover:border-indigo-250 border-transparent rounded-lg text-slate-500 hover:text-indigo-600 transition flex items-center gap-1 text-xs font-semibold"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => onDelete(plate.id)}
                    className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition"
                    title="Eliminar de Carta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPlatillos.length === 0 && (
          <div className="col-span-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto stroke-1 mb-2" />
            <p className="text-sm">No se encontraron productos en el menú.</p>
          </div>
        )}
      </div>

      {/* Modern Modal Dial */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingPlate ? 'Editar Platillo / Bebida en Carta' : 'Crear Nueva Oferta Gastronómica'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nombre del Platillo / Bebida</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Tacos de Mariscos al Pastor"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Descripción de Ingredientes / Maridaje</label>
                  <textarea
                    required
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe el corte, cocción, guarniciones y si posee alérgenos habituales con un lenguaje provocativo para el cliente..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Categoría del Menú</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaPlatillo)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Minutos Preparación (Promedio)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={tiempoPreparacionMs}
                    onChange={(e) => setTiempoPreparacionMs(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Precio de Canje / Venta ($)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Costo de Producción / Insumos ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={costo}
                    onChange={(e) => setCosto(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="col-span-2 py-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="plate-dispo-chk"
                    checked={disponible}
                    onChange={(e) => setDisponible(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="plate-dispo-chk" className="text-sm font-semibold text-slate-700 select-none">
                    Disponible inmediatamente en punto de venta
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl bg-white hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
                >
                  {editingPlate ? 'Guardar Cambios' : 'Anexar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
