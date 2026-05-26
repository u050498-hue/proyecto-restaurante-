/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Utensils, ClipboardList, CreditCard, Users, 
  ChefHat, TrendingUp, Sparkles, LogOut, Menu, X, ShieldAlert,
  Lock, Key
} from 'lucide-react';

// Types
import { Personal, Chef, Cliente, Platillo, Comanda, Cobro, VentaRecord, EstadoComanda } from './types';

// Default initial data
import { 
  INITIAL_PERSONAL, INITIAL_CHEFS, INITIAL_CLIENTES, 
  INITIAL_PLATILLOS, INITIAL_COMANDAS, INITIAL_COBROS, INITIAL_VENTAS 
} from './data';

// Component modules
import DashboardOverview from './components/DashboardOverview';
import PersonalList from './components/PersonalList';
import ChefsList from './components/ChefsList';
import ClientesList from './components/ClientesList';
import PlatillosList from './components/PlatillosList';
import ComandasManager from './components/ComandasManager';
import CobrosManager from './components/CobrosManager';
import VentasAnalytics from './components/VentasAnalytics';

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // States with localStorage persistence hydration
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [cobros, setCobros] = useState<Cobro[]>([]);
  const [ventas, setVentas] = useState<VentaRecord[]>([]);

  // Selection bridge between components (e.g., clicking checkout from Comandas goes straight to Billing)
  const [selectedComandaForBilling, setSelectedComandaForBilling] = useState<Comanda | null>(null);

  // Role session management
  const [sessionUser, setSessionUser] = useState<Personal | null>(() => {
    try {
      const saved = localStorage.getItem('rest_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginUsuario, setLoginUsuario] = useState('');
  const [loginContrasena, setLoginContrasena] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sync sessionUser state
  useEffect(() => {
    if (sessionUser) {
      localStorage.setItem('rest_session_user', JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem('rest_session_user');
    }
  }, [sessionUser]);

  // Lock waiter & cocinero page limits
  useEffect(() => {
    if (sessionUser && sessionUser.rol === 'Mesero') {
      if (activeTab !== 'comandas' && activeTab !== 'cobros') {
        setActiveTab('comandas');
      }
    } else if (sessionUser && sessionUser.rol === 'Cocinero') {
      if (activeTab !== 'comandas') {
        setActiveTab('comandas');
      }
    }
  }, [sessionUser, activeTab]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsuario.trim() || !loginContrasena.trim()) {
      setLoginError('Favor de ingresar usuario y clave.');
      return;
    }

    const matched = personal.find(
      p => p.usuario?.toLowerCase() === loginUsuario.trim().toLowerCase() && 
           p.contrasena === loginContrasena.trim() && 
           p.activo
    );

    if (matched) {
      setSessionUser(matched);
      if (matched.rol === 'Mesero' || matched.rol === 'Cocinero') {
        setActiveTab('comandas');
      } else {
        setActiveTab('resumen');
      }
      setLoginUsuario('');
      setLoginContrasena('');
    } else {
      setLoginError('Usuario o contraseña incorrectos, o la cuenta está desactivada.');
    }
  };

  const handleQuickLogin = (uname: string, pwd: string) => {
    setLoginError('');
    const matched = personal.find(
      p => p.usuario?.toLowerCase() === uname.toLowerCase() && 
           p.contrasena === pwd && 
           p.activo
    );
    if (matched) {
      setSessionUser(matched);
      if (matched.rol === 'Mesero' || matched.rol === 'Cocinero') {
        setActiveTab('comandas');
      } else {
        setActiveTab('resumen');
      }
    }
  };

  // Load from localStorage on boot
  useEffect(() => {
    try {
      const storedPersonal = localStorage.getItem('rest_personal');
      const storedChefs = localStorage.getItem('rest_chefs');
      const storedClientes = localStorage.getItem('rest_clientes');
      const storedPlatillos = localStorage.getItem('rest_platillos');
      const storedComandas = localStorage.getItem('rest_comandas');
      const storedCobros = localStorage.getItem('rest_cobros');
      const storedVentas = localStorage.getItem('rest_ventas');

      // Hydrate profiles with robust credential patching for older local cache compatibility
      let parsedPersonal = storedPersonal ? JSON.parse(storedPersonal) : INITIAL_PERSONAL;
      parsedPersonal = parsedPersonal.map((p: Personal) => {
        const initMatch = INITIAL_PERSONAL.find(ip => ip.id === p.id);
        if (initMatch && !p.usuario) {
          return { ...p, usuario: initMatch.usuario, contrasena: initMatch.contrasena };
        }
        return p;
      });

      setPersonal(parsedPersonal);
      setChefs(storedChefs ? JSON.parse(storedChefs) : INITIAL_CHEFS);
      setClientes(storedClientes ? JSON.parse(storedClientes) : INITIAL_CLIENTES);
      setPlatillos(storedPlatillos ? JSON.parse(storedPlatillos) : INITIAL_PLATILLOS);
      setComandas(storedComandas ? JSON.parse(storedComandas) : INITIAL_COMANDAS);
      setCobros(storedCobros ? JSON.parse(storedCobros) : INITIAL_COBROS);
      setVentas(storedVentas ? JSON.parse(storedVentas) : INITIAL_VENTAS);
    } catch (err) {
      console.error('Error hydrating state from localStorage', err);
      // Fallback
      setPersonal(INITIAL_PERSONAL);
      setChefs(INITIAL_CHEFS);
      setClientes(INITIAL_CLIENTES);
      setPlatillos(INITIAL_PLATILLOS);
      setComandas(INITIAL_COMANDAS);
      setCobros(INITIAL_COBROS);
      setVentas(INITIAL_VENTAS);
    }
  }, []);

  // Sync to localStorage on state edits
  useEffect(() => {
    if (personal.length > 0) localStorage.setItem('rest_personal', JSON.stringify(personal));
  }, [personal]);

  useEffect(() => {
    if (chefs.length > 0) localStorage.setItem('rest_chefs', JSON.stringify(chefs));
  }, [chefs]);

  useEffect(() => {
    if (clientes.length > 0) localStorage.setItem('rest_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    if (platillos.length > 0) localStorage.setItem('rest_platillos', JSON.stringify(platillos));
  }, [platillos]);

  useEffect(() => {
    if (comandas.length > 0) localStorage.setItem('rest_comandas', JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    if (cobros.length > 0) localStorage.setItem('rest_cobros', JSON.stringify(cobros));
  }, [cobros]);

  useEffect(() => {
    if (ventas.length > 0) localStorage.setItem('rest_ventas', JSON.stringify(ventas));
  }, [ventas]);

  // Handle resets for troubleshooting
  const handleReloadDefaults = () => {
    if (window.confirm('¿Está seguro de querer restaurar todos los datos por defecto? Esto borrará tus comandas y cobros registrados y cerrará la sesión.')) {
      localStorage.clear();
      setPersonal(INITIAL_PERSONAL);
      setChefs(INITIAL_CHEFS);
      setClientes(INITIAL_CLIENTES);
      setPlatillos(INITIAL_PLATILLOS);
      setComandas(INITIAL_COMANDAS);
      setCobros(INITIAL_COBROS);
      setVentas(INITIAL_VENTAS);
      setSessionUser(null);
      setActiveTab('resumen');
    }
  };

  // 1. PERSONAL CRUDS
  const handleAddPersonal = (newPerson: Omit<Personal, 'id'>) => {
    const id = `pers-${Math.floor(100 + Math.random() * 900)}`;
    setPersonal([...personal, { id, ...newPerson }]);
  };

  const handleEditPersonal = (edited: Personal) => {
    setPersonal(personal.map(p => p.id === edited.id ? edited : p));
  };

  const handleDeletePersonal = (id: string) => {
    if (window.confirm('¿Desea dar de baja a este colaborador?')) {
      setPersonal(personal.filter(p => p.id !== id));
    }
  };

  // 2. CHEFS CRUDS
  const handleAddChef = (newChef: Omit<Chef, 'id'>) => {
    const id = `chef-${Math.floor(100 + Math.random() * 900)}`;
    setChefs([...chefs, { id, ...newChef }]);
  };

  const handleEditChef = (edited: Chef) => {
    setChefs(chefs.map(c => c.id === edited.id ? edited : c));
  };

  const handleDeleteChef = (id: string) => {
    if (window.confirm('¿Desea remover a este chef del sistema?')) {
      setChefs(chefs.filter(c => c.id !== id));
    }
  };

  // 3. CLIENTES CRUDS
  const handleAddCliente = (newClient: Omit<Cliente, 'id'>) => {
    const id = `c-${Math.floor(100 + Math.random() * 900)}`;
    setClientes([...clientes, { id, ...newClient }]);
  };

  const handleEditCliente = (edited: Cliente) => {
    setClientes(clientes.map(c => c.id === edited.id ? edited : c));
  };

  const handleDeleteCliente = (id: string) => {
    if (window.confirm('¿Desea borrar este registro de cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  // 4. PLATILLOS CRUDS
  const handleAddPlatillo = (newPlate: Omit<Platillo, 'id'>) => {
    const id = `p-${Math.floor(100 + Math.random() * 900)}`;
    setPlatillos([...platillos, { id, ...newPlate }]);
  };

  const handleEditPlatillo = (edited: Platillo) => {
    setPlatillos(platillos.map(p => p.id === edited.id ? edited : p));
  };

  const handleDeletePlatillo = (id: string) => {
    if (window.confirm('¿Desea eliminar este platillo o bebida del menú?')) {
      setPlatillos(platillos.filter(p => p.id !== id));
    }
  };

  // 5. COMANDAS CRUDS
  const handleAddComanda = (newComanda: Omit<Comanda, 'id'>) => {
    const id = `com-${Math.floor(100 + Math.random() * 900)}`;
    setComandas([{ id, ...newComanda }, ...comandas]);
  };

  const handleUpdateComandaEstado = (id: string, nuevoEstado: EstadoComanda, chefId?: string) => {
    setComandas(prevComandas => {
      return prevComandas.map(com => {
        if (com.id !== id) return com;

        let chefName = com.chefNombre;
        let cId = com.chefId;

        // If user assigned a chef to start cooking
        if (nuevoEstado === 'En Cocina' && chefId) {
          const matched = chefs.find(ch => ch.id === chefId);
          chefName = matched?.nombre;
          cId = chefId;

          // Increment that chef's busy counter
          setChefs(prevChefs => prevChefs.map(ch => 
            ch.id === chefId ? { ...ch, comandasAsignadas: ch.comandasAsignadas + 1 } : ch
          ));
        }

        // If food finished cooking, release the chef
        if (nuevoEstado === 'Listo' && com.chefId) {
          // Decrement busy count
          const busyChefId = com.chefId;
          setChefs(prevChefs => prevChefs.map(ch => 
            ch.id === busyChefId ? { ...ch, comandasAsignadas: Math.max(0, ch.comandasAsignadas - 1) } : ch
          ));
        }

        return {
          ...com,
          estado: nuevoEstado,
          chefId: cId,
          chefNombre: chefName
        };
      });
    });
  };

  const handleDeleteComanda = (id: string) => {
    if (window.confirm('¿Está seguro de querer CANCELAR esta comanda? Esta operación removerá el pedido.')) {
      setComandas(comandas.filter(c => c.id !== id));
    }
  };

  // 6. COBROS & VENTAS DISPATCHER
  const handleAddCobro = (newCobro: Omit<Cobro, 'id'>, puntosAGanar: number, clientMatchedId?: string) => {
    const paymentId = `cob-${Math.floor(100 + Math.random() * 900)}`;
    const freshCobro = { id: paymentId, ...newCobro };

    // 1. Save cobro statement
    setCobros([freshCobro, ...cobros]);

    // 2. Mark comanda as paid (Cobrado)
    setComandas(prevComandas => prevComandas.map(com => {
      if (com.id === newCobro.comandaId) {
        return { ...com, estado: 'Cobrado' as EstadoComanda };
      }
      return com;
    }));

    // 3. Award loyalty points to client if registered
    if (clientMatchedId) {
      setClientes(prevClients => prevClients.map(cli => {
        if (cli.id === clientMatchedId) {
          return { 
            ...cli, 
            puntos: cli.puntos + puntosAGanar,
            frecuente: (cli.puntos + puntosAGanar) > 100 ? true : cli.frecuente
          };
        }
        return cli;
      }));
    }

    // 4. Register ROI / Sales record
    // Calculate total actual supply cost of dishes to measure proper gain margins
    let totalSupplyCost = 0;
    const targetComanda = comandas.find(c => c.id === newCobro.comandaId);
    if (targetComanda) {
      targetComanda.items.forEach(itm => {
        const plt = platillos.find(p => p.id === itm.platilloId);
        if (plt) {
          totalSupplyCost += (plt.costo * itm.cantidad);
        } else {
          // fallback default cost (30% of selling price)
          totalSupplyCost += (itm.precioUnitario * 0.3 * itm.cantidad);
        }
      });
    } else {
      totalSupplyCost = newCobro.total * 0.35; // default estimation
    }

    const saleRecord: VentaRecord = {
      id: `v-${Math.floor(100 + Math.random() * 900)}`,
      comandaId: newCobro.comandaId,
      itemsCount: targetComanda?.items.reduce((a, b) => a + b.cantidad, 0) || 1,
      subtotal: newCobro.subtotal,
      descuento: newCobro.subtotal * (newCobro.descuento / 100),
      total: newCobro.total,
      costoTotal: totalSupplyCost,
      ganancia: newCobro.total - totalSupplyCost,
      metodoPago: newCobro.metodoPago,
      fecha: new Date().toISOString().split('T')[0],
      fechaHora: new Date().toISOString()
    };

    setVentas([saleRecord, ...ventas]);
    
    // Switch to resumo dashboard or sales trends
    alert('¡Excelente! El cobro se registró correctamente. Se ha impreso el boleto fiscal de caja.');
    if (sessionUser?.rol === 'Mesero') {
      setActiveTab('comandas');
    } else {
      setActiveTab('ventas');
    }
  };

  // Nav helper bridge
  const handleSelectComandaForBilling = (comanda: Comanda) => {
    setSelectedComandaForBilling(comanda);
    setActiveTab('cobros');
  };

  // Tab configurations
  const menuConfig = [
    { key: 'resumen', label: 'Inicio / Control', icon: <Building2 className="w-4 h-4" /> },
    { key: 'comandas', label: 'Monitor Comandas', icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'cobros', label: 'Caja y Cobros', icon: <CreditCard className="w-4 h-4" /> },
    { key: 'platillos', label: 'Menú / Platillos', icon: <Utensils className="w-4 h-4" /> },
    { key: 'personal', label: 'Colaboradores', icon: <Users className="w-4 h-4" /> },
    { key: 'chefs', label: 'Maestros Chefs', icon: <ChefHat className="w-4 h-4" /> },
    { key: 'clientes', label: 'Directorio VIP', icon: <Users className="w-4 h-4" /> },
    { key: 'ventas', label: 'Auditoría / Ventas', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // Allowed tabs routing based on active role
  const allowedTabs = sessionUser 
    ? (sessionUser.rol === 'Mesero' 
        ? menuConfig.filter(item => item.key === 'comandas' || item.key === 'cobros')
        : sessionUser.rol === 'Cocinero'
        ? menuConfig.filter(item => item.key === 'comandas')
        : menuConfig)
    : [];

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans select-none" id="login-layout">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Brand header */}
          <div className="bg-slate-900 text-white px-6 py-8 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wider">EL MOLINO GOURMET</h1>
              <p className="text-xs text-indigo-300 font-semibold uppercase tracking-widest mt-0.5">Gestor de Operaciones</p>
            </div>
          </div>

          {/* Form and Quick accounts */}
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">Acceso al Sistema</h2>
              <p className="text-xs text-slate-400 mt-0.5">La cuenta de acceso debe ser creada por el Administrador.</p>
            </div>

            {loginError && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <p>{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Usuario de Acceso</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 flex items-center justify-center font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={loginUsuario}
                    onChange={(e) => setLoginUsuario(e.target.value)}
                    placeholder="Ej. sofia o gisela"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Contraseña / Código PIN</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 flex items-center justify-center font-bold font-mono">***</span>
                  <input
                    type="password"
                    required
                    value={loginContrasena}
                    onChange={(e) => setLoginContrasena(e.target.value)}
                    placeholder="Ej. 1234 o admin"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Ingresar al Módulo
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block mb-2 text-center select-none">
                Cuentas de demostración rápida creadas
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('gisela', 'admin')}
                  className="w-full flex items-center justify-between p-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl text-left transition text-xs font-bold"
                >
                  <div className="flex items-center gap-1.5 text-indigo-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span>Gisela O. (Administrador)</span>
                  </div>
                  <span className="font-mono text-[9px] text-indigo-650 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                    gisela / admin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('sofia', '1234')}
                  className="w-full flex items-center justify-between p-2.5 bg-amber-50/50 hover:bg-amber-50 border border-amber-150 rounded-xl text-left transition text-xs font-bold"
                >
                  <div className="flex items-center gap-1.5 text-amber-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Sofía M. (Mesero)</span>
                  </div>
                  <span className="font-mono text-[9px] text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded">
                    sofia / 1234
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('alberto', '6789')}
                  className="w-full flex items-center justify-between p-2.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-150 rounded-xl text-left transition text-xs font-bold"
                >
                  <div className="flex items-center gap-1.5 text-emerald-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Alberto G. (Cocinero)</span>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                    alberto / 6789
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('alejandro', '2345')}
                  className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition text-xs font-medium"
                >
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Alejandro R. (Mesero)</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded">
                    alejandro / 2345
                  </span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={handleReloadDefaults} 
                className="text-[10px] text-slate-400 hover:text-red-500 font-semibold underline"
              >
                Restaurar Base de Datos por Defecto
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans text-slate-900" id="application-layout">
      {/* Top Banner Branding Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md border-b border-slate-950 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm md:text-base tracking-tight block">EL MOLINO GOURMET</span>
            <span className="text-[10px] text-indigo-300 font-semibold tracking-wide uppercase block -mt-0.5">Gestor de Operaciones v2.1</span>
          </div>
        </div>

        {/* Desktop actions summary */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-right text-xs">
            <span className="text-slate-400 block font-medium">Caja chica activa:</span>
            <span className="font-bold text-emerald-400">
              ${cobros.reduce((acc, c) => acc + c.total, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={handleReloadDefaults}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-white/10 text-slate-200 transition"
          >
            Restaurar Valores
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1 bg-white/10 hover:bg-white/15 rounded-lg text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Container Layout */}
      <div className="flex flex-1 relative">
        
        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden lg:flex flex-col justify-between w-64 bg-white border-r border-slate-100 p-5 shrink-0 self-stretch min-h-[calc(100vh-69px)] shadow-2xs select-none">
          <nav className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-widest px-2.5 block mb-3">Módulos Administrativos</span>
            
            {allowedTabs.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  if (item.key !== 'cobros') setSelectedComandaForBilling(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 ${
                  activeTab === item.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-4 space-y-3">
            {sessionUser && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="truncate pr-1.5 text-left">
                  <span className="text-[8.5px] uppercase font-extrabold text-slate-400 block tracking-wider">Empleado</span>
                  <span className="font-bold text-slate-800 text-xs block truncate" title={sessionUser.nombre}>{sessionUser.nombre}</span>
                  <span className="text-[10px] font-extrabold text-indigo-750 bg-indigo-50/70 border border-indigo-150 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {sessionUser.rol}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSessionUser(null);
                    setActiveTab('resumen');
                  }}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 rounded-lg transition shrink-0"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="text-[9.5px] text-slate-405 text-center text-slate-400">
              <p>ID Sesión: <strong className="font-mono">U050498</strong></p>
              <p>© 2026 Molino Software</p>
            </div>
          </div>
        </aside>

        {/* Mobile menu drawer overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="w-64 max-w-xs bg-white h-full p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <span className="font-extrabold text-sm tracking-tight block">EL MOLINO GOURMET</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-450">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {allowedTabs.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key);
                        if (item.key !== 'cobros') setSelectedComandaForBilling(null);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold rounded-xl transition duration-150 ${
                        activeTab === item.key
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-3">
                {sessionUser && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-left">
                    <div className="truncate pr-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-extrabold">Sesión</span>
                      <span className="font-extrabold text-slate-800 text-xs block truncate">{sessionUser.nombre}</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        {sessionUser.rol}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSessionUser(null);
                        setMobileMenuOpen(false);
                        setActiveTab('resumen');
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition"
                      title="Cerrar Sesión"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    handleReloadDefaults();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-bold rounded-xl text-center transition shadow-2xs"
                >
                  Restaurar Valores
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-69px)] scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'resumen' && (
              <DashboardOverview
                personal={personal}
                chefs={chefs}
                clientes={clientes}
                platillos={platillos}
                comandas={comandas}
                cobros={cobros}
                onNavigate={(t) => setActiveTab(t)}
                onSelectComanda={handleSelectComandaForBilling}
              />
            )}

            {activeTab === 'comandas' && (
              <ComandasManager
                comandas={comandas}
                platillos={platillos}
                personal={personal}
                chefs={chefs}
                clientes={clientes}
                onAdd={handleAddComanda}
                onUpdateEstado={handleUpdateComandaEstado}
                onDelete={handleDeleteComanda}
                onNavigateToCobro={handleSelectComandaForBilling}
                selectedComandaExternal={selectedComandaForBilling}
                clearExternalSelection={() => setSelectedComandaForBilling(null)}
                currentUser={sessionUser}
              />
            )}

            {activeTab === 'cobros' && (
              <CobrosManager
                comandas={comandas}
                clientes={clientes}
                onAddCobro={handleAddCobro}
                selectedComandaExternal={selectedComandaForBilling}
                clearExternalSelection={() => setSelectedComandaForBilling(null)}
              />
            )}

            {activeTab === 'platillos' && (
              <PlatillosList
                platillos={platillos}
                onAdd={handleAddPlatillo}
                onEdit={handleEditPlatillo}
                onDelete={handleDeletePlatillo}
              />
            )}

            {activeTab === 'personal' && (
              <PersonalList
                personal={personal}
                onAdd={handleAddPersonal}
                onEdit={handleEditPersonal}
                onDelete={handleDeletePersonal}
              />
            )}

            {activeTab === 'chefs' && (
              <ChefsList
                chefs={chefs}
                onAdd={handleAddChef}
                onEdit={handleEditChef}
                onDelete={handleDeleteChef}
              />
            )}

            {activeTab === 'clientes' && (
              <ClientesList
                clientes={clientes}
                onAdd={handleAddCliente}
                onEdit={handleEditCliente}
                onDelete={handleDeleteCliente}
              />
            )}

            {activeTab === 'ventas' && (
              <VentasAnalytics
                ventas={ventas}
                platillos={platillos}
                cobros={cobros}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
