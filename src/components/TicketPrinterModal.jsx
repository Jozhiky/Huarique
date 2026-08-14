import React from 'react';
import { useStore } from '../store/useStore';
import { X, Printer, CheckCircle } from 'lucide-react';

export default function TicketPrinterModal() {
  const { ticketImprimir, setTicketImprimir } = useStore();

  if (!ticketImprimir) return null;

  const handlePrint = () => {
    window.print();
  };

  const fechaFormateada = new Date(ticketImprimir.creadoEn || Date.now()).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-huarique-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-soft-lg border border-huarique-100 p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setTicketImprimir(null)}
          className="absolute top-4 right-4 text-huarique-400 hover:text-huarique-700 p-1.5 rounded-full hover:bg-huarique-50 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-sm font-extrabold text-huarique-900 mb-3 text-center print:hidden flex items-center justify-center space-x-2">
          <Printer className="w-4 h-4 text-huarique-500" />
          <span>Vista Previa de Comanda Térmica</span>
        </h3>

        {/* Printable Ticket Area */}
        <div id="printable-comanda" className="bg-white p-4 border border-dashed border-huarique-300 rounded-2xl font-mono text-xs text-huarique-900 space-y-3">
          
          {/* Header */}
          <div className="text-center pb-2 border-b border-dashed border-huarique-300">
            <h2 className="text-base font-extrabold tracking-wider">HUARIQUE DE CATACAOS</h2>
            <p className="text-[11px] font-sans">Comanda de Cocina / Bar</p>
            <p className="text-[10px] font-mono mt-1">{fechaFormateada}</p>
          </div>

          {/* Table & Waiter Info */}
          <div className="py-1 border-b border-dashed border-huarique-300 space-y-1">
            <div className="flex justify-between text-sm font-extrabold">
              <span>MESA N°: {ticketImprimir.mesaNumero}</span>
              <span>{ticketImprimir.salonNombre}</span>
            </div>
            <div className="text-[11px]">
              MOZO: <span className="font-bold">{ticketImprimir.mozoNombre}</span>
            </div>
            <div className="text-[10px] text-gray-600">
              COD COMANDA: #{ticketImprimir.id.slice(-6)}
            </div>
          </div>

          {/* Dishes Table */}
          <div className="py-2 border-b border-dashed border-huarique-300">
            <div className="grid grid-cols-12 font-bold mb-1 border-b pb-1">
              <span className="col-span-2">CANT</span>
              <span className="col-span-7">DESCRIPCIÓN</span>
              <span className="col-span-3 text-right">TOTAL</span>
            </div>
            {ticketImprimir.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 py-1 text-[11px] items-start">
                <span className="col-span-2 font-extrabold">{item.cantidad}x</span>
                <div className="col-span-7 pr-1">
                  <span className="font-bold">{item.nombre}</span>
                  {item.nota && (
                    <div className="text-[10px] font-sans font-semibold text-red-600 italic">
                      * Obs: {item.nota}
                    </div>
                  )}
                </div>
                <span className="col-span-3 text-right font-semibold">
                  S/ {(item.precio * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-1 text-right">
            <p className="text-sm font-extrabold">
              TOTAL S/ {ticketImprimir.total.toFixed(2)}
            </p>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-[10px] text-gray-500 border-t border-dashed border-huarique-300">
            *** GRACIAS POR PREFERIRNOS ***
          </div>

        </div>

        {/* Action Button (Hidden on Print) */}
        <div className="mt-5 space-y-2 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full py-3 px-4 rounded-2xl bg-huarique-500 hover:bg-huarique-600 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-touch transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket Thermal (80mm)</span>
          </button>

          <button
            onClick={() => setTicketImprimir(null)}
            className="w-full py-2 px-4 rounded-xl text-huarique-600 font-semibold text-xs hover:bg-huarique-50 transition"
          >
            Cerrar Vista Previa
          </button>
        </div>

      </div>
    </div>
  );
}
