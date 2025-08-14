'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import FileImporter from '@/components/FileImporter'
import { CADGeometry } from '@/lib/firebase'

export default function ImportPage() {
  const handleImportComplete = (geometry: CADGeometry) => {
    // Redirect to viewer page with the newly imported geometry
    window.location.href = `/viewer?geometry=${geometry.id}`
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
              Import 3D Models
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Upload your 3D models and add them to your geometry library. Supported formats include STP, OBJ, FBX, and STL files.
            </motion.p>
          </div>

          {/* File Importer */}
          <div className="max-w-4xl mx-auto">
            <FileImporter onImportComplete={handleImportComplete} />
          </div>

          {/* Additional Info */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-black mb-4">Supported Formats</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📐</span>
                    <div>
                      <div className="text-black font-medium">STP/STEP</div>
                      <div className="text-gray-600 text-sm">Standard CAD format, best for engineering models</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔲</span>
                    <div>
                      <div className="text-black font-medium">STL</div>
                      <div className="text-gray-600 text-sm">3D printing format, good for complex geometries</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📦</span>
                    <div>
                      <div className="text-black font-medium">OBJ</div>
                      <div className="text-gray-600 text-sm">Universal 3D format, widely supported</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎬</span>
                    <div>
                      <div className="text-black font-medium">FBX</div>
                      <div className="text-gray-600 text-sm">Animation format, good for rigged models</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-black mb-4">Upload Guidelines</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 mt-1">•</span>
                    <div className="text-gray-600 text-sm">Maximum file size: 50MB per model</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 mt-1">•</span>
                    <div className="text-gray-600 text-sm">All metadata fields are required for proper organization</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 mt-1">•</span>
                    <div className="text-gray-600 text-sm">For best results, use STP or STL formats</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 mt-1">•</span>
                    <div className="text-gray-600 text-sm">Models are automatically categorized based on your input</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 