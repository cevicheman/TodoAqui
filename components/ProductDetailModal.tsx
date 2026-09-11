"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Product } from "@/lib/database"

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  if (!product) return null

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hola! Me interesa el producto: ${product.nombre} - $${product.precio}`)
    window.open(`https://wa.me/${product.vendedor_whatsapp}?text=${message}`, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-orange-200 bg-gradient-to-br from-white to-orange-50">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl text-orange-900">{product.nombre}</DialogTitle>
          <DialogDescription className="text-left text-orange-700">
            Información completa de la publicación
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.imagen_url || "/placeholder.svg"}
              alt={product.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {product.categoria}
            </Badge>
            <span className="text-right text-2xl font-bold text-orange-800">${product.precio}</span>
          </div>

          <p className="whitespace-pre-wrap leading-relaxed text-orange-800">{product.descripcion}</p>

          {product.vendedor_nombre && (
            <div className="flex flex-col gap-3 rounded-lg border border-orange-200 bg-white/70 p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <User className="size-4" />
                <span className="font-medium">Vendido por {product.vendedor_nombre}</span>
              </div>
              <Link
                href={`/seller/${product.vendedor_id}`}
                onClick={() => onOpenChange(false)}
                className="text-sm text-orange-600 underline-offset-4 hover:underline"
              >
                Ver más productos de este vendedor
              </Link>
            </div>
          )}

          <Button
            onClick={handleWhatsAppContact}
            disabled={!product.vendedor_whatsapp}
            className="w-full bg-green-500 text-white hover:bg-green-600"
          >
            <MessageCircle data-icon="inline-start" />
            Contactar por WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
