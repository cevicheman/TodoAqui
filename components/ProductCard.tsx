"use client"

import { MessageCircle, User, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/database"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  showActions?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: number) => void
  onProductClick?: (product: Product) => void
}

export default function ProductCard({
  product,
  showActions = false,
  onEdit,
  onDelete,
  onProductClick,
}: ProductCardProps) {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hola! Me interesa el producto: ${product.nombre} - $${product.precio}`)
    const whatsappUrl = `https://wa.me/${product.vendedor_whatsapp}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  // Calcular días restantes
  const daysLeft = Math.ceil((new Date(product.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysLeft <= 3
  const isOutOfStock = product.unidades_disponibles === 0

  return (
    <Card
      onClick={() => onProductClick?.(product)}
      className={`h-full flex flex-col bg-gradient-to-br from-white to-orange-50 border-orange-200 hover:shadow-lg transition-shadow duration-300 ${isOutOfStock ? "opacity-60" : ""} ${onProductClick ? "cursor-pointer" : ""}`}
    >
      <CardContent className="p-4 flex-grow">
        {/* Imagen del producto */}
        <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.imagen_url || "/placeholder.svg"}
            alt={product.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SIN STOCK</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            {product.categoria}
          </Badge>
          <div className="text-right">
            <span className="text-xs text-orange-600 block">{product.unidades_disponibles} disponibles</span>
            {showActions && (
              <span
                className={`text-xs ${isExpiringSoon ? "text-red-600 font-semibold" : "text-gray-500"} flex items-center mt-1`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {daysLeft > 0 ? `${daysLeft} días` : "Expirado"}
              </span>
            )}
          </div>
        </div>

        {isExpiringSoon && showActions && (
          <div className="flex items-center text-xs text-red-600 mb-2 bg-red-50 p-2 rounded">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {daysLeft > 0 ? `¡Expira en ${daysLeft} días!` : "¡Producto expirado!"}
          </div>
        )}

        <h3 className="font-semibold text-lg text-orange-900 mb-2 line-clamp-2">{product.nombre}</h3>

        <p className="text-orange-700 text-sm mb-3 line-clamp-3">{product.descripcion}</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-orange-800">${product.precio}</span>
        </div>

        {product.vendedor_nombre && (
          <div className="flex items-center text-xs text-orange-600 mb-3">
            <User className="w-3 h-3 mr-1" />
            <span>Vendido por: {product.vendedor_nombre}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        {!showActions && (
          <Button
            onClick={(event) => {
              event.stopPropagation()
              handleWhatsAppContact()
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={isOutOfStock}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isOutOfStock ? "Sin Stock" : "Contactar por WhatsApp"}
          </Button>
        )}

        {showActions && (
          <div className="flex space-x-2 w-full">
            <Button
              onClick={(event) => {
                event.stopPropagation()
                onEdit?.(product)
              }}
              variant="outline"
              size="sm"
              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Editar
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation()
                onDelete?.(product.id)
              }}
              variant="outline"
              size="sm"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              Eliminar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
