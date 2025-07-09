import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Usar JWT_SECRET del entorno o una clave por defecto
const JWT_SECRET = process.env.JWT_SECRET || "clave-secreta-todo-aqui-2024-super-segura-para-produccion"

export interface JWTPayload {
  userId: number
  email: string
  rol: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function formatPhoneNumber(phone: string): string {
  // Convertir número local (0969213476) a formato internacional (+593969213476)
  if (phone.startsWith("0")) {
    return "+593" + phone.substring(1)
  }
  if (!phone.startsWith("+593")) {
    return "+593" + phone
  }
  return phone
}
