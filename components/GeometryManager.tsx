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
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGeometry, setNewGeometry] = useState({
    name: '',
    description: '',
    category: 'primitive' as const,
    geometryType: 'cube' as const,
    parameters: {},
    material: {
      color: '#DC2626',
      metalness: 0.1,
      roughness: 0.2
    },
    tags: [],
    isPublic: true,
    downloadCount: 0,
    rating: 0
  })

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

  const handleCreateGeometry = async () => {
    try {
      const id = await geometryDB.createGeometry(newGeometry)
      console.log('Geometry created with ID:', id)
      setShowCreateForm(false)
      setNewGeometry({
        name: '',
        description: '',
        category: 'primitive',
        geometryType: 'cube',
        parameters: {},
        material: {
          color: '#DC2626',
          metalness: 0.1,
          roughness: 0.2
        },
        tags: [],
        isPublic: true,
        downloadCount: 0,
        rating: 0
      })
      loadGeometries() // Reload the list
    } catch (error) {
      console.error('Error creating geometry:', error)
    }
  }

  const handleDeleteGeometry = async (id: string) => {
    if (confirm('Are you sure you want to delete this geometry?')) {
      try {
        await geometryDB.deleteGeometry(id)
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
          <p className="text-gray-300">Loading geometries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">CAD Geometry Library</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          + Add Geometry
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search geometries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-600 focus:outline-none"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Create New Geometry</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Geometry Name"
                value={newGeometry.name}
                onChange={(e) => setNewGeometry(prev => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-600 focus:outline-none"
              />
              <select
                value={newGeometry.category}
                onChange={(e) => setNewGeometry(prev => ({ ...prev, category: e.target.value as any }))}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none"
              >
                <option value="primitive">Primitive</option>
                <option value="custom">Custom</option>
                <option value="imported">Imported</option>
                <option value="parametric">Parametric</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={newGeometry.description}
              onChange={(e) => setNewGeometry(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-600 focus:outline-none h-20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateGeometry}
                disabled={!newGeometry.name}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Geometry List */}
      <div className="space-y-3">
        {filteredGeometries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm || selectedCategory !== 'all' ? 'No geometries found matching your criteria.' : 'No geometries created yet.'}
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
                  <h4 className="text-white font-medium">{geometry.name}</h4>
                  <p className="text-gray-400 text-sm">{geometry.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-red-900/20 text-red-400 text-xs rounded-full">
                      {geometry.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
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
                    className="px-3 py-1 text-red-400 hover:text-red-300 text-sm"
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