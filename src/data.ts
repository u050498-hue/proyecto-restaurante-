/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Personal, Chef, Cliente, Platillo, Comanda, Cobro, VentaRecord } from './types';

export const INITIAL_PLATILLOS: Platillo[] = [
  {
    id: 'p1',
    nombre: 'Arrachera Premium (300g)',
    descripcion: 'Jugoso corte de arrachera de res servido con papas gajo, cebollitas cambray y guacamole fresco.',
    precio: 295.00,
    costo: 110.00,
    categoria: 'Platos Fuertes',
    disponible: true,
    tiempoPreparacionMs: 20
  },
  {
    id: 'p2',
    nombre: 'Fettuccine Alfredo con Pollo',
    descripcion: 'Pasta fettuccine bañada en una cremosa salsa de queso parmesano y ajo, coronada con pechuga de pollo a la parrilla.',
    precio: 185.00,
    costo: 65.00,
    categoria: 'Platos Fuertes',
    disponible: true,
    tiempoPreparacionMs: 15
  },
  {
    id: 'p3',
    nombre: 'Hamburguesa La Monumental',
    descripcion: '200g de carne angus, tocino crujiente, queso cheddar, cebolla caramelizada, lechuga y aderezo chipotle en pan artesanal de papa. Con papas fritas.',
    precio: 210.00,
    costo: 80.00,
    categoria: 'Platos Fuertes',
    disponible: true,
    tiempoPreparacionMs: 18
  },
  {
    id: 'p4',
    nombre: 'Tacos de Mariscos al Pastor (3 pzas)',
    descripcion: 'Tortillas de maíz con mezcla de camarón y pulpo al pastor, piña asada, cilantro y cebolla con salsa verde.',
    precio: 165.00,
    costo: 55.00,
    categoria: 'Especialidades',
    disponible: true,
    tiempoPreparacionMs: 12
  },
  {
    id: 'p5',
    nombre: 'Guacamole Tradicional',
    descripcion: 'Aguacate machacado con jitomate, cebolla, chile serrano y cilantro fresco. Servido con totopos crujientes hechos en casa.',
    precio: 95.00,
    costo: 30.00,
    categoria: 'Entradas',
    disponible: true,
    tiempoPreparacionMs: 8
  },
  {
    id: 'p6',
    nombre: 'Sopa Azteca (Tortilla)',
    descripcion: 'Caldo de jitomate con chile pasilla, servido con tiras de tortilla crujiente, aguacate, queso panela, crema de rancho y chicharrón.',
    precio: 110.00,
    costo: 35.00,
    categoria: 'Entradas',
    disponible: true,
    tiempoPreparacionMs: 10
  },
  {
    id: 'p7',
    nombre: 'Volcán de Chocolate',
    descripcion: 'Praliné líquido de chocolate amargo horneado, acompañado de helado artesanal de vainilla de Papantla.',
    precio: 115.00,
    costo: 40.00,
    categoria: 'Postres',
    disponible: true,
    tiempoPreparacionMs: 15
  },
  {
    id: 'p8',
    nombre: 'Cheesecake de Frutos Rojos',
    descripcion: 'Clásico pastel de queso horneado al estilo Nueva York, bañado con compota natural de frutos del bosque.',
    precio: 105.00,
    costo: 35.00,
    categoria: 'Postres',
    disponible: true,
    tiempoPreparacionMs: 5
  },
  {
    id: 'p9',
    nombre: 'Limonada de Lavanda y Menta (480ml)',
    descripcion: 'Bebida ultra-fresca con infusión de lavanda natural, hojas de menta fresca, jugo de limón recién exprimido y jarabe de agave.',
    precio: 65.00,
    costo: 18.00,
    categoria: 'Bebidas',
    disponible: true,
    tiempoPreparacionMs: 5
  },
  {
    id: 'p10',
    nombre: 'Clericot Tinto Especial',
    descripcion: 'Refrescante mezcla de vino tinto de la casa, manzana, melocotón y fresas en cubitos, con un toque de cítricos y gaseosa.',
    precio: 95.00,
    costo: 32.00,
    categoria: 'Bebidas',
    disponible: true,
    tiempoPreparacionMs: 5
  }
];

