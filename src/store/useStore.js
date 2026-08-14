import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Initial Mozos (Waiters) - Professional badges without emojis
const INITIAL_MOZOS = [
  { id: 'm1', nombre: 'Juan Pérez', pin: '123456', rol: 'mozo', iniciales: 'JP' },
  { id: 'm2', nombre: 'María Santos', pin: '654321', rol: 'mozo', iniciales: 'MS' },
  { id: 'm3', nombre: 'Carlos Mendoza', pin: '112233', rol: 'mozo', iniciales: 'CM' },
  { id: 'admin', nombre: 'Dueña (Administración)', pin: '999999', rol: 'duena', iniciales: 'AD' },
];

// Initial 3 Salones
const INITIAL_SALONES = [
  { id: 's1', nombre: 'Salón Principal Catacaos', totalMesas: 30, rito: 'Mesas 1 a 30', iconType: 'building' },
  { id: 's2', nombre: 'Salón Chichería & Patio', totalMesas: 25, rito: 'Mesas 31 a 55', iconType: 'wine' },
  { id: 's3', nombre: 'Salón Terraza VIP', totalMesas: 25, rito: 'Mesas 56 a 80', iconType: 'tree' },
];

// Generate 80 tables
const generateInitialMesas = () => {
  const mesas = [];
  for (let i = 1; i <= 30; i++) {
    mesas.push({
      id: `mesa-${i}`,
      numero: i,
      salonId: 's1',
      capacidad: i % 2 === 0 ? 4 : 6,
      estado: i === 3 ? 'ocupada' : i === 7 ? 'por_pagar' : 'libre',
      mozoId: i === 3 ? 'm1' : i === 7 ? 'm2' : null,
      comandaActualId: i === 3 ? 'cmd-demo-1' : i === 7 ? 'cmd-demo-2' : null,
      totalActual: i === 3 ? 164.00 : i === 7 ? 91.00 : 0,
      tiempoInicio: i === 3 ? new Date(Date.now() - 35 * 60000).toISOString() : i === 7 ? new Date(Date.now() - 60 * 60000).toISOString() : null,
    });
  }
  for (let i = 31; i <= 55; i++) {
    mesas.push({
      id: `mesa-${i}`,
      numero: i,
      salonId: 's2',
      capacidad: i % 3 === 0 ? 8 : 4,
      estado: i === 35 ? 'ocupada' : 'libre',
      mozoId: i === 35 ? 'm3' : null,
      comandaActualId: i === 35 ? 'cmd-demo-3' : null,
      totalActual: i === 35 ? 110.00 : 0,
      tiempoInicio: i === 35 ? new Date(Date.now() - 15 * 60000).toISOString() : null,
    });
  }
  for (let i = 56; i <= 80; i++) {
    mesas.push({
      id: `mesa-${i}`,
      numero: i,
      salonId: 's3',
      capacidad: 4,
      estado: 'libre',
      mozoId: null,
      comandaActualId: null,
      totalActual: 0,
      tiempoInicio: null,
    });
  }
  return mesas;
};

