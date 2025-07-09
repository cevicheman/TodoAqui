"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Package, Clock, AlertTriangle } from "lucide-react"
import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import ProductForm from "@/components/ProductForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/database"

interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchProducts()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      router.push("/auth/login")
    }
  }

  const fetchProducts = async () => {
    try {
      // Usar endpoint especial del dashboard que muestra todos los productos
      const response = await fetch("/api/dashboard/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSuccess = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProducts()
      } else {
        alert("Error al eliminar el producto")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error al eliminar el producto")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Calcular estadísticas
  const activeProducts = products.filter((p) => p.unidades_disponibles > 0 && new Date(p.expires_at) > new Date())
  const expiringSoon = products.filter((p) => {
    const daysLeft = Math.ceil((new Date(p.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft <= 3 && daysLeft > 0 && p.unidades_disponibles > 0
  })
  const outOfStock = products.filter((p) => p.unidades_disponibles === 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-orange-900">
                Dashboard {user.rol === "admin" ? "Administrador" : "Vendedor"}
              </h1>
              <p className="text-orange-600">Bienvenido, {user.nombre}</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </div>

        {/* Alertas */}
        {expiringSoon.length > 0 && (
          <div className="mb-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-semibold">
                    ¡Tienes {expiringSoon.length} producto(s) que expiran pronto!
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{products.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Activos</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{activeProducts.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Expiran Pronto</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{expiringSoon.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Sin Stock</CardTitle>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{outOfStock.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-900">
              {user.rol === "admin" ? "Todos los Productos" : "Mis Productos"}
            </h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-green-300 text-green-700">
                {activeProducts.length} Activos
              </Badge>
              {expiringSoon.length > 0 && (
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  {expiringSoon.length} Por expirar
                </Badge>
              )}
              {outOfStock.length > 0 && (
                <Badge variant="outline" className="border-red-300 text-red-700">
                  {outOfStock.length} Sin stock
                </Badge>
              )}
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-orange-900 mb-2">No tienes productos aún</h3>
                <p className="text-orange-600 mb-4">Comienza agregando tu primer producto para empezar a vender.</p>
                <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Producto
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-900">
              {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct || undefined}
            onSuccess={handleProductSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
