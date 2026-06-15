import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const OG_DESC =
  "The reasoning agent of Compass-BlackBox IQ — F.A.M.-grounded, vault-logged. Agents propose, humans promote."

export const metadata: Metadata = {
  metadataBase: new URL("https://gm-louis.vercel.app"),
  title: "GM Louis · Agentic Governance Management · Compass-BlackBox IQ",
  description:
    "GM Louis — Agentic Governance Management. The reasoning agent of Compass-BlackBox IQ: reasons over Microsoft's F.A.M. grounding and logs every decision to a governed vault the human owns.",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "GM Louis · Compass-BlackBox IQ",
    url: "https://gm-louis.vercel.app",
    title: "GM Louis · Agentic Governance Management",
    description: OG_DESC,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GM Louis — Agentic Governance Management" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GM Louis · Agentic Governance Management",
    description: OG_DESC,
    images: ["/og.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${geistMono.variable} ${inter.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden bg-background text-foreground">
        <div className="noise-overlay" />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
