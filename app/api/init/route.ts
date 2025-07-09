import { NextResponse } from "next/server"
import { initDatabase } from "@/lib/database"

export async function GET() {
  try {
    await initDatabase()
    return NextResponse.json({ message: "Base de datos inicializada correctamente" })
  } catch (error) {
    console.error("Error inicializando base de datos:", error)
    return NextResponse.json({ error: "Error inicializando base de datos" }, { status: 500 })
  }
}
