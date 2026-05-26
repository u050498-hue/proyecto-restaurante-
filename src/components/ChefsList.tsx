/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChefHat, Search, Edit2, Trash2, Award, CookingPot, Layers, Check, X, Sparkles } from 'lucide-react';
import { Chef } from '../types';

interface ChefsListProps {
  chefs: Chef[];
  onAdd: (chef: Omit<Chef, 'id'>) => void;
  onEdit: (chef: Chef) => void;
  onDelete: (id: string) => void;
}

export default function ChefsList({ chefs, onAdd, onEdit, onDelete }: ChefsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('todas');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChef, setEditingChef] = useState<Chef | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [experienciaAnios, setExperienciaAnios] = useState(5);
  const [estacion, setEstacion] = useState<'Calientes' | 'Fríos' | 'Repostería' | 'Parrilla' | 'Salsas'>('Calientes');
  const [activo, setActivo] = useState(true);

  const openAddModal = () => {
    setEditingChef(null);
    setNombre('');
    setEspecialidad('');
    setExperienciaAnios(5);
    setEstacion('Calientes');
    setActivo(true);
    setIsModalOpen(true);
  };

  const openEditModal = (chef: Chef) => {
    setEditingChef(chef);
    setNombre(chef.nombre);
    setEspecialidad(chef.especialidad);
    setExperienciaAnios(chef.experienciaAnios);
    setEstacion(chef.estacion);
    setActivo(chef.activo);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingChef) {
      onEdit({
        id: editingChef.id,
        nombre,
        especialidad,
        experienciaAnios: Number(experienciaAnios),
        estacion,
        activo,
        comandasAsignadas: editingChef.comandasAsignadas
      });
    } else {
      onAdd({
        nombre,
        especialidad,
        experienciaAnios: Number(experienciaAnios),
        estacion,
        activo,
        comandasAsignadas: 0
      });
    }
    setIsModalOpen(false);
  };

  // Filter criteria
  const filteredChefs = chefs.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStation = selectedStation === 'todas' || c.estacion === selectedStation;
    return matchesSearch && matchesStation;
  });

  const estaciones: ('Calientes' | 'Fríos' | 'Repostería' | 'Parrilla' | 'Salsas')[] = [
    'Calientes', 'Fríos', 'Repostería', 'Parrilla', 'Salsas'
  ];

  return (
    <div className="space-y-6" id="chefs-management">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-600" /> Plantilla de Chefs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Administra el talento culinario y asignación de estaciones en la cocina gourmet.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm flex items-center gap-2 self-stretch md:self-auto justify-center"
          id="add-chef-btn"
        >
          <Sparkles className="w-4 h-4" /> Registrar Chef / Maestro
        </button>
      </div>

      {/* Filters & Tools */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar chef por nombre o especialidad culinaria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition"
          />
        </div>
        
        {/* Station filter */}
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        >
          <option value="todas">Todas las Estaciones</option>
          {estaciones.map(est => (
            <option key={est} value={est}>Estación: {est}</option>
          ))}
        </select>
      </div>

      {/* Grid of Chefs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredChefs.map((chef) => (
          <div
            key={chef.id}
            className={`bg-white rounded-2xl border ${
              chef.activo ? 'border-slate-100' : 'border-slate-200 bg-slate-50/50'
            } p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md relative overflow-hidden`}
          >
            {/* Active/Estacion label */}
            <div className="absolute right-4 top-4 flex flex-col items-end gap-1">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                chef.activo 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {chef.activo ? 'De Guardia' : 'Fuera de Turno'}
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded font-bold">
                {chef.estacion}
              </span>
            </div>

            <div>
              <div className="flex flex-col items-center text-center pt-2">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 border-2 border-amber-100 mb-3 relative">
                  <ChefHat className="w-8 h-8 stroke-1.5" />
                  {chef.comandasAsignadas > 0 && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                      {chef.comandasAsignadas}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 leading-snug">{chef.nombre}</h3>
                <span className="text-xs text-slate-400 font-medium block mt-1">{chef.especialidad}</span>
              </div>

              {/* Stats */}
              <div className="mt-5 space-y-2.5 pb-4 border-b border-slate-100 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-slate-400" /> Experiencia</span>
                  <span className="font-bold text-slate-800">{chef.experienciaAnios} años</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1"><CookingPot className="w-3.5 h-3.5 text-slate-400" /> Estación asignada</span>
                  <span className="font-semibold text-amber-700">{chef.estacion}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-slate-400" /> Comandas asignadas</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${
                    chef.comandasAsignadas > 2 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {chef.comandasAsignadas} órdenes
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase">
                {chef.activo ? 'Listo para comandas' : 'Inactivo'}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(chef)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-amber-650 transition"
                  title="Editar Chef"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(chef.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition"
                  title="Eliminar del Sistema"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredChefs.length === 0 && (
          <div className="col-span-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400">
            <ChefHat className="w-12 h-12 text-slate-300 mx-auto stroke-1 mb-2" />
            <p className="text-sm">No se encontraron chefs registrados.</p>
          </div>
        )}
      </div>

      {/* Modal form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingChef ? 'Editar Perfil de Chef' : 'Registrar Nuevo Chef Artístico'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nombre Culinario</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Chef Eduardo Rossi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Especialidad Principal</label>
                  <input
                    type="text"
                    required
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    placeholder="Ej. Salsas, Repostería, Cocina de Autor"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Estación de Cocina</label>
                    <select
                      value={estacion}
                      onChange={(e) => setEstacion(e.target.value as 'Calientes' | 'Fríos' | 'Repostería' | 'Parrilla' | 'Salsas')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                    >
                      {estaciones.map(est => (
                        <option key={est} value={est}>{est}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Años de Trayectoria</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="50"
                      value={experienciaAnios}
                      onChange={(e) => setExperienciaAnios(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div className="py-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="chef-active-chk"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="chef-active-chk" className="text-sm font-semibold text-slate-700 select-none">
                    Chef de guardia activo (elegible para comandas)
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
                >
                  {editingChef ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
