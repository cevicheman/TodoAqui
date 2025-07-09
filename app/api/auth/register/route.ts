import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { hashPassword, formatPhoneNumber } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, password, numero_whatsapp } = await request.json()

    if (!nombre || !email || !password || !numero_whatsapp) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const formattedPhone = formatPhoneNumber(numero_whatsapp)

    const result = await sql`
      INSERT INTO users (nombre, email, password, numero_whatsapp, rol)
      VALUES (${nombre}, ${email}, ${hashedPassword}, ${formattedPhone}, 'vendedor')
      RETURNING id
    `

    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      userId: result[0].id,
    })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
