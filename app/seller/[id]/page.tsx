"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Store, ShoppingBag } from "lucide-react"
import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import ProductDetailModal from "@/components/ProductDetailModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/database"

interface Seller {
  id: number
  nombre: string
}

interface SellerResponse {
  seller: Seller
  products: Product[]
}

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<SellerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchSeller() {
      try {
        const { id } = await params
        const response = await fetch(`/api/sellers/${id}`)
        if (!response.ok) {
          if (!cancelled) setNotFound(true)
          return
        }
        const sellerData = (await response.json()) as SellerResponse
        if (!cancelled) setData(sellerData)
      } catch (error) {
        console.error("Error obteniendo perfil del vendedor:", error)
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSeller()
    return () => {
      cancelled = true
    }
  }, [params])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6 text-orange-700 hover:bg-orange-100 hover:text-orange-900">
          <Link href="/">
            <ArrowLeft data-icon="inline-start" />
            Volver a productos
          </Link>
        </Button>

        {loading ? (
          <div className="py-20 text-center text-orange-700">Cargando perfil...</div>
        ) : notFound || !data ? (
          <Card className="border-orange-200 bg-white/80">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Store className="size-12 text-orange-400" />
              <h1 className="text-2xl font-bold text-orange-900">Vendedor no encontrado</h1>
              <p className="text-orange-700">Este perfil ya no está disponible.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="mb-10 rounded-xl border border-orange-200 bg-gradient-to-br from-white to-orange-50 p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Store className="size-7" />
                </div>
                <div>
                  <p className="text-sm text-orange-600">Perfil del vendedor</p>
                  <h1 className="text-3xl font-bold text-orange-900">{data.seller.nombre}</h1>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center gap-3">
                <ShoppingBag className="size-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-orange-900">Publicaciones activas</h2>
                <span className="text-orange-600">({data.products.length})</span>
              </div>

              {data.products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.products.map((product) => (
                    <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
                  ))}
                </div>
              ) : (
                <Card className="border-orange-200 bg-white/80">
                  <CardContent className="py-12 text-center text-orange-700">
                    Este vendedor no tiene publicaciones activas.
                  </CardContent>
                </Card>
              )}
            </section>
          </>
        )}
      </main>

      <ProductDetailModal
        product={selectedProduct}
        open={selectedProduct !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null)
        }}
      />
    </div>
  )
}