// Menu Products (Catacaos Specialty) - Clean Professional List
const INITIAL_PRODUCTOS = [
  // Entradas
  { id: 'p1', nombre: 'Seco de Chabelo Catacaos', categoria: 'Entradas', precio: 32.00, descripcion: 'Plátano verde majado con carne aliñada y aderezo criollo' },
  { id: 'p2', nombre: 'Majado de Yuca con Chicharrón', categoria: 'Entradas', precio: 28.00, descripcion: 'Yuca piurana machacada con chicharrón crujiente' },
  { id: 'p3', nombre: 'Tamalitos Verdes Catacaos (2 un)', categoria: 'Entradas', precio: 16.00, descripcion: 'Con culantro fresco y salsa criolla piurana' },
  { id: 'p4', nombre: 'Tequeños de Queso y Cabaña', categoria: 'Entradas', precio: 22.00, descripcion: 'Crujientes rellenos de queso fresco con guacamole' },

  // Ceviches & Mariscadas
  { id: 'p5', nombre: 'Ceviche Especial de Mero', categoria: 'Ceviches', precio: 48.00, descripcion: 'Pesca del día con limón de Chulucanas, ají mochero y zarandaja' },
  { id: 'p6', nombre: 'Ceviche Mixto Norteño', categoria: 'Ceviches', precio: 45.00, descripcion: 'Pescado, mariscos frescos, camote glaseado y cancha' },
  { id: 'p7', nombre: 'Sudado de Cachema entera', categoria: 'Ceviches', precio: 42.00, descripcion: 'Pescado fresco sudado en chicha de jora y tomates' },

  // Platos Criollos & Fondos
  { id: 'p8', nombre: 'Cabrito a la Norteña con Tamal', categoria: 'Fondos', precio: 46.00, descripcion: 'Tierna carne macerada en chicha de jora, frejol y tamal' },
  { id: 'p9', nombre: 'Arroz con Pato a la Chiclayana', categoria: 'Fondos', precio: 44.00, descripcion: 'Pato tierno con arroz al culantro y cerveza negra' },
  { id: 'p10', nombre: 'Pollo a la Brasa Entero + Papas + Ensalada', categoria: 'Fondos', precio: 68.00, descripcion: 'Pollo jugoso marinado estilo Huarique con papas nativas' },
  { id: 'p11', nombre: '1/2 Pollo a la Brasa + Papas', categoria: 'Fondos', precio: 38.00, descripcion: 'Medio pollo dorado con ensalada fresca y salsas' },
  { id: 'p12', nombre: 'Lomo Saltado Especial al Wok', categoria: 'Fondos', precio: 42.00, descripcion: 'Fino lomo salteado con cebolla, tomate y papas crujientes' },

  // Bebidas & Chicha
  { id: 'p13', nombre: 'Chicha Morada de la Casa (Jarra 1.5L)', categoria: 'Bebidas', precio: 18.00, descripcion: 'Maíz morado natural hervido con piña y especias' },
  { id: 'p14', nombre: 'Clarito de Catacaos Tradicional (Jarra 1.5L)', categoria: 'Bebidas', precio: 20.00, descripcion: 'Chicha clarified artesanal piurana' },
  { id: 'p15', nombre: 'Cerveza Cusqueña 620ml', categoria: 'Bebidas', precio: 14.00, descripcion: 'Trigo o Negra muy helada' },
  { id: 'p16', nombre: 'Gaseosa Inka Kola 1.5L', categoria: 'Bebidas', precio: 12.00, descripcion: 'Inka Kola familiar helada' },
  { id: 'p17', nombre: 'Agua Mineral con/sin gas 500ml', categoria: 'Bebidas', precio: 5.00, descripcion: 'Botella personal' },

  // Postres
  { id: 'p18', nombre: 'Natilla Piurana Tradicional', categoria: 'Postres', precio: 12.00, descripcion: 'Elaborada con leche de cabra y chancaca pura' },
  { id: 'p19', nombre: 'Alfajores de Catacaos (Pack 4 un)', categoria: 'Postres', precio: 14.00, descripcion: 'Manjarblanco casero y suave masa hojaldrada' },
];

// Initial Comandas Demo
const INITIAL_COMANDAS = [
  {
    id: 'cmd-demo-1',
    mesaNumero: 3,
    salonNombre: 'Salón Principal Catacaos',
    mozoId: 'm1',
    mozoNombre: 'Juan Pérez',
    estado: 'en_preparacion',
    items: [
      { productoId: 'p1', nombre: 'Seco de Chabelo Catacaos', precio: 32.00, cantidad: 1, nota: 'Sin ají mochero' },
      { productoId: 'p8', nombre: 'Cabrito a la Norteña con Tamal', precio: 46.00, cantidad: 1, nota: '' },
      { productoId: 'p10', nombre: 'Pollo a la Brasa Entero + Papas + Ensalada', precio: 68.00, cantidad: 1, nota: 'Papas bien doradas' },
      { productoId: 'p13', nombre: 'Chicha Morada de la Casa (Jarra 1.5L)', precio: 18.00, cantidad: 1, nota: 'Con hielos aparte' }
    ],
    total: 164.00,
    creadoEn: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 'cmd-demo-2',
    mesaNumero: 7,
    salonNombre: 'Salón Principal Catacaos',
    mozoId: 'm2',
    mozoNombre: 'María Santos',
    estado: 'listo',
    items: [
      { productoId: 'p5', nombre: 'Ceviche Especial de Mero', precio: 48.00, cantidad: 1, nota: 'Picante medio' },
      { productoId: 'p11', nombre: '1/2 Pollo a la Brasa + Papas', precio: 38.00, cantidad: 1, nota: '' },
      { productoId: 'p17', nombre: 'Agua Mineral con/sin gas 500ml', precio: 5.00, cantidad: 1, nota: 'Sin gas' }
    ],
    total: 91.00,
    creadoEn: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'cmd-demo-3',
    mesaNumero: 35,
    salonNombre: 'Salón Chichería & Patio',
    mozoId: 'm3',
    mozoNombre: 'Carlos Mendoza',
    estado: 'pendiente',
    items: [
      { productoId: 'p6', nombre: 'Ceviche Mixto Norteño', precio: 45.00, cantidad: 2, nota: 'Extra camote' },
      { productoId: 'p14', nombre: 'Clarito de Catacaos Tradicional (Jarra 1.5L)', precio: 20.00, cantidad: 1, nota: '' }
    ],
    total: 110.00,
    creadoEn: new Date(Date.now() - 15 * 60000).toISOString(),
  }
];

