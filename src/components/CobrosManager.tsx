/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, Receipt, Percent, Check, AlertCircle, Coins, Smile, Sparkles, Building2, Terminal, RefreshCw, Printer, X } from 'lucide-react';
import { Comanda, Cliente, Cobro, MetodoPago, EstadoComanda } from '../types';

interface CobrosManagerProps {
  comandas: Comanda[];
  clientes: Cliente[];
  onAddCobro: (cobro: Omit<Cobro, 'id'>, puntosAGanar: number, clienteId?: string) => void;
  selectedComandaExternal?: Comanda | null;
  clearExternalSelection?: () => void;
}

export default function CobrosManager({
  comandas,
  clientes,
  onAddCobro,
  selectedComandaExternal,
  clearExternalSelection
}: CobrosManagerProps) {
  // Select active served orders elegible to be paid
  const billableComandas = comandas.filter(c => c.estado === 'Servido' || c.estado === 'Listo');

  // Currently billing order
  const [activeBillComanda, setActiveBillComanda] = useState<Comanda | null>(null);

  // Form states
  const [descuento, setDescuento] = useState<number>(0); // discount percent
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('Efectivo');
  const [efectivoRecibido, setEfectivoRecibido] = useState<string>('');
  const [facturado, setFacturado] = useState<boolean>(false);
  const [rfc, setRfc] = useState<string>('');

  // Receipt printed simulation trigger
  const [receiptSimulated, setReceiptSimulated] = useState<string | null>(null);

  useEffect(() => {
    if (selectedComandaExternal) {
      setActiveBillComanda(selectedComandaExternal);
      // Reset values
      setDescuento(0);
      setMetodoPago('Efectivo');
      setEfectivoRecibido('');
      setFacturado(false);
      setRfc('');
    }
  }, [selectedComandaExternal]);

  const handleSelectComanda = (comanda: Comanda) => {
    setActiveBillComanda(comanda);
    setDescuento(0);
    setMetodoPago('Efectivo');
    setEfectivoRecibido('');
    setFacturado(false);
    setRfc('');
    if (clearExternalSelection) clearExternalSelection();
  };

  const getSubtotal = () => {
    return activeBillComanda ? activeBillComanda.total : 0;
  };

  const getDiscountAmount = () => {
    return getSubtotal() * (descuento / 100);
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount();
  };

  const getCambio = () => {
    if (metodoPago !== 'Efectivo') return 0;
    const efec = Number(efectivoRecibido);
    if (isNaN(efec) || efec < getTotal()) return 0;
    return efec - getTotal();
  };

  // Loyalty points computed (1 point per 10 pesos spent)
  const getPuntosAGanar = () => {
    return Math.floor(getTotal() / 10);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBillComanda) return;

    if (metodoPago === 'Efectivo') {
      const efec = Number(efectivoRecibido);
      if (isNaN(efec) || efec < getTotal()) {
        alert('Monto recibido insuficiente para cubrir el total.');
        return;
      }
    }

    if (facturado && !rfc.trim()) {
      alert('Por favor ingrese el RFC de facturación.');
      return;
    }

    // Call state handler back
    onAddCobro({
      comandaId: activeBillComanda.id,
      numeroMesa: activeBillComanda.numeroMesa,
      clienteNombre: activeBillComanda.clienteNombre || 'Público General',
      subtotal: getSubtotal(),
      descuento: descuento,
      total: getTotal(),
      metodoPago: metodoPago,
      efectivoRecibido: metodoPago === 'Efectivo' ? Number(efectivoRecibido) : undefined,
      cambioEntregado: metodoPago === 'Efectivo' ? getCambio() : undefined,
      fechaHora: new Date().toISOString(),
      facturado: facturado,
      rfc: facturado ? rfc.toUpperCase() : undefined
    }, getPuntosAGanar(), activeBillComanda.clienteId);

    // Save mock visualization receipts
    const simulatedText = `
------------- TICKET DE COMPRA -------------
Restaurante El Molino Gourmet S.A de C.V
Fecha: ${new Date().toLocaleString()}
Mesa: ${activeBillComanda.numeroMesa}
Comanda ID: ${activeBillComanda.id}
Atendido por: ${activeBillComanda.meseroNombre}
Cliente: ${activeBillComanda.clienteNombre || 'Socio Club General'}
--------------------------------------------
${activeBillComanda.items.map(i => `${i.cantidad}x ${i.platilloNombre.padEnd(25)} $${(i.precioUnitario * i.cantidad).toFixed(2)}`).join('\n')}
--------------------------------------------
Subtotal:                              $${getSubtotal().toFixed(2)}
Descuento (${descuento}%):                       -$${getDiscountAmount().toFixed(2)}
TOTAL COBRADO:                         $${getTotal().toFixed(2)}
Pago recibido (${metodoPago}):           $${metodoPago === 'Efectivo' ? Number(efectivoRecibido).toFixed(2) : getTotal().toFixed(2)}
Cambio entregado:                      $${getCambio().toFixed(2)}
--------------------------------------------
Puntos Club Ganados:                  +${getPuntosAGanar()} pts
${facturado ? `RFC Facturación:                      ${rfc.toUpperCase()}` : ''}
¡Muchas gracias por su preferencia!
--------------------------------------------
    `;
    setReceiptSimulated(simulatedText);
    
    // Reset state after success. Keep the receipt visual modal open.
    setActiveBillComanda(null);
  };

  return (
    <div className="space-y-6" id="cobros-interface">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" /> Terminal de Facturación y Cobros
          </h1>
          <p className="text-slate-500 text-sm mt-1">Cierra cuentas instantáneas aplicando descuentos de lealtad y registrando movimientos contables.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Served active orders lists */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Mesa Servidas por Cobrar</h2>
              <p className="text-xs text-slate-400 mt-0.5">Pendientes de pago inmediato en caja.</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Comensales: {billableComandas.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {billableComandas.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2">
                <Smile className="w-10 h-10 text-slate-300 stroke-1" />
                <p className="text-xs text-center">¡Todas las mesas están al corriente! No hay comandas servidas pendientes de cobro.</p>
              </div>
            ) : (
              billableComandas.map(comanda => (
                <div
                  key={comanda.id}
                  onClick={() => handleSelectComanda(comanda)}
                  className={`p-4 bg-slate-50 border rounded-xl hover:border-indigo-300 transition cursor-pointer ${
                    activeBillComanda?.id === comanda.id ? 'border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/10' : 'border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{comanda.numeroMesa}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">ID: {comanda.id}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      ${comanda.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-2 font-medium">
                    Cliente: <span className="text-slate-700">{comanda.clienteNombre || 'General'}</span> | Servido por: <span className="text-slate-700">{comanda.meseroNombre}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate mt-1">
                    {comanda.items.map(i => `${i.cantidad}x ${i.platilloNombre}`).join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Billing Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          {!activeBillComanda ? (
            <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-3 h-full">
              <Terminal className="w-12 h-12 text-slate-300 stroke-1" />
              <h3 className="font-bold text-slate-700 text-sm">Terminal Desconectada</h3>
              <p className="text-xs text-center max-w-xs leading-relaxed">Selecciona una mesa servida de la izquierda para desplegar la terminal de cobro digital.</p>
            </div>
          ) : (
            <form onSubmit={handleRegisterPayment} className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Cobro de cuenta: {activeBillComanda.numeroMesa}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Resumen final para cliente: <strong className="text-slate-700">{activeBillComanda.clienteNombre || 'General'}</strong></p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBillComanda(null)}
                  className="text-slate-400 hover:text-slate-650"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Breakdown detail */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm text-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Detalle de Consumo</span>
                {activeBillComanda.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.cantidad}x {it.platilloNombre}</span>
                    <span className="font-semibold">${(it.precioUnitario * it.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Discounts */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-wider block flex items-center gap-1">
                  <Percent className="w-4 h-4 text-indigo-500" /> Aplicar Descuento / Cupón Club VIP
                </label>
                
                {/* Check if is frequent to recommend discount */}
                {activeBillComanda.clienteId && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 rounded-lg p-2 flex items-center gap-1.5 font-medium border border-emerald-100">
                    <Sparkles className="w-3.5 h-3.5" /> El cliente es socio frecuente. Recomendación: Aplicar 10% de cortesía.
                  </div>
                )}

                <div className="grid grid-cols-5 gap-2">
                  {[0, 5, 10, 15, 20].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDescuento(pct)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        descuento === pct
                          ? 'bg-indigo-600 text-white border-indigo-650 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pct}% Dto
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-wider block">Forma de Pago</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Efectivo', 'Tarjeta de Crédito/Débito', 'Transferencia', 'Pago Digital'] as MetodoPago[]).map(met => (
                    <button
                      key={met}
                      type="button"
                      onClick={() => setMetodoPago(met)}
                      className={`p-3 text-xs font-bold rounded-xl border flex flex-col items-center justify-center text-center transition gap-1 ${
                        metodoPago === met
                          ? 'bg-slate-900 text-white border-slate-950 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      {met}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic inputs according to payment selected */}
              {metodoPago === 'Efectivo' && (
                <div className="grid grid-cols-2 gap-4 bg-amber-50/40 p-4 rounded-xl border border-amber-150 animate-in slide-in-from-top-3 duration-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Registrar Efectivo Recibido</label>
                    <input
                      type="number"
                      required
                      min={getTotal()}
                      placeholder="Ej. 1000"
                      value={efectivoRecibido}
                      onChange={(e) => setEfectivoRecibido(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Cambio a Entregar:</span>
                    <span className="text-2xl font-black text-amber-900 block mt-1">
                      ${getCambio().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Invoicing togglers */}
              <div className="space-y-3.5 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="facturado-chk"
                    checked={facturado}
                    onChange={(e) => setFacturado(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                  />
                  <label htmlFor="facturado-chk" className="text-xs font-semibold text-slate-700 select-none flex items-center gap-1.5 cursor-pointer">
                    <Building2 className="w-4 h-4 text-slate-400" /> Solicita Factura de Impuestos (RFC)
                  </label>
                </div>

                {facturado && (
                  <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100 animate-in slide-in-from-top-3 duration-200">
                    <label className="text-xs font-bold text-slate-550 uppercase tracking-wider block">Clave RFC del Cliente</label>
                    <input
                      type="text"
                      maxLength={13}
                      placeholder="Ej. COBR900214JK0"
                      value={rfc}
                      onChange={(e) => setRfc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none text-sm uppercase font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Calculations Box */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col gap-2 shadow-xs">
                <div className="flex justify-between text-xs text-slate-350">
                  <span>Monto de Consumo:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Descuento Aplicado ({descuento}%):</span>
                    <span>-${getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-slate-300 border-t border-white/10 pt-2 font-medium">
                  <span className="flex items-center gap-1"><Smile className="w-4 h-4 text-indigo-400" /> Puntos Club Ganados:</span>
                  <span className="text-white font-bold">+{getPuntosAGanar()} pts</span>
                </div>

                <div className="flex justify-between items-center text-base border-t border-white/10 pt-2 font-bold select-none">
                  <span className="text-slate-200 text-sm uppercase tracking-wider">Monto Total a Cobrar:</span>
                  <span className="text-3xl font-black text-indigo-300 font-mono">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-sm"
              >
                <Check className="w-5 h-5" /> Registrar Cobro e Imprimir Boleta
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Receipts simulated print modal */}
      {receiptSimulated && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-250 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" /> Comprobante de Caja Impreso
              </h2>
              <button
                onClick={() => setReceiptSimulated(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <pre className="bg-slate-100 text-[11px] font-mono leading-relaxed p-4 rounded-xl text-slate-700 overflow-x-auto border border-slate-200 max-h-[400px] select-text">
                {receiptSimulated}
              </pre>

              <div className="flex gap-2 justify-end pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setReceiptSimulated(null)}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                >
                  Cerrar Comprobante
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
