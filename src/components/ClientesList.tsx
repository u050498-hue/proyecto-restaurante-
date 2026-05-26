/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Search, UserPlus, Phone, Mail, Award, Edit2, Trash2, Heart, Shield, Plus, Minus, X } from 'lucide-react';
import { Cliente } from '../types';

interface ClientesListProps {
  clientes: Cliente[];
  onAdd: (client: Omit<Cliente, 'id'>) => void;
  onEdit: (client: Cliente) => void;
  onDelete: (id: string) => void;
}

export default function ClientesList({ clientes, onAdd, onEdit, onDelete }: ClientesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrecuente, setFilterFrecuente] = useState<'todos' | 'frecuentes' | 'regulares'>('todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [frecuente, setFrecuente] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [notas, setNotas] = useState('');

  const openAddModal = () => {
    setEditingClient(null);
    setNombre('');
    setTelefono('');
    setEmail('');
    setFrecuente(false);
    setPuntos(0);
    setNotas('');
    setIsModalOpen(true);
  };

  const openEditModal = (client: Cliente) => {
    setEditingClient(client);
    setNombre(client.nombre);
    setTelefono(client.telefono);
    setEmail(client.email);
    setFrecuente(client.frecuente);
    setPuntos(client.puntos);
    setNotas(client.notas || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingClient) {
      onEdit({
        id: editingClient.id,
        nombre,
        telefono,
        email,
        frecuente,
        puntos: Number(puntos),
        notas: notas.trim() || undefined
      });
    } else {
      onAdd({
        nombre,
        telefono,
        email,
        frecuente,
        puntos: Number(puntos),
        notas: notas.trim() || undefined
      });
    }
    setIsModalOpen(false);
  };

  // Filters
  const filteredClientes = clientes.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.telefono.includes(searchTerm);
    if (filterFrecuente === 'frecuentes') return matchesSearch && c.frecuente;
    if (filterFrecuente === 'regulares') return matchesSearch && !c.frecuente;
    return matchesSearch;
  });

  return (
    <div className="space-y-6" id="clientes-management">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" /> Directorio de Clientes
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-normal">Monitorea y premia la lealtad de tus comensales recurrentes e ingresa sus notas personales/alergias.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm flex items-center gap-2 self-stretch md:self-auto justify-center"
          id="add-client-btn"
        >
          <UserPlus className="w-4 h-4" /> Registrar Cliente
        </button>
      </div>

      {/* Tools & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre, teléfono o correo digital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-550/20 focus:border-emerald-500 text-sm transition"
          />
        </div>
        
        {/* Frequency filter */}
        <select
          value={filterFrecuente}
          onChange={(e) => setFilterFrecuente(e.target.value as any)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-550/20 focus:border-emerald-500 transition"
        >
          <option value="todos">Todos los Clientes</option>
          <option value="frecuentes">Frecuentes (Club Lealtad)</option>
          <option value="regulares">Clientes Regulares</option>
        </select>
      </div>

      {/* Grid of clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClientes.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200 relative overflow-hidden"
          >
            {/* Loyalty star badge */}
            {client.frecuente && (
              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full shadow-2xs">
                  <Award className="w-3.5 h-3.5 fill-amber-400 stroke-amber-700" /> Club VIP
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-base border border-emerald-100">
                  {client.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug">{client.nombre}</h3>
                  <span className="text-xs text-slate-400 block mt-0.5">{client.id}</span>
                </div>
              </div>

              {/* Data elements */}
              <div className="mt-5 space-y-2 pb-4 border-b border-slate-100 text-slate-600 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{client.telefono}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex justify-between items-center text-indigo-600 bg-indigo-50/50 p-2 rounded-lg mt-3">
                  <span className="font-semibold block">Puntos Acumulados:</span>
                  <span className="font-bold text-sm block">{client.puntos} pts</span>
                </div>

                {/* Patient / Preference notes */}
                {client.notas ? (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-550 text-[11px] leading-relaxed mt-2 italic">
                    <strong>Preferencia/Alergias:</strong> {client.notas}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic mt-2">
                    Sin especificaciones/alergias anotadas.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-2">
              <span className="text-[10px] text-slate-400">
                Puntos canjeables por postres o % dto.
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(client)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition"
                  title="Editar Cliente"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition"
                  title="Eliminar del Directorio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredClientes.length === 0 && (
          <div className="col-span-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400">
            <Users className="w-12 h-12 text-slate-300 mx-auto stroke-1 mb-2" />
            <p className="text-sm">No se encontraron clientes registrados con ese criterio.</p>
          </div>
        )}
      </div>

      {/* Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingClient ? 'Modificar Registro de Cliente' : 'Inscribir Nuevo Cliente'}
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Roberto Esquivel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Teléfono</label>
                    <input
                      type="text"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. 552-334-9988"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Puntos Acumulados</label>
                    <input
                      type="number"
                      min="0"
                      value={puntos}
                      onChange={(e) => setPuntos(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. roberto@gmail.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Notas del Cliente / Alergias</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej. Alérgico a nueces, prefiere mesas con buena iluminación o aire acondicionado..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm resize-none"
                  />
                </div>

                <div className="py-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="client-frecuente-chk"
                    checked={frecuente}
                    onChange={(e) => setFrecuente(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="client-frecuente-chk" className="text-sm font-semibold text-slate-700 select-none flex items-center gap-1.5">
                    Socio Club de Lealtad (Frecuente)
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
                >
                  {editingClient ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
