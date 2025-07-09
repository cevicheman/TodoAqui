import { type NextRequest, NextResponse } from "next/server"
import { sql, type Product, cleanupProducts } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Ejecutar limpieza automática cada vez que se consultan productos
    await cleanupProducts()

    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")
    const search = searchParams.get("search")

    let products: Product[]

    if (categoria && search) {
      products = (await sql`
        SELECT p.*, u.nombre as vendedor_nombre, u.numero_whatsapp as vendedor_whatsapp
        FROM products p
        JOIN users u ON p.vendedor_id = u.id
        WHERE p.categoria = ${categoria} 
        AND (p.nombre ILIKE ${`%${search}%`} OR p.descripcion ILIKE ${`%${search}%`})
        AND p.unidades_disponibles > 0
        AND p.expires_at > CURRENT_TIMESTAMP
        ORDER BY p.created_at DESC
      `) as Product[]
    } else if (categoria) {
      products = (await sql`
        SELECT p.*, u.nombre as vendedor_nombre, u.numero_whatsapp as vendedor_whatsapp
        FROM products p
        JOIN users u ON p.vendedor_id = u.id
        WHERE p.categoria = ${categoria}
        AND p.unidades_disponibles > 0
        AND p.expires_at > CURRENT_TIMESTAMP
        ORDER BY p.created_at DESC
      `) as Product[]
    } else if (search) {
      products = (await sql`
        SELECT p.*, u.nombre as vendedor_nombre, u.numero_whatsapp as vendedor_whatsapp
        FROM products p
        JOIN users u ON p.vendedor_id = u.id
        WHERE (p.nombre ILIKE ${`%${search}%`} OR p.descripcion ILIKE ${`%${search}%`})
        AND p.unidades_disponibles > 0
        AND p.expires_at > CURRENT_TIMESTAMP
        ORDER BY p.created_at DESC
      `) as Product[]
    } else {
      products = (await sql`
        SELECT p.*, u.nombre as vendedor_nombre, u.numero_whatsapp as vendedor_whatsapp
        FROM products p
        JOIN users u ON p.vendedor_id = u.id
        WHERE p.unidades_disponibles > 0
        AND p.expires_at > CURRENT_TIMESTAMP
        ORDER BY p.created_at DESC
      `) as Product[]
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error obteniendo productos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const { nombre, descripcion, precio, unidades_disponibles, categoria, imagen_url } = await request.json()

    if (!nombre || !descripcion || !precio || !unidades_disponibles || !categoria || !imagen_url) {
      return NextResponse.json({ error: "Todos los campos son requeridos, incluyendo la imagen" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (nombre, descripcion, precio, unidades_disponibles, categoria, imagen_url, vendedor_id)
      VALUES (${nombre}, ${descripcion}, ${Number.parseFloat(precio)}, ${Number.parseInt(unidades_disponibles)}, ${categoria}, ${imagen_url}, ${payload.userId})
      RETURNING id
    `

    return NextResponse.json({
      message: "Producto creado exitosamente",
      productId: result[0].id,
    })
  } catch (error) {
    console.error("Error creando producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
