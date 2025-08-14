'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import ModelViewer from '@/components/ModelViewer'
import ControlPanel from '@/components/ControlPanel'
import Header from '@/components/Header'
import { CADGeometry, geometryDB } from '@/lib/firebase'

export default function ViewerPage() {
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
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading viewer...</p>
          </div>
        </div>
      </main>
    )
  }

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
              3D Viewer
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              View and interact with your 3D models. Use the control panel below to adjust settings and view options.
            </motion.p>
          </div>

          {/* Empty State */}
          {!selectedGeometry && geometries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-black mb-2">No Models to View</h3>
              <p className="text-gray-600 mb-6">Import your first 3D model or select one from the library to get started.</p>
              <div className="flex gap-4 justify-center">
                <a href="/import" className="btn-primary">
                  Import Model
                </a>
                <a href="/library" className="btn-secondary">
                  Browse Library
                </a>
              </div>
            </div>
          )}

          {/* Viewer Content */}
          {geometries.length > 0 && (
            <div className="space-y-6">
              {/* Selected Geometry Info */}
              {selectedGeometry && (
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">{selectedGeometry.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{selectedGeometry.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          {selectedGeometry.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                          {selectedGeometry.geometryType}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {selectedGeometry.fileUrl && (
                        <a 
                          href={selectedGeometry.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700 text-sm underline"
                        >
                          Download Original File
                        </a>
                      )}
                      <a 
                        href="/library" 
                        className="text-red-600 hover:text-red-700 text-sm underline"
                      >
                        ← Back to Library
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* No Geometry Selected */}
              {!selectedGeometry && (
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">Select a Model</h3>
                      <p className="text-gray-600 text-sm">Choose a model from the library to view it here.</p>
                    </div>
                    <a href="/library" className="btn-primary">
                      Browse Library
                    </a>
                  </div>
                </div>
              )}
              
              {/* 3D Viewer - Full Width */}
              <div className="card h-[600px] relative overflow-hidden">
                <ModelViewer 
                  model={selectedModel}
                  settings={viewerSettings}
                  customGeometry={selectedGeometry}
                />
              </div>

              {/* Settings Bar at Bottom */}
              <div className="card">
                <ControlPanel 
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
                  settings={viewerSettings}
                  onSettingsChange={handleSettingsChange}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
} 