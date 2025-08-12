'use client'

import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-red-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-white">PillarX</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', href: '#home' },
              { name: 'Features', href: '#features' },
              { name: 'About', href: '#about' },
              { name: 'Contact', href: '#contact' }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button className="btn-primary">
              Get Started
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  )
} 