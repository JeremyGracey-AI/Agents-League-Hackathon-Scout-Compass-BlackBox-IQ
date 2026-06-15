import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'

import './globals.css'

const grotesk = Space_Grotesk({
  variable: '--font-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono-geist',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Compass-BlackBox IQ — The governance layer for an autonomous agent',
  description:
    "Microsoft governs what an agent is allowed to do. Compass-BlackBox IQ governs what it knows, did, and learned. Built for the Agents League Reasoning Agents track.",
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0e1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${geistMono.variable} bg-bg`}>
      <body className="font-sans antialiased bg-bg text-ink">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