// Initial Insumos (Inventory Items)
const INITIAL_INSUMOS = [
  { id: 'ins-1', nombre: 'Pollo Entero Fresco', categoria: 'Carnes', stockActual: 45, unidad: 'Unidades', stockMinimo: 15, costoUnitario: 18.50 },
  { id: 'ins-2', nombre: 'Carne de Cabrito Norteño', categoria: 'Carnes', stockActual: 22, unidad: 'Kg', stockMinimo: 10, costoUnitario: 32.00 },
  { id: 'ins-3', nombre: 'Pescado Mero / Cachema', categoria: 'Pescados', stockActual: 18, unidad: 'Kg', stockMinimo: 8, costoUnitario: 42.00 },
  { id: 'ins-4', nombre: 'Arroz Extra Nir', categoria: 'Abarrotes', stockActual: 120, unidad: 'Kg', stockMinimo: 30, costoUnitario: 3.80 },
  { id: 'ins-5', nombre: 'Yuca Fresca Yascila', categoria: 'Verduras', stockActual: 40, unidad: 'Kg', stockMinimo: 15, costoUnitario: 2.50 },
  { id: 'ins-6', nombre: 'Aceite Vegetal Primor', categoria: 'Abarrotes', stockActual: 35, unidad: 'Litros', stockMinimo: 12, costoUnitario: 8.50 },
  { id: 'ins-7', nombre: 'Maíz Morado Culle', categoria: 'Abarrotes', stockActual: 25, unidad: 'Kg', stockMinimo: 8, costoUnitario: 5.00 },
  { id: 'ins-8', nombre: 'Cerveza Cusqueña 620ml', categoria: 'Bebidas', stockActual: 12, unidad: 'Cajas', stockMinimo: 5, costoUnitario: 68.00 },
];

// Initial Inventory History (Kardex)
const INITIAL_KARDEX = [
  {
    id: 'k-1',
    insumoId: 'ins-1',
    insumoNombre: 'Pollo Entero Fresco',
    tipo: 'ENTRADA',
    cantidad: 50,
    motivo: 'Compra de Mercado Central Piura',
    proveedor: 'Avícola San Lorenzo',
    costoTotal: 925.00,
    usuario: 'Dueña (Administración)',
    fecha: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'k-2',
    insumoId: 'ins-1',
    insumoNombre: 'Pollo Entero Fresco',
    tipo: 'SALIDA',
    cantidad: 5,
    motivo: 'Consumo Cocina Turno Almuerzo',
    proveedor: '-',
    costoTotal: 92.50,
    usuario: 'Juan Pérez',
    fecha: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'k-3',
    insumoId: 'ins-4',
    insumoNombre: 'Arroz Extra Nir',
    tipo: 'ENTRADA',
    cantidad: 100,
    motivo: 'Reabastecimiento Quincenal',
    proveedor: 'Distribuidora Chulucanas',
    costoTotal: 380.00,
    usuario: 'Dueña (Administración)',
    fecha: new Date(Date.now() - 4 * 86400000).toISOString(),
  }
];

