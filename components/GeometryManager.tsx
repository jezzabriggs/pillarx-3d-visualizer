'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { geometryDB, CADGeometry } from '@/lib/firebase'

interface GeometryManagerProps {
  onGeometrySelect: (geometry: CADGeometry) => void
}

export default function GeometryManager({ onGeometrySelect }: GeometryManagerProps) {
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

  const handleDeleteGeometry = async (id: string) => {
    if (confirm('Are you sure you want to delete this geometry?')) {
      try {
        // Get the geometry first to check if it has a file
        const geometry = geometries.find(g => g.id === id)
        
        // Delete the geometry record
        await geometryDB.deleteGeometry(id)
        
        // If there's a file, delete it from storage too
        if (geometry?.fileUrl) {
          try {
            await geometryDB.deleteFile(geometry.fileUrl)
          } catch (fileError) {
            console.error('Error deleting file:', fileError)
            // Continue even if file deletion fails
          }
        }
        
        loadGeometries() // Reload the list
      } catch (error) {
        console.error('Error deleting geometry:', error)
      }
    }
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

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading geometries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black">CAD Geometry Library</h3>
        <a
          href="/import"
          className="btn-primary"
        >
          + Import Model
        </a>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search geometries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:border-red-600 focus:outline-none"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-black focus:border-red-600 focus:outline-none"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Geometry List */}
      <div className="space-y-3">
        {filteredGeometries.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            {searchTerm || selectedCategory !== 'all' ? 'No geometries found matching your criteria.' : 'No geometries imported yet.'}
          </div>
        ) : (
          filteredGeometries.map((geometry) => (
            <motion.div
              key={geometry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card hover:border-red-600 transition-colors cursor-pointer"
              onClick={() => onGeometrySelect(geometry)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-black font-medium">{geometry.name}</h4>
                  <p className="text-gray-600 text-sm">{geometry.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      {geometry.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                      {geometry.geometryType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteGeometry(geometry.id!)
                    }}
                    className="px-3 py-1 text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
} 