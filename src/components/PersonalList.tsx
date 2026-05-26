/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, Search, Edit2, Trash2, Shield, Calendar, Phone, Mail, DollarSign, Clock, Check, X, UserCheck } from 'lucide-react';
import { Personal, Role } from '../types';

interface PersonalListProps {
  personal: Personal[];
  onAdd: (person: Omit<Personal, 'id'>) => void;
  onEdit: (person: Personal) => void;
  onDelete: (id: string) => void;
}

export default function PersonalList({ personal, onAdd, onEdit, onDelete }: PersonalListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('todos');
  const [selectedShift, setSelectedShift] = useState<string>('todos');
  
  // State for adding or editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Personal | null>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<Role>('Mesero');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0]);
  const [salario, setSalario] = useState(8500);
  const [activo, setActivo] = useState(true);
  const [turno, setTurno] = useState<'Matutino' | 'Vespertino' | 'Nocturno'>('Matutino');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const openAddModal = () => {
    setEditingPerson(null);
    setNombre('');
    setRol('Mesero');
    setTelefono('');
    setEmail('');
    setFechaIngreso(new Date().toISOString().split('T')[0]);
    setSalario(8500);
    setActivo(true);
    setTurno('Matutino');
    setUsuario('');
    setContrasena('');
    setIsModalOpen(true);
  };

  const openEditModal = (person: Personal) => {
    setEditingPerson(person);
    setNombre(person.nombre);
    setRol(person.rol);
    setTelefono(person.telefono);
    setEmail(person.email);
    setFechaIngreso(person.fechaIngreso);
    setSalario(person.salario);
    setActivo(person.activo);
    setTurno(person.turno);
    setUsuario(person.usuario || '');
    setContrasena(person.contrasena || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingPerson) {
      onEdit({
        id: editingPerson.id,
        nombre,
        rol,
        telefono,
        email,
        fechaIngreso,
        salario: Number(salario),
        activo,
        turno,
        usuario: usuario.trim() || undefined,
        contrasena: contrasena.trim() || undefined
      });
    } else {
      onAdd({
        nombre,
        rol,
        telefono,
        email,
        fechaIngreso,
        salario: Number(salario),
        activo,
        turno,
        usuario: usuario.trim() || undefined,
        contrasena: contrasena.trim() || undefined
      });
    }
    setIsModalOpen(false);
  };

  // Filter staff criteria
  const filteredPersonal = personal.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.telefono.includes(searchTerm);
    const matchesRole = selectedRole === 'todos' || p.rol === selectedRole;
    const matchesShift = selectedShift === 'todos' || p.turno === selectedShift;
    return matchesSearch && matchesRole && matchesShift;
  });

  const roles: Role[] = ['Mesero', 'Host', 'Cajero', 'Administrador', 'Limpieza', 'Repartidor', 'Cocinero'];

  return (
    <div className="space-y-6" id="personal-management">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" /> Registro de Personal
          </h1>
          <p className="text-slate-500 text-sm mt-1">Supervisa roles, datos de contacto, salarios y turnos de tus colaboradores.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm flex items-center gap-2 self-stretch md:self-auto justify-center"
          id="add-personal-btn"
        >
          <UserPlus className="w-4 h-4" /> Registrar Colaborador
        </button>
      </div>

      {/* Filters & Tools */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"
          />
        </div>
        
        {/* Role filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        >
          <option value="todos">Todos los Roles</option>
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Shift filter */}
        <select
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        >
          <option value="todos">Todos los Turnos</option>
          <option value="Matutino">Turno Matutino</option>
          <option value="Vespertino">Turno Vespertino</option>
          <option value="Nocturno">Turno Nocturno</option>
        </select>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonal.map((person) => (
          <div
            key={person.id}
            className={`bg-white rounded-2xl border ${
              person.activo ? 'border-slate-100' : 'border-slate-200 bg-slate-50/50'
            } p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md relative overflow-hidden`}
          >
            {/* Active badge */}
            <div className="absolute right-4 top-4">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                person.activo 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {person.activo ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activo
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Inactivo
                  </>
                )}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {person.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-snug">{person.nombre}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {person.rol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information body */}
              <div className="mt-5 space-y-2.5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{person.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs truncate">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{person.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Turno: <strong className="text-slate-700">{person.turno}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs text-indigo-600 font-medium">
                  <DollarSign className="w-4 h-4 text-indigo-500" />
                  <span>Salario Mensual: <strong>${person.salario.toLocaleString('es-MX')} MXN</strong></span>
                </div>
                <div className="pt-2.5 border-t border-dashed border-slate-100 mt-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Acceso Sistema:</span>
                  {person.usuario ? (
                    <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-indigo-50/60 border border-slate-150 px-2 py-0.5 rounded-lg flex items-center gap-1.5">
                      <span className="text-indigo-600">@{person.usuario}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500 select-all font-sans px-1 bg-white border border-slate-100 rounded text-[10px] font-semibold" title="Clave de acceso">{person.contrasena}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic bg-slate-50 border border-slate-100 px-2   py-0.5 rounded">
                      Sin cuenta activa
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Ingreso: {person.fechaIngreso}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(person)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition"
                  title="Editar Colaborador"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(person.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition"
                  title="Dar de Baja"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPersonal.length === 0 && (
          <div className="col-span-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-400">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto stroke-1 mb-2" />
            <p className="text-sm">No se encontraron colaboradores con los filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modern Dialog Modal (Add/Edit Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-0 border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingPerson ? 'Editar Datos del Colaborador' : 'Nuevo Registro de Colaborador'}
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Sofía Martínez Ruiz"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Rol / Puesto</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as Role)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Turno</label>
                  <select
                    value={turno}
                    onChange={(e) => setTurno(e.target.value as 'Matutino' | 'Vespertino' | 'Nocturno')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Nocturno">Nocturno</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Teléfono</label>
                  <input
                    type="text"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. 554-123-4567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. sofia@restaurante.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Salario Mensual (MXN)</label>
                  <input
                    type="number"
                    required
                    min="5000"
                    value={salario}
                    onChange={(e) => setSalario(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Fecha de Contratación</label>
                  <input
                    type="date"
                    required
                    value={fechaIngreso}
                    onChange={(e) => setFechaIngreso(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                  <span className="text-xs font-bold text-indigo-600 block uppercase tracking-wider mb-2">Credenciales de Acceso al Sistema</span>
                  <p className="text-[11px] text-slate-500 mb-2.5">Si este colaborador requiere ingresar al sistema, defina un usuario y una clave de acceso aquí. Sus permisos serán controlados por su rol seleccionado arriba ({rol}).</p>
                  
                  <div className="grid grid-cols-2 gap-3 bg-slate-50/75 p-3.5 rounded-xl border border-slate-200">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block">Usuario de Acceso</label>
                      <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        placeholder="Ej. sofia"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block">Contraseña / Clave PIN</label>
                      <input
                        type="text"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        placeholder="Ej. 1234"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {editingPerson && (
                  <div className="col-span-2 py-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="status-checkbox"
                      checked={activo}
                      onChange={(e) => setActivo(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="status-checkbox" className="text-sm font-semibold text-slate-700 select-none">
                      Colaborador activo actualmente
                    </label>
                  </div>
                )}
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
                  {editingPerson ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
