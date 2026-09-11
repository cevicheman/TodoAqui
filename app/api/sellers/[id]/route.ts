import { type NextRequest, NextResponse } from "next/server"
import { sql, type Product } from "@/lib/database"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sellerId = Number.parseInt(id, 10)

    if (!Number.isInteger(sellerId) || sellerId < 1) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 })
    }

    const sellers = await sql`
      SELECT id, nombre
      FROM users
      WHERE id = ${sellerId}
        AND rol IN ('admin', 'vendedor')
    `

    if (sellers.length === 0) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 })
    }

    const products = (await sql`
      SELECT p.*, u.nombre as vendedor_nombre, u.numero_whatsapp as vendedor_whatsapp
      FROM products p
      JOIN users u ON p.vendedor_id = u.id
      WHERE p.vendedor_id = ${sellerId}
        AND p.unidades_disponibles > 0
        AND p.expires_at > CURRENT_TIMESTAMP
      ORDER BY p.created_at DESC
    `) as Product[]

    return NextResponse.json({ seller: sellers[0], products })
  } catch (error) {
    console.error("Error obteniendo vendedor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
