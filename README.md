# Ventas Renacer - Tienda Virtual con Imágenes

Una tienda virtual completa construida con Next.js, PostgreSQL (Neon) y autenticación JWT, que incluye subida de imágenes y eliminación automática de productos.

## 🚀 Despliegue Rápido en Vercel

### 1. Crear Base de Datos en Neon

1. Ve a [Neon Console](https://console.neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la URL de conexión que se ve así:
   \`\`\`
   postgresql://username:password@host/database
   \`\`\`

### 2. Desplegar en Vercel

1. Haz clic en el botón "Deploy" en la esquina superior derecha
2. Conecta tu cuenta de GitHub
3. Configura las variables de entorno:
   - `DATABASE_URL`: Tu URL de Neon PostgreSQL
   - `JWT_SECRET`: Una clave secreta (ej: `mi-clave-super-secreta-2024`)
   - `BLOB_READ_WRITE_TOKEN`: Se configura automáticamente

### 3. ¡Listo!

Tu tienda estará disponible en tu URL de Vercel. La base de datos se inicializa automáticamente con:

- ✅ Usuario administrador: `admin@todoaqui.com` / `password`
- ✅ 20 productos de ejemplo en todas las categorías
- ✅ Todas las tablas y relaciones configuradas

## 🎯 Funcionalidades

- 🏪 **Tienda completa** con categorías y búsqueda
- 📸 **Subida de imágenes** obligatoria para cada producto
- ⏰ **Eliminación automática** por stock/tiempo
- 👤 **Autenticación JWT** para vendedores y admin
- 📱 **WhatsApp integrado** para contacto directo
- 📊 **Dashboard avanzado** con estadísticas
- 🔔 **Alertas** de productos por expirar
- 🎨 **Diseño responsive** con colores cálidos
- 🔒 **Roles y permisos** (admin/vendedor)
- 💾 **Base de datos PostgreSQL** en la nube

## 🛠️ Desarrollo Local

\`\`\`bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev
\`\`\`

## 📝 Credenciales de Prueba

**Administrador:**
- Email: `admin@todoaqui.com`
- Contraseña: `password`

## 🌟 Tecnologías

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Base de datos:** PostgreSQL (Neon)
- **Autenticación:** JWT + bcrypt
- **UI:** shadcn/ui + Lucide Icons
- **Despliegue:** Vercel

## 🎨 Mejoras Visuales

- **Imágenes grandes** en cada producto
- **Badges de estado** (sin stock, por expirar)
- **Alertas visuales** en dashboard
- **Preview de imágenes** en formularios
- **Indicadores de tiempo** restante

---

¡Tu tienda virtual está lista para usar! 🎉
