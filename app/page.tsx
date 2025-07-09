"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Home, GraduationCap, Briefcase, Coffee, Watch } from "lucide-react"
import Navbar from "@/components/Navbar"
import SearchBar from "@/components/SearchBar"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/database"

const categorias = [
  { name: "Hogar", icon: Home, color: "from-orange-400 to-red-400" },
  { name: "Educación", icon: GraduationCap, color: "from-blue-400 to-indigo-400" },
  { name: "Servicios", icon: Briefcase, color: "from-green-400 to-teal-400" },
  { name: "Alimentos", icon: Coffee, color: "from-yellow-400 to-orange-400" },
  { name: "Accesorios", icon: Watch, color: "from-purple-400 to-pink-400" },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initializeApp()
  }, [])

  useEffect(() => {
    if (initialized) {
      fetchProducts()
    }
  }, [initialized])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchQuery])

  const initializeApp = async () => {
    try {
      // Inicializar base de datos
      await fetch("/api/init")
      setInitialized(true)
    } catch (error) {
      console.error("Error inicializando app:", error)
      setInitialized(true) // Continuar aunque falle la inicialización
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
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

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.categoria === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSelectedCategory("")
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category)
    setSearchQuery("")
  }

  const getProductsByCategory = (category: string) => {
    return products.filter((product) => product.categoria === category).slice(0, 4)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-orange-700">Inicializando Todo Aquí...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <ShoppingBag className="w-16 h-16 text-orange-500 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-orange-900">Todo Aquí</h1>
          </div>
          <p className="text-xl text-orange-700 mb-8 max-w-2xl mx-auto">
            Tu tienda virtual de confianza. Encuentra todo lo que necesitas en un solo lugar.
          </p>

          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">Explora por Categorías</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categorias.map((categoria) => {
              const Icon = categoria.icon
              return (
                <Button
                  key={categoria.name}
                  onClick={() => handleCategorySelect(categoria.name)}
                  variant={selectedCategory === categoria.name ? "default" : "outline"}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedCategory === categoria.name
                      ? "bg-orange-500 text-white shadow-lg scale-105"
                      : "border-orange-300 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{categoria.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {searchQuery || selectedCategory ? (
            // Filtered Results
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-900">
                  {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory}
                </h2>
                <span className="text-orange-600">{filteredProducts.length} productos encontrados</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-orange-600 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
                </div>
              )}
            </div>
          ) : (
            // Category Sections
            <div className="space-y-12">
              {categorias.map((categoria) => {
                const categoryProducts = getProductsByCategory(categoria.name)
                const Icon = categoria.icon

                if (categoryProducts.length === 0) return null

                return (
                  <div key={categoria.name}>
                    <div className="flex items-center mb-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${categoria.color} flex items-center justify-center mr-4`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-orange-900">{categoria.name}</h2>
                        <p className="text-orange-600">Productos destacados</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {products.filter((p) => p.categoria === categoria.name).length > 4 && (
                      <div className="text-center mt-6">
                        <Button
                          onClick={() => handleCategorySelect(categoria.name)}
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          Ver todos los productos de {categoria.name}
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-100 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-4">
            <ShoppingBag className="w-8 h-8 text-orange-500 mr-2" />
            <span className="text-xl font-bold text-orange-900">Todo Aquí</span>
          </div>
          <p className="text-orange-700">Tu tienda virtual de confianza - Conectando vendedores y compradores</p>
        </div>
      </footer>
    </div>
  )
}
