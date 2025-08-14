'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'

export default function Home() {
  const features = [
    {
      title: 'Geometry Library',
      description: 'Browse and organize your 3D model collection with advanced search and filtering capabilities.',
      icon: '📚',
      href: '/library',
      color: 'from-red-600 to-red-700'
    },
    {
      title: '3D Viewer',
      description: 'Interactive 3D visualization with customizable settings, grid, axes, and rotation controls.',
      icon: '🎯',
      href: '/viewer',
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Import Models',
      description: 'Upload STP, OBJ, FBX, and STL files with comprehensive metadata management.',
      icon: '📁',
      href: '/import',
      color: 'from-green-600 to-green-700'
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-black mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            PillarX
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Advanced CAD Geometry Library & 3D Visualization Platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Link href="/library" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Everything You Need for 3D Model Management
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From importing and organizing to viewing and analyzing, PillarX provides a complete solution for your CAD geometry needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card hover:scale-105 transition-transform duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                onClick={() => window.location.href = feature.href}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 text-3xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link 
                    href={feature.href}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors group-hover:gap-3"
                  >
                    Explore {feature.title}
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Ready to Build Your 3D Model Collection?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Start importing your first models and experience the power of organized 3D geometry management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/import" className="btn-primary text-lg px-8 py-4">
                Import Your First Model
              </Link>
              <Link href="/library" className="btn-secondary text-lg px-8 py-4">
                Browse Library
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 