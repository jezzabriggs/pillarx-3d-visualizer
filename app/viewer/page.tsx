'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import ModelViewer from '@/components/ModelViewer'
import ControlPanel from '@/components/ControlPanel'
import Header from '@/components/Header'
import { CADGeometry, geometryDB } from '@/lib/firebase'

// Separate component that uses useSearchParams
function ViewerContent() {
  const searchParams = useSearchParams()
  const geometryId = searchParams.get('geometry')
  
  const [selectedModel, setSelectedModel] = useState<string>('cube')
  const [selectedGeometry, setSelectedGeometry] = useState<CADGeometry | null>(null)
  const [viewerSettings, setViewerSettings] = useState({
    backgroundColor: '#ffffff',
    showGrid: true,
    showAxes: true,
    autoRotate: false,
  })
  const [loading, setLoading] = useState(true)
  const [geometries, setGeometries] = useState<CADGeometry[]>([])

  // Load geometries and selected geometry on component mount
  useEffect(() => {
    loadGeometries()
  }, [])

  useEffect(() => {
    if (geometryId) {
      loadSelectedGeometry(geometryId)
    }
  }, [geometryId])

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

  const loadSelectedGeometry = async (id: string) => {
    try {
      const geometry = await geometryDB.getGeometry(id)
      if (geometry) {
        setSelectedGeometry(geometry)
        setSelectedModel('custom')
      }
    } catch (error) {
      console.error('Error loading selected geometry:', error)
    }
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    setSelectedGeometry(null) // Reset custom geometry when switching to built-in models
  }

  const handleSettingsChange = (settings: any) => {
    setViewerSettings(prev => ({ ...prev, ...settings }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading viewer...</p>
        </div>
      </div>
    )
  }

  return (
    <>
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
              3D Model Viewer
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore and interact with 3D models in real-time
            </motion.p>
          </div>

          {/* Selected Geometry Info */}
          {selectedGeometry && (
            <motion.div 
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {selectedGeometry.name}
              </h3>
              <p className="text-gray-600 mb-2">{selectedGeometry.description}</p>
              <div className="text-sm text-gray-500">
                <span className="mr-4">Type: {selectedGeometry.geometryType}</span>
                <span className="mr-4">Created: {new Date(selectedGeometry.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          )}

          {/* Model Selection */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Model
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="cube">Cube</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="custom">Custom Geometry</option>
            </select>
          </motion.div>

          {/* 3D Viewer */}
          <div className="relative">
            <div className="w-full h-96 md:h-[600px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <ModelViewer
                model={selectedModel}
                settings={viewerSettings}
                customGeometry={selectedGeometry}
              />
            </div>
            
            {/* Control Panel - Horizontal Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
              <ControlPanel
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                settings={viewerSettings}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Main component with Suspense boundary
export default function ViewerPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading viewer...</p>
          </div>
        </div>
      }>
        <ViewerContent />
      </Suspense>
    </main>
  )
} 