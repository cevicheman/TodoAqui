import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Todo Aquí - Tu Tienda Virtual de Confianza",
  description:
    "Encuentra todo lo que necesitas en un solo lugar. Productos de hogar, educación, servicios, alimentos y accesorios.",
  keywords: "tienda virtual, productos, hogar, educación, servicios, alimentos, accesorios, Ecuador",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
