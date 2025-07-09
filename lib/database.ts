import { neon } from "@neondatabase/serverless"

// Usar Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL!)

// Función para inicializar la base de datos
export const initDatabase = async () => {
  try {
    console.log("🔄 Inicializando base de datos...")

    // Crear tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        numero_whatsapp TEXT NOT NULL,
        rol TEXT DEFAULT 'vendedor' CHECK (rol IN ('admin', 'vendedor')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Crear tabla de productos con imagen
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        unidades_disponibles INTEGER NOT NULL DEFAULT 0,
        categoria TEXT NOT NULL CHECK (categoria IN ('Hogar', 'Educación', 'Servicios', 'Alimentos', 'Accesorios')),
        imagen_url TEXT NOT NULL,
        vendedor_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
        FOREIGN KEY (vendedor_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `

    // Agregar columnas si no existen (para actualizaciones)
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS imagen_url TEXT DEFAULT '/placeholder.svg?height=300&width=300'`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days')`
    } catch (error) {
      // Las columnas ya existen, continuar
    }

    // Verificar si existe el usuario admin
    const adminExists = await sql`SELECT id FROM users WHERE email = 'admin@todoaqui.com'`

    if (adminExists.length === 0) {
      // Insertar usuario administrador por defecto
      await sql`
        INSERT INTO users (nombre, email, password, numero_whatsapp, rol)
        VALUES ('Administrador', 'admin@todoaqui.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+593969213476', 'admin')
      `
      console.log("✅ Usuario administrador creado")
    }

    // Verificar si existen productos
    const productsCount = await sql`SELECT COUNT(*) as count FROM products`

    if (Number(productsCount[0].count) === 0) {
      console.log("🔄 Insertando productos de ejemplo...")

      // Obtener el ID del admin
      const adminUser = await sql`SELECT id FROM users WHERE email = 'admin@todoaqui.com'`
      const adminId = adminUser[0].id

      // Insertar productos de ejemplo con imágenes placeholder
      const productos = [
        // Hogar
        [
          "Juego de Sábanas Premium",
          "Sábanas 100% algodón, suaves y duraderas",
          45.99,
          15,
          "Hogar",
          "/placeholder.svg?height=300&width=300&text=Sábanas",
        ],
        [
          "Lámpara LED Moderna",
          "Lámpara de mesa con luz regulable",
          32.5,
          8,
          "Hogar",
          "/placeholder.svg?height=300&width=300&text=Lámpara",
        ],
        [
          "Set de Toallas Bambú",
          "Toallas ecológicas super absorbentes",
          28.75,
          12,
          "Hogar",
          "/placeholder.svg?height=300&width=300&text=Toallas",
        ],
        [
          "Organizador de Cocina",
          "Organizador multifuncional para cocina",
          19.99,
          20,
          "Hogar",
          "/placeholder.svg?height=300&width=300&text=Organizador",
        ],

        // Educación
        [
          "Cuadernos Universitarios",
          "Pack de 5 cuadernos rayados",
          12.5,
          25,
          "Educación",
          "/placeholder.svg?height=300&width=300&text=Cuadernos",
        ],
        [
          "Calculadora Científica",
          "Calculadora para estudiantes avanzados",
          35.0,
          10,
          "Educación",
          "/placeholder.svg?height=300&width=300&text=Calculadora",
        ],
        [
          "Set de Marcadores",
          "Marcadores de colores para arte",
          18.25,
          18,
          "Educación",
          "/placeholder.svg?height=300&width=300&text=Marcadores",
        ],
        [
          "Mochila Escolar",
          "Mochila resistente con múltiples compartimentos",
          42.0,
          7,
          "Educación",
          "/placeholder.svg?height=300&width=300&text=Mochila",
        ],

        // Servicios
        [
          "Consultoría Digital",
          "Asesoría en marketing digital por hora",
          25.0,
          100,
          "Servicios",
          "/placeholder.svg?height=300&width=300&text=Consultoría",
        ],
        [
          "Clases de Inglés",
          "Clases particulares de inglés online",
          15.0,
          50,
          "Servicios",
          "/placeholder.svg?height=300&width=300&text=Inglés",
        ],
        [
          "Diseño Gráfico",
          "Diseño de logos y material publicitario",
          45.0,
          30,
          "Servicios",
          "/placeholder.svg?height=300&width=300&text=Diseño",
        ],
        [
          "Reparación Celulares",
          "Servicio técnico especializado",
          20.0,
          40,
          "Servicios",
          "/placeholder.svg?height=300&width=300&text=Reparación",
        ],

        // Alimentos
        [
          "Miel Orgánica",
          "Miel pura de abeja, 500g",
          8.5,
          30,
          "Alimentos",
          "/placeholder.svg?height=300&width=300&text=Miel",
        ],
        [
          "Café Premium",
          "Café molido de altura, 250g",
          12.75,
          22,
          "Alimentos",
          "/placeholder.svg?height=300&width=300&text=Café",
        ],
        [
          "Granola Artesanal",
          "Granola casera con frutos secos",
          6.99,
          35,
          "Alimentos",
          "/placeholder.svg?height=300&width=300&text=Granola",
        ],
        [
          "Mermelada Casera",
          "Mermelada de fresa sin conservantes",
          5.25,
          28,
          "Alimentos",
          "/placeholder.svg?height=300&width=300&text=Mermelada",
        ],

        // Accesorios
        [
          "Reloj Deportivo",
          "Reloj resistente al agua",
          89.99,
          5,
          "Accesorios",
          "/placeholder.svg?height=300&width=300&text=Reloj",
        ],
        [
          "Collar Artesanal",
          "Collar hecho a mano con piedras naturales",
          24.5,
          12,
          "Accesorios",
          "/placeholder.svg?height=300&width=300&text=Collar",
        ],
        [
          "Gafas de Sol",
          "Gafas con protección UV",
          38.75,
          9,
          "Accesorios",
          "/placeholder.svg?height=300&width=300&text=Gafas",
        ],
        [
          "Billetera de Cuero",
          "Billetera genuina hecha a mano",
          32.0,
          15,
          "Accesorios",
          "/placeholder.svg?height=300&width=300&text=Billetera",
        ],
      ]

      for (const producto of productos) {
        await sql`
          INSERT INTO products (nombre, descripcion, precio, unidades_disponibles, categoria, imagen_url, vendedor_id)
          VALUES (${producto[0]}, ${producto[1]}, ${producto[2]}, ${producto[3]}, ${producto[4]}, ${producto[5]}, ${adminId})
        `
      }
      console.log("✅ Productos de ejemplo insertados")
    }

    console.log("✅ Base de datos inicializada correctamente")
    return true
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error)
    return false
  }
}

