import React from 'react';
import { useStore } from './store/useStore';
import LoginScreen from './components/LoginScreen';
import HeaderNavigation from './components/HeaderNavigation';
import SalonesMap from './components/SalonesMap';
import TomarComandaModal from './components/TomarComandaModal';
import CocinaDisplay from './components/CocinaDisplay';
import TicketPrinterModal from './components/TicketPrinterModal';
import DueñaDashboard from './components/DueñaDashboard';
import InventarioKardex from './components/InventarioKardex';

export default function App() {
  const { isAuthenticated, mozoActivo, activeTab, mesaSeleccionada, setMesaSeleccionada } = useStore();

  // Enforce LoginScreen as the FIRST screen!
  if (!isAuthenticated || !mozoActivo) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-huarique-50 flex flex-col font-sans">
      
      {/* Header bar */}
      <HeaderNavigation />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'salones' && (
          <SalonesMap onSelectMesaForComanda={(mesa) => setMesaSeleccionada(mesa)} />
        )}

        {activeTab === 'cocina' && (
          <CocinaDisplay />
        )}

        {activeTab === 'duena' && (
          <DueñaDashboard />
        )}

        {activeTab === 'inventario' && (
          <InventarioKardex />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-huarique-100 py-4 px-6 text-center text-xs text-huarique-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <p>© {new Date().getFullYear()} Huarique de Catacaos - Sistema Profesional de Comandas & Kardex</p>
          <p className="text-huarique-400">Diseñado para Tablet & Móvil (3 Salones - 80 Mesas)</p>
        </div>
      </footer>

      {/* Modals */}
      <TomarComandaModal
        mesa={mesaSeleccionada}
        isOpen={Boolean(mesaSeleccionada)}
        onClose={() => setMesaSeleccionada(null)}
      />

      <TicketPrinterModal />

    </div>
  );
}