export const INITIAL_PERSONAL: Personal[] = [
  {
    id: 'pers1',
    nombre: 'Sofía Martínez',
    rol: 'Mesero',
    telefono: '554-123-4567',
    email: 'sofia.martinez@restaurante.com',
    fechaIngreso: '2025-01-10',
    salario: 8500,
    activo: true,
    turno: 'Matutino',
    usuario: 'sofia',
    contrasena: '1234'
  },
  {
    id: 'pers2',
    nombre: 'Alejandro Ruiz',
    rol: 'Mesero',
    telefono: '554-765-4321',
    email: 'alejandro.ruiz@restaurante.com',
    fechaIngreso: '2025-03-15',
    salario: 8500,
    activo: true,
    turno: 'Vespertino',
    usuario: 'alejandro',
    contrasena: '2345'
  },
  {
    id: 'pers3',
    nombre: 'Clara Domínguez',
    rol: 'Cajero',
    telefono: '553-987-6543',
    email: 'clara.dominguez@restaurante.com',
    fechaIngreso: '2024-09-01',
    salario: 10500,
    activo: true,
    turno: 'Matutino',
    usuario: 'clara',
    contrasena: '3456'
  },
  {
    id: 'pers4',
    nombre: 'Mauricio Peralta',
    rol: 'Host',
    telefono: '552-345-6789',
    email: 'mau.peralta@restaurante.com',
    fechaIngreso: '2025-02-20',
    salario: 9000,
    activo: true,
    turno: 'Vespertino',
    usuario: 'mauricio',
    contrasena: '4567'
  },
  {
    id: 'pers5',
    nombre: 'Gisela Orozco',
    rol: 'Administrador',
    telefono: '551-567-8901',
    email: 'gisela.admin@restaurante.com',
    fechaIngreso: '2023-06-12',
    salario: 19000,
    activo: true,
    turno: 'Matutino',
    usuario: 'gisela',
    contrasena: 'admin'
  },
  {
    id: 'pers6',
    nombre: 'Teresa Godoy',
    rol: 'Limpieza',
    telefono: '558-901-2345',
    email: 'teresa.g@restaurante.com',
    fechaIngreso: '2024-11-05',
    salario: 7500,
    activo: true,
    turno: 'Matutino',
    usuario: 'teresa',
    contrasena: '5678'
  },
  {
    id: 'pers7',
    nombre: 'Alberto Gómez',
    rol: 'Cocinero',
    telefono: '556-998-1122',
    email: 'alberto.gomez@restaurante.com',
    fechaIngreso: '2025-04-10',
    salario: 11000,
    activo: true,
    turno: 'Vespertino',
    usuario: 'alberto',
    contrasena: '6789'
  }
];

export const INITIAL_CHEFS: Chef[] = [
  {
    id: 'chef1',
    nombre: 'Chef Eduardo Rossi',
    especialidad: 'Comida Italiana & Salsas',
    experienciaAnios: 12,
    estacion: 'Calientes',
    activo: true,
    comandasAsignadas: 0
  },
  {
    id: 'chef2',
    nombre: 'Chef Patricia Medina',
    especialidad: 'Carnes, Parrilla & Brasa',
    experienciaAnios: 9,
    estacion: 'Parrilla',
    activo: true,
    comandasAsignadas: 0
  },
  {
    id: 'chef3',
    nombre: 'Chef Samuel Cárdenas',
    especialidad: 'Repostería Creativa & Postres',
    experienciaAnios: 6,
    estacion: 'Repostería',
    activo: true,
    comandasAsignadas: 0
  },
  {
    id: 'chef4',
    nombre: 'Chef Diana Mendoza',
    especialidad: 'Entradas, Ensaladas & Bar de Fríos',
    experienciaAnios: 5,
    estacion: 'Fríos',
    activo: true,
    comandasAsignadas: 0
  }
];

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'c1',
    nombre: 'Roberto Esquivel',
    telefono: '552-334-9988',
    email: 'roberto@gmail.com',
    frecuente: true,
    puntos: 320,
    notas: 'Prefiere mesas cerca de la ventana. Alérgico al cilantro.'
  },
  {
    id: 'c2',
    nombre: 'Mariana Silva',
    telefono: '553-445-8811',
    email: 'marianasil@outlook.com',
    frecuente: true,
    puntos: 190,
    notas: 'Cliente habitual de mañanas.'
  },
  {
    id: 'c3',
    nombre: 'Carlos Vergara',
    telefono: '554-990-1122',
    email: 'cvergara@yahoo.com',
    frecuente: false,
    puntos: 45
  },
  {
    id: 'c4',
    nombre: 'Brenda Luján',
    telefono: '551-778-4422',
    email: 'brenda.lujan@hotmail.com',
    frecuente: true,
    puntos: 540,
    notas: 'Le encanta el fettuccine alfredo y el clericot.'
  },
  {
    id: 'c5',
    nombre: 'Francisco Ortiz',
    telefono: '556-335-5599',
    email: 'fortiz@empresa.com',
    frecuente: false,
    puntos: 10
  }
];