// Función para limpiar productos expirados y sin stock
export const cleanupProducts = async () => {
  try {
    // Eliminar productos sin stock
    const deletedOutOfStock = await sql`
      DELETE FROM products 
      WHERE unidades_disponibles = 0
      RETURNING id
    `

    // Eliminar productos expirados (más de 14 días)
    const deletedExpired = await sql`
      DELETE FROM products 
      WHERE expires_at < CURRENT_TIMESTAMP
      RETURNING id
    `

    console.log(`🧹 Limpieza automática: ${deletedOutOfStock.length} sin stock, ${deletedExpired.length} expirados`)

    return {
      outOfStock: deletedOutOfStock.length,
      expired: deletedExpired.length,
    }
  } catch (error) {
    console.error("❌ Error en limpieza automática:", error)
    return { outOfStock: 0, expired: 0 }
  }
}

export { sql }

export interface User {
  id: number
  nombre: string
  email: string
  password: string
  numero_whatsapp: string
  rol: "admin" | "vendedor"
  created_at: string
}

export interface Product {
  id: number
  nombre: string
  descripcion: string
  precio: number
  unidades_disponibles: number
  categoria: "Hogar" | "Educación" | "Servicios" | "Alimentos" | "Accesorios"
  imagen_url: string
  vendedor_id: number
  created_at: string
  expires_at: string
  vendedor_nombre?: string
  vendedor_whatsapp?: string
}
