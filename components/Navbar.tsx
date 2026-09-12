"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarUser {
  id: number
  nombre: string
  email: string
  rol: string
}

export default function Navbar() {
  const [user, setUser] = useState<NavbarUser | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-orange-100 to-peach-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <span className="text-2xl font-bold text-orange-800">Ventas Renacer</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-orange-700 hover:text-orange-900 hover:bg-orange-50">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 text-orange-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.nombre}</span>
                  {user.rol === "admin" && (
                    <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">Admin</span>
                  )}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-orange-700 hover:text-orange-900 hover:bg-orange-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-orange-700 hover:text-orange-900 hover:bg-orange-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-orange-700">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-orange-700 px-2 py-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.nombre}</span>
                  {user.rol === "admin" && (
                    <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">Admin</span>
                  )}
                </div>
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" className="w-full justify-start text-orange-700 hover:bg-orange-50">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-orange-700 hover:bg-orange-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login" className="block">
                  <Button variant="ghost" className="w-full justify-start text-orange-700 hover:bg-orange-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
