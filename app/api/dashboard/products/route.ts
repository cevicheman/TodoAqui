import { type NextRequest, NextResponse } from "next/server"
import { sql, type Product } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

// Endpoint especial para el dashboard que muestra TODOS los productos del usuario (incluso sin stock)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    let products: Product[]

    if (payload.rol === "admin") {
      // Admin ve todos los productos
      products = (await sql`
        SELECT p.*, u.nombre as vendedor_nombre, u.numero_whatsapp as vendedor_whatsapp
        FROM products p
        JOIN users u ON p.vendedor_id = u.id
        ORDER BY p.created_at DESC
      `) as Product[]
    } else {
      // Vendedor ve solo sus productos
      products = (await sql`
        SELECT p.*, u.nombre as vendedor_nombre, u.numero_whatsapp as vendedor_whatsapp
        FROM products p
        JOIN users u ON p.vendedor_id = u.id
        WHERE p.vendedor_id = ${payload.userId}
        ORDER BY p.created_at DESC
      `) as Product[]
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error obteniendo productos del dashboard:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
