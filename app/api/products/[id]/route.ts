import { type NextRequest, NextResponse } from "next/server"
import { sql, type Product } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const productId = Number.parseInt(params.id)
    const { nombre, descripcion, precio, unidades_disponibles, categoria, imagen_url } = await request.json()

    // Verificar que el producto existe y pertenece al usuario (o es admin)
    const products = await sql`SELECT * FROM products WHERE id = ${productId}`
    const product = products[0] as Product

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    if (payload.rol !== "admin" && product.vendedor_id !== payload.userId) {
      return NextResponse.json({ error: "No tienes permisos para editar este producto" }, { status: 403 })
    }

    // Si las unidades llegan a 0, el producto se eliminará automáticamente en la próxima consulta
    await sql`
      UPDATE products 
      SET nombre = ${nombre}, descripcion = ${descripcion}, precio = ${Number.parseFloat(precio)}, 
          unidades_disponibles = ${Number.parseInt(unidades_disponibles)}, categoria = ${categoria},
          imagen_url = ${imagen_url || product.imagen_url}
      WHERE id = ${productId}
    `

    return NextResponse.json({ message: "Producto actualizado exitosamente" })
  } catch (error) {
    console.error("Error actualizando producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const productId = Number.parseInt(params.id)

    // Verificar que el producto existe y pertenece al usuario (o es admin)
    const products = await sql`SELECT * FROM products WHERE id = ${productId}`
    const product = products[0] as Product

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    if (payload.rol !== "admin" && product.vendedor_id !== payload.userId) {
      return NextResponse.json({ error: "No tienes permisos para eliminar este producto" }, { status: 403 })
    }

    await sql`DELETE FROM products WHERE id = ${productId}`

    return NextResponse.json({ message: "Producto eliminado exitosamente" })
  } catch (error) {
    console.error("Error eliminando producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
