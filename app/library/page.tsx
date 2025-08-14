'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import GeometryManager from '@/components/GeometryManager'
import { CADGeometry, geometryDB } from '@/lib/firebase'

export default function LibraryPage() {
  const [geometries, setGeometries] = useState<CADGeometry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Load geometries on component mount
  useEffect(() => {
    loadGeometries()
  }, [])

  const loadGeometries = async () => {
    try {
      setLoading(true)
      const loadedGeometries = await geometryDB.getGeometries({
        orderBy: 'createdAt',
        orderDirection: 'desc'
      })
      setGeometries(loadedGeometries)
    } catch (error) {
      console.error('Error loading geometries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGeometrySelect = (geometry: CADGeometry) => {
    // Redirect to viewer page with the selected geometry
    window.location.href = `/viewer?geometry=${geometry.id}`
  }

  const filteredGeometries = geometries.filter(geometry => {
    const matchesSearch = geometry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         geometry.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || geometry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'primitive', name: 'Primitive' },
    { id: 'custom', name: 'Custom' },
    { id: 'imported', name: 'Imported' },
    { id: 'parametric', name: 'Parametric' }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-black mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Geometry Library
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Browse and manage your 3D model collection. Click on any model to view it in the 3D viewer.
            </motion.p>
          </div>

          {/* Geometry Manager */}
          <div className="max-w-6xl mx-auto">
            <GeometryManager onGeometrySelect={handleGeometrySelect} />
          </div>
        </div>
      </section>
    </main>
  )
} 