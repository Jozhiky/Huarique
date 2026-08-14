# 🚀 Guía de Conexión a Supabase - Huarique de Catacaos

Esta guía te explicará paso a paso cómo conectar tu aplicación de **Huarique de Catacaos** a tu base de datos en la nube con **Supabase** en menos de 5 minutos.

---

## 📌 Paso 1: Crear tu proyecto en Supabase (Gratis)

1. Ve a [https://supabase.com/](https://supabase.com/) y haz clic en **Sign In** o **Start your project**.
2. Inicia sesión con tu cuenta de GitHub o correo electrónico.
3. Haz clic en el botón **New Project**.
4. Completa la información de tu proyecto:
   - **Name**: `Huarique de Catacaos`
   - **Database Password**: Ingresa una contraseña segura (¡guárdala bien!).
   - **Region**: Selecciona `South America (São Paulo)` o `US East` para la menor latencia.
5. Haz clic en **Create new project** y espera 1 minuto a que se cree la base de datos.

---

## 📌 Paso 2: Ejecutar el Script de la Base de Datos (SQL)

1. En el panel lateral izquierdo de tu proyecto en Supabase, ingresa a **SQL Editor** (ícono `>/_`).
2. Haz clic en **New Query**.
3. Abre el archivo [`supabase_setup.sql`](./supabase_setup.sql) ubicado en la raíz de esta carpeta, copia todo su contenido y pégalo en el editor de Supabase.
4. Haz clic en el botón **Run** (o presiona `Ctrl + Enter`).
5. Verás el mensaje `Success. No rows returned`. ¡Tus tablas de Mozos, Mesas, Comandas, Productos e Inventario Kardex ya están creadas!

---

## 📌 Paso 3: Obtener tus Credenciales (API Keys)

1. En el menú lateral izquierdo de Supabase, ve a **Project Settings** (ícono de engranaje ⚙️) > **API**.
2. Busca la sección **Project API keys** y copia:
   - **Project URL** (ejemplo: `https://xyzprojectname.supabase.co`)
   - **anon / public key** (una clave larga que empieza con `eyJhbG...`)

---

## 📌 Paso 4: Configurar el archivo `.env.local` en tu Proyecto

1. En la raíz de la carpeta de este proyecto (`d:\richa\Huarique`), crea un archivo llamado `.env.local`.
2. Pega el siguiente contenido reemplazando tus claves:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-public-aqui
```

3. Guarda el archivo `.env.local`.

---

## 📌 Paso 5: Probar la Aplicación

1. En la terminal de este proyecto ejecuta:
   ```bash
   npm run dev
   ```
2. Abre tu navegador en `http://localhost:3000`.
3. Verás en la esquina superior derecha la insignia **"Supabase DB"** en verde, indicando que el sistema está 100% sincronizado con tu base de datos en la nube.

> 💡 **Nota**: Si ejecutas la app sin configurar `.env.local`, el sistema utilizará automáticamente la **Base de Datos Local Autónoma (LocalStorage)**, permitiéndote usar todas las funciones offline de inmediato.
