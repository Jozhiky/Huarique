# 🍽️ Huarique de Catacaos - Sistema de Comandas & Kardex de Inventario

Aplicación Web / PWA / Tablet profesional diseñada para la gestión de comandas en tiempo real, mapa interactivo de 3 salones (~80 mesas), monitor de cocina con tickets térmicos (80mm), autenticación de mozos mediante PIN táctil de 6 dígitos, dashboard directivo para la dueña y control de inventario (Kardex de entradas y salidas de insumos).

---

## 🌟 Características Principales

### 1. 🏛️ Mapa Interactivo de 3 Salones (~80 Mesas)
- **Salón Principal Catacaos**: 30 Mesas.
- **Salón Chichería & Patio**: 25 Mesas.
- **Salón Terraza VIP**: 25 Mesas.
- Indicador visual de estado de mesa (*Libre*, *Ocupada*, *Por Pagar*).
- Cálculo en tiempo real del tiempo de permanencia y consumo acumulado.

### 2. 🔑 Autenticación Táctil por PIN de 6 dígitos (3 Mozos + Dueña)
- **Mozo 1 (Juan Pérez)**: PIN `123456`
- **Mozo 2 (María Santos)**: PIN `654321`
- **Mozo 3 (Carlos Mendoza)**: PIN `112233`
- **Dueña (Administradora)**: PIN `999999`
- Modal con teclado numérico diseñado ergonómicamente para pantallas táctiles de tablets.

### 3. 📝 Toma de Comandas & Impresión Térmica de Cocina
- Catálogo de platos criollos y piuranos ordenados por categoría (Entradas, Ceviches, Fondos, Bebidas, Postres).
- Observaciones por plato ("Sin picante", "Con hielo aparte", "Bien cocido").
- Envío instantáneo a la pantalla de cocina.
- Formato e **impresión directa en ticketera térmica (80mm)** con un clic.

### 4. 👑 Panel de Control de la Dueña (Dashboard)
- Métricas de ventas diarias y ticket promedio por mesa.
- **Rendimiento de los Mozos**: Tablero detallado con mesas atendidas, total vendido por mozo y desempeño.
- Ranking de platos más vendidos y registro histórico de comandas.

### 5. 📦 Control de Insumos & Kardex (Entradas y Salidas)
- Registro de **Entradas** (compras de insumos como Pollo fresco, Arroz, Pescado, Aceite con proveedor y costo).
- Registro de **Salidas** (consumo de cocina, mermas o ajustes).
- Alertas automáticas de **Bajo Stock / Reabastecimiento Crítico**.
- Historial completo de movimientos auditado con fecha, hora y usuario.

### 6. 🎨 Diseño UI & Estética Suave (Light Mode)
- Basado en los tonos del logotipo de *Huarique de Catacaos* (dorado cálido `#C89B3C`, crema `#FAF7F2`, sombras suaves y bordes redondeados `rounded-3xl`).
- 100% responsivo para Tablets (10" horizontal/vertical), Celulares y Computadoras de escritorio.

---

## 🛠️ Instalación y Ejecución Local

```bash
# 1. Clonar o ingresar a la carpeta del proyecto
cd d:\richa\Huarique

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre `http://localhost:3000` en tu navegador o tablet.

---

## 🗄️ Integración con Supabase DB

Revisa la guía paso a paso [`GUIA_SUPABASE.md`](./GUIA_SUPABASE.md) y ejecuta el script [`supabase_setup.sql`](./supabase_setup.sql) en el SQL Editor de tu consola de Supabase.

El proyecto funciona de manera **totalmente autónoma offline (LocalStorage)** y se conecta automáticamente a la nube al configurar tu `.env.local`.

---

## 📱 Generación de APK para Android (PWA / Webview)

Esta aplicación está optimizada como **PWA (Progressive Web App)** y se puede convertir fácilmente en un archivo **.APK** para las 3 tablets mediante cualquiera de las siguientes opciones:

### Opción A: PWABuilder (Forma más rápida sin instalar nada)
1. Despliega la app en Vercel, Netlify o GitHub Pages.
2. Ingresa a [PWABuilder.com](https://www.pwabuilder.com/).
3. Pega la URL de tu app y haz clic en **Build APK**.
4. Descarga e instala el archivo `.apk` directamente en tus 3 tablets Android.

### Opción B: Capacitor (Nativo en el proyecto)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Huarique Comandas" "com.huarique.comandas"
npm run build
npx cap add android
npx cap open android
```

---

## 🐙 Comandos Git / GitHub

Para subir tus cambios a tu repositorio de GitHub:

```bash
git add .
git commit -m "feat: Sistema completo de comandas, 3 salones, mozos por PIN, dashboard dueña y kardex de insumos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/huarique-de-catacaos.git
git push -u origin main
```
