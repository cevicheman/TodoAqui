import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

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

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Nombre de archivo requerido" }, { status: 400 })
    }

    if (!request.body) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
    }

    // Generar nombre único para el archivo
    const uniqueFilename = `${Date.now()}-${filename}`

    const blob = await put(uniqueFilename, request.body, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error subiendo archivo:", error)
    return NextResponse.json({ error: "Error subiendo archivo" }, { status: 500 })
  }
}