// Active mock orders in the system
export const INITIAL_COMANDAS: Comanda[] = [
  {
    id: 'com-001',
    numeroMesa: 'Mesa 4',
    clienteId: 'c1',
    clienteNombre: 'Roberto Esquivel',
    items: [
      { platilloId: 'p1', platilloNombre: 'Arrachera Premium (300g)', precioUnitario: 295, cantidad: 1, notas: 'Sin cilantro en guacamole.' },
      { platilloId: 'p10', platilloNombre: 'Clericot Tinto Especial', precioUnitario: 95, cantidad: 1 }
    ],
    chefId: 'chef2',
    chefNombre: 'Chef Patricia Medina',
    meseroId: 'pers1',
    meseroNombre: 'Sofía Martínez',
    estado: 'En Cocina',
    total: 390.00,
    comentarios: 'Término medio de la arrachera.',
    fechaHora: '2026-05-20T17:15:00Z'
  },
  {
    id: 'com-002',
    numeroMesa: 'Mesa 12',
    clienteId: 'c4',
    clienteNombre: 'Brenda Luján',
    items: [
      { platilloId: 'p2', platilloNombre: 'Fettuccine Alfredo con Pollo', precioUnitario: 185, cantidad: 2 },
      { platilloId: 'p9', platilloNombre: 'Limonada de Lavanda y Menta (480ml)', precioUnitario: 65, cantidad: 2 },
      { platilloId: 'p7', platilloNombre: 'Volcán de Chocolate', precioUnitario: 115, cantidad: 1, notas: 'Mandar junto con las bebidas.' }
    ],
    chefId: 'chef1',
    chefNombre: 'Chef Eduardo Rossi',
    meseroId: 'pers2',
    meseroNombre: 'Alejandro Ruiz',
    estado: 'Listo',
    total: 615.00,
    fechaHora: '2026-05-20T17:30:00Z'
  },
  {
    id: 'com-003',
    numeroMesa: 'Mesa 8',
    clienteId: 'c3',
    clienteNombre: 'Carlos Vergara',
    items: [
      { platilloId: 'p3', platilloNombre: 'Hamburguesa La Monumental', precioUnitario: 210, cantidad: 1 },
      { platilloId: 'p10', platilloNombre: 'Clericot Tinto Especial', precioUnitario: 95, cantidad: 1 }
    ],
    meseroId: 'pers1',
    meseroNombre: 'Sofía Martínez',
    estado: 'Pendiente',
    total: 305.00,
    fechaHora: '2026-05-20T17:45:00Z'
  }
];

