import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://todoaqui.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Todo Aquí - Tu Tienda Virtual de Confianza",
    template: "%s | Todo Aquí",
  },
  description:
    "Encuentra productos de hogar, educación, servicios, alimentos y accesorios en Todo Aquí.",
  keywords: [
    "tienda virtual",
    "productos",
    "hogar",
    "educación",
    "servicios",
    "alimentos",
    "accesorios",
    "Ecuador",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: "Todo Aquí",
    title: "Todo Aquí - Tu Tienda Virtual de Confianza",
    description:
      "Encuentra productos de hogar, educación, servicios, alimentos y accesorios en Todo Aquí.",
    url: "/",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 512,
        height: 512,
        alt: "Todo Aquí",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo Aquí - Tu Tienda Virtual de Confianza",
    description:
      "Encuentra productos de hogar, educación, servicios, alimentos y accesorios en Todo Aquí.",
    images: ["/placeholder-logo.png"],
  },
  icons: {
    icon: "/placeholder-logo.png",
    shortcut: "/placeholder-logo.png",
    apple: "/placeholder-logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: "Todo Aquí",
              description:
                "Tienda virtual de productos de hogar, educación, servicios, alimentos y accesorios.",
              url: siteUrl,
              image: `${siteUrl}/placeholder-logo.png`,
              areaServed: "EC",
            }),
          }}
        />
        {children}
      </body>
    </html>
  )
}
