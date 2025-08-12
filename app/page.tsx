'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ModelViewer from '@/components/ModelViewer'
import ControlPanel from '@/components/ControlPanel'
import Header from '@/components/Header'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('cube')
  const [viewerSettings, setViewerSettings] = useState({
    backgroundColor: '#000000',
    showGrid: true,
    showAxes: true,
    autoRotate: false,
  })

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
  }

  const handleSettingsChange = (settings: any) => {
    setViewerSettings(prev => ({ ...prev, ...settings }))
  }

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
            Explore and interact with stunning 3D models in real-time. Built with cutting-edge web technologies for the best visualization experience.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Control Panel */}
            <div className="lg:col-span-1">
              <ControlPanel 
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                settings={viewerSettings}
                onSettingsChange={handleSettingsChange}
              />
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
                title: 'Multiple Formats',
                description: 'Support for GLB, GLTF, OBJ, and other popular 3D formats',
                icon: '📁'
              },
              {
                title: 'Customizable View',
                description: 'Adjust lighting, materials, and camera settings to your preference',
                icon: '⚙️'
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