// 7 days of historical reports (Cobros & Ventas)
export const INITIAL_COBROS: Cobro[] = [
  {
    id: 'cob-101',
    comandaId: 'hist-01',
    numeroMesa: 'Mesa 2',
    clienteNombre: 'Mónica Vega',
    subtotal: 380.00,
    descuento: 10, // 10%
    total: 342.00,
    metodoPago: 'Tarjeta de Crédito/Débito',
    fechaHora: '2026-05-19T21:30:00Z',
    facturado: true,
    rfc: 'VEGM850412H98'
  },
  {
    id: 'cob-102',
    comandaId: 'hist-02',
    numeroMesa: 'Mesa 5',
    clienteNombre: 'Juan Manuel G.',
    subtotal: 540.00,
    descuento: 0,
    total: 540.00,
    metodoPago: 'Efectivo',
    efectivoRecibido: 600,
    cambioEntregado: 60,
    fechaHora: '2026-05-19T20:15:00Z',
    facturado: false
  },
  {
    id: 'cob-103',
    comandaId: 'hist-03',
    numeroMesa: 'Barra 2',
    clienteNombre: 'Cliente General',
    subtotal: 160.00,
    descuento: 0,
    total: 160.00,
    metodoPago: 'Pago Digital',
    fechaHora: '2026-05-19T18:45:00Z',
    facturado: false
  },
  {
    id: 'cob-104',
    comandaId: 'hist-04',
    numeroMesa: 'Mesa 10',
    clienteNombre: 'Mariana Silva',
    subtotal: 410.00,
    descuento: 5,
    total: 389.50,
    metodoPago: 'Tarjeta de Crédito/Débito',
    fechaHora: '2026-05-18T22:15:00Z',
    facturado: false
  },
  {
    id: 'cob-105',
    comandaId: 'hist-05',
    numeroMesa: 'Mesa 1',
    clienteNombre: 'Brenda Luján',
    subtotal: 820.00,
    descuento: 15,
    total: 697.00,
    metodoPago: 'Transferencia',
    fechaHora: '2026-05-18T15:20:00Z',
    facturado: true,
    rfc: 'LUJB910214JK3'
  },
  {
    id: 'cob-106',
    comandaId: 'hist-06',
    numeroMesa: 'Mesa 4',
    clienteNombre: 'Francisco Ortiz',
    subtotal: 305.00,
    descuento: 0,
    total: 305.00,
    metodoPago: 'Efectivo',
    efectivoRecibido: 350,
    cambioEntregado: 45,
    fechaHora: '2026-05-17T20:45:00Z',
    facturado: false
  },
  {
    id: 'cob-107',
    comandaId: 'hist-07',
    numeroMesa: 'Mesa 9',
    clienteNombre: 'Arturo Peniche',
    subtotal: 1150.00,
    descuento: 10,
    total: 1035.00,
    metodoPago: 'Tarjeta de Crédito/Débito',
    fechaHora: '2026-05-17T14:30:00Z',
    facturado: true,
    rfc: 'PENA781005TY1'
  }
];

export const INITIAL_VENTAS: VentaRecord[] = [
  {
    id: 'v-201',
    comandaId: 'hist-01',
    itemsCount: 2,
    subtotal: 380.00,
    descuento: 38.00,
    total: 342.00,
    costoTotal: 145.00,
    ganancia: 197.00,
    metodoPago: 'Tarjeta de Crédito/Débito',
    fecha: '2026-05-19',
    fechaHora: '2026-05-19T21:30:00Z'
  },
  {
    id: 'v-202',
    comandaId: 'hist-02',
    itemsCount: 3,
    subtotal: 540.00,
    descuento: 0,
    total: 540.00,
    costoTotal: 205.00,
    ganancia: 335.00,
    metodoPago: 'Efectivo',
    fecha: '2026-05-19',
    fechaHora: '2026-05-19T20:15:00Z'
  },
  {
    id: 'v-203',
    comandaId: 'hist-03',
    itemsCount: 1,
    subtotal: 160.00,
    descuento: 0,
    total: 160.00,
    costoTotal: 55.00,
    ganancia: 105.00,
    metodoPago: 'Pago Digital',
    fecha: '2026-05-19',
    fechaHora: '2026-05-19T18:45:00Z'
  },
  {
    id: 'v-204',
    comandaId: 'hist-04',
    itemsCount: 2,
    subtotal: 410.00,
    descuento: 20.50,
    total: 389.50,
    costoTotal: 160.00,
    ganancia: 229.50,
    metodoPago: 'Tarjeta de Crédito/Débito',
    fecha: '2026-05-18',
    fechaHora: '2026-05-18T22:15:00Z'
  },
  {
    id: 'v-205',
    comandaId: 'hist-05',
    itemsCount: 4,
    subtotal: 820.00,
    descuento: 123.00,
    total: 697.00,
    costoTotal: 310.00,
    ganancia: 387.00,
    metodoPago: 'Transferencia',
    fecha: '2026-05-18',
    fechaHora: '2026-05-18T15:20:00Z'
  },
  {
    id: 'v-206',
    comandaId: 'hist-06',
    itemsCount: 2,
    subtotal: 305.00,
    descuento: 0,
    total: 305.00,
    costoTotal: 115.00,
    ganancia: 190.00,
    metodoPago: 'Efectivo',
    fecha: '2026-05-17',
    fechaHora: '2026-05-17T20:45:00Z'
  },
  {
    id: 'v-207',
    comandaId: 'hist-07',
    itemsCount: 6,
    subtotal: 1150.00,
    descuento: 115.00,
    total: 1035.00,
    costoTotal: 440.00,
    ganancia: 595.00,
    metodoPago: 'Tarjeta de Crédito/Débito',
    fecha: '2026-05-17',
    fechaHora: '2026-05-17T14:30:00Z'
  }
];
