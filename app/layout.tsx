import type React from "react"
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://todoaqui.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ventas Renacer - Tu Tienda Virtual de Confianza",
    template: "%s | Ventas Renacer",
  },
  description:
    "Encuentra productos de hogar, educación, servicios, alimentos y accesorios en Ventas Renacer.",

  verification: {
  google: "yR0LzAMNwCE7gDkPNVBjf7fUHVqoLUVYR1AGjFPfjh8",
  },
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
    siteName: "Ventas Renacer",
    title: "Ventas Renacer - Tu Tienda Virtual de Confianza",
    description:
      "Encuentra productos de hogar, educación, servicios, alimentos y accesorios en Ventas Renacer.",
    url: "/",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 512,
        height: 512,
        alt: "Ventas Renacer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ventas Renacer - Tu Tienda Virtual de Confianza",
    description:
      "Encuentra productos de hogar, educación, servicios, alimentos y accesorios en Ventas Renacer.",
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
              name: "Ventas Renacer",
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
