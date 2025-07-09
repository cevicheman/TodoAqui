"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { compressImage, formatFileSize } from "@/lib/imageUtils"
import Image from "next/image"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  currentImage?: string
  onRemoveImage?: () => void
}

export default function ImageUpload({ onImageUpload, currentImage, onRemoveImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: string
    compressedSize: string
    show: boolean
  }>({ originalSize: "", compressedSize: "", show: false })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida")
      return
    }

    const originalSize = file.size
    let processedFile = file

    // Si el archivo es mayor a 5MB, comprimir automáticamente
    if (originalSize > 5 * 1024 * 1024) {
      setCompressing(true)
      setCompressionProgress(0)
      setCompressionInfo({
        originalSize: formatFileSize(originalSize),
        compressedSize: "",
        show: true,
      })

      try {
        // Simular progreso de compresión
        const progressInterval = setInterval(() => {
          setCompressionProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        // Comprimir imagen
        processedFile = await compressImage(file, 4500) // Comprimir a máximo 4.5MB para dar margen

        clearInterval(progressInterval)
        setCompressionProgress(100)

        setCompressionInfo((prev) => ({
          ...prev,
          compressedSize: formatFileSize(processedFile.size),
        }))

        // Mostrar resultado por 2 segundos
        setTimeout(() => {
          setCompressionInfo((prev) => ({ ...prev, show: false }))
        }, 3000)
      } catch (error) {
        console.error("Error comprimiendo imagen:", error)
        alert("Error al comprimir la imagen. Intenta con una imagen más pequeña.")
        setCompressing(false)
        return
      }

      setCompressing(false)
    }

    // Verificar tamaño final
    if (processedFile.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande incluso después de la compresión. Intenta con una imagen más pequeña.")
      return
    }

    setUploading(true)

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(processedFile.name)}`, {
        method: "POST",
        body: processedFile,
      })

      if (response.ok) {
        const { url } = await response.json()
        onImageUpload(url)
      } else {
        alert("Error al subir la imagen")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="space-y-4">
      {currentImage ? (
        <Card className="relative overflow-hidden">
          <div className="relative w-full h-48">
            <Image
              src={currentImage || "/placeholder.svg"}
              alt="Producto"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button type="button" variant="destructive" size="sm" onClick={onRemoveImage} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-orange-400 bg-orange-50" : "border-orange-300 hover:border-orange-400 hover:bg-orange-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center space-y-4">
            {compressing ? (
              <div className="w-full max-w-xs">
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-orange-800 font-medium">Comprimiendo imagen...</p>
                  <Progress value={compressionProgress} className="w-full" />
                  <p className="text-orange-600 text-sm">{compressionProgress}% completado</p>
                </div>
              </div>
            ) : uploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            ) : (
              <ImageIcon className="h-12 w-12 text-orange-400" />
            )}

            <div>
              <p className="text-orange-800 font-medium">
                {compressing
                  ? "Comprimiendo imagen..."
                  : uploading
                    ? "Subiendo imagen..."
                    : "Haz clic o arrastra una imagen aquí"}
              </p>
              <p className="text-orange-600 text-sm mt-1">
                PNG, JPG, WEBP - Se comprime automáticamente si es mayor a 5MB
              </p>
            </div>

            {!compressing && !uploading && (
              <Button type="button" variant="outline" className="border-orange-300 text-orange-700">
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar Imagen
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Información de compresión */}
      {compressionInfo.show && (
        <Card className="bg-green-50 border-green-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">¡Imagen comprimida exitosamente!</p>
              <p className="text-green-700 text-sm">
                Tamaño original: {compressionInfo.originalSize} → Comprimido: {compressionInfo.compressedSize}
              </p>
            </div>
          </div>
        </Card>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
