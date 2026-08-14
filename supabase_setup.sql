-- ====================================================================
-- SCRIPT DE BASE DE DATOS SUPABASE - HUARIQUE DE CATACAOS
-- Copia y pega este script en el SQL Editor de tu consola de Supabase
-- ====================================================================

-- 1. TABLA MOZOS (USUARIOS CON PIN DE 6 DÍGITOS)
CREATE TABLE IF NOT EXISTS public.mozos (
    id TEXT PRIMARY KEY DEFAULT 'mozo_' || gen_random_uuid(),
    nombre TEXT NOT NULL,
    pin VARCHAR(6) NOT NULL UNIQUE,
    rol TEXT NOT NULL DEFAULT 'mozo', -- 'mozo' o 'duena'
    avatar TEXT DEFAULT '👨‍🍳',
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA SALONES
CREATE TABLE IF NOT EXISTS public.salones (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    total_mesas INT NOT NULL,
    rito TEXT,
    icon TEXT DEFAULT '🏛️'
);

-- 3. TABLA MESAS
CREATE TABLE IF NOT EXISTS public.mesas (
    id TEXT PRIMARY KEY,
    numero INT NOT NULL,
    salon_id TEXT REFERENCES public.salones(id) ON DELETE CASCADE,
    capacidad INT DEFAULT 4,
    estado TEXT DEFAULT 'libre', -- 'libre', 'ocupada', 'por_pagar'
    mozo_id TEXT REFERENCES public.mozos(id),
    total_actual NUMERIC(10,2) DEFAULT 0.00,
    tiempo_inicio TIMESTAMPTZ
);

-- 4. TABLA PRODUCTOS (MENÚ DE CATACAOS)
CREATE TABLE IF NOT EXISTS public.productos (
    id TEXT PRIMARY KEY DEFAULT 'p_' || gen_random_uuid(),
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL, -- 'Entradas', 'Ceviches', 'Fondos', 'Bebidas', 'Postres'
    precio NUMERIC(10,2) NOT NULL,
    descripcion TEXT,
    imagen TEXT DEFAULT '🍲',
    activo BOOLEAN DEFAULT TRUE
);

-- 5. TABLA COMANDAS
CREATE TABLE IF NOT EXISTS public.comandas (
    id TEXT PRIMARY KEY DEFAULT 'cmd_' || gen_random_uuid(),
    mesa_numero INT NOT NULL,
    salon_nombre TEXT NOT NULL,
    mozo_id TEXT REFERENCES public.mozos(id),
    mozo_nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'en_preparacion', 'listo', 'cobrado'
    nota_general TEXT,
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA DETALLES DE COMANDA
CREATE TABLE IF NOT EXISTS public.comanda_detalles (
    id BIGSERIAL PRIMARY KEY,
    comanda_id TEXT REFERENCES public.comandas(id) ON DELETE CASCADE,
    producto_id TEXT REFERENCES public.productos(id),
    nombre TEXT NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    nota TEXT
);

-- 7. TABLA INSUMOS (INVENTARIO)
CREATE TABLE IF NOT EXISTS public.insumos (
    id TEXT PRIMARY KEY DEFAULT 'ins_' || gen_random_uuid(),
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL, -- 'Carnes', 'Pescados', 'Abarrotes', 'Verduras', 'Bebidas'
    stock_actual NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    unidad TEXT NOT NULL DEFAULT 'Kg', -- 'Kg', 'Unidades', 'Litros', 'Cajas'
    stock_minimo NUMERIC(10,2) NOT NULL DEFAULT 5.00,
    costo_unitario NUMERIC(10,2) DEFAULT 0.00,
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA KARDEX (HISTORIAL ENTRADAS Y SALIDAS DE INSUMOS)
CREATE TABLE IF NOT EXISTS public.kardex (
    id TEXT PRIMARY KEY DEFAULT 'k_' || gen_random_uuid(),
    insumo_id TEXT REFERENCES public.insumos(id) ON DELETE CASCADE,
    insumo_nombre TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'ENTRADA' o 'SALIDA'
    cantidad NUMERIC(10,2) NOT NULL,
    motivo TEXT,
    proveedor TEXT,
    costo_total NUMERIC(10,2) DEFAULT 0.00,
    usuario TEXT NOT NULL,
    fecha TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DE MOZOS INICIALES
INSERT INTO public.mozos (id, nombre, pin, rol, avatar) VALUES
('m1', 'Juan Pérez', '123456', 'mozo', '👨‍🍳'),
('m2', 'María Santos', '654321', 'mozo', '👩‍🍳'),
('m3', 'Carlos Mendoza', '112233', 'mozo', '🧑‍🍳'),
('admin', 'Dueña (Administración)', '999999', 'duena', '👑')
ON CONFLICT (pin) DO NOTHING;

-- SEED DE SALONES INICIALES
INSERT INTO public.salones (id, nombre, total_mesas, rito, icon) VALUES
('s1', 'Salón Principal Catacaos', 30, 'Mesas 1 a 30', '🏛️'),
('s2', 'Salón Chichería & Patio', 25, 'Mesas 31 a 55', '🏺'),
('s3', 'Salón Terraza VIP', 25, 'Mesas 56 a 80', '🌿')
ON CONFLICT (id) DO NOTHING;

-- HABILITAR PUBLIC ACCESS (RLS DESACTIVADO PARA USO INTERNO DE LOCAL)
ALTER TABLE public.mozos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comanda_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kardex ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo acceso anónimo" ON public.mozos FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso anónimo" ON public.salones FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso anónimo" ON public.mesas FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso anónimo" ON public.productos FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso anónimo" ON public.comandas FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso anónimo" ON public.comanda_detalles FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso anónimo" ON public.insumos FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso anónimo" ON public.kardex FOR ALL USING (true);