export const useStore = create(
  persist(
    (set, get) => ({
      mozos: INITIAL_MOZOS,
      mozoActivo: INITIAL_MOZOS[0],
      salones: INITIAL_SALONES,
      mesas: generateInitialMesas(),
      productos: INITIAL_PRODUCTOS,
      comandas: INITIAL_COMANDAS,
      insumos: INITIAL_INSUMOS,
      kardex: INITIAL_KARDEX,
      
      salonSeleccionadoId: 's1',
      activeTab: 'salones',
      mesaSeleccionada: null,
      ticketImprimir: null,

      setMozoActivoByPin: (pin) => {
        const found = get().mozos.find(m => m.pin === pin);
        if (found) {
          set({ mozoActivo: found });
          return { success: true, mozo: found };
        }
        return { success: false, message: 'PIN incorrecto. Intenta con 123456 (Juan), 654321 (María), 112233 (Carlos) o 999999 (Dueña).' };
      },

      setSalonSeleccionadoId: (id) => set({ salonSeleccionadoId: id }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setMesaSeleccionada: (mesa) => set({ mesaSeleccionada: mesa }),
      setTicketImprimir: (comanda) => set({ ticketImprimir: comanda }),

      crearEnviarComanda: (mesaId, items, notaGeneral = '') => {
        const state = get();
        const mesa = state.mesas.find(m => m.id === mesaId);
        const salon = state.salones.find(s => s.id === mesa.salonId);
        
        if (!mesa || items.length === 0) return null;

        const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        
        const nuevaComanda = {
          id: `cmd-${Date.now()}`,
          mesaNumero: mesa.numero,
          salonNombre: salon ? salon.nombre : 'Salón',
          mozoId: state.mozoActivo.id,
          mozoNombre: state.mozoActivo.nombre,
          estado: 'pendiente',
          items: items,
          notaGeneral: notaGeneral,
          total: total,
          creadoEn: new Date().toISOString(),
        };

        const nuevasMesas = state.mesas.map(m => {
          if (m.id === mesaId) {
            return {
              ...m,
              estado: 'ocupada',
              mozoId: state.mozoActivo.id,
              comandaActualId: nuevaComanda.id,
              totalActual: total,
              tiempoInicio: m.tiempoInicio || new Date().toISOString(),
            };
          }
          return m;
        });

        set({
          comandas: [nuevaComanda, ...state.comandas],
          mesas: nuevasMesas,
          mesaSeleccionada: null,
          ticketImprimir: nuevaComanda
        });

        return nuevaComanda;
      },

      cambiarEstadoComanda: (comandaId, nuevoEstado) => {
        const state = get();
        const nuevasComandas = state.comandas.map(cmd => {
          if (cmd.id === comandaId) {
            return { ...cmd, estado: nuevoEstado };
          }
          return cmd;
        });
        set({ comandas: nuevasComandas });
      },

      cobrarMesa: (mesaId) => {
        const state = get();
        const mesa = state.mesas.find(m => m.id === mesaId);
        if (!mesa) return;

        const nuevasComandas = state.comandas.map(cmd => {
          if (cmd.id === mesa.comandaActualId) {
            return { ...cmd, estado: 'cobrado' };
          }
          return cmd;
        });

        const nuevasMesas = state.mesas.map(m => {
          if (m.id === mesaId) {
            return {
              ...m,
              estado: 'libre',
              mozoId: null,
              comandaActualId: null,
              totalActual: 0,
              tiempoInicio: null,
            };
          }
          return m;
        });

        set({
          comandas: nuevasComandas,
          mesas: nuevasMesas,
          mesaSeleccionada: null,
        });
      },

      registrarMovimientoInsumo: ({ insumoId, tipo, cantidad, motivo, proveedor, costoTotal }) => {
        const state = get();
        const insumo = state.insumos.find(i => i.id === insumoId);
        if (!insumo) return;

        const cantidadNum = parseFloat(cantidad);
        const costoNum = parseFloat(costoTotal || 0);

        const nuevoStock = tipo === 'ENTRADA'
          ? insumo.stockActual + cantidadNum
          : Math.max(0, insumo.stockActual - cantidadNum);

        const nuevosInsumos = state.insumos.map(i => {
          if (i.id === insumoId) {
            return { ...i, stockActual: nuevoStock };
          }
          return i;
        });

        const nuevoKardex = {
          id: `k-${Date.now()}`,
          insumoId: insumo.id,
          insumoNombre: insumo.nombre,
          tipo: tipo,
          cantidad: cantidadNum,
          motivo: motivo,
          proveedor: proveedor || '-',
          costoTotal: costoNum,
          usuario: state.mozoActivo.nombre,
          fecha: new Date().toISOString(),
        };

        set({
          insumos: nuevosInsumos,
          kardex: [nuevoKardex, ...state.kardex]
        });
      },

      crearNuevoInsumo: ({ nombre, categoria, stockInicial, unidad, stockMinimo, costoUnitario }) => {
        const state = get();
        const nuevoInsumo = {
          id: `ins-${Date.now()}`,
          nombre,
          categoria,
          stockActual: parseFloat(stockInicial || 0),
          unidad,
          stockMinimo: parseFloat(stockMinimo || 5),
          costoUnitario: parseFloat(costoUnitario || 0),
        };

        set({ insumos: [...state.insumos, nuevoInsumo] });

        if (nuevoInsumo.stockActual > 0) {
          get().registrarMovimientoInsumo({
            insumoId: nuevoInsumo.id,
            tipo: 'ENTRADA',
            cantidad: nuevoInsumo.stockActual,
            motivo: 'Registro de Insumo Nuevo (Stock Inicial)',
            proveedor: 'Inventario Inicial',
            costoTotal: nuevoInsumo.stockActual * nuevoInsumo.costoUnitario,
          });
        }
      }
    }),
    {
      name: 'huarique-catacaos-storage',
    }
  )
);
