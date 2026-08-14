-- ====================================================================
-- SCRIPT DE BASE DE DATOS SUPABASE - HUARIQUE DE CATACAOS
-- INSTRUCCIONES: Asegúrate de NO seleccionar ningún texto con el mouse.
-- Haz clic en el editor, presiona Ctrl+A (Seleccionar todo) y luego RUN.
-- ====================================================================

-- --------------------------------------------------------------------
-- BLOQUE 1: CREACIÓN DE TABLAS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.mozos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    pin VARCHAR(6) NOT NULL UNIQUE,
    rol TEXT NOT NULL DEFAULT 'mozo',
    avatar TEXT DEFAULT '👨‍🍳',
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.salones (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    total_mesas INT NOT NULL,
    rito TEXT,
    icon TEXT DEFAULT '🏛️'
);

CREATE TABLE IF NOT EXISTS public.mesas (
    id TEXT PRIMARY KEY,
    numero INT NOT NULL,
    salon_id TEXT REFERENCES public.salones(id) ON DELETE CASCADE,
    capacidad INT DEFAULT 4,
    estado TEXT DEFAULT 'libre',
    mozo_id TEXT REFERENCES public.mozos(id),
    total_actual NUMERIC(10,2) DEFAULT 0.00,
    tiempo_inicio TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    descripcion TEXT,
    imagen TEXT DEFAULT '🍲',
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.comandas (
    id TEXT PRIMARY KEY,
    mesa_numero INT NOT NULL,
    salon_nombre TEXT NOT NULL,
    mozo_id TEXT REFERENCES public.mozos(id),
    mozo_nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    nota_general TEXT,
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comanda_detalles (
    id BIGSERIAL PRIMARY KEY,
    comanda_id TEXT REFERENCES public.comandas(id) ON DELETE CASCADE,
    producto_id TEXT REFERENCES public.productos(id),
    nombre TEXT NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    nota TEXT
);

CREATE TABLE IF NOT EXISTS public.insumos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    stock_actual NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    unidad TEXT NOT NULL DEFAULT 'Kg',
    stock_minimo NUMERIC(10,2) NOT NULL DEFAULT 5.00,
    costo_unitario NUMERIC(10,2) DEFAULT 0.00,
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kardex (
    id TEXT PRIMARY KEY,
    insumo_id TEXT REFERENCES public.insumos(id) ON DELETE CASCADE,
    insumo_nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    cantidad NUMERIC(10,2) NOT NULL,
    motivo TEXT,
    proveedor TEXT,
    costo_total NUMERIC(10,2) DEFAULT 0.00,
    usuario TEXT NOT NULL,
    fecha TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- BLOQUE 2: DATOS INICIALES (INSERCIONES)
-- --------------------------------------------------------------------

INSERT INTO public.mozos (id, nombre, pin, rol, avatar) VALUES ('m1', 'Juan Pérez', '123456', 'mozo', '👨‍🍳') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.mozos (id, nombre, pin, rol, avatar) VALUES ('m2', 'María Santos', '654321', 'mozo', '👩‍🍳') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.mozos (id, nombre, pin, rol, avatar) VALUES ('m3', 'Carlos Mendoza', '112233', 'mozo', '🧑‍🍳') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.mozos (id, nombre, pin, rol, avatar) VALUES ('admin', 'Dueña (Administración)', '999999', 'duena', '👑') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.salones (id, nombre, total_mesas, rito, icon) VALUES ('s1', 'Salón Principal Catacaos', 30, 'Mesas 1 a 30', '🏛️') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.salones (id, nombre, total_mesas, rito, icon) VALUES ('s2', 'Salón Chichería & Patio', 25, 'Mesas 31 a 55', '🏺') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.salones (id, nombre, total_mesas, rito, icon) VALUES ('s3', 'Salón Terraza VIP', 25, 'Mesas 56 a 80', '🌿') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-1', 'Pollo Entero Fresco', 'Carnes', 45.00, 'Unidades', 15.00, 18.50) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-2', 'Carne de Cabrito Norteño', 'Carnes', 22.00, 'Kg', 10.00, 32.00) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-3', 'Pescado Mero / Cachema', 'Pescados', 18.00, 'Kg', 8.00, 42.00) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-4', 'Arroz Extra Nir', 'Abarrotes', 120.00, 'Kg', 30.00, 3.80) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-5', 'Yuca Fresca Yascila', 'Verduras', 40.00, 'Kg', 15.00, 2.50) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-6', 'Aceite Vegetal Primor', 'Abarrotes', 35.00, 'Litros', 12.00, 8.50) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-7', 'Maíz Morado Culle', 'Abarrotes', 25.00, 'Kg', 8.00, 5.00) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.insumos (id, nombre, categoria, stock_actual, unidad, stock_minimo, costo_unitario) VALUES ('ins-8', 'Cerveza Cusqueña 620ml', 'Bebidas', 12.00, 'Cajas', 5.00, 68.00) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p1', 'Seco de Chabelo Catacaos', 'Entradas', 32.00, 'Plátano verde majado con carne aliñada y aderezo criollo', '🍌') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p2', 'Majado de Yuca con Chicharrón', 'Entradas', 28.00, 'Yuca piurana machacada con chicharrón crujiente', '🥔') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p3', 'Tamalitos Verdes Catacaos (2 un)', 'Entradas', 16.00, 'Con culantro fresco y salsa criolla piurana', '🌽') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p5', 'Ceviche Especial de Mero', 'Ceviches', 48.00, 'Pesca del día con limón de Chulucanas, ají mochero y zarandaja', '🐟') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p6', 'Ceviche Mixto Norteño', 'Ceviches', 45.00, 'Pescado, mariscos frescos, camote glaseado y cancha', '🦑') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p8', 'Cabrito a la Norteña con Tamal', 'Fondos', 46.00, 'Tierna carne macerada en chicha de jora, frejol y tamal', '🍖') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p10', 'Pollo a la Brasa Entero + Papas + Ensalada', 'Fondos', 68.00, 'Pollo jugoso marinado estilo Huarique con papas nativas', '🍗') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p11', '1/2 Pollo a la Brasa + Papas', 'Fondos', 38.00, 'Medio pollo dorado con ensalada fresca y salsas', '🍗') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p13', 'Chicha Morada de la Casa (Jarra 1.5L)', 'Bebidas', 18.00, 'Maíz morado natural hervido con piña y especias', '🍷') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.productos (id, nombre, categoria, precio, descripcion, imagen) VALUES ('p14', 'Clarito de Catacaos Tradicional (Jarra 1.5L)', 'Bebidas', 20.00, 'Chicha clarified artesanal piurana', '🍺') ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- BLOQUE 3: POLÍTICAS DE SEGURIDAD (RLS)
-- --------------------------------------------------------------------

ALTER TABLE public.mozos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comanda_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kardex ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acceso total mozos" ON public.mozos;
DROP POLICY IF EXISTS "Acceso total salones" ON public.salones;
DROP POLICY IF EXISTS "Acceso total mesas" ON public.mesas;
DROP POLICY IF EXISTS "Acceso total productos" ON public.productos;
DROP POLICY IF EXISTS "Acceso total comandas" ON public.comandas;
DROP POLICY IF EXISTS "Acceso total comanda_detalles" ON public.comanda_detalles;
DROP POLICY IF EXISTS "Acceso total insumos" ON public.insumos;
DROP POLICY IF EXISTS "Acceso total kardex" ON public.kardex;

CREATE POLICY "Acceso total mozos" ON public.mozos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total salones" ON public.salones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total mesas" ON public.mesas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total productos" ON public.productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total comandas" ON public.comandas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total comanda_detalles" ON public.comanda_detalles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total insumos" ON public.insumos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total kardex" ON public.kardex FOR ALL USING (true) WITH CHECK (true);
