"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import ImageUpload from "@/components/ImageUpload"
import type { Product } from "@/lib/database"

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel?: () => void
}

const categorias = ["Hogar", "Educación", "Servicios", "Alimentos", "Accesorios"]

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: product?.nombre || "",
    descripcion: product?.descripcion || "",
    precio: product?.precio?.toString() || "",
    unidades_disponibles: product?.unidades_disponibles?.toString() || "",
    categoria: product?.categoria || "",
    imagen_url: product?.imagen_url || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.imagen_url) {
      setError("La imagen del producto es obligatoria")
      setLoading(false)
      return
    }

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
        if (!product) {
          setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            unidades_disponibles: "",
            categoria: "",
            imagen_url: "",
          })
        }
      } else {
        const data = await response.json()
        setError(data.error || "Error al guardar el producto")
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

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, imagen_url: url }))
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imagen_url: "" }))
  }

  return (
    <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900">{product ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          {/* Imagen del producto */}
          <div>
            <Label className="text-orange-800 text-base font-medium">Imagen del Producto *</Label>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded mt-2 mb-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-blue-800 text-sm">
                  <p className="font-medium">Compresión automática activada</p>
                  <p className="text-blue-700">
                    Si tu imagen es mayor a 5MB, se comprimirá automáticamente manteniendo la calidad visual. Formatos
                    soportados: PNG, JPG, WEBP.
                  </p>
                </div>
              </div>
            </div>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.imagen_url}
              onRemoveImage={handleRemoveImage}
            />
          </div>

          <div>
            <Label htmlFor="nombre" className="text-orange-800">
              Nombre del Producto
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              required
              className="border-orange-300 focus:border-orange-500"
              placeholder="Ej: Lámpara LED Moderna"
            />
          </div>

          <div>
            <Label htmlFor="descripcion" className="text-orange-800">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              required
              rows={3}
              className="border-orange-300 focus:border-orange-500"
              placeholder="Describe las características y beneficios de tu producto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="precio" className="text-orange-800">
                Precio ($)
              </Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => handleChange("precio", e.target.value)}
                required
                className="border-orange-300 focus:border-orange-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="unidades" className="text-orange-800">
                Unidades Disponibles
              </Label>
              <Input
                id="unidades"
                type="number"
                min="0"
                value={formData.unidades_disponibles}
                onChange={(e) => handleChange("unidades_disponibles", e.target.value)}
                required
                className="border-orange-300 focus:border-orange-500"
                placeholder="0"
              />
              <p className="text-xs text-orange-600 mt-1">Si llega a 0, el producto se eliminará automáticamente</p>
            </div>
          </div>

          <div>
            <Label htmlFor="categoria" className="text-orange-800">
              Categoría
            </Label>
            <Select value={formData.categoria} onValueChange={(value) => handleChange("categoria", value)}>
              <SelectTrigger className="border-orange-300 focus:border-orange-500">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <p className="text-blue-800 text-sm">
              <strong>📅 Duración:</strong> Tu producto estará visible por 14 días desde su publicación.
            </p>
            <p className="text-blue-700 text-xs mt-1">Se eliminará automáticamente si se queda sin stock o expira.</p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.imagen_url}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Guardando..." : product ? "Actualizar Producto" : "Agregar Producto"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
