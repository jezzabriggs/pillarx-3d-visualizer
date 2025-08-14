'use client'

import { motion } from 'framer-motion'

interface ControlPanelProps {
  selectedModel?: string
  onModelChange?: (model: string) => void
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
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Viewer Settings */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-4">Viewer Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300 bg-gray-50 cursor-pointer"
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
                  <div className="text-sm font-medium text-black">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </div>
                <button
                  onClick={() => onSettingsChange({ [option.key]: !settings[option.key as keyof typeof settings] })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings[option.key as keyof typeof settings] ? 'bg-red-600' : 'bg-gray-300'
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
      </div>
    </motion.div>
  )
} 