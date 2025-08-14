'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { geometryDB, CADGeometry } from '@/lib/firebase'

interface FileImporterProps {
  onImportComplete: (geometry: CADGeometry) => void
}

interface MetadataForm {
  projectName: string
  assetName: string
  assetType: string
  inspectionType: string
  lastInspected: string
  engineerInCharge: string
}

export default function FileImporter({ onImportComplete }: FileImporterProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showMetadataForm, setShowMetadataForm] = useState(false)
  const [metadata, setMetadata] = useState<MetadataForm>({
    projectName: '',
    assetName: '',
    assetType: '',
    inspectionType: '',
    lastInspected: '',
    engineerInCharge: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    // Check file type
    const allowedTypes = ['.stp', '.step', '.obj', '.fbx', '.stl']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please select a valid 3D model file (.stp, .step, .obj, .fbx, .stl)')
      return
    }

    setSelectedFile(file)
    setShowMetadataForm(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMetadataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!metadata.projectName || !metadata.assetName || !metadata.assetType || 
        !metadata.inspectionType || !metadata.lastInspected || !metadata.engineerInCharge) {
      alert('Please fill in all required fields')
      return
    }

    if (!selectedFile) {
      alert('No file selected')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))

      // Create geometry record in Firestore first
      const geometryData = {
        name: metadata.assetName,
        description: `${metadata.assetType} - ${metadata.projectName}`,
        category: 'imported' as const,
        geometryType: 'custom' as const,
        parameters: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: fileExtension,
          projectName: metadata.projectName,
          assetName: metadata.assetName,
          assetType: metadata.assetType,
          inspectionType: metadata.inspectionType,
          lastInspected: metadata.lastInspected,
          engineerInCharge: metadata.engineerInCharge
        },
        material: {
          color: '#DC2626',
          metalness: 0.1,
          roughness: 0.2
        },
        tags: ['imported', '3d-model', metadata.assetType.toLowerCase(), metadata.inspectionType.toLowerCase()],
        isPublic: true,
        downloadCount: 0,
        rating: 0,
        fileUrl: '' // Will be updated after file upload
      }

      const geometryId = await geometryDB.createGeometry(geometryData)
      
      // Now upload the actual file to Firebase Storage
      const fileUrl = await geometryDB.uploadFile(selectedFile, geometryId)
      
      // Update the geometry record with the real file URL
      await geometryDB.updateGeometry(geometryId, { fileUrl })
      
      // Complete upload
      setUploadProgress(100)
      clearInterval(progressInterval)
      
      // Get the created geometry and pass it to parent
      const createdGeometry = await geometryDB.getGeometry(geometryId)
      if (createdGeometry) {
        onImportComplete(createdGeometry)
      }

      // Reset form
      resetForm()

    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setShowMetadataForm(false)
    setMetadata({
      projectName: '',
      assetName: '',
      assetType: '',
      inspectionType: '',
      lastInspected: '',
      engineerInCharge: ''
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  if (showMetadataForm) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">File Metadata</h3>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to File Selection
          </button>
        </div>

        {uploading ? (
          <div className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-white">Uploading...</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            {/* File Info */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h4 className="text-white font-medium mb-2">Selected File:</h4>
              <p className="text-gray-300">{selectedFile?.name}</p>
              <p className="text-gray-400 text-sm">
                Size: {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </p>
            </div>

            {/* Metadata Form */}
            <form onSubmit={handleMetadataSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={metadata.projectName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    name="assetName"
                    value={metadata.assetName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="Enter asset name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Asset Type *
                  </label>
                  <select
                    name="assetType"
                    value={metadata.assetType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  >
                    <option value="">Select asset type</option>
                    <option value="Building">Building</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Tunnel">Tunnel</option>
                    <option value="Road">Road</option>
                    <option value="Railway">Railway</option>
                    <option value="Dam">Dam</option>
                    <option value="Pipeline">Pipeline</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Inspection Type *
                  </label>
                  <select
                    name="inspectionType"
                    value={metadata.inspectionType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  >
                    <option value="">Select inspection type</option>
                    <option value="Visual">Visual</option>
                    <option value="Structural">Structural</option>
                    <option value="Safety">Safety</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Quality">Quality</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Inspected *
                  </label>
                  <input
                    type="date"
                    name="lastInspected"
                    value={metadata.lastInspected}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Engineer In-Charge *
                  </label>
                  <input
                    type="text"
                    name="engineerInCharge"
                    value={metadata.engineerInCharge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="Enter engineer name"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload CAD File'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Import 3D Model</h3>
      
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stp,.step,.obj,.fbx,.stl"
        onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-red-500 bg-red-900/10'
            : 'border-gray-600 hover:border-red-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-4">📁</div>
        <p className="text-white text-lg mb-2">Drop your 3D model here</p>
        <p className="text-gray-400 mb-4">
          Supports: STP, STEP, OBJ, FBX, STL
        </p>
        <button
          onClick={openFileDialog}
          className="btn-primary"
        >
          Choose File
        </button>
      </div>

      {/* Upload Tips */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-white font-medium mb-2">Upload Requirements:</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Maximum file size: 50MB</li>
          <li>• Supported formats: STP, STEP, OBJ, FBX, STL</li>
          <li>• All metadata fields are required</li>
          <li>• For best results, use STP, STEP, or STL formats</li>
        </ul>
      </div>
    </div>
  )
} 