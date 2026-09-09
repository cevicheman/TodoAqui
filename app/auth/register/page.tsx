"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    numero_whatsapp: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          numero_whatsapp: formData.numero_whatsapp,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || "Error al registrar usuario")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50 flex items-center justify-center p-4">
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-xl max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">¡Registro Exitoso!</h2>
            <p className="text-green-600 mb-4">
              Tu cuenta ha sido creada correctamente. Serás redirigido al login en unos segundos.
            </p>
            <Link href="/auth/login">
              <Button className="bg-green-500 hover:bg-green-600 text-white">Ir al Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="sr-only">Registrarse en Todo Aquí</h1>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <ShoppingBag className="w-10 h-10 text-orange-500" />
            <span className="text-3xl font-bold text-orange-900">Todo Aquí</span>
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-900 flex items-center justify-center">
              <UserPlus className="w-6 h-6 mr-2" />
              Registro de Vendedor
            </CardTitle>
            <p className="text-orange-600">Crea tu cuenta para vender productos</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

              <div>
                <Label htmlFor="nombre" className="text-orange-800">
                  Nombre Completo
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  required
                  className="border-orange-300 focus:border-orange-500"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-orange-800">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="border-orange-300 focus:border-orange-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="numero_whatsapp" className="text-orange-800">
                  Número de WhatsApp
                </Label>
                <Input
                  id="numero_whatsapp"
                  type="tel"
                  value={formData.numero_whatsapp}
                  onChange={(e) => handleChange("numero_whatsapp", e.target.value)}
                  required
                  className="border-orange-300 focus:border-orange-500"
                  placeholder="0969213476"
                />
                <p className="text-xs text-orange-600 mt-1">
                  Formato: 0969213476 (se convertirá automáticamente a +593969213476)
                </p>
              </div>

              <div>
                <Label htmlFor="password" className="text-orange-800">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="border-orange-300 focus:border-orange-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-orange-800">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  className="border-orange-300 focus:border-orange-500"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                {loading ? "Registrando..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-orange-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="text-orange-800 font-semibold hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-orange-600 hover:text-orange-800 text-sm">
                ← Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
