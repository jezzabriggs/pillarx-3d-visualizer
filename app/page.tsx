'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ModelViewer from '@/components/ModelViewer'
import ControlPanel from '@/components/ControlPanel'
import Header from '@/components/Header'
import GeometryManager from '@/components/GeometryManager'
import FileImporter from '@/components/FileImporter'
import { CADGeometry } from '@/lib/firebase'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('cube')
  const [selectedGeometry, setSelectedGeometry] = useState<CADGeometry | null>(null)
  const [viewerSettings, setViewerSettings] = useState({
    backgroundColor: '#000000',
    showGrid: true,
    showAxes: true,
    autoRotate: false,
  })
  const [activeTab, setActiveTab] = useState<'viewer' | 'library' | 'import'>('viewer')

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    setSelectedGeometry(null) // Reset custom geometry when switching to built-in models
  }

  const handleSettingsChange = (settings: any) => {
    setViewerSettings(prev => ({ ...prev, ...settings }))
  }

  const handleGeometrySelect = (geometry: CADGeometry) => {
    setSelectedGeometry(geometry)
    setSelectedModel('custom') // Switch to custom mode
  }

  const handleImportComplete = (geometry: CADGeometry) => {
    setSelectedGeometry(geometry)
    setSelectedModel('custom')
    setActiveTab('viewer') // Switch back to viewer
  }

  const tabs = [
    { id: 'viewer', name: '3D Viewer', icon: '🎯' },
    { id: 'library', name: 'Geometry Library', icon: '📚' },
    { id: 'import', name: 'Import Models', icon: '📁' }
  ]

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PillarX
            <span className="block text-primary">3D Visualizer</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore and interact with stunning 3D models in real-time. Store, manage, and visualize your CAD geometries with our powerful database integration.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'viewer' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Control Panel */}
              <div className="lg:col-span-1">
                <ControlPanel 
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
                  settings={viewerSettings}
                  onSettingsChange={handleSettingsChange}
                />
                
                {/* Selected Geometry Info */}
                {selectedGeometry && (
                  <div className="card mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Selected Geometry</h3>
                    <div className="space-y-2">
                      <p className="text-white font-medium">{selectedGeometry.name}</p>
                      <p className="text-gray-400 text-sm">{selectedGeometry.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-red-900/20 text-red-400 text-xs rounded-full">
                          {selectedGeometry.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                          {selectedGeometry.geometryType}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 3D Viewer */}
              <div className="lg:col-span-3">
                <div className="card h-[600px] relative overflow-hidden">
                  <ModelViewer 
                    model={selectedModel}
                    settings={viewerSettings}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="max-w-4xl mx-auto">
              <GeometryManager onGeometrySelect={handleGeometrySelect} />
            </div>
          )}

          {activeTab === 'import' && (
            <div className="max-w-4xl mx-auto">
              <FileImporter onImportComplete={handleImportComplete} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Interactive 3D Models',
                description: 'Explore models with intuitive controls and real-time rendering',
                icon: '🎯'
              },
              {
                title: 'CAD Geometry Database',
                description: 'Store, manage, and organize your 3D models with Firestore integration',
                icon: '🗄️'
              },
              {
                title: 'File Import & Export',
                description: 'Support for STP, OBJ, FBX, and STL formats',
                icon: '📁'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 