import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PillarX - 3D Model Visualizer',
  description: 'Interactive 3D model visualization platform built with Next.js and Three.js',
  keywords: '3D, visualization, models, Three.js, Next.js',
  authors: [{ name: 'PillarX Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900">
          {children}
        </div>
      </body>
    </html>
  )
} 