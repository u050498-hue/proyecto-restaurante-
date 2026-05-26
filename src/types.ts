/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Mesero' | 'Host' | 'Cajero' | 'Administrador' | 'Limpieza' | 'Repartidor' | 'Cocinero';

export interface Personal {
  id: string;
  nombre: string;
  rol: Role;
  telefono: string;
  email: string;
  fechaIngreso: string;
  salario: number;
  activo: boolean;
  turno: 'Matutino' | 'Vespertino' | 'Nocturno';
  usuario?: string;
  contrasena?: string;
}

export interface Chef {
  id: string;
  nombre: string;
  especialidad: string;
  experienciaAnios: number;
  estacion: 'Calientes' | 'Fríos' | 'Repostería' | 'Parrilla' | 'Salsas';
  activo: boolean;
  avatarUrl?: string;
  comandasAsignadas: number; // Active orders being prepared
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  frecuente: boolean;
  puntos: number;
  notas?: string;
}

export type CategoriaPlatillo = 'Entradas' | 'Platos Fuertes' | 'Postres' | 'Bebidas' | 'Especialidades';

export interface Platillo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number; // For ROI/profit margin analysis in Ventas
  categoria: CategoriaPlatillo;
  disponible: boolean;
  tiempoPreparacionMs: number; // Approximate preparation time in minutes (or simulation minutes)
  imagenUrl?: string;
}

export interface ItemComanda {
  platilloId: string;
  platilloNombre: string;
  precioUnitario: number;
  cantidad: number;
  notas?: string;
}

export type EstadoComanda = 'Pendiente' | 'En Cocina' | 'Listo' | 'Servido' | 'Cobrado' | 'Cancelado';

export interface Comanda {
  id: string;
  numeroMesa: string;
  clienteId?: string;
  clienteNombre?: string;
  items: ItemComanda[];
  chefId?: string; // Chef currently preparing it if 'En Cocina' or 'Listo'
  chefNombre?: string;
  meseroId: string; // Waiter who took the order
  meseroNombre: string;
  estado: EstadoComanda;
  total: number;
  comentarios?: string;
  fechaHora: string; // Timestamp ISO
}

export type MetodoPago = 'Efectivo' | 'Tarjeta de Crédito/Débito' | 'Transferencia' | 'Pago Digital';

export interface Cobro {
  id: string;
  comandaId: string;
  numeroMesa: string;
  clienteNombre: string;
  subtotal: number;
  descuento: number; // percentage or direct amount? percentage (0 - 100)
  total: number;
  metodoPago: MetodoPago;
  efectivoRecibido?: number;
  cambioEntregado?: number;
  fechaHora: string;
  facturado: boolean;
  rfc?: string;
}

export interface VentaRecord {
  id: string;
  comandaId: string;
  itemsCount: number;
  subtotal: number;
  descuento: number;
  total: number;
  costoTotal: number; // to calculate real profit
  ganancia: number; // total - costoTotal
  metodoPago: MetodoPago;
  fecha: string; // YYYY-MM-DD
  fechaHora: string; // Timestamp ISO
}
