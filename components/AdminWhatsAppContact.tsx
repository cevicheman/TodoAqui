"use client"

import { MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminWhatsAppContact() {
  const pathname = usePathname()
  const currentPage = pathname === "/" ? "inicio" : pathname
  const message = encodeURIComponent(
    `Hola, deseo comunicarme con el administrador de TodoAqui sobre la página: ${currentPage}`,
  )
  const whatsappUrl = `https://wa.me/593968117731?text=${message}`

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      <span className="text-sm text-orange-700">Contactar al administrador</span>
      <Button
        asChild
        size="sm"
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-4 h-4 mr-2" />
          Administrador
        </a>
      </Button>
    </div>
  )
}