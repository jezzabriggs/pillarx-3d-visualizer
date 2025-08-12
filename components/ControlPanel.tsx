'use client'

import { motion } from 'framer-motion'

interface ControlPanelProps {
  selectedModel: string
  onModelChange: (model: string) => void
  settings: {
    backgroundColor: string
    showGrid: boolean
    showAxes: boolean
    autoRotate: boolean
  }
  onSettingsChange: (settings: any) => void
}

export default function ControlPanel({ 
  selectedModel, 
  onModelChange, 
  settings, 
  onSettingsChange 
}: ControlPanelProps) {
  const models = [
    { id: 'cube', name: 'Cube', description: 'Simple geometric cube' },
    { id: 'sphere', name: 'Sphere', description: 'Smooth spherical object' },
    { id: 'torus', name: 'Torus', description: 'Ring-shaped geometry' },
    { id: 'icosahedron', name: 'Icosahedron', description: 'Complex polyhedron' },
  ]

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Model Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Select Model</h3>
        <div className="space-y-3">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                selectedModel === model.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
              }`}
            >
              <div className="font-medium">{model.name}</div>
              <div className="text-sm text-gray-400">{model.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Viewer Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Viewer Settings</h3>
        
        {/* Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-600 bg-gray-700 cursor-pointer"
          />
        </div>

        {/* Toggle Options */}
        <div className="space-y-3">
          {[
            { key: 'showGrid', label: 'Show Grid', description: 'Display reference grid' },
            { key: 'showAxes', label: 'Show Axes', description: 'Display coordinate axes' },
            { key: 'autoRotate', label: 'Auto Rotate', description: 'Continuous model rotation' },
          ].map((option) => (
            <div key={option.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{option.label}</div>
                <div className="text-xs text-gray-400">{option.description}</div>
              </div>
              <button
                onClick={() => onSettingsChange({ [option.key]: !settings[option.key as keyof typeof settings] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings[option.key as keyof typeof settings] ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings[option.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="btn-secondary w-full">
            Reset Camera
          </button>
          <button className="btn-secondary w-full">
            Screenshot
          </button>
          <button className="btn-secondary w-full">
            Fullscreen
          </button>
        </div>
      </div>
    </motion.div>
  )
} 